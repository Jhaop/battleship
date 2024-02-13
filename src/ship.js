function Ship(length) {
  return {
    length: length,
    hitsRecieved: 0,
    sunk: false,
    hit: function () {
      this.hitsRecieved += 1;
    },
    isSunk: function () {
      if (this.hitsRecieved === this.length) return true;
      return false;
    },
  };
}

module.exports = Ship;
