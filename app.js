const express = require('express');
const app = express();
require('dotenv').config();
require('./DB/sql_conn');
require('./models/contact_model');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// api routes
app.use('/api/customer', require('./routes/customer_routes'));


app.listen(process.env.PORT, () => console.log(`Listening on port ${process.env.PORT}`));