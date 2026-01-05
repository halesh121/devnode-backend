const mongoose = require('mongoose')


const db= async()=>{

await mongoose.connect('mongodb+srv://NamastedevDB:halesh123@namastedev.56vnvgu.mongodb.net/devtinder')
}

module.exports={db}