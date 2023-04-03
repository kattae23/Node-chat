const myForm = document.querySelector('form');


myForm.addEventListener('submit', ev => {
    ev.preventDefault();
    const formData = {};

    for( let el of myForm.elements ){

        if( el.name.length > 0 )
        formData[el.name] = el.value

    }

    fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        body: JSON.stringify( formData ),
        headers: {
            'Content-Type': 'application/json'
        },
    })
    .then( resp => resp.json() )
    .then( ({msg, token}) => {
        if(msg){
            return console.error( msg )
        }

        localStorage.setItem('token', token);
        window.location =  'chat.html';
        console.log(data)

    })
    .catch( err => {
        console.log(err)
    })

})

function handleCredentialResponse(response) {
    // decodeJwtResponse() is a custom function defined by you
    // to decode the credential response.
 //    console.log(response.credential)
 const body = { id_token: response.credential };

 fetch('http://localhost:3000/api/auth/google',{
     method: 'POST',
     headers: {
         'Content-Type': 'application/json'
     },
     body: JSON.stringify(body)
 })
     .then( resp => resp.json() )
     .then( resp => {
         console.log(resp)
         localStorage.setItem('email', resp.user.email)
         localStorage.setItem('token', resp.token)
         location.reload();
         window.location =  'chat.html';
     })
     .catch( console.warn );
 }

 const button = document.getElementById('google_signout');
 button.onclick = () => {

     console.log( google.accounts.id )
     google.accounts.id.disableAutoSelect()

     google.accounts.id.revoke( localStorage.getItem('email' ), done => {
         localStorage.clear();
         location.reload();
     })

 }
