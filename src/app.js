const express = require('express');
const cors = require('cors');
require('./db/mongoose');
const { PORT } = require('../config');

const routes = require('./routes');

const app = express();
const port = PORT;

app.use(express.json());
app.use(cors({ origin: "http://localhost:3000" }))
app.use(routes);
app.use(express.static('public'));

app.listen(port, () => {
  console.log('Server is up on port ' + port);
});
