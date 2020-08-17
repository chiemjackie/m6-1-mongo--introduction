const { MongoClient } = require("mongodb");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const dbFunction = async (dbname) => {
  const client = await MongoClient(MONGO_URI, options);

  await client.connect();

  const db = client.db("exercise-1");
  console.log("connected!");

  await db.collection("users").insertOne({ name: "Buck Rogers " });

  client.close();
  console.log("disconnected!");
};

dbFunction();
