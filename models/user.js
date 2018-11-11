let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let bcrypt = require('bcrypt');
let userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        bcrypt: true
    }
});

module.exports = mongoose.model('user', userSchema);
module.exports.createUser = (user,callback) => {
    bcrypt.hash(user.password,10,(err,hashed) => {
        if(err) throw err;
        user.password = hashed;
        user.save(callback);
    });
}