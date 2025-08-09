const mongoose = require("mongoose");
const initdata = require("./data.js");
const listing = require("../models/listing.js");

const mongo_url = "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
  await mongoose.connect(mongo_url);
}

main()
  .then(() => {
    console.log("Database succesfully connected");
  })
  .catch((err) => {
    console.log(err);
  });

const initDB = async () => {
  await listing.deleteMany({});
  initdata.data = initdata.data.map((obj) => ({
    ...obj,
    owner: "687de205678d192178bd838f",
  }));
  await listing.insertMany(initdata.data);
  console.log("data was intialized");
};

initDB();
