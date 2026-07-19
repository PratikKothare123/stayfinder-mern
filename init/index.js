const mongoose = require("mongoose");
const path = require("path");
const initData = require("./data.js");
const Listing = require("../models/listing.js")
require('dotenv').config({ path: path.join(__dirname, '../.env') });;

const MONGO_URL = process.env.MONGO_URL;
main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "6a2a5706f7d122ee5ea578df",
    image: {
      url: obj.image,
      filename: "listingimage"
    }
  }));
  await Listing.insertMany(initData.data);
  console.log("Data was initialized");
};

initDB();
