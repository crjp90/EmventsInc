let User = null;
const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, index: true},
    password: { type: String, required: true},
    email: { type: String, required: true },
    fullname: { type: String }
  }
);

userSchema.methods.verifyPassword = function(password) {
  // no utilizamos Arrow Function ya que interfiere con el contexto de this:	
  return this.password === password;
}

User = mongoose.model('User', userSchema);

module.exports = User;

