"use strict";

const $playedWords = $("#words");
const $form = $("#newWordForm");
const $wordInput = $("#wordInput");
const $message = $(".msg");
const $table = $("table");
const $submitBtn = $(".word-input-btn");

let gameId;


/** Start */

async function start() {
  const response = await fetch(`/api/new-game`, {
    method: "POST",
  });
  const gameData = await response.json();

  gameId = gameData.gameId;
  let board = gameData.board;

  displayBoard(board);
}

/** Display board */

function displayBoard(board) {
  $table.empty();

  // loop over board and create the DOM tr/td structure
  for (const row of board) {
    const $newRow = $("<tr>");

    for (const cell of row) {
      const $newCell = $("<td>").append(cell);
      $newRow.append($newCell);
    }

    $table.append($newRow);
  }
}

/** Handle button submission to check for word and display results */
async function handleSubmit(event) {
  event.preventDefault();
  let word = $wordInput.val().toUpperCase();
  //$wordInput.text("");

  const response = await checkWord(word);

  displayResult(response, word);
}

$submitBtn.on("click", handleSubmit);

/** Check word via API */
async function checkWord(word) {
  console.log(word);
  console.log($wordInput);
  console.log(gameId);
  const response = await fetch(`/api/score-word`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      "gameId": gameId,
      "word": word
    }),
  });

  return await response.json();
}

async function displayResult(response, word) {
  console.log(response.result);

  if (response.result === "not-word") {
    $message.text("Not a word!");
  }

  if (response.result === "not-on-board") {
    $message.text("Word not on board!");
  }

  if (response.result === "ok") {
    $message.text(`${word} added!`);
    const $li = $(`<li>${word}</li>`);

    $playedWords.append($li);
  }
  $wordInput.val('');
}


start();