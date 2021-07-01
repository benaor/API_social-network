const Mongoose = require("mongoose")

const postSchema = new Mongoose.Schema(
  {
    posterId: {
      type: String,
      required: true
    },
    message: {
      type: String,
      trim: true,
      maxlength: 500
    },
    picture: {
      type: String
    },
    video: {
      type: String
    },
    likers: {
      type: [String],
      required: true
    },
    comments: {
      type: [
        {
          commenterId: String,
          commenterPseudo: String,
          text: String,
          timestamp: Number
        }
      ],
      required: true
    }
  },
  {
    timestamps: true
  }
)

const PostModel = Mongoose.model("post", postSchema)

module.exports = PostModel
