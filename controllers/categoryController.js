const { Category } = require("../db")

const serverError = res => {
  res.status(500).send({
    code: 500,
    msg: "服务器内部错误"
  })
}

module.exports = {
  // 新增
  async add(req, res) {
    const { name, slug } = req.body
    // 创建新分类
    try {
      let result = await Category.create({ name, slug })
      // // console.log(result)
      // res.send(result)
      res.status(201).send({
        code: 201,
        msg: "创建成功"
      })
    } catch (error) {
      //  res.send(error.errors)
      if (error.errors[0].type == "unique violation") {
        let msg = error.errors[0].path + " 已存在,请重新提交"
        res.status(400).send({
          code: 400,
          msg
        })
      }
      // res.send(400).send({
      //   code:400,
      //   msg:''
      // })
    }
  },
  // 获取列表
  async list(req, res) {
    try {
      let data = await Category.findAll()
      res.send({
        code: 200,
        msg: "获取成功",
        data
      })
    } catch (error) {
      serverError(res)
    }
  },
  // 根据id搜索文章分类
  async search(req, res) {
    const { id } = req.query
    try {
      let data = await Category.findAll({
        where: {
          id
        }
      })
      res.send({
        code: 200,
        msg: "获取成功",
        data
      })
    } catch (error) {
      serverError(res)
    }
  },
  // 编辑文章类别
  async edit(req, res) {
    const { id, name, slug } = req.body
    try {
      let result = await Category.update(
        { name, slug },
        {
          where: {
            id
          }
        }
      )
      if (result == 1) {
        res.send({
          code: 200,
          msg: "修改成功"
        })
      } else {
        res.send({
          code: 400,
          msg: "修改失败，请检查slug和name参数"
        })
      }
    } catch (error) {
      serverError(res)
    }
  },
  // 删除文章类别
  async _delete(req, res) {
    const { id } = req.body
    // // console.log(id)
    try {
      const result = await Category.destroy({
        where: { id }
      })
      // res.send(result)
      // console.log(result)
      // res.send('/delsuc')
      if(result==1){
        res.send({
          code:204,
          msg:'删除成功'
        })
      }else{
        res.send({
          code:400,
          msg:'，删除失败,请检查id'
        })
      }
    } catch (error) {
      serverError(res)
    }
  }
}
