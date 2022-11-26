const mongoose = require('mongoose');

const {MONGODB_CNN, MONGODB_CNN_TEST, NODE_ENV} = process.env;

const dbConnection = async () => {
    const DB_URI = (NODE_ENV === 'test') ? MONGODB_CNN_TEST : MONGODB_CNN;
    try {
        await mongoose.connect(DB_URI,{
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log('Connected to Mongo');
    }catch(error) {
        console.log(error);
        throw new Error('Error en la base de datos');
    }
}
module.exports = {
    dbConnection
}