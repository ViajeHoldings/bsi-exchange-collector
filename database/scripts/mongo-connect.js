const mongoose = require('mongoose');

function mongoConnect(mongoUrl) {
  const connectionOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  };

  mongoose.connect(mongoUrl, connectionOptions);

  const dbConnection = mongoose.connection;
  dbConnection.on('error', () => console.error('Database connection error.'));
  dbConnection.once('open', () =>
    console.log('Successfully connected to database...'),
  );
  dbConnection.on('close', () => console.log('Database connection is closed.'));

  return dbConnection;
}

module.exports = mongoConnect;
