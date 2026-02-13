const mongoose = require("mongoose");

async function connectToDB() {
  await mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("Connected successfully to database");
    })
    .catch((error) => {
      console.log("Connection Failed To MongoDB!", error);
    });

  // Anthor way
  // try {
  //   mongoose.connect(process.env.MONGO_URI);
  //   console.log("Connected successfully to database");
  // } catch (error) {
  //   console.log("Connection Failed To MongoDB!", error);
  // }
}

module.exports = connectToDB;
