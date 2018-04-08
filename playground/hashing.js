const { SHA256 } = require("crypto-js"),
		     jwt = require("jsonwebtoken"),
		  bcrypt = require("bcryptjs");

let password = "123abc!";

// bcrypt.genSalt(12, (err, salt) => {
// 	bcrypt.hash(password, salt, (err, hash) => {
// 		console.log(hash);
// 	});
// });

let hashedPassword = "$2a$12$chULw2bHXpB2F42AoZJRvuZelWUlT7m1S0vICIruHQzTSRogtWYyC";

bcrypt.compare(password, hashedPassword, (err, result) => {
	console.log(result);
});

// let data = {
// 	id: 4
// };

// let token = jwt.sign(data, "123abc");

// console.log(token);

// let decoded = jwt.verify(token, "123abc");

// console.log(decoded);

// const message = "I am the user number 3";
// const hash = SHA256(message).toString();

// console.log(`Message: ${message}`);
// console.log(`Hash: ${hash}`);

// let data = {
// 	id: 4
// };

// let token = {
// 	data,
// 	hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// };

// Safe
// const resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();

// A hacker who doesn't have access to the salt
// token.data.id = 5;
// token.hash = SHA256(JSON.stringify(token.data)).toString();

// if (resultHash === token.hash) {
// 	console.log("Data was not changed");
// } else {
// 	console.log("Data was changed. Don't trust");
// }