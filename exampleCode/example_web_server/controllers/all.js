const fs = require("fs");

const sendImage = async (req, res) => {
  if (!req.body) {
    res.send("body undefined");
  }
  console.log(`req is: \n${req.body.imageData}`);

  if (req.body.imageData == undefined) {
    res.send("imageData undefined");
  }
  const { imageData } = req.body;
  fs.writeFile("data.txt", imageData, (err) => {
    if (err) {
      console.log("didnt work stupid ass");
      res.send("didnt work stupid ass");
    } else {
      console.log("worked successfully this time...");
      res.send("worked successfully this time...");
    }
    res.send("worked successfully this time...");
  });
  res.send(`req is: \n${req.body.imageData}`);
};

const getImage = async (req, res) => {
  const imagePath = "./images/eye.jpeg";
  const image = fs.readFileSync(imagePath);
  res.setHeader("Content-Type", "image/jpeg");
  res.send(image);
};

module.exports = {
  sendImage,
  getImage,
};
