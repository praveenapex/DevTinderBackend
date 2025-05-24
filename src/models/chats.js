const { default: mongoose } = require("mongoose");

const Chat=mongoose.model("Chat",new mongoose.Schema({
    participents:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
        }
    ],
    messages:{
        type:[{
            senderId:{
                type:String,
                required:true
            },
            firstName:{
                type:String,
                required:true
            },
            text:{
                type:String,
                required:true
            }
        }],
        default:[]
    }
},{timestamps:true}))

module.exports=Chat