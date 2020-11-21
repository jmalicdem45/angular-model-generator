#!/usr/bin/env node
'use strict';
const chalk = require("chalk");
const boxen = require("boxen");
const fs = require('fs');
const toPascalCase = require('to-pascal-case');
const {toKebab} = require("to-kebab");

const greeting = chalk.white.bold("Thank you for using this CLI -Codekage");

const boxenOptions = {
 padding: 1,
 margin: 1,
 borderColor: "white",
 backgroundColor: "#555555"
};
const msgBox = boxen( greeting, boxenOptions );

console.log(msgBox);

const yargs = require("yargs");
const { string } = require("yargs");

const options = yargs
 .usage("Usage: -s <name>")
 .option("s", { alias: "swagger-name", describe: "Swagger.json name", type: "string", demandOption: true })
 .argv;

 const rawData = fs.readFileSync(options.s);
 const swagger = JSON.parse(rawData);
 const directory = 'src/app/shared/models';
 if (!fs.existsSync(directory)) {
     fs.mkdirSync(directory, { recursive: true });
 }
 Object.keys(swagger.definitions).forEach(key => {
     if (key === 'ApiResponse') {
         return;
     }
     const model = swagger.definitions[key];
     const fileName = `${ toKebab(key).toLowerCase() }.model.ts`;
     fs.writeFileSync(`${ directory }/${ fileName }`, writeFileContents(key, model.properties));
});

function writeFileContents(modelName, properties) {
    const className = toPascalCase(modelName);
    const fileContent  = `export class ${ className } { \n ${ buildProperties(properties) }}`;

    return fileContent;
}

function buildProperties(properties) {
    let content = '';
    Object.keys(properties).forEach(key => {
        const property = properties[key];
        content += `${key}: ${ getType(property.type) === '[]' ? ` ${ getType(property.items.type) }[]` : getType(property.type) } = ${ property.type === 'boolean' ? 'false' : property.type === 'array' ? '[]' : 'null' }; \n`;
    });
    return content;
}

function getType(type) {
    switch(type) {
        case 'string':
            return 'string';
        case 'integer':
            return 'number';
        case 'boolean':
            return 'boolean';
        case 'double':
            return 'number';
        case 'float':
            return 'number';
        case 'object':
            return 'any';
        case 'array':
            return '[]'
        default:
            return 'any';
    }
}

