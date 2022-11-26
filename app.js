require('dotenv').config();
const Server = require('./common/models/server');

const server = new Server();

const NODE_ENV = process.env.NODE_ENV || 'development';

if (NODE_ENV !== 'test') {
    server.listen();
}

module.exports = server.app