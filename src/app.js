const express = require("express");
const app = express();
const PORT = 3000;

app.use((req, res) => {
  res.send("hiii");
});

app.listen(PORT, () => {
  console.log("Server is running on ", PORT);
});
