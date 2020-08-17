const { MongoClient } = require("mongodb");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const addUser = async (req, res) => {
  try {
    const { name } = req.body;
    const acceptedData = { name };

    const client = await MongoClient(MONGO_URI, options);

    await client.connect();

    const db = client.db("exercise_1");

    await db.collection("users").insertOne(acceptedData);

    client.close();

    res
      .status(201)
      .json({ status: 201, data: { name: name, _id: acceptedData._id } });
  } catch ({ message }) {
    res.status(401).json({ status: 401, message: message });
  }
};

module.exports = { addUser };
