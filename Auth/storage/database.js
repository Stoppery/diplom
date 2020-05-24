const Client = require('pg-native');

module.exports.database = {
    dbConnect: function (PGHOST, PGUSER, PGDATABASE, PGPASSWORD, PGPORT) {
        let client = new Client();
        client.connectSync(`postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}:${PGPORT}/${PGDATABASE}`);
        return client;
    }
};