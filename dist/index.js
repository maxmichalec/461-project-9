"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander"); // add this line
//add the following line
const program = new commander_1.Command();
program
    .version("1.0.0")
    .description("An example CLI for managing a directory")
    .option("-l, --ls  [value]", "List directory contents")
    .option("-m, --mkdir <value>", "Create a directory")
    .option("-t, --touch <value>", "Create a file")
    .parse(process.argv);
const options = program.opts();
//# sourceMappingURL=index.js.map