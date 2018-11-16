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

let User = module.exports = mongoose.model('user', userSchema);
module.exports.getUserByEmail = (userEmail,callback) => {
    User.findOne({email: userEmail},callback);
};
module.exports.getUserById = (id, callback) => {
    User.findById(id, callback);
};
module.exports.comparePassword = (candidatePassword,hash,callback) => {
    bcrypt.compare(candidatePassword,hash, (err,isMatch) => {
        if(err) return callback(err);
        callback(null, isMatch);
    });
}
module.exports.createUser = (user,callback) => {
    bcrypt.hash(user.password,10,(err,hashed) => {
        if(err) throw err;
        user.password = hashed;
        user.save(callback);
    });
};