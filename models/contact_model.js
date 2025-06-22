const { DataTypes } = require("sequelize");
const sequelize = require("../DB/sql_conn");

const ContactModel = sequelize.define(
    "contact",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        phoneNumber: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        linkedId: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        linkPrecedence: {
            type: DataTypes.ENUM("primary", "secondary"),
            allowNull: false,
            defaultValue: "primary",
        },
        deletedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },

    {
        timestamps: true, // This will add automatically created_at and updated_at
        freezeTableName: true,
        tableName: "contact",
    }
);

// sequelize.sync({ force: false }) // Uncomment this if you want to sync the model with the database
//   .then(() => {
//     console.log('Database & tables created!');
// });

module.exports = ContactModel;
