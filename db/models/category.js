"use strict"

module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define("category", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  })

  Category.associate = function(model) {
    // associations can be defined here
    // // console.log(model)
    // this.hasMany(model, { foreignKey: "id", sourceKey: "pid" })
  }

  return Category
}
