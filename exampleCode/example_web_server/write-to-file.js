const fs = require('fs')
fs.writeFile('data.txt','hello world',(err) => {
    if(err){
        console.log('didnt work stupid ass')
    }
    else{
        console.log('worked successfully this time...')
    }
})