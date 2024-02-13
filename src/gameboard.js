const Ship = require("./ship");

function Gameboard() {
  return {
    size: 10,
    board: [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ],
    ships: [],
    processShipHit: function (x, y) {
      let flag = false;
      let shipsIterator = 0;
      let tempShip = this.ships[shipsIterator];
      while (!flag) {
        for (let i = 0; i < tempShip.coordinatesArray.length; i++) {
          const [a, b] = [...tempShip.coordinatesArray[i]];
          if (a === x && b === y) {
            tempShip.ship.hit();
            flag = true;
            break;
          }
        }
        shipsIterator += 1;
        tempShip = this.ships[shipsIterator];
      }
    },
    shipSunk: function (x, y) {
      let flag = false;
      let shipAmount = 4;
      let shipsIterator = 0;
      let tempShip = this.ships[shipsIterator];
      let coordinatesIterator;
      while (!flag && shipsIterator < shipAmount) {
        coordinatesIterator = 0;
        while (
          coordinatesIterator < tempShip.coordinatesArray.length &&
          !flag
        ) {
          const [a, b] = [...tempShip.coordinatesArray[coordinatesIterator]];
          if (a === x && b === y) {
            if (tempShip.ship.isSunk()) {
              flag = true;
              return flag;
            }
          }
          coordinatesIterator += 1;
        }
        shipsIterator += 1;
        tempShip = this.ships[shipsIterator];
      }
      return flag;
    },
    recieveAttack: function (x, y) {
      if (this.board[x][y] === -1 || this.board[x][y] === "X") {
        return 0; // ALREADY SHOT THERE
      }
      if (this.board[x][y] === 1) {
        this.board[x][y] = "X";
        this.processShipHit(x, y);
        return 1; // HIT SOMETHING
      }
      if (this.board[x][y] === 0) {
        this.board[x][y] = -1;
        return -1; // MISSED
      }
    },
    placeShip: function (x, y, ship) {
      const shipLength = ship.length;
      if (this.board[x][y] !== 0) {
        return 0; // Cannot place ship there
      }
      if (this.isPlaceable(x, y, shipLength)) {
        const coordinatesArray = [];
        for (let i = y; i < y + shipLength; i++) {
          this.board[x][i] = 1;
          coordinatesArray.push([x, i]);
        }
        this.ships.push({
          ship,
          coordinatesArray,
        });
        return 1; // Ship positioned
      }
      return 0; // Cannot place ship there
    },
    isPlaceable: function (x, y, length) {
      let flag = true;
      let i = y;
      while (flag && i <= y + length && i < this.size) {
        if (this.board[x][i] !== 0) {
          return false;
        }
        i++;
      }
      return true;
    },
    allShipsSunk: function () {
      let i = 0;
      while (i < this.ships.length && this.ships[i].ship.isSunk()) {
        i++;
      }
      if (i === this.ships.length) {
        return true;
      }
      return false;
    },
    showBoard: function () {
      for (let i = 0; i < this.size; i++) {
        console.log(this.board[i]);
      }
    },
  };
}

module.exports = Gameboard;
