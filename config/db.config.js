const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb://127.0.0.1:27017/freeway'; //process.env.MONGODB_URI ||

mongoose.connect(MONGODB_URI)
.then(() => console.info(`Successfully connect to data base ${MONGODB_URI}`))
.catch((error) => console.error(`An error ocurred tryin to connect to database ${MONGODB_URI}`, error))