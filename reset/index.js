// 数据库
const db = require("../db")
// 导入mock
const articleData = require("./resetData/article.json")
const categoryData = require("./resetData/category.json")
const userData = require("./resetData/user.json")
// 导入fs
const fs = require('fs')
// 导入path
const path = require('path')

// 生成随机数据
const Mock = require("mockjs")
const Random = Mock.Random

// 随机数据的方法
function randomData(num) {
  return Mock.mock({
    [`Comment|${num}`]: [
      {
        "id|+1": 1,
        // 随机的作者名
        author: "@cname",
        // 内容
        content: "@csentence(8,32)",
        date: "@now('year','yyyy')-@natural(1,7)-@datetime('dd')",
        time:'@time',
        articleId:"@natural(1,220)",
        "state|1":["已通过","待审核","已拒绝"]
      }
    ]
  })
}


// 生成随机的访问量
articleData.forEach(v=>{
  v.read =  parseInt(Math.random()*1000)
})
db.sequelize.sync({ force: true }).then(async () => {
  try {
    await db.Category.bulkCreate(categoryData)
    await db.Article.bulkCreate(articleData)
    await db.Comment.bulkCreate(randomData(8000).Comment)
    // // console.log( randomData(10000).Comment.length)
    await db.User.create(userData)
    // 不存在文件夹就新建
    if(!fs.existsSync('./uploads')){
      fs.mkdirSync('./uploads')
    }
    fs.copyFileSync(path.join(__dirname,'./static/icon.jpg'),path.join(__dirname,'../uploads/icon.jpg'))
    // 移动图片
    setTimeout(() => {
      // console.log('搞定')
    }, 0);
  } catch (error) {
    // console.log(error)
  }
  // // console.log(res);
})
