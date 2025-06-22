const Sequelize = require("sequelize");
require('dotenv').config()
let sequelize;
try {
    sequelize = new Sequelize(
        process.env.SQL_DATABASE_NAME,
        process.env.SQL_DATABASE_USERNAME,
        process.env.SQL_DATABASE_PASSWORD,
        {
            dialect: "mysql",
            host: process.env.SQL_DATABASE_HOST,
            define: {
                timestamps: false,
            },
        }
    );
    console.log('sql db connected succesfully')
} catch(error) {
    console.log('sql db connection error', error)
}


module.exports = sequelize