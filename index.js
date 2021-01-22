// Simple looping calculator using Math.js.
// input an equation in quotes, then add a list of 
// numbers to use. Separate vars by adding a space between 
// new variables, and a comma between different variable 
// values.
// NOTES: 
// Do not add anything to the right of the equal sign.
// Convert fractions, square roots, etc. to their decimal 
// forms.
// Please don't use i, I'm not even gonna try to implement 
// that thing.
/*=========*\ 
|| Example ||
\*=========*/
// Equation: "2ab"
// Inputs: 1,2,3 3,2,1 (input variable lists as they appear 
// in the equation)
// Output: 6,4,2,12,8,4,18,12,6
// Note this will be the same if you put the equation as 
// 2ba and keep the variables the same!

// And before someone complains about the sign, I'm a 
// programmer, not a graphic designer lol
//  It's about as good as you're gonna get, I can't draw






const getInput = require('prompt-sync')();
const chalk = require('chalk');
const http = require('http');
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
		vars[i][k] = parseFloat(vars[i][k], 10);
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
let combos = combineArrays.combineArrays(vars);
for (i in combos) {
	combos[i]=combos[i].split(" ");
}
combos = combos.filter(Boolean);
// this outputs every combo in the form of ["x1x2...xn",...]
let equations = [];
for (i in combos) {
	let replace = equation;
	for (let k = 0; k < combos[i].length; k++) {
		replace = replace.replace(new RegExp(`${varLetters[k]}`, "gi"), `(${combos[i][k]})`);
	}
	equations.push(replace);
}
let temporary = {"expr": equations};
const options = {
	method: "POST",
	host: "api.mathjs.org",
	path: "/v4",
	port: 80,
	headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(JSON.stringify(temporary))
    }
}
const final = new Promise((resolve, reject) => {
	let req = http.request(options, (resp) => {
  let data = '';

  // A chunk of data has been received.
  resp.on('data', (chunk) => {
    data += chunk;
  });

  // The whole response has been received. Print out the result.
  resp.on('end', () => {
		resolve(JSON.parse(data).result);
  });

	}).on("error", (err) => {
		reject(err)
		console.log(JSON.parse(data).error);
	});

	req.end(JSON.stringify(temporary));
});
final.then((response) => {
	for (i in response) {
		console.log(`${combos[i].toString()}: ${response[i]}`)
	}
}).catch((error) => {
	console.log(error);
});
console.log(final);