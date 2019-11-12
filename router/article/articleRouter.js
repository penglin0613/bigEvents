const express = require("express")
const router = express.Router()
// 验证插件
const { check } = require("express-validator")

// 导入控制器
const articleController = reqlib("/controllers/articleController.js")
// 导入文件上传组件
const upload = reqlib("/utils/uploads.js").upload.single("cover")

// 错误信息提示中间件
const { errorMsg } = reqlib("/utils/message")

// 文件上传类型验证
const typeCheck = (req, res, next) => {
  upload(req, res, err => {
    if (err) {
      res.status(400).send({
        code: 400,
        msg: "文件类型不对哦，请检查"
      })
    } else {
      next()
    }
  })
}

// 文件是否上传判断
const fileCheck = (req, res, next) => {
  if (!req.file) {
    // 没有文件
    return res.status(400).send({
      code: 400,
      msg: "文章封面没有上传，请检查"
    })
  }
  next()
}

// 注册路由 - 发布文章
router.post(
  "/publish",
  typeCheck,
  [
    check("title")
      .not()
      .isEmpty(),
    check("categoryId")
      .not()
      .isEmpty(),
    check("date")
      .not()
      .isEmpty(),
    check("content")
      .not()
      .isEmpty()
  ],
  errorMsg,
  fileCheck,
  articleController.publish
)

// 注册路由 - 根据id获取文章
router.get(
  "/search",
  [
    check("id")
      .not()
      .isEmpty()
  ],
  errorMsg,
  articleController.search
)

// 注册路由 - 编辑文章
router.post("/edit", typeCheck,[
  check("id")
  .not()
  .isEmpty(),
  check("title")
    .not()
    .isEmpty(),
  check("categoryId")
    .not()
    .isEmpty(),
  check("date")
    .not()
    .isEmpty(),
  check("content")
    .not()
    .isEmpty()
],errorMsg,articleController.edit)


// 注册路由 - 删除文章
router.use('/delete',[
  check('id').not().isEmpty()
],errorMsg,articleController._delete)

// 注册路由 - 文章搜索
router.get('/query',articleController.query)


module.exports = router
