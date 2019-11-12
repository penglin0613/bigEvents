const express = require("express");

const router = express.Router();
// 引入jwt token工具
const JwtUtil = require("../utils/jwt");
// 分类路由
const categoryRouter = require("./category/categoryRouter");
// 文章路由
const articleRouter = require("./article/articleRouter");
// 评论路由
const commentRouter = require("./comment/commentRouter");
// 用户路由
const userRouter = require("./user/userRouter");
// 用户路由
const dataRouter = require("./data/dataRouter");

router.use((req, res, next) => {
  // console.log(req.url)
  // 如果是登录页就放过去
  if (req.url === "/user/login") {
    next();
  } else {
    // 验证token
    let authorization = req.headers.authorization;
    let jwt = new JwtUtil(authorization);
    let result = jwt.verifyToken();
    if (result == "err") {
      return res.status(403).send({ status: 403, msg: "未登录，请先登录" });
    }
    next();
  }
});

// 中间件 - 分类路由
router.use("/category", categoryRouter);
// 中间件 - 文章路由
router.use("/article", articleRouter);
// 中间件 - 评论路由
router.use("/comment", commentRouter);

// 中间件 - 用户
router.use("/user", userRouter);

// 中间件 - 统计数据
router.use("/data", dataRouter);

module.exports = router;
