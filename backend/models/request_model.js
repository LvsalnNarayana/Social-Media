//________  require mongoose  ________// 
import mongoose from 'mongoose'

//________  schema  ________// 
const schema = mongoose.Schema;

//________  user schema  ________// 
const request_schema = new schema({
    sender_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    receiver_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
}, {
    timestamps: true
});
//create mongoose model
const User = mongoose.model('Request', request_schema);
export default User;
