const { User } = require("../db")
// 导入配置
const config = require('../config/index')
// 引入jwt token工具
const JwtUtil = require('../utils/jwt');

// 导入fs
const fs = require("fs")
const path = require("path")

const serverError = res => {
  res.status(500).send({
    code: 500,
    msg: "服务器内部错误"
  })
}

module.exports = {
  // 用户登录
  async login(req, res) {
    const { username, password } = req.body
    try {
      let userRes = await User.findOne({
        where: {
          username,
          password
        }
      })
      if (!userRes) {
        return res.send({
          code: 400,
          msg: "用户名或密码错误"
        })
      }
       // 登陆成功，添加token验证
       let jwt = new JwtUtil(username);
       let token = jwt.generateToken();

      res.send({
        code: 200,
        msg: "登录成功",
        token
      })
    } catch (error) {
      // console.log(error)
      serverError(res)
    }
  },
  // 用户退出
  logout(req, res) {
    res.send({
      code: 200,
      msg: "退出成功"
    })
  },
  // 获取用户信息
  async info(req, res) {
    try {
      let userRes = await User.findOne({
        where: {
          id: 1
        },
        attributes: ["nickname", "userPic"]
      })
      userRes = JSON.parse(JSON.stringify(userRes))
      userRes.userPic = `${config.baseUrl}:${config.port}/${userRes.userPic}`
      res.send({
        code: 200,
        msg: "获取成功",
        data: userRes
      })
    } catch (error) {
      serverError(res)
    }
  },
  // 获取用户详情
  async detail(req, res) {
    try {
      let userRes = await User.findOne({
        where: {
          id: 1
        },
        attributes: ["nickname", "userPic", "email", "password", "username"]
      })
      userRes = JSON.parse(JSON.stringify(userRes))
      userRes.userPic = `${config.baseUrl}:${config.port}/${userRes.userPic}`
      res.send({
        code: 200,
        msg: "获取成功",
        data: userRes
      })
    } catch (error) {
      serverError(res)
    }
  },
  // 编辑用户信息
  async edit(req, res) {
    // 获取信息
    const { username, nickname, email, password } = req.body
    let updateOpt = { username, nickname, email, password }
    try {
      let userRes = {}
      // 获取图片
      if (req.file) {
        // 获取封面
        const { filename: userPic } = req.file
        updateOpt["userPic"] = userPic
        // 删除之前的那个图片
        userRes = await User.findOne({
          where: {
            id: 1
          }
        })
      }
      // 更新数据

      const updateRes = await User.update(updateOpt, {
        where: {
          id: 1
        }
      })

      res.send({
        code: 200,
        msg: "更新成功"
      })
      // 删除文件
      fs.unlinkSync(path.join(__dirname, "../uploads/", userRes.userPic))
    } catch (error) {
      // console.log(error)
      serverError(res)
    }
  }
}
