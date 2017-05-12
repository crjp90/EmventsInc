let User = null;
const mongoose = require('mongoose');

//const Schema = mongoose.Schema;
const userSchema = mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, index: true},
    password: { type: String, required: true},
    email: { type: String, required: true },
    fullname: { type: String }
  }
);

userSchema.methods.speak = function() {
    let greeting = (this.fullname ? "Name is " + this.fullname : "I don't have a name");
    console.log(greeting);
}

userSchema.methods.verifyPassword = (password) => {
  console.log("this.password: " + this.password + ", password: " + password);
  return this.password === password;
}

User = mongoose.model('User', userSchema);

module.exports = User;

