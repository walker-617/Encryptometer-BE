const express = require("express");
const cors = require("cors"); // Import cors
const fs = require("fs").promises;
const { encrypt } = require("./helpers/encrypt");
const { decrypt } = require("./helpers/decrypt");

const app = express();
const port = 1000;
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.get("/", (req, res) => {
  res.send("welcome to Encryptometer BE API server.");
});

// for testing purposes
app.get("/test/api/encrypt", async (req, res) => {
  try {
    const { algorithm } = req.query;
    const text = await fs.readFile("Dummy_512KB.json", "utf8");
    const data = JSON.stringify(text);
    const response = encrypt(data, algorithm);
    res.send(response);
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred while reading the file.");
  }
});

// for real use
app.get("/api/encrypt", (req, res) => {
  try {
    const { text, algorithm } = req.query;
    const data = text;
    const response = encrypt(data, algorithm);
    res.send(response);
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred while reading the file.");
  }
});

app.get("/api/decrypt", (req, res) => {
  try {
    const { text, algorithm, iv } = req.query;
    const data = text;
    const response = decrypt(data, algorithm, Buffer.from(iv, "hex"));
    res.send(response);
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred while reading the file.");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
