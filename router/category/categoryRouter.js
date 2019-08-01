const express = require("express")
const router = express.Router()
// 验证插件
const { check } = require("express-validator")

// 导入控制器
const categoryController = reqlib("/controllers/categoryController.js")

// 错误信息提示中间件
const {errorMsg} = reqlib('/utils/message')

// 新增文章分类
router.post(
  "/add",
  [
    check("slug")
      .not()
      .isEmpty(),
    check("slug")
      .not()
      .isEmpty()
  ],
  errorMsg,
  categoryController.add
)

// 获取文章分类列表
router.get('/list',categoryController.list)
// 根据id搜索文章分类
router.get('/search',[
  check('id').not()
  .isEmpty()
],errorMsg,categoryController.search)

// 编辑文章类别
router.post('/edit',[
  check('id').not().isEmpty(),
  check('name').not().isEmpty(),
  check('slug').not().isEmpty(),
],errorMsg,categoryController.edit)


// 删除文章类别
router.post('/delete',[
  check('id').not().isEmpty()
],errorMsg,categoryController._delete)


module.exports = router
