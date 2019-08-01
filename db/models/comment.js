module.exports = (sequelize, DataTypes) => {
    const Comment = sequelize.define('comment', {
      author: {
        type: DataTypes.STRING,
        allowNull: false
      },
      content: {
        type: DataTypes.STRING,
        allowNull: false
      },
      date: {
        type: DataTypes.STRING,
        allowNull: false
      },
      time: {
        type: DataTypes.STRING,
        allowNull: false
      },
      state: {
        type: DataTypes.STRING,
        allowNull: false
      }
    });
  
    Comment.associate = function(models) {
      // associations can be defined here
    };
  
    return Comment;
  };