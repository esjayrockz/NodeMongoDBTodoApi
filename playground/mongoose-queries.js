const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

const id = "6ba289750176dffc2c47053a11";

User.findById("5b9f1d29f6c7dde11030b569").then((user) => {
  if(!user){
    return console.log('User not found');
  }
  console.log('User: ', JSON.stringify(user, undefined, 2));
}).catch((e) => console.log(e));

// if(!ObjectID.isValid(id)){
//   console.log('Id not valid');
// }

// Todo.find({
//   _id: id
// }).then((todos) => {
//   if(todos.length === 0){
//     return console.log('Id not found');
//   }
//   console.log('Todos', todos);
// });
//
// Todo.findOne({
//   _id: id
// }).then((todo) => {
//   if(!todo){
//     return console.log('Id not found');
//   }
//   console.log('Todo', todo);
// });

// Todo.findById(id).then((todo) => {
//   if(!todo){
//     return console.log('Id not found');
//   }
//   console.log('Todo By Id', todo);
// }).catch((e) => console.log());
