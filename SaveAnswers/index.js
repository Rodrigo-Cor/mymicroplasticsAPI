const { connecttionDB } = require("../globalFunctions");
const User = require("../models/User");

module.exports = async function (context, req) {
  context.log("JavaScript HTTP trigger function processed a request.");
  const connection = await connecttionDB();
  console.log(connection.success);
  if (!connection.success) {
    context.res = {
      status: 503,
      body: connection.message,
    };
    return;
  }
  const username = req.body && req.body.username;
  const password = req.body && req.body.password;
  const questions = req.body && req.body.questions;

  
  if (!username || !password || questions.length < 1) {
    context.res = {
      status: 400,
      body: "Please pass a username, password and answers on the body",
    };
    return;
  }

  const user = {
    username,
    password,
    questions
  };

  const newUser = new User(user);
  await newUser.save();

  context.res = {
    status: 201,
    body: "Se ha registrado " + username,
  };
};
