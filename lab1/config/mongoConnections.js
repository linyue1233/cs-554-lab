const mongoClient = require('mongodb').MongoClient;
const settings = require('./setting.json');
const mongoConfig = settings.mongoConfig;

let _connection = undefined;
let _db = undefined;

module.exports = async () => {
    if (!_connection) {
        _connection = await mongoClient.connect(mongoConfig.serverUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        _db = await _connection.db(mongoConfig.database);
    }
    return _db;
};