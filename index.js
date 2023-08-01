const crypto = require("crypto");

function compareMoves(moves, move1, move2) {
  const index1 = moves.indexOf(move1);
  const index2 = moves.indexOf(move2);
  if (index1 === index2) return "Draw";
  const distance = (index2 - index1 + moves.length) % moves.length;
  return distance <= moves.length / 2 ? "Win" : "Lose";
}

function generateKey() {
  return crypto.randomBytes(32).toString("hex");
}

function generateHMAC(key, message) {
  return crypto.createHmac("sha256", key).update(message).digest("hex");
}

function generateTable(moves) {
  let table = "";
  for (let i = -1; i < moves.length; i++) {
    for (let j = -1; j < moves.length; j++) {
      if (i === -1 && j === -1) {
        table += "Move";
      } else if (i === -1) {
        table += moves[j];
      } else if (j === -1) {
        table += moves[i];
      } else {
        table += compareMoves(moves, moves[i], moves[j]);
      }
      table += "\t";
    }
    table += "\n";
  }
  return table;
}

const moves = process.argv.slice(2);
if (new Set(moves).size !== moves.length || moves.length % 2 === 0) {
  console.log("Moves must be unique and there must be an odd number of them.");
  console.log("Example: node script.js Rock Paper Scissors");
  process.exit(1);
}
console.log(moves);

const computerMove = moves[Math.floor(Math.random() * moves.length)];
const key = generateKey();
const hmac = generateHMAC(key, computerMove);

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
    console.log(generateTable(moves));
  } else {
    const userMove = moves[parseInt(answer) - 1];
    console.log("Your move:", userMove);
    console.log("Computer move:", computerMove);
    console.log("You", compareMoves(moves, userMove, computerMove) + "!");
    console.log("HMAC key:", key);
  }
  readline.close();
});
