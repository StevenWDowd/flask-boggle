"use strict";

const $playedWords = $("#words");
const $form = $("#newWordForm");
const $wordInput = $("#wordInput");
const $message = $(".msg");
const $table = $("table");
const $submitBtn = $(".word-input-btn")

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
  for (const row of board){
    const $newRow = $("<tr>");

    for (const cell of row){
      const $newCell = $("<td>").append(cell);
      $newRow.append($newCell)
    }

    $table.append($newRow);
  }
}

/** Handle button submission to check for word and display results */
async function handleSubmit(event) {
  event.preventDefault()
  let word = $wordInput;
  $wordInput.text("");

  response = await checkWord(word);

  displayResult(response, word);
}

$submitBtn.on("click", handleSubmit)

/** Check word via API */
async function checkWord(word) {
  const response = await fetch(`/api/score-word`, {
    method: "POST",
    body: {
      "gameId": gameId,
      "word": word
    },
    header: {"Content-Type": "application/json"}
  });

  return await response.json();
}

async function displayResult(response, word) {

  if (response.result = "not-word") {
    $message.text("Not a word!");
  }

  if (response.result = "not-on-board") {
    $message.text("Word not on board!");
  }

  if (response.result = "ok") {
    $message.text(`${word} added!`);
    const $li = $(`<li>${word}</li>`);

    $playedWords.append($li);
  }
}


start();