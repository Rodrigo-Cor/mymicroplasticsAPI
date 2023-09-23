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

  const numberQuestion = req.body && req.body.numberQuestion;
  const userProperties = {
    id: 1,
    initialAnswer: 1,
    finalAnswer: 1,
    numberQuestion: 1,
    _id: 0,
  };
  
  let user = [];
  if (numberQuestion === "") {
    user = await User.find({}, userProperties);
  } else {
    user = await User.find({ numberQuestion: numberQuestion }, userProperties);
  }

  context.res = {
    status: 200,
    body: user,
  };
};
