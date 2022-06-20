import express from "express";

const app = express();

app.get("/", (req, res) => {
  console.log(req.ip);

  res.status(200).send({ msg: "good" });
});

app.listen(3001, () => {
  console.log("App on port 3001");
});
