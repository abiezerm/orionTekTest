const _data = require("../lib/data");
const fs = require('fs');

const userList = JSON.parse(
	fs.readFileSync('.data/data.json')
);


let createUser = function (req, res) {
	// Validate fields
	let firstName =
		typeof req.body.firstName == "string" &&
		req.body.firstName.trim().length > 0
			? req.body.firstName.trim()
			: false;
	let lastName =
		typeof req.body.lastName == "string" &&
		req.body.lastName.trim().length > 0
			? req.body.lastName.trim()
			: false;
	let email =
		typeof req.body.email == "string" &&
		req.body.email.trim().length > 0
			? req.body.email.trim()
			: false;
	let password =
		typeof req.body.password == "string" &&
		req.body.password.trim().length > 0
			? req.body.password.trim()
			: false;
	let address =
		typeof req.body.address == "object" || typeof req.body.address == "string" && req.body.address.length > 0
			? req.body.address
			: false;

	if (firstName && lastName && email && password && address) {
		_data.read('users', email, (err) => {
			if (err) {
				// Create the user object.
				let userObject = {
					firstName:req.body.firstName,
					lastName:req.body.lastName,
					email:req.body.email,
					Password:req.body.password,
					address:req.body.address,
				};

				//Store the created user
				_data.create("users", email, userObject, function (err) {
					if (!err) {
						userList.push(userObject);
						fs.writeFile('.data/data.json', JSON.stringify(userList), (err) => {
							res
								.status(201)
								.send(
									{
										message:'User created!',
										data:{
											userObject,
											userList
										}
									}
								);
						});
					} else {
						res.send('Error');
					}
				});


			} else {
				res.status(400).send('User already exist!')
			}
		});
	} else {
		res.status(400).send({message:"Missing fields or invalid fields!"})
	}
	;
};

let readUser = function (req, res) {
	let email =
		typeof req.params.email == "string" &&
		req.params.email.length > 0
			? req.params.email.trim()
			: false;

	_data.read("users", email, function (err, data) {
		if (!err && data) {
			// Remove the hashed password from the user object before returning it to the request
			delete data.password;
			res.status(200).send(data);
		} else {
			res.status(404);
		}
	});
};

let updateUser = function (req, res) {
	// Check for the required field
	let email =
		typeof req.body.email == "string" &&
		req.body.email.trim().length > 0
			? req.body.email.trim()
			: false;

	// Check Optional fields
	let firstName =
		typeof req.body.firstName == "string" &&
		req.body.firstName.trim().length > 0
			? req.body.firstName.trim()
			: false;

	let lastName =
		typeof req.body.lastName == "string" &&
		req.body.lastName.trim().length > 0
			? req.body.lastName.trim()
			: false;

	let password =
		typeof req.body.password == "string" &&
		req.body.password.trim().length > 0
			? req.body.password.trim()
			: false;

	let address =
		typeof req.body.address == "object" || typeof req.body.address == "string" && req.body.address.length > 0
			? req.body.address
			: false;

	//Error if the email is invalid
	if (email) {
		// Error if nothing is sent to update.
		if (firstName || lastName || password || address) {
			// Lookup the user
			_data.read("users", email, function (err, userData) {
				if (!err && userData) {
					// Update the fields that are necessary

					if (firstName) userData.firstName = firstName;
					if (lastName) userData.lastName = lastName;
					if (password) userData.Password = password;
					if (address) userData.address = address;

					//Store the new updates
					_data.update("users", email, userData, function (err) {
						if (!err) {
							delete userData.Password;
							//callback(200, userData);
							res.status(200).send(userData);
						} else {
							console.log(err);
							res.status(500).send('Could not update the user.');
						}
					});
				} else {
					res.status(400).send('The specified user does not exists.');
				}
			});
		} else {
			res.status(400).send('Missing fields to update.');
		}
	} else {
		res.status(400).send('Invalid or missing email');
	}
};

let deleteUser = function (req, res) {

};

let listUsers = function (req, res) {

};


module.exports = {
	createUser,
	readUser,
	updateUser,
	deleteUser,
	listUsers
};


// let welcome = function (req, res) {
// 	res.status(200).send('Hello from the controllers');
// };
//
// let print = function (req, res) {
// 	console.log(req.body);
// 	res.status(200).send('Information printed on the screen');
// };