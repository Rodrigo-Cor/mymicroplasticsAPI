const mongoose = require('mongoose');

const get3Element = (arr, num) => {
  const length = arr.length;
  const newArr = [];
  if (arr.length <= num) {
    return arr;
  }

  for (let i = 0; i < num; i++) {
    const index = Math.floor(Math.random() * length);
    const element = arr.splice(index, 1)[0];
    newArr.push(element);
  }
  return newArr;
}

const connecttionDB = async () => {
  try {
    await mongoose.connect(process.env.URI);
    return {
      success: true,
      message: 'Connected to the database!',
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error connecting to the database: ' + error,
    };
  }
};

module.exports = {
  get3Element,
  connecttionDB,
};
