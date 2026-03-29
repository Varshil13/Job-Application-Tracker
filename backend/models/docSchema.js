const mongoose = require("mongoose")

const docSchema = new mongoose.Schema({

  docName : {
    type : String,
    required : true
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  public_id: {
    type: String,
    required: true
  },

  url: {
    type: String,
    required: true
  },

  resource_type: {
    type: String,
    required: true
  },

  mimeType: {
    type: String,
    required: true
  },

  originalName: {
    type: String,
    required: true
  },

  size: {
    type: Number
  },

  uploadedAt: {
    type: Date,
    default: Date.now
  }

})

module.exports = mongoose.model("Doc", docSchema)