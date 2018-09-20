const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {ObjectID} = require('mongodb');

const todos = [{
  _id: new ObjectID(),
  text: 'First todo'
},{
  _id: new ObjectID(),
  text: 'Second todo',
  completed: true,
  completedAt: 333
}];


beforeEach((done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done());
});

describe('POST /todos', () => {
  it('should create a new todo', (done)=>{
    const text = 'Test todo text';
    request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
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
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(2)
      })
      .end(done);
  });

});


  describe('GET /todos/:id', () => {
    it('should return todo doc', (done) => {
      request(app)
        .get(`/todos/${todos[0]._id.toHexString()}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.todo.text).toBe(todos[0].text);
        })
        .end(done);
    });

    it('should return 404 if todo not found', (done) => {
      const _id = new ObjectID();
      request(app)
        .get(`/todos/${_id.toHexString()}`)
        .expect(404)
        .end(done);
    });

    it('should return 404 for non-object ids', (done) =>{
      const _id = '123';
      request(app)
        .get(`/todos/${_id}`)
        .expect(404)
        .end(done);
    })
  });

  describe('DELETE /todos/:id', () => {
    it('should delete a todo', (done) => {
      const id = todos[1]._id.toHexString();

      request(app)
        .delete(`/todos/${id}`)
        .expect(200)
        .expect((res)=>{
          expect(res.body.todo._id).toBe(id);
        })
        .end((err, res) => {
          if(err){
            return done(err);
          }

          Todo.findById(id).then((todo) => {
            expect(todo).toNotExist();
            done();
          }).catch((e) => done(e));
        });
    });

  it('should return 404 if todo not found', (done) => {
    const _id = new ObjectID();
    request(app)
      .delete(`/todos/${_id.toHexString()}`)
      .expect(404)
      .end(done);
  });

  it('should return 404 if object id is invalid', (done) => {
    const _id = '123';
    request(app)
      .delete(`/todos/${_id}`)
      .expect(404)
      .end(done);
  });

  });

  describe('PATCH /todos/:id', () => {
    it('should update the todo', (done) => {
      const id = todos[0]._id.toHexString();
      request(app)
        .patch(`/todos/${id}`)
        .send({
          text: 'Make food for week',
          completed: true
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe('Make food for week');
        expect(res.body.todo.completed).toBe(true);
        expect(res.body.todo.completedAt).toBeA('number');
      })
      .end(done);
    });

    it('should clear completedAt when todo is not complted', (done) => {
      const id = todos[1]._id.toHexString();
      request(app)
        .patch(`/todos/${id}`)
        .send({
          text: 'Not completed yet',
          completed: false
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe('Not completed yet');
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toNotExist();
      })
      .end(done);
    });
  });
