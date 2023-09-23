const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  id: { type: String, required: true },
  initialAnswer: {
    type: Schema.Types.Mixed,
    required: true,
  },
  finalAnswer: {
    type: Schema.Types.Mixed,
    required: true,
  },
  numberQuestion: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("User", userSchema, "Users");
