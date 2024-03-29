const { connecttionDB } = require("../globalFunctions");
const User = require("../models/User");

module.exports = async function (context, req) {
  context.log("JavaScript HTTP trigger function processed a request.");
  const connection = await connecttionDB();
  if (!connection.success) {
    context.res = {
      status: 503,
      body: connection.message,
    };
    return;
  }

  const id = req.body && req.body.id;
  const initialAnswer = req.body && req.body.initialAnswer;
  const finalAnswer = req.body && req.body.finalAnswer;
  const numberQuestion = req.body && req.body.numberQuestion;

  const user = {
    id: id,
    initialAnswer: initialAnswer,
    finalAnswer: finalAnswer,
    numberQuestion: numberQuestion,
  };

  console.log("Usuario" + user);

  const newUser = new User(user);
  await newUser.save();

  context.res = {
    status: 201,
    body: "Se ha registrado " + id + " con exito",
  };
};
