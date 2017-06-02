let Usuario = null;
const mongoose = require('mongoose');

const usuarioSchema = mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, index: true},
    password: { type: String, required: true},
    email: { type: String, required: true },
    fullname: { type: String }
  }
);

usuarioSchema.methods.verifyPassword = function(password) {
  // no utilizamos Arrow Function ya que interfiere con el contexto de this:	
  return this.password === password;
}

Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;

