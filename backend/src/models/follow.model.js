import mongoose, { Schema } from "mongoose";

const followSchema = new Schema({
    follower: {
        type: Schema.Types.ObjectId, // the one who is following
        ref: "User",
    },
    following: {
        type: Schema.Types.ObjectId, //
        ref: "User"
    }
},{
    timestamps: true
})

export const Follow = new mongoose.model("Follow", followSchema)