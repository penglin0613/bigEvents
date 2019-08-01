const express = require('express')
const router = express.Router()
// 分类路由
const categoryRouter = require('./category/categoryRouter')
// 文章路由
const articleRouter = require('./article/articleRouter')
// 评论路由
const commentRouter = require('./comment/commentRouter')
// 用户路由
const userRouter = require('./user/userRouter')
// 用户路由
const dataRouter = require('./data/dataRouter')

// 中间件 - 分类路由
router.use('/category',categoryRouter)
// 中间件 - 文章路由
router.use('/article',articleRouter)
// 中间件 - 评论路由
router.use('/comment',commentRouter)

// 中间件 - 用户
router.use('/user',userRouter)

// 中间件 - 统计数据
router.use('/data',dataRouter)


module.exports = router
 