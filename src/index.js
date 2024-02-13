import "./style.css";
const Ship = require("./ship");
import Gameboard from "./gameboard";
//import createGame from "./game";
//import { gameLoop } from "./game";
import Game from "./game_v2";

const container = document.createElement("div");
container.classList.add("container");

const title = document.createElement("div");
title.innerHTML = "Battleship";
title.classList.add("title");

const playButton = document.createElement("button");
playButton.innerHTML = "PLAY";
playButton.classList.add("playButton");

const gameContainer = document.createElement("div");
gameContainer.classList.add("gameContainer");

const player1div = document.createElement("div");
player1div.classList.add("playerDiv");
const player1name = document.createElement("div");
player1name.classList.add("playerName");
player1name.innerHTML = "Player 1";
player1div.appendChild(player1name);
const player1boardDiv = createBoard(10);
player1boardDiv.setAttribute("id", "1");
player1div.appendChild(player1boardDiv);

const player2div = document.createElement("div");
player2div.classList.add("playerDiv");
const player2name = document.createElement("div");
player2name.classList.add("playerName");
player2name.innerHTML = "Player 2";
player2div.appendChild(player2name);
const player2boardDiv = createBoard(10);
player2boardDiv.setAttribute("id", "2");
player2div.appendChild(player2boardDiv);

gameContainer.appendChild(player1div);
gameContainer.appendChild(player2div);
container.appendChild(title);
container.appendChild(playButton);
container.appendChild(gameContainer);
document.body.appendChild(container);

function createBoard(size) {
  const board = document.createElement("div");
  board.classList.add("playerBoard");
  let count = 0;
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const newCell = document.createElement("div");
      newCell.classList.add("boardCell");
      newCell.dataset.position = count;
      board.appendChild(newCell);
      count += 1;
    }
  }
  return board;
}

function calculateCoordinates(number, size) {
  const x = Math.floor(number / size);
  const y = Math.floor(number % size);
  return [x, y];
}

function fillBoards(board1, board2) {
  const size = 10;
  let count = 0;
  let children = player1boardDiv.children;
  if (gameStatus === "ended") {
    children = player1boardDiv.children;
    for (let i = 0; i < size * size; i++) {
      children[i].classList.remove("boardCellRed");
      children[i].classList.remove("boardCellGrey");
      children[i].classList.remove("empty");
      children[i].classList.remove("ship");
      children[i].classList.remove("sunk");
      children[i].innerHTML = "";
      children[i].classList.add("boardCellDefault");
    }
    children = player2boardDiv.children;
    for (let i = 0; i < size * size; i++) {
      children[i].classList.remove("boardCellRed");
      children[i].classList.remove("boardCellGrey");
      children[i].classList.remove("empty");
      children[i].classList.remove("ship");
      children[i].classList.remove("sunk");
      children[i].innerHTML = "";
      children[i].classList.add("boardCellDefault");
    }
    gameStatus = undefined;
    const winnerDiv = document.getElementsByClassName("winnerDiv");
    winnerDiv[0].remove();
    return;
  }
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const temp = board1[i][j];
      if (temp === -1) {
        children[count].classList.remove("boardCellDefault");
        children[count].classList.add("boardCellGrey");
      } else if (temp === "X") {
        children[count].classList.remove("boardCellDefault");
        children[count].classList.add("boardCellRed");
        children[count].innerHTML = "X";
      }
      count += 1;
    }
  }
  count = 0;
  children = player2boardDiv.children;
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const temp = board2[i][j];
      if (temp === -1) {
        children[count].classList.remove("boardCellDefault");
        children[count].classList.add("boardCellGrey");
      } else if (temp === "X") {
        children[count].classList.remove("boardCellDefault");
        children[count].classList.add("boardCellRed");
        children[count].innerHTML = "X";
      }
      count += 1;
    }
  }
}

function drawBoard(board) {
  const size = 10;
  let count = 0;
  let board_id = Number(board.getAttribute("id"));
  let children;
  let board_temp;
  let gameboard_temp;
  if (board_id === 1) {
    children = player1boardDiv.children;
    board_temp = player1gameboard.board;
    gameboard_temp = player1gameboard;
  }
  if (board_id === 2) {
    children = player2boardDiv.children;
    board_temp = player2gameboard.board;
    gameboard_temp = player2gameboard;
  }
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      //const temp = game[board_id - 1].board[i][j];
      const temp = board_temp[i][j];
      if (temp === -1) {
        children[count].classList.add("empty");
      } else if (temp === "X") {
        children[count].classList.remove("empty");
        children[count].classList.add("ship");
        children[count].innerHTML = "X";
        if (gameboard_temp.shipSunk(i, j)) {
          children[count].classList.add("sunk");
        }
      }
      count += 1;
    }
  }
}

function addCellListeners(playerBoard) {
  const size = 10;
  let count = 0;
  let children = playerBoard.children;
  const board_id = playerBoard.getAttribute("id");
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      children[count].addEventListener("click", loop);
      count += 1;
    }
  }
}

function removeCellsListeners() {
  const size = 10;
  let children = player2boardDiv.children;
  for (let i = 0; i < size * size; i++) {
    children[i].removeEventListener("click", loop);
  }
}

function loop(e) {
  const size = 10;
  const target = e.target;
  const coordinates = calculateCoordinates(
    target.getAttribute("data-position"),
    size,
  );
  let flag = player2gameboard.recieveAttack(coordinates[0], coordinates[1]);
  if (flag !== 0) {
    drawBoard(player2boardDiv);
    if (game.gameOver() === 1) {
      showWinner(1);
      removeCellsListeners();
      playButton.addEventListener("click", playFunc);
      gameStatus = "ended";
    }
    game.IAPlayTurn();
    drawBoard(player1boardDiv);
    if (game.gameOver() === 2) {
      showWinner(2);
      removeCellsListeners();
      playButton.addEventListener("click", playFunc);
      gameStatus = "ended";
    }
  }
}

function showWinner(winner) {
  const winnerDiv = document.createElement("div");
  winnerDiv.innerHTML = `The winner is ${winner}`;
  winnerDiv.classList.add("winnerDiv");
  gameContainer.appendChild(winnerDiv);
}

function playFunc() {
  game = Game();
  //game.setShips();
  settingShips();
}

function settingShips() {
  const shipsContainer = document.createElement("div");
  shipsContainer.classList.add("shipsContainer");

  const tinyShipXLabel = document.createElement("label");
  const tinyShipYLabel = document.createElement("label");
  const smallShipXLabel = document.createElement("label");
  const smallShipYLabel = document.createElement("label");
  const mediumShipXLabel = document.createElement("label");
  const mediumShipYLabel = document.createElement("label");
  const bigShipXLabel = document.createElement("label");
  const bigShipYLabel = document.createElement("label");

  const tinyShipX = document.createElement("input");
  const tinyShipY = document.createElement("input");
  const smallShipX = document.createElement("input");
  const smallShipY = document.createElement("input");
  const mediumShipX = document.createElement("input");
  const mediumShipY = document.createElement("input");
  const bigShipX = document.createElement("input");
  const bigShipY = document.createElement("input");

  const size = 10;

  tinyShipX.setAttribute("id", "tinyShipX");
  tinyShipX.setAttribute("type", "number");
  tinyShipY.setAttribute("id", "tinyShipY");
  tinyShipY.setAttribute("type", "number");

  smallShipX.setAttribute("id", "smallShipX");
  smallShipX.setAttribute("type", "number");
  smallShipY.setAttribute("id", "smallShipY");
  smallShipY.setAttribute("type", "number");

  mediumShipX.setAttribute("id", "mediumShipX");
  mediumShipX.setAttribute("type", "number");
  mediumShipY.setAttribute("id", "mediumShipY");
  mediumShipY.setAttribute("type", "number");

  bigShipX.setAttribute("id", "bigShipX");
  bigShipX.setAttribute("type", "number");
  bigShipY.setAttribute("id", "bigShipY");
  bigShipY.setAttribute("type", "number");

  tinyShipXLabel.setAttribute("for", "tinyShipX");
  tinyShipYLabel.setAttribute("for", "tinyShipY");
  smallShipXLabel.setAttribute("for", "smallShipX");
  smallShipYLabel.setAttribute("for", "smallShipY");
  mediumShipXLabel.setAttribute("for", "mediumShipX");
  mediumShipYLabel.setAttribute("for", "mediumShipY");
  bigShipXLabel.setAttribute("for", "bigShipX");
  bigShipYLabel.setAttribute("for", "bigShipY");

  tinyShipXLabel.innerHTML = "Tiny Row";
  tinyShipYLabel.innerHTML = "Tiny Column";
  smallShipXLabel.innerHTML = "Small Row";
  smallShipYLabel.innerHTML = "Small Column";
  mediumShipXLabel.innerHTML = "Medium Row";
  mediumShipYLabel.innerHtml = "Medium Column";
  bigShipXLabel.innerHTML = "Big Row";
  bigShipYLabel.innerHTML = "Big Column";

  const setShipsBtn = document.createElement("button");
  setShipsBtn.setAttribute("id", "setShipsBtn");
  setShipsBtn.innerHTML = "POSITION SHIPS";
  setShipsBtn.addEventListener("click", () => {
    const tinyX = tinyShipX.value - 1;
    const tinyY = tinyShipY.value - 1;
    const smallX = smallShipX.value - 1;
    const smallY = smallShipY.value - 1;
    const mediumX = mediumShipX.value - 1;
    const mediumY = mediumShipY.value - 1;
    const bigX = bigShipX.value - 1;
    const bigY = bigShipY.value - 1;
    const ship01 = Ship(1);
    const ship02 = Ship(2);
    const ship03 = Ship(3);
    const ship04 = Ship(4);

    const coordsArray = [];
    coordsArray.push([tinyX, tinyY]);

    coordsArray.push([smallX, smallY]);
    coordsArray.push([smallX, smallY + 1]);

    coordsArray.push([mediumX, mediumY]);
    coordsArray.push([mediumX, mediumY + 1]);
    coordsArray.push([mediumX, mediumY + 2]);

    coordsArray.push([bigX, bigY]);
    coordsArray.push([bigX, bigY + 1]);
    coordsArray.push([bigX, bigY + 2]);
    coordsArray.push([bigX, bigY + 3]);

    let flag = true;
    let i;
    let temp;
    while (flag && coordsArray.length > 0) {
      temp = coordsArray.pop();
      i = 0;
      let x1, y1;
      while (flag && i < coordsArray.length) {
        [x1, y1] = [...temp];
        if (x1 >= size || y1 >= size) {
          flag = false;
        }
        if (x1 === coordsArray[i][0] && y1 === coordsArray[i][1]) {
          flag = false;
        }
        i++;
      }
    }
    if (flag) {
      player1gameboard = game.player1Gameboard;
      player2gameboard = game.player2Gameboard;
      player1gameboard.placeShip(tinyX, tinyY, ship01);
      player1gameboard.placeShip(smallX, smallY, ship02);
      player1gameboard.placeShip(mediumX, mediumY, ship03);
      player1gameboard.placeShip(bigX, bigY, ship04);
      setAIShips();
      const shipsContainer = document.getElementsByClassName("shipsContainer");
      shipsContainer[0].remove();
      fillBoards(player1gameboard.board, player2gameboard.board);
      addCellListeners(player2boardDiv);
      return true;
    } else {
      return false;
    }
  });

  function setAIShips() {
    const ship01 = Ship(1);
    const ship02 = Ship(2);
    const ship03 = Ship(3);
    const ship04 = Ship(4);
    const size = 10;
    let tinyX;
    let tinyY;
    let smallX;
    let smallY;
    let mediumX;
    let mediumY;
    let bigX;
    let bigY;

    let outerFlag = true;
    while (outerFlag) {
      //ship 1 randomizer
      tinyX = Math.floor(Math.random() * 10);
      tinyY = Math.floor(Math.random() * 10);
      //ship 2 randomizer
      smallX = Math.floor(Math.random() * 10);
      smallY = Math.floor(Math.random() * 10);

      //ship 3 randomizer
      mediumX = Math.floor(Math.random() * 10);
      mediumY = Math.floor(Math.random() * 10);

      //ship 4 randomizer
      bigX = Math.floor(Math.random() * 10);
      bigY = Math.floor(Math.random() * 10);

      const coordsArray = [];
      coordsArray.push([tinyX, tinyY]);

      coordsArray.push([smallX, smallY]);
      coordsArray.push([smallX, smallY + 1]);

      coordsArray.push([mediumX, mediumY]);
      coordsArray.push([mediumX, mediumY + 1]);
      coordsArray.push([mediumX, mediumY + 2]);

      coordsArray.push([bigX, bigY]);
      coordsArray.push([bigX, bigY + 1]);
      coordsArray.push([bigX, bigY + 2]);
      coordsArray.push([bigX, bigY + 3]);

      let i;
      let temp;
      let flag = true;
      while (flag && coordsArray.length > 0) {
        temp = coordsArray.pop();
        i = 0;
        let x1, y1;
        while (flag && i < coordsArray.length) {
          [x1, y1] = [...temp];
          if (x1 >= size || y1 >= size) {
            flag = false;
          }
          if (x1 === coordsArray[i][0] && y1 === coordsArray[i][1]) {
            flag = false;
          }
          i++;
        }
      }
      if (flag) {
        outerFlag = false;
      }
    }
    //asdasd
    player2gameboard = game.player2Gameboard;
    player2gameboard.placeShip(tinyX, tinyY, ship01);
    player2gameboard.placeShip(smallX, smallY, ship02);
    player2gameboard.placeShip(mediumX, mediumY, ship03);
    player2gameboard.placeShip(bigX, bigY, ship04);
  }

  shipsContainer.appendChild(tinyShipXLabel);
  shipsContainer.appendChild(tinyShipYLabel);
  shipsContainer.appendChild(tinyShipX);
  shipsContainer.appendChild(tinyShipY);
  shipsContainer.appendChild(smallShipXLabel);
  shipsContainer.appendChild(smallShipYLabel);
  shipsContainer.appendChild(smallShipX);
  shipsContainer.appendChild(smallShipY);
  shipsContainer.appendChild(mediumShipXLabel);
  shipsContainer.appendChild(mediumShipYLabel);
  shipsContainer.appendChild(mediumShipX);
  shipsContainer.appendChild(mediumShipY);
  shipsContainer.appendChild(bigShipXLabel);
  shipsContainer.appendChild(bigShipYLabel);
  shipsContainer.appendChild(bigShipX);
  shipsContainer.appendChild(bigShipY);
  shipsContainer.appendChild(setShipsBtn);
  container.appendChild(shipsContainer);
}

let game;
let gameStatus;
let player1gameboard;
let player2gameboard;
playButton.addEventListener("click", playFunc);
//const game = createGame();
//const player1gameboard = game[0];
//const player2gameboard = game[1];
//fillBoards(player1gameboard.board, player2gameboard.board);
//addCellListeners(player2boardDiv);
//fillBoards(player1gameboard.board, player2gameboard.board);
//gameLoop(player1gameboard, player2gameboard);
