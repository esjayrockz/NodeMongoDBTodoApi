const {MongoClient, ObjectID} = require('mongodb');
MongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true }, (err, client) => {
  if(err){
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

  const db = client.db('TodoApp');

  db.collection('Users').findOneAndUpdate({
    _id: new ObjectID('5b98ae6db28397b0063ea960')
  },
  {
    $set: { name: 'Suvajit' },
    $inc: { age: 1 }
  }, {
  returnOriginal: false
}).then((result) => {
  console.log(result);
});
  // client.close();
});
