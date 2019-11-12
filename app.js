const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const morgan = require("morgan")
// 设置到全局对象上 
global.reqlib = require('app-root-path').require;

// 导入配置文件
const config = require('./config/index')
 
// 路由
const adminRouter = require("./router/adminRouter")
const indexRouter = require("./router/indexRouter")
// 数据库
const db = require("./db")

const app = express()

// 托管静态资源
app.use(express.static('static'))


// 中间件 - 跨域
app.use(cors())

// 中间件 - post数据解析
app.use(bodyParser.urlencoded({ extended: false }))

// 中间件 - 日志 最小模式输出
app.use(morgan("tiny"))

// 中间件 - 路由 - admin 
app.use("/api/v1/admin", adminRouter)
// 中间件 - 路由 - index
app.use("/api/v1/index", indexRouter)

// 中间件 - 托管静态资源
app.use(express.static('uploads'))
 
db.sequelize.sync({ force: false }).then(() => {
  app.listen(config.port, () => {
    console.log(`开启成功: ${config.baseUrl}:${config.port}`)
  })
})
