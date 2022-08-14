//________  require mongoose  ________//
import mongoose from "mongoose";
// import User from "./user_model.js";

//________  schema  ________//
const schema = mongoose.Schema;

//________  user schema  ________//
const message_schema = new schema(
    {
        users: [
            {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: "User",
            },
        ],
        messages: [
            {
                sender_id: {
                    type: mongoose.Types.ObjectId,
                    ref: "User",
                },
                receiver_id: {
                    type: mongoose.Types.ObjectId,
                    ref: "User",
                },
                created_at: {
                    type: Date,
                    default: new Date(),
                },
                delivered: {
                    type: Boolean,
                    default: false,
                },
                read: {
                    type: Boolean,
                    default: false,
                },
                message: {
                    type: String,
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);

message_schema.statics.SEND_MESSAGE = (sender_id, receiver_id, message) => {
    const sent_message = Message.findOneAndUpdate(
        {
            users: {
                $all: [
                    { $elemMatch: { $eq: mongoose.Types.ObjectId(sender_id) } },
                    { $elemMatch: { $eq: mongoose.Types.ObjectId(receiver_id) } }
                ]
            }
        },
        {
            users: [sender_id, receiver_id],
            $push: {
                messages: {
                    sender_id: sender_id,
                    receiver_id: receiver_id,
                    message: message,
                },
            },
        }, { upsert: true, new: true })
    return sent_message;
};

message_schema.statics.GET_MESSAGES = (receiver_id) => {
    const new_messages = Message.aggregate([
        {
            $match: {
                users: {
                    $all: [
                        { $elemMatch: { $eq: mongoose.Types.ObjectId(receiver_id) } }
                    ],
                },
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "users",
                foreignField: "_id",
                pipeline: [
                    {
                        $addFields: {
                            id: {
                                $toString: "$_id",
                            },
                        },
                    },
                    {
                        $project: {
                            _id: 0,
                            __v: 0,
                            posts: 0,
                            friends: 0,
                            password: 0,
                            createdAt: 0,
                            updatedAt: 0,
                            dob: 0
                        }
                    }
                ],
                as: "user",
            },
        },
        {
            $project: {
                messages: 1,
                user: {
                    $filter: {
                        input: "$user",
                        as: "usere",
                        cond: {
                            $ne: [
                                "$$usere.id",
                                receiver_id,
                            ]
                        },
                    }
                }
            },
        },
        {
            $unwind: '$user'
        }
    ]);
    return new_messages;
};

message_schema.statics.GET_USER_MESSAGES = (sender_id, receiver_id) => {
    const user_messages = Message.findOne({
        users: {
            $all: [
                { $elemMatch: { $eq: mongoose.Types.ObjectId(sender_id) } },
                { $elemMatch: { $eq: mongoose.Types.ObjectId(receiver_id) } }
            ]
        }
    });
    return user_messages
};

message_schema.statics.SET_DELIVERED = (sender_id, receiver_id) => {
    const new_data = Message.findOneAndUpdate(
        {
            users: {
                $all: [
                    { $elemMatch: { $eq: mongoose.Types.ObjectId(sender_id) } },
                    { $elemMatch: { $eq: mongoose.Types.ObjectId(receiver_id) } }
                ]
            }
        },
        { $set: { "messages.$[data].delivered": true } },
        { arrayFilters: [{ "data.delivered": false, "data.receiver_id": receiver_id }], new: true },
    );
    return new_data
}

message_schema.statics.SET_READ = (sender_id, receiver_id) => {
    const new_data = Message.findOneAndUpdate(
        {
            users: {
                $all: [
                    { $elemMatch: { $eq: mongoose.Types.ObjectId(sender_id) } },
                    { $elemMatch: { $eq: mongoose.Types.ObjectId(receiver_id) } }
                ]
            }
        },
        { $set: { "messages.$[data].read": true } },
        { arrayFilters: [{ "data.delivered": true, "data.receiver_id": receiver_id }], new: true },
    );
    return new_data
}
//create mongoose model
const Message = mongoose.model("Message", message_schema);
export default Message;
