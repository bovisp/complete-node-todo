const mongoose  = require("mongoose"),
	  validator = require("validator"),
	  jwt       = require("jsonwebtoken"),
	  _         = require("lodash");

let UserSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		menlength: 1,
		trim: true,
		unique: true,
		validate: {
			validator: validator.isEmail,
			message: '{VALUE} is not a valid email'
		}
	},

	password: {
		type: String,
		reuired: true,
		minlength: 6
	},

	tokens: [
		{
			access: {
				type: String,
				reuired: true
			},
			token: {
				type: String,
				reuired: true
			}
		}
	]
});

UserSchema.methods.generateAuthToken = function () {
	let user = this;
	let access = 'auth';

	let token = jwt.sign(
		{
			_id: user._id.toHexString(),
			access
		},
		'abc123'
	).toString();

	user.tokens = user.tokens.concat([{ access, token }]);

	return user.save()
		.then(() => {
			return token;
		});
};

UserSchema.statics.findByToken = function (token) {
	let User = this;

	let decoded;

	try {
		decoded = jwt.verify(token, "abc123")
	} catch (e) {
		return Promise.reject();
	}

	return User.findOne({
		'_id': decoded._id,
		tokens: {
			$elemMatch: {
				token: token,
				access: 'auth'
			}
		}
	})
};

UserSchema.methods.toJSON = function () {
	let user = this;

	let userObject = user.toObject();

	return _.pick(userObject, ['_id', 'email']);
}

const User = mongoose.model("User", UserSchema);

module.exports = { User };