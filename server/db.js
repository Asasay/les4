const { Sequelize, DataTypes, Model } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize("test", "root", "password", {
  host: process.env.DB_HOST,
  dialect: "mysql",
});

sequelize
  .authenticate()
  .then(() =>
    console.log("Sequelize connection has been established successfully.")
  )
  .catch((error) =>
    console.error("Sequelize was unable to connect to the database:", error)
  );

class User extends Model {}
class Session extends Model {}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    User: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    hashedPassword: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    salt: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { sequelize }
);

Session.init(
  {
    session_id: {
      type: DataTypes.STRING("128"),
      allowNull: false,
    },
    expires: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    data: {
      type: DataTypes.TEXT("medium"),
    },
  },
  { sequelize, tableName: "sessions", freezeTableName: true, timestamps: false }
);

Session.removeAttribute("id");

module.exports = { User, Session };
