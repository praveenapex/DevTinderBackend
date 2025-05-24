const { userAuth } = require('../middlewares/auth');
const Chat = require('../models/chats');

const router= require('express').Router();

router.get('/chat',userAuth,async(req,res)=>{
    try {
        const targetUserId=req.query.targetUserId;
        const loggedInUser = req.user;
        const chats=await Chat.find({
            participents:{$all:[targetUserId,loggedInUser?._id]}
        }).populate('participents','_id firstName')
        return res.status(200).json({
            status:true,
            chats:chats
        })
    } catch (error) {
        console.log("ERROR: "+error.message);
        return res.status(500).json({
            status:false,
            message:error.message
        })
    }
})

module.exports=router;