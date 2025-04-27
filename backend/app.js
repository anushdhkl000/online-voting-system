const express = require('express')
require('dotenv').config()
require('./database/dbConfig')
const bodyParser = require('body-parser')
const cors = require('cors');
const { envConfig } = require('./config/envConfig');
const indexRouter = require('./routes/v1/index.route');
const errorHandler = require('./utils/errorHandler');


const app = express()
const corsOptions = {
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    optionsSuccessStatus: 200,
    credentials: true
};
// middleware
app.use(bodyParser.json())
app.use(cors(corsOptions))
app.use('/public/uploads', express.static('public/uploads'))

const config = envConfig();

const port = config.PORT || 5002

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})

// routes
app.use('/api/v1/', indexRouter)
app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type");
    res.setHeader("Access-Control-Allow-Credentials", true);
    next();
});

app.use(errorHandler)
