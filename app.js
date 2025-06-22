const express = require('express');
const app = express();
require('dotenv').config();
require('./DB/sql_conn');
require('./models/contact_model');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// # Database
// SQL_DATABASE_NAME=bitespeed_database
// SQL_DATABASE_USERNAME=root
// SQL_DATABASE_PASSWORD=MySQL@123
// SQL_DATABASE_HOST=127.0.0.1


app.listen(process.env.PORT, () => console.log(`Listening on port ${process.env.PORT}`));