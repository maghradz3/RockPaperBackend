const crypto = require("crypto");

class Rules {
  constructor(moves) {
    this.moves = moves;
  }
  compareMoves(move1, move2) {
    const index1 = this.moves.indexOf(move1);
    const index2 = this.moves.indexOf(move2);
    if (index1 === index2) return "Draw";
    const distance = (index2 - index1 + this.moves.length) % this.moves.length;
    return distance <= this.moves.length / 2 ? "Win" : "Lose";
  }
}

class KeyGenerator {
  generateKey() {
    return crypto.randomBytes(32).toString("hex");
  }
  generateHMAC(key, message) {
    return crypto.createHmac("sha256", key).update(message).digest("hex");
  }
}

class TableGenerator {
  constructor(moves) {
    this.rules = new Rules(moves);
  }
  generateTable() {
    const moves = ["Rock", "Paper", "Scissors"];
    const results = [
      ["Draw", "Win", "Lose"],
      ["Lose", "Draw", "Win"],
      ["Win", "Lose", "Draw"],
    ];

    let table = "+-------------+------+-------+----------+\n";
    table += "| v PC\\User > | Rock | Paper | Scissors |\n";
    table += "+-------------+------+-------+----------+\n";

    for (let i = 0; i < moves.length; i++) {
      table += "| " + moves[i] + " ".repeat(11 - moves[i].length);
      for (let j = 0; j < results[i].length; j++) {
        table += "| " + results[i][j] + " ".repeat(6 - results[i][j].length);
      }
      table += "|\n+-------------+------+-------+----------+\n";
    }

    return table;
  }
}

const moves = process.argv.slice(2);
if (moves.length < 2) {
  console.log("Number of moves should be greater than 1.");
  if (new Set(moves).size !== moves.length || moves.length % 2 === 0) {
    console.log(
      "Moves must be unique and there must be an odd number of them."
    );
    console.log("Example: node script.js Rock Paper Scissors");
    return;
  }
  process.exit(1);
}

const rules = new Rules(moves);
const keyGen = new KeyGenerator();
const tableGen = new TableGenerator(moves);

const computerMove = moves[Math.floor(Math.random() * moves.length)];
const key = keyGen.generateKey();
const hmac = keyGen.generateHMAC(key, computerMove);

console.log("HMAC:", hmac);
console.log("Available moves:");
moves.forEach((move, index) => console.log(`${index + 1} - ${move}`));
console.log("0 - exit");
console.log("? - help");

const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

readline.question("Enter your move: ", (answer) => {
  if (answer === "0") {
    console.log("Goodbye!");
    process.exit(0);
  } else if (answer === "?") {
    console.log(tableGen.generateTable());
  } else {
    const userMove = moves[parseInt(answer) - 1];
    console.log("Your move:", userMove);
    console.log("Computer move:", computerMove);
    console.log("You", rules.compareMoves(userMove, computerMove) + "!");
    console.log("HMAC key:", key);
  }
  readline.close();
});
