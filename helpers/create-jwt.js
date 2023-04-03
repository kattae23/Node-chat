const jwt = require('jsonwebtoken');
const { User } = require('../models')

const public_key = process.env.SECRETORPRIVATEKEY;


const createJWT = async (uid = '') => {

    return new Promise((resolve, reject) => {

        const payload = { uid }

        jwt.sign(payload, public_key, {
            expiresIn: '30h'
        }, (err, token) => {
            
            if (err) {
                console.log(error);
                reject('Token could not be generated');
            } else {
                resolve( token );
            }
        })
    })
}

const comprobarJWT = async ( token = '') => {

    try {

        if (token.length < 10){
            return null
        }

        const { uid } = jwt.verify( token, public_key )

        console.log(uid)

        const user = await User.findById( uid );

        if ( user ) {
            if ( user.status ){
                return user
            }
            else{
                return null;
            }
        }else {
            return null
        }


    } catch (error) {
        console.log(error)
        return null;
    }


}


module.exports = {
    createJWT,
    comprobarJWT
}