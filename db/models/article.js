module.exports = (sequelize, DataTypes) => {
  const Article = sequelize.define('article', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    cover: {
      type: DataTypes.STRING,
      allowNull: false
    },
    date: {
      type: DataTypes.STRING,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    isDelete: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false
    },
    read: {
      type: DataTypes.INTEGER
    }
  });
 
  Article.associate = function(model) {
    // associations can be defined here
  };

  return Article;
};