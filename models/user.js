let User = null;
const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const userSchema = new Schema(
  {
    username: { type: String, required: true, unique: true, index: true},
    password: { type: String, required: true},
    email: { type: String, required: true },
    fullname: { type: String }
  }
);

userSchema.methods.verifyPassword = (password) => {
    return this.password === password;
}

User = mongoose.model('User', userSchema);

module.exports = User;

