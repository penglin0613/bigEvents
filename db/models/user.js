module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('user', {
      username: {
        type: DataTypes.STRING,
        allowNull: false
      },
      nickname: {
        type: DataTypes.STRING
      },
      email: {
        type: DataTypes.STRING
      },
      userPic: {
        type: DataTypes.STRING
      },
      password: {
        type: DataTypes.STRING
      }
    });
  
    User.associate = function(models) {
      // associations can be defined here
    };
  
    return User;
  };