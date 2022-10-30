const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AlumniSchema = new Schema({
    name: String,
    email:String,
    image: String,
    year: Number,
    rollno:Number,
    password:String,
    Bs:String,
    category:String,
    Organization:String,
    careerflow:[
        {
            type:Schema.Types.ObjectId,
            ref:'careerflow'
        }
    ],
    linkedInUrl:String
});

module.exports = mongoose.model('alumni', AlumniSchema);