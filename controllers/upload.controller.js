const userModel = require("../models/user.model")
const fs = require("fs")
const { promisify } = require("util")
const { uploadErrors } = require("../utils/error.utils")
const UserModel = require("../models/user.model")
const pipeline = promisify(require("stream").pipeline)

exports.uploadProfil = async (req, res) => {
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

  const fileName = req.body.name + ".jpg"

  await pipeline(
    req.file.stream,
    fs.createWriteStream(
      `${__dirname}/../client/public/uploads/profil/${fileName}`
    )
  )

  try {
    await UserModel.findByIdAndUpdate(
      req.body.userId,
      {
        $set: { picture: "./uploads/profil/" + fileName }
      },
      { new: true, upsert: true, setDefaultsOnInsert: true },
      (err, docs) => {
        if (!err) return res.send(docs)
        else return res.status(500).send({ message: err })
      }
    )
  } catch (err) {
    return res.status(500).send({ message: err })
  }
}
