const mongoose = require("mongoose")
require("dotenv").config({ path: ".env" })

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_ID}:${process.env.DB_PWD}@cluster0.53gzo.mongodb.net/social-network`,
    {
      useNewUrlParser: true,
        useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    }
  )
  .then(() => console.log("Connected with MongoDB"))
  .catch((err) => console.log("failed to connect with MongoDB", err))
