const express = require('express');
const app = express();
const controller = require('./controller');

app.get('/', (req, res) => res.send("Welcome To Export excel api"));
app.get('/excelDownload', controller.exportExcel);

app.listen(4000, () => console.log('server is running!'));
