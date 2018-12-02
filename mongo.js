let mongoose = require('mongoose');

let env = process.env.NODE_ENV || 'development';

let config = require('./config/mongo.json')[env];

module.exports = () => {
    let envUrl = process.env[config.use_env_variable];

    let localUrl = `mongo://${config.host}/${config.database}`;

    let mongoUrl = envUrl ? envUrl : localUrl;

    return mongoose.connect(mongoUrl, { useNewUrlParser: true }, err => {
        if (err) console.warn(err);
        console.log(`Connected to ${mongoUrl.database}`);
    });
};