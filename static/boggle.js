"use strict";

const $playedWords = $("#words");
const $form = $("#newWordForm");
const $wordInput = $("#wordInput");
const $message = $(".msg");
const $table = $("table");

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
      console.log($newCell)
      //board[row][cell]
      $newRow.append($newCell)
    }
    $table.append($newRow);
  }
}


start();