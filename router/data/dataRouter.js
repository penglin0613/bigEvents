const express = require("express")
const router = express.Router()

// 错误信息提示中间件
const { errorMsg } = reqlib("/utils/message")
// 导入控制器
const dataController = reqlib("/controllers/dataController.js")


// 注册路由
// 路由 - 统计数据
router.get('/info',dataController.info)
// 路由 - 日新增文章数量统计
router.get('/article',dataController.article)
// 路由 - 各类型文章数量统计
router.get('/category',dataController.category)
// 路由 - 日文章访问量
router.get('/visit',dataController.visit)

// 暴露出去
module.exports = router