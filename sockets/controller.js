const { Socket } = require("socket.io");
const { comprobarJWT } = require("../helpers/create-jwt");
const ChatMessages = require("../models/chat-messages");

const chatMessages = new ChatMessages();


const socketController = async( socket = new Socket(), io ) => {

    const user = await comprobarJWT(socket.handshake.headers['x-token']);

    if( !user ){
        return socket.disconnect();
    }
    
    //agg al user connected
    chatMessages.connectUser( user );
    io.emit('online-users', chatMessages.usersArr )
    socket.emit('messages-receive', chatMessages.last10 );
    
    //conectarlo a una sala especial
    socket.join(user.id);
    
    
    //limpiar cuando alguien se desconecta
    socket.on('disconnect', () => {
        chatMessages.disconnectUser( user.id )
        io.emit('online-users', chatMessages.usersArr )
    });

    socket.on('send-message', ({uid, message}) => {
        if ( uid ) {
            //mensaje privado
            socket.to( uid ).emit('private-message',{ from: user.firstName, message })
        }else {
            chatMessages.sendMessage(user.uid, user.firstName, user.lastName, message);
            io.emit('messages-receive', chatMessages.last10 );
        }
    })

}



module.exports = {
    socketController,
}