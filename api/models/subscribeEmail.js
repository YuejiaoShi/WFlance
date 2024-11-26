import { Model, DataTypes } from "sequelize";
import sequelize from "../config/db.js";

class SubscribeEmail extends Model {}

SubscribeEmail.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      // validate: {
      //   isEmail: true,
      // },
    },
    isSubscribed: {
      type: DataTypes.BOOLEAN,
      field: "is_subscribed",
      defaultValue: true,
    },
    subscribedAt: {
      type: DataTypes.DATE,
      field: "subscribed_at",
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "subscribed_emails",
    timestamps: false,
  }
);

export default SubscribeEmail;
