# NodeMongoDBTodoApi
Rest Api using Node, Express and MongoDB

More details:
REST APIs for Todo Application  (Node.JS, Express, MongoDB, Mongoose, Mocha Testing, Heroku and mLab)
* Created REST APIs for CRUD operations for Users and their Private Todos using async – await for asynchronous functions.
* User authentication done using JWTs, Auth Tokens, Hashing and Private routes managed using Express Auth middleware.
* Tested REST API endpoints using Mocha, SuperTest and Expect assertions.
* Used MongoDB Database and Mongoose ODM and managed configuration using Postman and Robo Mongo.
* Deployed app and MongoDB database on Heroku using mLab MongoDB.


Correct Steps to access API:
* All the routes for the API are handled in server/server.js and authentication middleware is present in server/middleware. The mongoose models is defined in server/models.
* Currently, there is no front end web interface to access the API so ways to access it is through code or an Application like Postman. Postman is the best option.
* User authentication is implemented using JWTs, Auth Tokens and Hashing so the routes will not be accessible without a token.

API routes.
For User requests.
* Register: POST https://evening-eyrie-48193.herokuapp.com/users
* Get back your details: GET https://evening-eyrie-48193.herokuapp.com/users/me
* Login: POST https://evening-eyrie-48193.herokuapp.com/users/login
* Delete your details: DELETE https://evening-eyrie-48193.herokuapp.com/users/me/token

For Todo requests.
* Get your todos: GET https://evening-eyrie-48193.herokuapp.com/todos
* Create a new todo: POST https://evening-eyrie-48193.herokuapp.com/todos
* Update a todo: PATCH https://evening-eyrie-48193.herokuapp.com/todos/:id
* Get a specific todo: GET https://evening-eyrie-48193.herokuapp.com/todos/:id
* Delete a specific todo: DELETE https://evening-eyrie-48193.herokuapp.com/todos/:id

Further guides to access API are as follows:

Access User details:

* Register: In order to access a token, you must first register at https://evening-eyrie-48193.herokuapp.com/users
and by making a POST request to this url and send an email and password in the body.
Example:
{ "email": "example@example.com", "password": "mnb@123!"}. Email will be validated so email format has to be correct. You will receive an x-auth token back. You must set this x-auth token as header with the header name as 'x-auth' before accessing other private routes. Obviously every time you login, you will be given back a new x-auth token which you must use to access other private routes.
* Get back your details: You can get your own id and email back by setting the x-auth token as a header and making a GET request to https://evening-eyrie-48193.herokuapp.com/users/me
* Login: You will get a new x-auth token as a header by sending an email and password in the body and making a POST request to https://evening-eyrie-48193.herokuapp.com/users/login . You must use this new x-auth token to access other private routes.
* Delete your details: You can get delete your id/email by setting the x-auth token as a header and making a DELETE request to https://evening-eyrie-48193.herokuapp.com/users/me/token

Access your Todos:

* Get your todos: You can get your todos by setting the x-auth token as a header and making a GET request to https://evening-eyrie-48193.herokuapp.com/todos
* Create a new todo: You can create a new todo by setting the x-auth token as a header and making a POST request to https://evening-eyrie-48193.herokuapp.com/todos. You must send only a text in the body. Example:
{ "text": "Some todo" }. Fields like the creator will be set by the program and completed will be set to False, which you will be able to change to true in only the following patch request.
* Update a todo: You can update a todo by setting the x-auth token as a header and making a PATCH request to https://evening-eyrie-48193.herokuapp.com/todos/:id. You should send the id in the link. You can send a text or completed or both in the body. completed should be set to true or false. Example: { "completed": true }. The completedAt field will be filled automatically if you set completed to true.
* Get a specific todo: You can get a specific todo back by setting the x-auth token as a header and making a GET request to https://evening-eyrie-48193.herokuapp.com/todos/:id with the id in the link.
* Delete a specific todo: You can delete a specific todo by setting the x-auth token as a header and making a DELETE request to https://evening-eyrie-48193.herokuapp.com/todos/:id with the id in the link.
