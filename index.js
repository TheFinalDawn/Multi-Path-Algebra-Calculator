// Simple looping calculator using Math.js.
// input an equation in quotes, then add a list of 
// numbers to use. Separate vars by adding a space between 
// new variables, and a comma between different variable 
// values.
// NOTE: Do not add anything to the right of the equal sign.
// Example: 

// Equation: "2ab"
// Inputs: 1,2,3 3,2,1 (input variable lists as they appear 
// in the equation)
// Output: 6,4,2,12,8,4,18,12,6
// Note this will be the same if you put the equation as 
// 2ba and keep the variables the same!
















const getInput = require('prompt-sync')();
const chalk = require('chalk');
const got = require('got');
const combineArrays = require('./combineArrays.js');
// It's so long I won't bother trying to stuff it in here.
console.log('Please input equation.');
let equation = getInput("> ");
console.log(`Equation confirmed: ${equation}.`);
console.log('Please input your variable values. See left for format guide.');
let vars = getInput("> ");
vars = vars.split(" ");
for (i in vars) {
	vars[i] = vars[i].split(",");
}
for (i in vars) {
	for (k in vars[i]) {
		vars[i][k] = parseInt(vars[i][k], 10);
		if (isNaN(vars[i][k])) {
			console.error(chalk.yellow(`SYNTAX ERROR: Variable ${(parseInt(i) + 1)}, ${(parseInt(k) + 1)} is not a number.`));
			console.info(chalk.grey("Hint: only pass numbers into this part."));
			process.exit(9);
		}
	}
}
console.log(`Variables received: ${JSON.stringify(vars)}`)

// Process equation, identify and replace vars, send as batch to math.js

let variables = equation.match(/[a-zA-Z]/g);
let varLetters = [];
for (i in variables) {
	if (varLetters.indexOf(variables[i]) == -1) varLetters.push(variables[i]);
}
if (varLetters.length != vars.length) {
	console.error(chalk.yellow(`SYNTAX ERROR: ${vars.length} variable sets were passed, needed ${varLetters.length}.`));
	process.exit(9);
}
// variables identified, now create variable combinations and somehow replace variables in the actual equation copies.
const combos = combineArrays.combineArrays(vars);
// this outputs every combo in the form of ["x1x2...xn",...]
let equations = [];
console.log(varLetters);
for (i in combos) {
	let replace = equation;
	for (let k = 0; k < combos[i].length; k++) {
		replace = replace.replace(varLetters[k], `(${combos[i][k]})`);
	}
	equations.push(replace);
}
let final = null;
got.post("http://api.mathjs.org/v4/", { headers: "content-type: application/json", json: equations })
	.then(response => {
		final = response.data;
	}).catch(err => console.log(chalk.red(err)));