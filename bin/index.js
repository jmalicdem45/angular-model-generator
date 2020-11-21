#!/usr/bin/env node
'use strict';
const chalk = require("chalk");
const boxen = require("boxen");
const fs = require('fs');

const greeting = chalk.white.bold("Thank you for using this CLI");

const boxenOptions = {
 padding: 1,
 margin: 1,
 borderColor: "blue",
 backgroundColor: "#555555"
};
const msgBox = boxen( greeting, boxenOptions );

console.log(msgBox);

const yargs = require("yargs");

const options = yargs
 .usage("Usage: -s <name>")
 .option("s", { alias: "swagger-name", describe: "Swagger.json name", type: "string", demandOption: true })
 .argv;

 const rawData = fs.readFileSync(options.s);
 const swagger = JSON.parse(rawData);

 Object.keys(swagger.definitions).forEach(key => {
     if (key === 'ApiResponse') {
         return;
     }
     const model = swagger.definitions[key];
     console.log(model);
 });

