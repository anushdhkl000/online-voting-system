const mongoose = require('mongoose');
const { envConfig } = require('../config/envConfig');

const dbConfig = envConfig();

mongoose.connect(dbConfig.MONGO_CONNECTION_STRING).then(() =>
    console.log('Connected to database')).catch((err) => {
        console.log(err)
    })

