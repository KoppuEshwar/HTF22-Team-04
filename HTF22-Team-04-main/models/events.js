const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EventSchema = new Schema({
    title: String,
    posterUrl: String,
    date: String,
    location:String,
    mode:{
        type:String,
        enum:['offline','online']
    }
});

module.exports = mongoose.model('events', EventSchema);