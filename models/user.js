
const { Schema, model } = require('mongoose')

const UserSchema = Schema({
    firstName: {
        type: String,
        required: [true, 'The first name is required']
    },
    lastName: {
        type: String,
        required: [true, 'The last name is required'],
    },
    email: {
        type: String,
        required: [true, 'The Email is required'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'The password is required'],
    },
    img: {
        type: String,
    },
    role: {
        type: String,
        required: true,
        default: 'USER_ROLE',
        emun: ['ADMIN_ROLE', 'USER_ROLE']
    },
    status: {
        type: Boolean,
        default: true,
    },
    google: {
        type: Boolean,
        default: false,
    },
});


// para eliminar la contraseña y cualquier otro dato que no quiera que el usuario final vea
UserSchema.methods.toJSON = function() {
    const { __v, password, _id, ...user } = this.toObject();
    user.uid = _id;
    return user;
}

module.exports = model('User', UserSchema );