const express = require("express")
const router = express.Router()
// 验证插件
const { check } = require("express-validator")

// 导入控制器
const commentController = reqlib("/controllers/commentController.js")

// 错误信息提示中间件
const { errorMsg } = reqlib("/utils/message")


// 注册路由 - 评论搜索
router.get("/search",commentController.search)

// 注册路由 - 评论审核通过
router.post(
  "/pass",
  [
    check("id")
      .not()
      .isEmpty()
  ],
  errorMsg,
  commentController.pass
)

// 注册路由 - 评论审核不通过
router.post(
  "/reject",
  [
    check("id")
      .not()
      .isEmpty()
  ],
  errorMsg,
  commentController.reject
)

// 注册路由 - 删除评论
router.post(
  "/delete",
  [
    check("id")
      .not()
      .isEmpty()
  ],
  errorMsg,
  commentController._delete
)

module.exports = router
