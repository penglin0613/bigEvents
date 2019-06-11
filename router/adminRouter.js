// 导入express
const express = require('express')
// 导入路由
const router = express.Router()
// 导入控制器
const adminController = require('../controllers/adminController')
// 导入bodyParser中间件
const bodyParser = require('body-parser')
// 导入multer中间件
const multer = require('multer')
const upload = multer({ dest: 'uploads/articles/' })
const uploadUser = multer({ dest: 'uploads/' })

// 注册body-parser中间件
// parse application/x-www-form-urlencoded
router.use(bodyParser.urlencoded({ extended: false }))

// 登录
router.post('/login', adminController.login)
// 登出
router.post('/logout', adminController.logout)
// 获取用户信息
router.get('/getuser', adminController.getuser)
// 获取用户信息
router.get('/article_count', adminController.article_count)
// 获取评论数量统计
router.get('/comment_count', adminController.comment_count)
// 月新增文章数
router.get('/month_article_count', adminController.month_article_count)
// 文章类型数量统计
router.get('/article_category_count', adminController.article_category_count)
// 月文章访问量
router.get('/article_category_visit', adminController.article_category_visit)
// 文章搜索
router.get('/search', adminController.search)
// 文章发布
router.post(
  '/article_publish',
  upload.single('cover'),
  adminController.article_publish
)
// 文章修改
router.post(
  '/article_edit',
  upload.single('cover'),
  adminController.article_edit
)
// 文章删除
router.get('/article_delete', adminController.article_delete)
// 分类获取
router.get('/category_search', adminController.category_search)
// 分类新增
router.post('/category_add', adminController.category_add)
// 分类编辑
router.post('/category_edit', adminController.category_edit)
// 分类删除
router.post('/category_delete', adminController.category_delete)
// 文章评论搜索
router.get('/comment_search', adminController.comment_search)
// 评论审核通过
router.post(
  '/comment_pass',
  adminController.comment_Check,
  adminController.comment_pass
)
// 评论审核不通过
router.post(
  '/comment_reject',
  adminController.comment_Check,
  adminController.comment_reject
)
// 删除评论
router.post(
  '/comment_delete',
  adminController.comment_Check,
  adminController.comment_delete
)
// 获取用户信息userinfo_get
router.get('/userinfo_get', adminController.userinfo_get)
// 编辑用户信息 
router.post('/userinfo_edit', uploadUser.single('user_pic'), adminController.userinfo_edit)

// 暴露
module.exports = router
