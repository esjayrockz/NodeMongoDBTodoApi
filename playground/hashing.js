const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');

const bcrypt = require('bcryptjs');
const password = '123abc!';

// bcrypt.genSalt(10, (err, salt) => {
//   bcrypt.hash(password, salt, (err, hash) => {
//     console.log(hash);
//   });
// });

const hashedPassword = '$2a$10$XSiNqLhy4xr7hU35OPoBwuNNVRUyNbzgTgrqsIbBzpRV4xDr7g0pG';

bcrypt.compare('123abc!', hashedPassword, (err, res) => {
  console.log(res);
});



// const data = {
//   id: 10
// };
//
//
// const data2 = {
//   id: 20
// };
//
// const token = jwt.sign(data, 'abc123');
// console.log('Token: ', token);
//
// const decoded = jwt.verify(token, 'abc123');
// console.log('Decoded: ', decoded);
//
// const token2 = jwt.sign(data2, 'abc1233');
// console.log('Token: ', token2);
//
// const decoded2 = jwt.verify(token, 'abc123');
// console.log('Decoded: ', decoded2);







// const msg = "I am user number 3";
// const hash = SHA256(msg);
//
// console.log(`Message: ${msg}`);
// console.log(`Hash: ${hash}`);
//
// const data = {
//   id: 4
// };
//
// const token = {
//   data,
//   hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// }
//
// // data.id = 5;
// // data.hash = SHA256(JSON.stringify(data)).toString();
//
// const resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();
//
// if(resultHash === token.hash){
//   console.log('Data was not changed');
// }
// else {
//   console.log('Data was changed. Do not trust!');
// }
