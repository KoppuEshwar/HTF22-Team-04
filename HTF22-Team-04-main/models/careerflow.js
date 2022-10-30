const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const careerFlowSchema = new Schema({
    from: String,
    to: String,
    organization: String,
    role:String,
    alumni:{
        type:Schema.Types.ObjectId,
        ref:'alumni'
    }
});

module.exports = mongoose.model('careerflow', careerFlowSchema);