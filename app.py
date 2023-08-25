from flask import Flask, request, render_template, jsonify
from uuid import uuid4

from boggle import BoggleGame

app = Flask(__name__)
app.config["SECRET_KEY"] = "this-is-secret"

# The boggle games created, keyed by game id
games = {}


@app.get("/")
def homepage():
    """Show board."""

    return render_template("index.html")


@app.post("/api/new-game")
def new_game():
    """Start a new game and return JSON: {game_id, board}."""

    # get a unique string id for the board we're creating
    game_id = str(uuid4())
    game = BoggleGame()
    games[game_id] = game

    return jsonify({"gameId": game_id, "board": game.board})

@app.post("/api/score-word")
def score_word():
    """Takes user-submitted data, from which it extracts the gameId and the
    submitted word. It uses the gameId to get a game instance and then checks
    whether the played word is valid in that game."""

    game_data = request.get_json()
    #DONE: Don't use get; you want to crash if there is no corresponding game
    current_game = games.get(game_data.get("gameId"))
    current_game = games[game_data["gameId"]]
    target_word = game_data["word"]

    #Is this necessary?
    if not current_game:
        return jsonify({"result": "game-not-found"})

    #TODO: Invoke score_word
    if not current_game.is_word_in_word_list(target_word):
        return jsonify({"result": "not-word"})

    if not current_game.check_word_on_board(target_word):
        return jsonify({"result": "not-on-board"})

    return jsonify({"result": "ok"})

