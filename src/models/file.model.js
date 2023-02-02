const db = require("../models");
const User = db.user;

module.exports = (sequelize, Sequelize, DataTypes) => {
  const File = sequelize.define(
    "File", // Model name
    {
      // Attributes
      id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      filePublicUrl: {
        type: DataTypes.STRING,
      },
      userEmailId: {
        type: DataTypes.STRING,
      },
      fileName: {
        type: DataTypes.STRING,
      },
      fileSize: {
        type: DataTypes.BIGINT,
      },
      fileType: {
        type: DataTypes.STRING,
      },
    },
    {
      // Options
      timestamps: true,
      underscrored: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return File;
};
