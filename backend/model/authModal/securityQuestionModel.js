const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const securityQuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
  userId: {
    type: ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("SecurityQuestion", securityQuestionSchema);
