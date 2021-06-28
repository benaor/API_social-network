const UserModel = require("../models/user.model")
const ObjectID = require("mongoose").Types.ObjectId

module.exports.getAllUsers = async (req, res) => {
  const users = await UserModel.find().select("-password")
  res.status(200).json(users)
}

module.exports.userInfo = (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id)

  UserModel.findById(req.params.id, (err, docs) => {
    if (!err) res.send(docs)
    else console.log("ID unknown : " + err)
  }).select("-password")
}

module.exports.updateUser = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id)
  try {
    await UserModel.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          bio: req.body.bio
        }
      },
      {
        new: true,
        upsert: true,
        setDefaultsOneInsert: true
      },
      (err, docs) => {
        if (!err) return res.send(docs)
        if (err) return res.status(500).send({ message: err })
      }
    )
  } catch (err) {
    return res.status(500).json({ message: err })
  }
}

module.exports.deleteUser = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id)

  try {
    await UserModel.remove({ _id: req.params.id }).exec()
    return res.status(200).json({ message: "successfully deleted. " })
  } catch (err) {
    return res.status(500).json({ message: err })
  }
}

module.exports.follow = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id)

  if (!ObjectID.isValid(req.body.idToFollow))
    return res.status(400).send("ID unknown : " + req.body.idToFollow)

  try {
    //Add to the followerList
    await UserModel.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { following: req.body.idToFollow } },
      { new: true, upsert: true },
      (err, docs) => {
        if (!err) res.status(201).json(docs)
        else res.status(400).json(err)
      }
    )

    //Add to following list
    await UserModel.findByIdAndUpdate(
      req.body.idToFollow,
      {
        $addToSet: { followers: req.params.id }
      },
      { new: true, upsert: true },
      (err, docs) => {
        // if (!err) res.status(201).json(docs) //on ne peut pas mettre 2 responses
        if (err) res.status(400).json(err)
      }
    )
  } catch (err) {
    return res.status(500).json({ message: err })
  }
}

module.exports.unfollow = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id)

  if (!ObjectID.isValid(req.body.idToUnfollow))
    return res.status(400).send("ID unknown : " + req.body.idToUnfollow)

  try {
    //Add to the followerList
    await UserModel.findByIdAndUpdate(
      req.params.id,
      { $pull: { following: req.body.idToUnfollow } },
      { new: true, upsert: true },
      (err, docs) => {
        if (!err) res.status(201).json(docs)
        else res.status(400).json(err)
      }
    )

    //Add to following list
    await UserModel.findByIdAndUpdate(
      req.body.idToUnfollow,
      {
        $pull: { followers: req.params.id }
      },
      { new: true, upsert: true },
      (err, docs) => {
        if (err) res.status(400).json(err)
      }
    )
  } catch (err) {
    return res.status(500).json({ message: err })
  }
}
