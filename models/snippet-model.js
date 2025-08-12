const mongoose = require("mongoose");

const snippetSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description : {
        type: String
    },
    language: {
        type: String,
        required: true
    },
    content: {
        type: String,
        default: "",
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    collaborators: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
        }
    ],
    lastEditedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    version: {
        type: Number,
        default : 1,
    }
}, {timestamps: true})

module.exports = mongoose.model("snippet", snippetSchema);