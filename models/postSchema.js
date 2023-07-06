const mongoose = require('mongoose')
const { Schema } = mongoose
const postSchema = new mongoose.Schema(
    {
        caption:{
            type:String,
            required:true
        },
        imageUrl:{
            type:String,
            default:"none"
        },
        postedBy:{
            type:Schema.Types.ObjectId,
            ref:"User"
        }

    }
)
const postingschema = mongoose.model("Post",postSchema)
module.exports = postingschema;