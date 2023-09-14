const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const WORK_FACTOR = 10;
const Schema = mongoose.Schema;

const EMAIL_PATTERN = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


const userSchema = Schema({
    name: {
        type: String,
        required: 'User name is required'
    },
    email: {
        type: String,
        required: 'User mail is required',
        lowercase: true,
        trim: true,
        match: [EMAIL_PATTERN, 'Invalid email format']
    },
    username: {
        type: String,
        required: 'User username is required',
        trim: true,
        unique: true,
        validate: {
          validator: function(value) {
            return !value.includes(' ')
          },
          message: 'Invalid username, username can not contains white spaces'
        }
    },
    password: {
        type: String,
        required: 'User password is required',
        minLength: [8, 'User password needs 8 chars']
    },
    avatarUrl: {
        type: String,
        default: function () {
          return `https://i.pravatar.cc/150?u=${this.email}`
        }
    }, 
    credits: {
      type: Number,
      default: 0
    }

}, { timestamps: true });

userSchema.virtual('products', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'user',
  limit: 15,
})




userSchema.pre('save', function(next) {
  const user = this;

  if (user.isModified('password')) {
    bcrypt.hash(this.password, WORK_FACTOR)
    .then((hash) => {
      user.password = hash;
      next();
    })
    .catch((error) => next(error))
  } else {
    next();
  }
})

userSchema.methods.checkPassword = function (password) {
  return bcrypt.compare(password, this.password);
}

const User = mongoose.model('User', userSchema);
module.exports = User;