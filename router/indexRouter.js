const express = require('express')
const router = express.Router()
// 验证插件
const { check } = require("express-validator")
// 控制器
const indexController = reqlib('/controllers/indexController.js')

// 错误信息提示中间件
const {errorMsg} = reqlib('/utils/message')

  

// 路由 - 评论新增
router.post('/post_comment',[
    check('author').not().isEmpty().isLength({max:6}),
    check('content').not().isEmpty(),
    check('articleId').not().isEmpty()
],errorMsg,indexController.post_comment)

// 路由 - 评论列表
router.get('/get_comment',[
    check('articleId').not().isEmpty()
],errorMsg,indexController.get_comment)

// 路由 - 文章搜索
router.get('/search',indexController.search)
// 路由 - 文章类型
router.get('/category',indexController.category)
// 路由 - 热点图
router.get('/hotpic',indexController.hotpic)
// 路由 - 文章热门排行
router.get('/rank',indexController.rank)
// 路由 - 最新资讯
router.get('/latest',indexController.latest)
// 路由 - 最新评论
router.get('/latest_comment',indexController.latest_comment)
// 路由 - 焦点关注
router.get('/attention',indexController.attention)
// 路由 - 文章详情
router.get('/article',indexController.article)


module.exports = router
