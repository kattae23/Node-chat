

let user = null;
let socket = null;

//ref html
const txtUid     = document.querySelector('#txtUid')
const txtMessage = document.querySelector('#txtMessage')
const ulUsers    = document.querySelector('#ulUsers')
const ulMessages = document.querySelector('#ulMessages')
const btnLogout  = document.querySelector('#btnLogout')

//validar el token del local storage
const validateJWT = async() => {

    const token = localStorage.getItem('token') || '';

    if ( token.length <= 10 ) {
        window.location =  'index.html';
        throw new Error('there no token in the server')
    }

    const resp = await fetch('http://localhost:3000/api/auth/renew', {
        headers: {'x-token': token}
    });

    const { user: userDB, token: tokenDB } = await resp.json();
    localStorage.setItem('token', tokenDB);
    user = userDB
    document.title = user.firstName

    await connectSocket();

}

const connectSocket = async () => {

    socket = io({
        'extraHeaders': {
            'x-token': localStorage.getItem('token')
        }
    });

    socket.on('connect', () => {
        console.log('Sockets online');
    })
    
    socket.on('disconnect', () => {
        console.log('Sockets offline');
    })

    socket.on('messages-receive', drawMessages )
    
    socket.on('online-users', drawUsers )

    
    socket.on('private-message', (payload) => {
        // TODO MESSAGES
        console.log('Private:', payload)
    })

}

const drawUsers = ( users = [] ) => {

    let usersHtml = '';

    users.forEach( ({firstName, lastName, uid}) => {

        usersHtml += `
        <li>
            <p>
                <h5 class="text-success">${ firstName + ' ' + lastName}</h5>
                <span class="fs-6 text-muted">${uid}</span>
            </p>
        </li>
        `

        
    })
    ulUsers.innerHTML = usersHtml;
}


const drawMessages = ( messages = [] ) => {

    let messagesHtml = '';

    messages.forEach( ({firstName, lastName, message}) => {

        messagesHtml += `
        <li>
            <p>
                <span class="text-primary">${ firstName + ' ' + lastName}: </span>
                <span class="fs-6 text-muted">${message}</span>
            </p>
        </li>
        `

        
    })
    ulMessages.innerHTML = messagesHtml;
}

txtMessage.addEventListener('keyup', ({keyCode}) => {
    
    const message = txtMessage.value;
    const uid     = txtUid.value;
    
    if ( keyCode !== 13 ){ return ;}
    if ( message.length === 0 ){ return; }

    socket.emit('send-message', {message, uid} );

    txtMessage.value = '';

})

const main = async() => {

    //validar jwt
    await validateJWT();


}


main();

