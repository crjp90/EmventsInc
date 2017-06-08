const UserModel = require('../models/user');

function createUser(username,password,email, fullname){
  return new Promise((resolve,reject) => {
    try{
      UserModel.findOne({username:username}, (err,user) => {
        if(err){ reject(err) }
        else{
          if(!user){
            const newUser = UserModel({username:username,password:password,email:email,fullname:fullname});
            newUser.save((err) => {
              if(err){ reject(err) }
                else{
                  console.log('Inserted 1 user into the collection');
                  resolve(newUser);
                }
            });
          }else{
            resolve(undefined);
          }
        }
      });
    }catch(ex){
      reject(ex);
    }
  });
}

function getUserByUsername(username) {
  return new Promise((resolve,reject) => {
    try {
      UserModel.findOne({ username: username}, (err, user) => {
        if (err) {reject(err) }
          else{
            if (!user) {
              resolve(undefined);
            }
            else
            {
              resolve(user);
            }
          }
        });
      }
    catch(ex){
      reject(ex);
    }
   });
}

module.exports = {createUser, getUserByUsername};
