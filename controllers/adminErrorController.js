const fs = require('fs');
const path = require('path');
const { logEvents } = require('../middleware/logEvents');

const getErrorLogs = (req, res) => {
  const logFilePath = path.join(__dirname, '..', 'logs', 'errLog.txt'); 
  fs.readFile(logFilePath, 'utf8', (err, data) => {
    if (err) {
        logEvents(`${err.name}: ${err.message}`, 'errLog.txt');
      console.error('Error reading error log file:', err);
      return res.status(500).json({ error: 'Could not read error logs' });
    }
    res.json({ errorLogs: data });
  });
};

module.exports = { getErrorLogs };
