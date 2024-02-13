const Ship = require("./ship");
//const Gameboard = require("./gameboard");
import { IA } from "./player";
import Player from "./player";
import Gameboard from "./gameboard";

export default function Game() {
  return {
    player1: Player("Leo"),
    IAPlayer: IA(),
    player1Gameboard: Gameboard(),
    player2Gameboard: Gameboard(),
    pick: undefined,
    setShips: function () {
      const ship01 = Ship(1);
      const ship02 = Ship(2);
      const ship03 = Ship(3);
      const ship04 = Ship(4);

      const ship05 = Ship(1);
      const ship06 = Ship(2);
      const ship07 = Ship(3);
      const ship08 = Ship(4);

      this.player1Gameboard.placeShip(0, 8, ship01);
      this.player1Gameboard.placeShip(3, 2, ship02);
      this.player1Gameboard.placeShip(6, 5, ship03);
      this.player1Gameboard.placeShip(9, 4, ship04);

      this.player2Gameboard.placeShip(8, 7, ship05);
      this.player2Gameboard.placeShip(4, 6, ship06);
      this.player2Gameboard.placeShip(9, 5, ship07);
      this.player2Gameboard.placeShip(1, 0, ship08);
    },
    IAPlayTurn: function () {
      this.player1Gameboard = this.IAPlayer.attack(this.player1Gameboard);
    },
    gameOver: function () {
      if (this.player1Gameboard.allShipsSunk()) {
        return 2;
      }
      if (this.player2Gameboard.allShipsSunk()) {
        return 1;
      }
      return 0;
    },
    gameLoop: function () {
      let playerTurn = 1;
      while (this.gameOver() === 0) {
        this.playTurn(playerTurn);
      }
    },
  };
}
