const express = require("express")
const router = express.Router()
// 验证插件
const { check } = require("express-validator")

// 导入控制器
const userController = reqlib("/controllers/userController.js")

// 错误信息提示中间件
const { errorMsg } = reqlib("/utils/message")
// 导入文件上传组件
const upload = reqlib("/utils/uploads.js").upload.single("userPic")
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

// 用户登录
router.post(
  "/login",
  [
    check("username")
      .not()
      .isEmpty(),
    check("password")
      .not()
      .isEmpty()
  ],
  errorMsg,
  userController.login
)

// 用户登出
router.post("/logout", userController.logout)
// 获取用户信息
router.get("/info", userController.info)
// 获取用户详情
router.get("/detail", userController.detail)
// 编辑用户详情
router.post(
  "/edit",
  typeCheck,
  [
    check("username")
      .not()
      .isEmpty(),
    check("nickname")
      .not()
      .isEmpty(),
    check("email")
      .not()
      .isEmpty()
      .isEmail(),
    check("password")
      .not()
      .isEmpty()
  ],
  errorMsg,

  userController.edit
)

module.exports = router
