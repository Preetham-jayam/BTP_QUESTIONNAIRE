const mongoose = require('mongoose');

const ResponseSchema = new mongoose.Schema({
    question: String,
    answer: String
});

const SubmissionSchema = new mongoose.Schema({
    responses: [ResponseSchema],
    score: Number,
    submittedAt: {
        type: Date,
        default: Date.now
    }
});

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phoneNo: {
        type: Number,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    submissions: [SubmissionSchema]
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
