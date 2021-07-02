const postModel = require("../models/post.model")
const userModel = require("../models/user.model")
const ObjectID = require("mongoose").Types.ObjectId
const fs = require("fs")
const { uploadErrors } = require("../utils/error.utils")
const { promisify } = require("util")
const pipeline = promisify(require("stream").pipeline)

exports.readPost = (req, res) => {
  postModel
    .find((err, docs) => {
      if (!err) res.status(200).send(docs)
      else console.log("error to get data : " + err)
    })
    .sort({ createdAt: -1 })
}

exports.createPost = async (req, res) => {
  const { posterId, message, video } = req.body
  let fileName

  if (req.file !== null) {
    try {
      if (
        req.file.detectedMimeType != "image/jpg" &&
        req.file.detectedMimeType != "image/png" &&
        req.file.detectedMimeType != "image/jpeg"
      )
        throw Error("invalid file")

      if (req.file.size > 1000000) throw Error("max size")
    } catch (err) {
      const errors = uploadErrors(err)
      return res.status(201).json({ errors })
    }

    fileName = posterId + Date.now() + ".jpg"
    await pipeline(
      req.file.stream,
      fs.createWriteStream(
        `${__dirname}/../client/public/uploads/posts/${fileName}`
      )
    )
  }

  const newPost = new postModel({
    posterId,
    message,
    picture: req.file !== null ? "./uploads/posts/" + fileName : "",
    video,
    likers: [],
    comments: []
  })

  try {
    const post = await newPost.save()
    res.status(201).json(post)
  } catch (err) {
    return res.status(400).send(err)
  }
}

exports.updatePost = (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id)

  const updatedRecord = {
    message: req.body.message
  }

  postModel.findByIdAndUpdate(
    req.params.id,
    { $set: updatedRecord },
    { new: true },
    (err, docs) => {
      if (!err) res.send(docs)
      else console.log("update error : " + err)
    }
  )
}

exports.deletePost = (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id)

  postModel.findByIdAndDelete(req.params.id, (err, docs) => {
    if (!err) res.send(docs)
    else console.log("deleted error : " + err)
  })
}

exports.likePost = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id)

  try {
    await postModel.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { likers: req.body.id } },
      { new: true },
      (err, docs) => {
        if (err) return res.status(400).send(err)
      }
    )
    await userModel.findByIdAndUpdate(
      req.body.id,
      { $addToSet: { likes: req.params.id } },
      { new: true },
      (err, docs) => {
        if (!err) res.send(docs)
        else return res.status(400).send(err)
      }
    )
  } catch (err) {
    res.status(400).send(err)
  }
}

exports.unlikePost = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id)

  try {
    await postModel.findByIdAndUpdate(
      req.params.id,
      { $pull: { likers: req.body.id } },
      { new: true },
      (err, docs) => {
        if (err) return res.status(400).send(err)
      }
    )
    await userModel.findByIdAndUpdate(
      req.body.id,
      { $pull: { likes: req.params.id } },
      { new: true },
      (err, docs) => {
        if (!err) res.send(docs)
        else return res.status(400).send(err)
      }
    )
  } catch (err) {
    res.status(400).send(err)
  }
}

exports.commentPost = (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id)

  try {
    return postModel.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          comments: {
            commenterId: req.body.commenterId,
            commenterPseudo: req.body.commenterPseudo,
            text: req.body.text,
            timestamp: new Date().getTime()
          }
        }
      },
      { new: true },
      (err, docs) => {
        if (!err) res.send(docs)
        else return res.status(400).send(err)
      }
    )
  } catch (err) {
    res.status(400).send(err)
  }
}

exports.editCommentPost = (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id)

  try {
    return postModel.findById(req.params.id, (err, docs) => {
      const theComment = docs.comments.find((comment) =>
        comment._id.equals(req.body.commentId)
      )

      // If Commment is not found
      if (!theComment) return res.status(404).send("Comment not found")

      // If Comment is found
      theComment.text = req.body.text
      return docs.save((error) => {
        if (!error) return res.status(200).send(docs)
        else return res.status(500).send(error)
      })
    })
  } catch (err) {
    res.status(400).send(err)
  }
}

exports.deleteCommentPost = (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id)

  try {
    return postModel.findByIdAndUpdate(
      req.params.id,
      {
        $pull: {
          comments: { _id: req.body.commentId }
        }
      },
      { new: true },
      (err, docs) => {
        if (!err) return res.status(200).send(docs)
        else return res.status(500).send(err)
      }
    )
  } catch (err) {
    res.status(400).send(err)
  }
}
