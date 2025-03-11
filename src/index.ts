const figlet = require("figlet");

console.log(
  figlet.textSync(require("../package.json").name)
);
