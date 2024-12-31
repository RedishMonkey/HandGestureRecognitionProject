// Import Express
const express = require('express');
app = express();
const fs = require('fs')
const cors = require('cors')
const routes = require('./routes/all')

// Define a port to run your server
const PORT = 3000;

app.use(express.json());
app.use(cors())
app.use(routes)

// Define a simple route
app.get('/', (req, res) => {
    res.send('Welcome to my simple Express server!');
});
// // const sendImage = async (req, res)=> {
// //     if(!req.body)
// //     {
// //         res.send('body undefined');
// //     }
// //     console.log(`req is: \n${req.body.imageData}`);
// //     res.send(`req is: \n${req.body.imageData}`);
// //     // if(req.body.imageData == undefined)
// //     // {
// //     //     res.send('imageData undefined')
// //     // }
// //     //const {imageData} = req.body
// //     // fs.writeFile('data.txt','hello worlddd',(err) => {
// //     // if(err){
// //     //     console.log('didnt work stupid ass')
// //     //     res.send('didnt work stupid ass')
// //     // }
// //     // else{
// //     //     console.log('worked successfully this time...');
// //     //     res.send('worked successfully this time...');
// //     // }
// //     // res.send('worked successfully this time...');
// // //})
// // }

// const getImage = async (req, res) => {
//     const imagePath = './images/eye.jpeg'
//     const image = fs.readFileSync(imagePath)
//     res.setHeader('Content-Type', 'image/jpeg')
//     res.send(image);
// } 
// app.post('/send-image', sendImage)
// app.get('/get-image', getImage)



// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});