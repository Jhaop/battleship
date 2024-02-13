const Player = require("./player");
const Ship = require("./ship");
const Gameboard = require("./gameboard");
let flag = 1;
export default function createGame() {
  const player1 = Player("Leo");
  const player2 = Player("Computer");
  const player1Gameboard = Gameboard();
  const player2Gameboard = Gameboard();

  const ship01 = Ship(1);
  const ship02 = Ship(2);
  const ship03 = Ship(3);
  const ship04 = Ship(4);

  const ship05 = Ship(1);
  const ship06 = Ship(2);
  const ship07 = Ship(3);
  const ship08 = Ship(4);

  //initialize(player1Gameboard, player2Gameboard)
  setShip(0, 8, ship01, player1Gameboard);
  setShip(3, 2, ship02, player1Gameboard);
  setShip(6, 5, ship03, player1Gameboard);
  setShip(9, 4, ship04, player1Gameboard);

  setShip(8, 7, ship05, player2Gameboard);
  setShip(4, 6, ship06, player2Gameboard);
  setShip(9, 5, ship07, player2Gameboard);
  setShip(1, 0, ship08, player2Gameboard);

  return [player1Gameboard, player2Gameboard];
}

//function initialize(gameboard1, gameboard2) {
//gameboard1.initialize()
//gameboard2.initialize()
//console.log(`fff ${gameboard1}`)
//}

function setShip(x, y, ship, gameboard) {
  console.log(gameboard.placeShip(x, y, ship));
}

function playTurn(playerTurn, player1Gameboard) {
  if (playerTurn === 2) {
    // IA TURN
    IAPlayTurn(player1Gameboard);
    playerTurn = 1;
  } else {
    while (flag === false) {
      playerTurn = 1;
    }
    playerTurn = 2;
  }
}

function gameLoop(player1Gameboard, player2Gameboard) {
  let playerTurn = 1;
  console.log(`Turn: ${playerTurn}`);
  while (gameOver(player1Gameboard, player2Gameboard) === 0) {
    playTurn(playerTurn, player1Gameboard);
    console.log(`Turn: ${playerTurn}`);
    gameOver(player1Gameboard, player2Gameboard);
  }
}

function gameOver(player1Gameboard, player2Gameboard) {
  if (player1Gameboard.allShipsSunk()) {
    console.log("Player 2 WON");
    return 2;
  }
  if (player2Gameboard.allShipsSunk()) {
    console.log("Player 1 WON");
    return 1;
  }
  return 0;
}

function IAPlayTurn() {
  let x = Math.floor(Math.random() * 10);
  let y = Math.floor(Math.random() * 10);
  while (player1Gameboard.recieveAttack(x, y) !== 1) {
    let x = Math.floor(Math.random() * 10);
    let y = Math.floor(Math.random() * 10);
  }
  flag = false;
}

export { gameLoop };
