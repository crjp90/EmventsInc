const UserModel = require('../models/user');

function createUser(username,password,email, fullname){
  return new Promise((resolve,reject) => {
    try{
      console.log(username);
      UserModel.findOne({username:username}, (err,user) => {
        if(err){ reject(err) }
        else{
          console.log(user);
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

module.exports = {createUser};
