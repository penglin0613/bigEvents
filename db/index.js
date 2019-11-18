
const Sequelize = require('sequelize');
const CategoryModel = require('./models/category.js');
const CommentModel = require('./models/comment.js');
const ArticleModel = require('./models/article.js');
const UserModel = require('./models/user.js');
const {database,username,password,host}= require('../config')

const sequelize = new Sequelize(database, username, password, {
  host,
  dialect: 'mysql',
  define: {
    // `timestamps` 字段指定是否将创建 `createdAt` 和 `updatedAt` 字段.
    // 该值默认为 true, 但是当前设定为 false
    timestamps: false,
    // 设置数据库定义的类型
    engine: 'MYISAM'
  },
  // 打印sql语句
  logging:false
});

const Category = CategoryModel(sequelize, Sequelize);
const Comment = CommentModel(sequelize, Sequelize);
const Article = ArticleModel(sequelize, Sequelize);
const User = UserModel(sequelize, Sequelize);

// 定义关联 分类 ->文章 一对多
// // console.log(Category.hasMany)
Category.hasMany(Article)
Article.belongsTo(Category)

// 定义关联 文章 ->分类 一对多
Article.hasMany(Comment)
Comment.belongsTo(Article)
module.exports = {
  sequelize,
  Sequelize,
  Category,
  Comment,
  Article,
  User
}