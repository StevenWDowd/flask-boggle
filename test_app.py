from unittest import TestCase

from app import app, games

# Make Flask errors be real errors, not HTML pages with error info
app.config['TESTING'] = True

# This is a bit of hack, but don't use Flask DebugToolbar
app.config['DEBUG_TB_HOSTS'] = ['dont-show-debug-toolbar']


class BoggleAppTestCase(TestCase):
    """Test flask app of Boggle."""

    def setUp(self):
        """Stuff to do before every test."""

        self.client = app.test_client()
        app.config['TESTING'] = True

    def test_homepage(self):
        """Make sure information is in the session and HTML is displayed"""

        with self.client as client:
            response = client.get('/')
            html = response.get_data(as_text=True)

            self.assertEqual(response.status_code, 200)
            self.assertIn("<title>Boggle</title>", html)
            self.assertIn("<!-- this is the homepage -->", html)

    def test_api_new_game(self):
        """Test starting a new game"""

        with self.client as client:
            response = client.post('/api/new-game')
            json = response.get_json()

            self.assertEqual(type(json["gameId"]) == str, True)
            self.assertIsInstance(json["board"], list)
            self.assertIn(json["gameId"], games.keys())

    def test_score_word(self):
        """Test if word is valid"""

        with self.client as client:
            # Retrieve new gameId
            new_game_response = client.post('/api/new-game')
            new_game = new_game_response.get_json()
            gameId = new_game["gameId"]

            # Set game board to static values
            game = games.get(gameId)
            game.board = [["T","E", "S","T"],
                          ["T","E", "S","T"],
                          ["T","E", "S","T"],
                          ["T","E", "S","T"],
                          ["T","E", "S","T"]]

            # Test for valid word in board and wordlist
            valid_input = client.post("/api/score-word",
                                              json={
                                                  "gameId": gameId,
                                                  "word": "TEST"})
            valid_data = valid_input.get_json()

            self.assertEqual(valid_data, {"result": "ok"})

            # Test word not in wordlist
            wordlist_input = client.post("/api/score-word",
                                              json={
                                                  "gameId": gameId,
                                                  "word": "BLARG"})
            wordlist_data = wordlist_input.get_json()

            self.assertEqual(wordlist_data, {"result": "not-word"})

            # Test word not on board
            board_input = client.post("/api/score-word",
                                              json={
                                                  "gameId": gameId,
                                                  "word": "ABDUCT"})
            board_data = board_input.get_json()

            self.assertEqual(board_data, {"result": "not-on-board"})

