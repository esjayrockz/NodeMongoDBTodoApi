const MongoClient = require('mongodb').MongoClient;
MongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true }, (err, client) => {
  if(err){
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

  const db = client.db('TodoApp');

  // db.collection('Todos').insertOne({
  //   text: 'Something else',
  //   completed: true
  // }, (err, result) => {
  //   if(err){
  //     return console.log('Unable to insert todo', err);
  //   }
  //   console.log(JSON.stringify(result.ops, undefined, 2));
  // });

  db.collection('Users').insertOne({
    name: 'Suvajit',
    age: 27,
    location: 'Charlotte'
  }, (err, result) => {
    if(err){
      return console.log('Unable to insert an user', err);
    }
    console.log(result.ops[0]._id.getTimestamp());
  });

  // client.close();
});
