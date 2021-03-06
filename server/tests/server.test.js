const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
  it('should create a new todo', (done)=>{
    const text = 'Test todo text';
    request(app)
      .post('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .send({text})
      .expect(200)//The expect methods are coming from supertest and not expect library
      .expect((res) => {
        expect(res.body.text).toBe(text);//This expect statement is coming from expect library
      })
      .end((err, res) => {
        if(err){
          return done(err);
        }
        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e) => done(e));
      });
  });

  it('should not create a todo with invalid body data', (done) => {
    request(app)
      .post('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .send({})
      .expect(400)
      .end((err, res) => {
        if(err){
          return done(err);
        }
        Todo.find().then((todos)=> {
          expect(todos.length).toBe(2);//2 because beforeEach adds 2 todos.
          done();
        }).catch((e)=> done(e));
      });
  });
});


describe('GET /todos', () => {
  it('should get all todos', (done) => {
    request(app)
      .get('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(1)
      })
      .end(done);
  });

});


  describe('GET /todos/:id', () => {
    it('should return todo doc', (done) => {
      request(app)
        .get(`/todos/${todos[0]._id.toHexString()}`)
        .set('x-auth', users[0].tokens[0].token)
        .expect(200)
        .expect((res) => {
          expect(res.body.todo.text).toBe(todos[0].text);
        })
        .end(done);
    });

    it('should not return todo doc created by another user', (done) => {
      request(app)
        .get(`/todos/${todos[1]._id.toHexString()}`)
        .set('x-auth', users[0].tokens[0].token)
        .expect(404)
        .end(done);
    });

    it('should return 404 if todo not found', (done) => {
      const _id = new ObjectID();
      request(app)
        .get(`/todos/${_id.toHexString()}`)
        .set('x-auth', users[0].tokens[0].token)
        .expect(404)
        .end(done);
    });

    it('should return 404 for non-object ids', (done) =>{
      const _id = '123';
      request(app)
        .get(`/todos/${_id}`)
        .set('x-auth', users[0].tokens[0].token)
        .expect(404)
        .end(done);
    })
  });

  describe('DELETE /todos/:id', () => {
    it('should delete a todo', (done) => {
      const id = todos[1]._id.toHexString();
      request(app)
        .delete(`/todos/${id}`)
        .set('x-auth', users[1].tokens[0].token)
        .expect(200)
        .expect((res)=>{
          expect(res.body.todo._id).toBe(id);
        })
        .end((err, res) => {
          if(err){
            return done(err);
          }

          Todo.findById(id).then((todo) => {
            expect(todo).toBeFalsy();
            done();
          }).catch((e) => done(e));
        });
    });

    it('should not delete a todo created by another user', (done) => {
      const id = todos[0]._id.toHexString();
      request(app)
        .delete(`/todos/${id}`)
        .set('x-auth', users[1].tokens[0].token)
        .expect(404)
        .end((err, res) => {
          if(err){
            return done(err);
          }

          Todo.findById(id).then((todo) => {
            expect(todo).toBeTruthy();
            done();
          }).catch((e) => done(e));
        });
    });

  it('should return 404 if todo not found', (done) => {
    const _id = new ObjectID();
    request(app)
      .delete(`/todos/${_id.toHexString()}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should return 404 if object id is invalid', (done) => {
    const _id = '123';
    request(app)
      .delete(`/todos/${_id}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end(done);
  });

  });

  describe('PATCH /todos/:id', () => {
    it('should update the todo', (done) => {
      const id = todos[0]._id.toHexString();
      request(app)
        .patch(`/todos/${id}`)
        .set('x-auth', users[0].tokens[0].token)
        .send({
          text: 'Make food for week',
          completed: true
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe('Make food for week');
        expect(res.body.todo.completed).toBe(true);
        expect(typeof res.body.todo.completedAt).toBe('number');
      })
      .end(done);
    });

    it('should not update the todo created by another user', (done) => {
      const id = todos[1]._id.toHexString();
      request(app)
        .patch(`/todos/${id}`)
        .set('x-auth', users[0].tokens[0].token)
        .send({
          text: 'Make food for week',
          completed: true
      })
      .expect(404)
      .end(done);
    });


    it('should clear completedAt when todo is not complted', (done) => {
      const id = todos[1]._id.toHexString();
      request(app)
        .patch(`/todos/${id}`)
        .set('x-auth', users[1].tokens[0].token)
        .send({
          text: 'Not completed yet',
          completed: false
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe('Not completed yet');
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toBeFalsy();
      })
      .end(done);
    });
  });

  describe('GET /users/me', () => {
    it('should return user if authenticated', (done) => {
      request(app)
        .get('/users/me')
        .set('x-auth', users[0].tokens[0].token)
        .expect(200)
        .expect((res) => {
          expect(res.body._id).toBe(users[0]._id.toHexString());
          expect(res.body.email).toBe(users[0].email);
        })
        .end(done);
    });

    it('should return a 401 if not authenticated', (done) => {
      request(app)
        .get('/users/me')
        .expect(401)
        .expect((res) => {
          expect(res.body).toEqual({});
        })
        .end(done);
    });
  });

 describe('POST /users', () => {
  it('should create a user', (done) => {
    const email = 'example@example.com';
    const password = 'mnb@123!';
    request(app)
      .post('/users')
      .send({email, password})
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toBeTruthy();
        expect(res.body._id).toBeTruthy();
        expect(res.body.email).toBe(email);
      })
      .end((err) => {
        if(err){
          return done(err);
        }
        User.findOne({email}).then((user) => {
          expect(user).toBeTruthy();
          expect(user.password).not.toBe(password);
          done();
        }).catch((e) => done(e));
      });
  });

  it('should return validation errors if request invalid', (done) => {
    const email = 'example@example';
    const password = 'pass';
    request(app)
      .post('/users')
      .send({email, password})
      .expect(400)
      .end(done);
  });

  it('should not create a user if email is invalid', (done) => {
    const email = users[0].email;//reusing same email
    const password = 'password';
    request(app)
      .post('/users')
      .send({email, password})
      .expect(400)
      .end(done);
  });

 });

 describe('POST /users/login', () =>{
   it('should login user and return auth token', (done) => {
     request(app)
       .post('/users/login')
       .send({
         email: users[1].email,
         password: users[1].password
       })
       .expect(200)
       .expect((res) => {
         expect(res.headers['x-auth']).toBeTruthy();
       })
       .end((err, res) => {
         if(err){
           return done(err);
         }
         User.findById(users[1]._id).then((user) => {
           expect(user.toObject().tokens[1]).toMatchObject({
              access: 'auth',
              token: res.headers['x-auth']
            });
         done();
       }).catch((e) => done(e));
       });
   });

   it('should reject invalid login', (done) => {
     request(app)
       .post('/users/login')
       .send({
         email: users[1].email,
         password: users[0].password
       })
       .expect(400)
       .expect((res) => {
         expect(res.headers['x-auth']).toBeFalsy();
       })
       .end((err, res) => {
         if(err){
           return done(err);
         }
         User.findById(users[1]._id).then((user) => {
          expect(user.tokens.length).toBe(1);
          done();
       }).catch((e) => done(e));
       });
   });
 });

 describe('DELETE /users/me/token', () => {
     it('should logout an user', (done) => {
       request(app)
         .delete('/users/me/token')
         .set('x-auth', users[0].tokens[0].token)
         .expect(200)
         .end((err, res) => {
           if(err){
             return done(err);
           }
           User.findById(users[0]._id).then((user) => {
             expect(user.tokens.length).toBe(0);
             done();
           }).catch((e) => done(e));
         });
     });
 });
