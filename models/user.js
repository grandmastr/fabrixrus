let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let bcrypt = require('bcrypt');
let userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: Number,
        required:true
    },
    isAdmin: {
        type: String,
        default: 'admin'
    },
    date:{
        type: Date,
        default: Date.now
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
module.exports.comparePassword = (userPassword,hash,callback) => {
    bcrypt.compare(userPassword,hash, (err,isMatch) => {
        if(err) return callback(err);
        callback(null, isMatch);
    });
};
module.exports.createUser = (user,callback) => {
    bcrypt.hash(user.password,10,(err,hashed) => {
        if(err) throw err;
        user.password = hashed;
        user.save(callback);
    });
};
module.exports.updateUserDetails = (user, newDetails, callback) => {
    bcrypt.hash(user.password, 10, (err, hashed) => {
        if (err) throw err;
        user.password = hashed;
        User.updateOne({ _id: user.id }, newDetails, callback);
    });
};