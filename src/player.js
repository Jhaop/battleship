import Gameboard from "./gameboard";

export default function Player(name) {
  return {
    name: name,
    attack: function (x, y, gameboard) {
      gameboard.recieveAttack(x, y);
    },
  };
}

export function IA() {
  return {
    targets: [],
    getFromQueue: function () {
      if (this.targets.length !== 0) {
        let x = this.targets.shift();
        let y = this.targets.shift();
        return [x, y];
      }
      return undefined;
    },
    addToQueue: function (x, y) {
      const size = 10;
      if (y + 1 < size) {
        this.targets.push(x);
        this.targets.push(y + 1);
      }
      if (y - 1 >= 0) {
        this.targets.push(x);
        this.targets.push(y - 1);
      }
    },

    //FIX ALL OF THIS
    attack: function (player1Gameboard) {
      let nextTarget = this.getFromQueue();
      if (nextTarget !== undefined) {
        let [x, y] = [...nextTarget];
        let flag = player1Gameboard.recieveAttack(x, y);
        while (flag === 0 && this.targets.length > 0) {
          nextTarget = this.getFromQueue();
          [x, y] = [...nextTarget];
          flag = player1Gameboard.recieveAttack(x, y);
        }
        if (flag === 1) {
          if (!player1Gameboard.shipSunk(x, y)) {
            this.addToQueue(x, y);
          }
          return player1Gameboard;
        }
      }
      let x = Math.floor(Math.random() * 10);
      let y = Math.floor(Math.random() * 10);
      let flag = player1Gameboard.recieveAttack(x, y);
      while (flag === 0) {
        x = Math.floor(Math.random() * 10);
        y = Math.floor(Math.random() * 10);
        flag = player1Gameboard.recieveAttack(x, y);
      }
      if (flag === 1) {
        const size = 10;
        if (!player1Gameboard.shipSunk(x, y)) {
          this.addToQueue(x, y);
        }
      }
      return player1Gameboard;
    },
  };
}
