class Message {

    constructor(uid, firstName, lastName, message ) {
        this.uid = uid;
        this.firstName = firstName;
        this.lastName = lastName;
        this.message = message;
    }

}


class ChatMessages {

    constructor() {
        this.messages = [];
        this.users = {};
    }

    get last10 () {
        this.messages = this.messages.splice(0,10);
        return this.messages;
    }

    get usersArr() {
        return Object.values( this.users );
    }

    sendMessage( uid, firstName, lastName, message) {
        this.messages.unshift(
            new Message(uid, firstName, lastName, message)
        )
    };

    connectUser( user ){
        this.users[user.id] = user;
    }

    disconnectUser( id ) {
        delete this.users[id];
    }
}

module.exports = ChatMessages;