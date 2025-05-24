const { Server } = require('socket.io');
const Chat = require('../models/chats');

const initializeSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: 'http://localhost:5173'
        },
    });
    io.on('connection', (socket) => {

        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });

        socket.on('joinChat', (data) => {
            const roomId = [data.targetUserId, data.userId].sort().join('-');
           console.log('User joined chat:', data);
           socket.join(roomId);
        });
        socket.on('sendMessage', async (data) => {
            console.log('Message sent:', data);
            let chat;
            const chats=await Chat.find({
                participents: {
                    $all: [data.userId, data.targetUserId]
                }
            })
            if(chats.length===0){
                 chat=new Chat({
                    participents:[data.userId,data.targetUserId],
                    messages:[]
                })
            }else{
                chat=chats[0];
            }
            chat.messages.push({
                senderId:data.userId,
                firstName:data.firstName,
                text:data.text
            })
            await chat.save();
            const roomId = [data.targetUserId, data.userId].sort().join('-');
            io.to(roomId).emit('messageReceived', data);
        });

    });
 }

module.exports = { initializeSocket };