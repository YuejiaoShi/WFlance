import { Model, DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import originalUser from "./originalUser.js";

class DeveloperClient extends Model {}

DeveloperClient.init(
  {
    developerId: {
      type: DataTypes.INTEGER,
      field: "developer_id",
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    clientId: {
      type: DataTypes.INTEGER,
      field: "client_id",
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    createdAt: {
      type: DataTypes.DATE,
      field: "created_at",
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "DeveloperClient",
    tableName: "developer_client",
    timestamps: false,
    defaultScope: {
      attributes: { exclude: ["client_id"] },
      include: [
        {
          model: originalUser,
          as: "client",
          attributes: ["name"],
        },
      ],
    },
  }
);
DeveloperClient.belongsTo(originalUser, {
  foreignKey: "client_id",
  as: "client",
});
export default DeveloperClient;
