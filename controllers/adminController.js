const path = require('path')
// 导入moment
const moment = require('moment')
// 导入提示
const message = require(path.join(__dirname, '../utils/message'))
// 导入配置
const config = require(path.join(__dirname, '../utils/config'))
// 获取用户信息
const db = require(path.join(__dirname, '../utils/db'))
// 导入fs
const fs = require('fs')
// 导入数据验证
const cd = require(path.join(__dirname, '../utils/checkData'))

module.exports = {
  // 用户登录
  login(req, res) {
    // 数据获取
    const user_name = req.body.user_name || ''
    const password = req.body.password || ''
    // 类型判断
    if (user_name === 'admin' && password === '123456') {
      res.send({
        msg: '登录成功',
        code: 200
      })
    } else {
      res.send({
        msg: '用户名或密码错误',
        code: 400
      })
    }
  },
  // 用户登出
  logout(req, res) {
    res.send({
      msg: '登出成功',
      code: 200
    })
  },
  // 获取用户信息
  getuser(req, res) {
    let { nickname, user_pic } = db.getUser()
    user_pic = config.serverAddress + user_pic
    // 获取用户信息
    res.send({
      msg: '获取成功',
      code: 200,
      data: { nickname, user_pic }
    })
  },
  // 获取文章数量统计
  article_count(req, res) {
    res.send({
      msg: '文章统计获取成功',
      code: 200,
      data: {
        all_count: db.getArticle().length,
        day_count: 5
      }
    })
  },
  // 获取评论数量统计
  comment_count(req, res) {
    res.send({
      msg: '评论数量获取成功',
      code: 200,
      data: {
        all_count: db.getComments().length,
        day_count: 10
      }
    })
  },
  // 月新增文章获取
  month_article_count(req, res) {
    // 根据今天日期获取一个月的
    // 生成日期数组
    let data = []
    for (let i = 30; i >= 1; i--) {
      data.push({
        day: moment()
          .subtract(i, 'days')
          .format('YYYY-MM-DD'),
        day_count: parseInt(Math.random() * 300)
      })
    }

    res.send({
      msg: '月新增文章数获取成功',
      code: 200,
      data
    })
  },
  // 获取类型对应文章数
  article_category_count(req, res) {
    res.send({
      msg: '类型统计数据获取成功',
      code: 200,
      data: [
        {
          type: '科技',
          all_count: 1
        },
        {
          type: '财经',
          all_count: 1
        }
      ]
    })
  },
  // 月文章访问量
  article_category_visit(req, res) {
    res.send({
      msg: '月文章访问量获取成功',
      code: 200,
      data: [
        {
          month: '1月',
          all_count: [
            {
              type: '科技',
              count: 237
            },
            {
              type: '财经',
              count: 237
            }
          ]
        },
        {
          month: '2月',
          all_count: [
            {
              type: '科技',
              count: 237
            },
            {
              type: '财经',
              count: 237
            }
          ]
        },
        {
          month: '三月',
          all_count: [
            {
              type: '科技',
              count: 237
            },
            {
              type: '财经',
              count: 237
            }
          ]
        },
        {
          month: '四月',
          all_count: [
            {
              type: '科技',
              count: 123
            },
            {
              type: '财经',
              count: 456
            }
          ]
        },
        {
          month: '五月',
          all_count: [
            {
              type: '科技',
              count: 99
            },
            {
              type: '财经',
              count: 300
            }
          ]
        }
      ]
    })
  },
  // 文章搜索
  search(req, res) {
    // 获取提交的数据
    const key = req.query.key || ''
    const type = req.query.type || ''
    const state = req.query.state || ''
    const page = parseInt(req.query.page || 1)
    const perpage = parseInt(req.query.perpage || 6)
    const id = req.query.id

    // 数据类型判断
    if (isNaN(page) || isNaN(perpage)) {
      message.invalidParameter(res)
      return
    }
    // 文章检索
    let article = db.getArticle()
    // 类型筛选
    article = article.filter(v => {
      // 类型筛选
      if (type == '') return true
      return v.type == type
    })
    // 状态筛选
    article = article.filter(v => {
      // 类型筛选
      if (state == '') return true
      return v.state == state
    })
    // 是否被删除
    article = article.filter(v => {
      // 类型筛选
      return v.isDelete == false
    })
    // 获取分类
    let cateData = {}
    db.getCategory().forEach(v => {
      if (v.isDelete == false) {
        cateData[v.id] = v.name
      }
    })
    // 关键字
    article = article
      .reverse()
      .filter(v => {
        if (
          cateData[v.type] == undefined ||
          cateData[v.type].isDelete == true
        ) {
          return false
        }
        // 类型筛选
        if (key == '') return true
        try {
          return v.title.indexOf(key) != -1 || v.content.indexOf(key) != -1
        } catch (error) {
          return false
        }
      })
      .map(v => {
        let {
          id,
          title,
          content,
          cover,
          type,
          read,
          comment,
          date,
          state,
          author,
          isDelete
        } = v
        if (
          cover.indexOf('http') == -1 &&
          cover.indexOf(config.serverAddress) == -1
        ) {
          cover = config.serverAddress + cover
        }
        type = cateData[type]
        return {
          id,
          title,
          content,
          cover,
          type,
          read,
          comment,
          date,
          state,
          author
        }
      })
    if (id) {
      // 如果只是id
      const editOne = article.filter(v => {
        return v.id == id
      })[0]

      // 设置type 为id
      for (const key in cateData) {
        if (cateData[key] == editOne.type) {
          editOne.type = key
        }
      }
      if (editOne) {
        res.send({
          msg: '获取成功',
          code: 200,
          data: editOne
        })
        return
      }
    }

    // 实现分页
    let startIndex = (page - 1) * perpage
    let endIndex = startIndex + perpage
    if (endIndex > article.length) {
      endIndex = article.length
    }
    // 总页数
    let totalPage = Math.ceil(article.length / perpage) || 1
    // 返回的数据
    var backData = []
    console.log(startIndex)
    console.log(endIndex)
    for (let i = startIndex; i < endIndex; i++) {
      backData.push(article[i])
    }
    res.send({
      msg: '搜索成功',
      code: 200,
      totalPage,
      data: backData
    })
  },
  // 文章发布
  article_publish(req, res) {
    // 获取数据
    const title = req.body.title || ''
    const type = req.body.type || 1
    const date = req.body.date || moment().format('YYYY-MM-DD')
    const content = req.body.content || ''
    let cover
    // 允许的图片类型
    if (!req.file) {
      res.send({
        msg: '封面不能为空哦',
        code: 400
      })
      return
    } else if (
      req.file.size > 1024 * 1024 * 5 ||
      ['image/gif', 'image/png', 'image/jpeg'].indexOf(req.file.mimetype) == -1
    ) {
      res.send({
        msg: '文件大小或类型不对，请检查',
        code: 400
      })
      fs.unlinkSync(path.join(__dirname, '../', req.file.path))
      return
    }
    // 标题判断
    if (!title) {
      res.send({
        msg: '标题不能为空哦',
        code: 400
      })
      return
    }
    // 标题判断
    if (!type) {
      res.send({
        msg: '类型不能为空哦',
        code: 400
      })
      return
    }
    // 设置封面
    cover = config.serverAddress + `/static/articles/${req.file.filename}`
    // 获取文章
    if (
      db.addArticle({
        title,
        content,
        cover,
        type,
        date,
        author: '管理员'
      })
    ) {
      res.send({
        msg: '发布成功',
        code: 201
      })
    } else {
      res.send({
        msg: '发布失败',
        code: 400
      })
    }
    // 类型判断
    // res.send(req.file)
  },
  // 文章编辑
  article_edit(req, res) {
    const id = req.body.id
    // 获取数据
    const title = req.body.title
    const type = req.body.type
    const content = req.body.content
    let cover

    // id不能为空
    if (!id || isNaN(id)) {
      res.send({
        msg: 'id不能为空',
        code: 400
      })
      return
    }
    // 标题判断
    if (!title) {
      res.send({
        msg: '标题不能为空哦',
        code: 400
      })
      return
    }
    // 标题判断
    if (!type) {
      res.send({
        msg: '类型不能为空哦',
        code: 400
      })
      return
    } else {
    }

    // 允许的图片类型
    if (req.file) {
      if (
        req.file.size > 1024 * 1024 ||
        ['image/gif', 'image/png', 'image/jpeg'].indexOf(req.file.mimetype) ==
          -1
      ) {
        res.send({
          msg: '文件大小或类型不对，请检查',
          code: 400
        })
        fs.unlinkSync(path.join(__dirname, '../', req.file.path))
        return
      }
    }
    // 设置封面
    cover = config.serverAddress + `/static/articles/${req.file.filename}`
    // 修改文章
    if (db.editArticle({ id, title, type, content, cover })) {
      res.send({
        msg: '修改成功',
        code: 200
      })
    } else {
      res.send({
        msg: '修改失败，请检查参数',
        code: 400
      })
    }

    // 类型判断
    // res.send(req.file)
  },
  // 文章删除
  article_delete(req, res) {
    // 获取id
    if (!req.query.id) {
      res.send({
        msg: 'id不能为空',
        code: 400
      })
      return
    }
    // 获取id
    const id = req.query.id
    if (id > db.getArticle().length || isNaN(id)) {
      res.send({
        msg: 'id无效,请检查',
        code: 400
      })
      return
    }

    // 软删除
    if (db.editArticle({ id, isDelete: true })) {
      res.send({
        msg: '删除成功',
        code: 200
      })
    } else {
      res.send({
        msg: '删除失败，请检查',
        code: 200
      })
    }
  },
  // 分类查询
  category_search(req, res) {
    // 获取所有并返回
    res.send({
      msg: '分类获取完毕',
      code: 200,
      data: db
        .getCategory()
        .filter(v => {
          return !v.isDelete
        })
        .map(v => {
          const { name, slug, id } = v
          return {
            id,
            name,
            slug
          }
        })
    })
  },
  // 分类新增
  category_add(req, res) {
    // 获取数据
    if (!req.body.name || !req.body.name.trim()) {
      res.send({
        msg: 'name不能为空',
        code: 400
      })
      return
    }
    if (!req.body.slug || !req.body.slug.trim()) {
      res.send({
        msg: 'slug不能为空',
        code: 400
      })
      return
    }
    // 取值
    const name = req.body.name.trim()
    const slug = req.body.slug.trim()

    // 判断是否存在
    const filterCate = db.getCategory().filter(v => {
      return v.name == name || v.slug == slug
    })
    if (filterCate.length != 0) {
      res.send({
        msg: 'name或slug已存在,请检查',
        code: 400
      })
    } else {
      // 新增
      if (db.addCategory({ name, slug })) {
        res.send({
          msg: '新增成功',
          code: 200
        })
      } else {
        res.send({
          msg: '新增失败，请检查',
          code: 400
        })
      }
    }
  },
  // 分类编辑
  category_edit(req, res) {
    // 获取数据
    if (!req.body.id || !req.body.id.trim || isNaN(req.body.id)) {
      res.send({
        msg: 'id不对哦，请检查',
        code: 400
      })
    }
    // 获取数据
    if (!req.body.name || !req.body.name.trim()) {
      res.send({
        msg: 'name不能为空',
        code: 400
      })
      return
    }
    if (!req.body.slug || !req.body.slug.trim()) {
      res.send({
        msg: 'slug不能为空',
        code: 400
      })
      return
    }
    // 获取数据
    const id = req.body.id
    const name = req.body.name
    const slug = req.body.slug
    if (
      db.getCategory().filter(v => {
        return v.id == id
      }).length != 1
    ) {
      res.send({
        msg: 'id不存在哦',
        code: 400
      })
      return
    }

    // 调用修改方法
    if (db.editCategory({ id, name, slug })) {
      res.send({
        msg: '修改成功',
        code: 200
      })
    } else {
      res.send({
        msg: '修改失败,请重试',
        code: 400
      })
    }
  },
  // 分类删除
  category_delete(req, res) {
    // 获取数据
    if (!req.body.id || !req.body.id.trim || isNaN(req.body.id)) {
      res.send({
        msg: 'id不对哦，请检查',
        code: 400
      })
    }
    // 获取数据
    const id = req.body.id
    if (
      db.getCategory().filter(v => {
        return v.id == id
      }).length != 1
    ) {
      res.send({
        msg: 'id不存在哦',
        code: 400
      })
      return
    }
    const isDelete = true
    if (db.editCategory({ id, isDelete })) {
      res.send({
        msg: '删除成功',
        code: 200
      })
    } else {
      res.send({
        msg: '删除失败,请重试',
        code: 400
      })
    }
  },
  //
  // 文章评论搜索
  comment_search(req, res) {
    // 数据获取
    let page = req.query.page
    let perpage = req.query.perpage
    // 数据判断
    if (cd.cExist(page) == false) {
      page = 1
    }
    if (!cd.cExist(perpage)) {
      perpage = 6
    }
    if (cd.cNum(page) == false) {
      message.invalidParameter(res, 'page')
      return
    }
    if (cd.cNum(perpage) == false) {
      message.invalidParameter(res, 'perpage')
      return
    }
    // 查询数据
    let comments = db.getComments()
    comments = comments.filter(v => {
      return v.isDelete == false
    })

    // 起始索引
    const startI = (page - 1) * perpage
    let endI = startI + perpage
    let data = []
    // 判断是否可以取到值
    if (startI > comments.length) {
      res.send({
        msg: '页码过大',
        code: 400
      })
    }
    if (endI > comments.length) {
      endI = comments.length
    }
    // 取值
    for (let i = startI; i < endI; i++) {
      data.push(comments[i])
    }
    res.send({
      msg: '获取成功',
      code: 200,
      data
    })
  },
  // 评论id验证
  comment_Check(req, res, next) {
    // 获取id
    let id = req.body.id

    if (!cd.cExist(id)) {
      message.invalidParameter(res, 'id')
      return
    }
    if (!cd.cNum(id)) {
      message.invalidParameter(res, 'id')
      return
    }
    // 查询数据
    const comments = db.getComments()
    const filterComments = comments.filter(v => {
      return v.id == id
    })
    if (filterComments.length == 0) {
      message.invalidParameter(res, 'id', '不存在')
      return
    }
    next()
  },
  // 评论审核通过
  comment_pass(req, res) {
    if (db.passComments(req.body.id, true)) {
      res.send({
        msg: '设置成功',
        code: 200
      })
    } else {
      res.send({
        msg: '设置失败,请重试',
        code: 400
      })
    }
  }, // 评论审核通过
  comment_reject(req, res) {
    if (db.passComments(req.body.id, false)) {
      res.send({
        msg: '设置成功',
        code: 200
      })
    } else {
      res.send({
        msg: '设置失败,请重试',
        code: 400
      })
    }
  },
  // 评论删除
  comment_delete(req, res) {
    if (db.deleteComments(req.body.id)) {
      res.send({
        msg: '删除成功',
        code: 200
      })
    } else {
      res.send({
        msg: '删除失败,请重试',
        code: 400
      })
    }
  },
  // 获取用户信息
  userinfo_get(req, res) {
    // 获取用户信息
    let user = db.getUser()
    user.user_pic = config.serverAddress + user.user_pic
    res.send({
      msg: '用户信息获取成功',
      code: 200,
      data: user
    })
  },
  userinfo_edit(req, res) {
    // 获取用户数据
    let user = db.getUser()
    // 允许的图片类型
    // 如果文件存在
    if (req.file) {
      // 文件大小判断
      if (
        req.file.size > 1024 * 1024 ||
        ['image/gif', 'image/png', 'image/jpeg'].indexOf(req.file.mimetype) ==
          -1
      ) {
        res.send({
          msg: '文件大小或类型不对，请检查',
          code: 400
        })
        try {
          fs.unlinkSync(path.join(__dirname, '../', req.file.path))
        } catch (error) {}
        return
      }
      try {
        // 删除之前的文件
        fs.unlinkSync(
          path.join(__dirname, '../uploads/', user.user_pic.split('/')[2])
        )
      } catch (error) {}

      // console
      //   .log
      //   // path.join(__dirname, '../uploads/', user.user_pic.split('/')[2])
      //   ()
      // 设置文件信息
      user.user_pic = '/static/' + req.file.filename
    }

    if (cd.cExist(req.body.username)) {
      user.username = req.body.username
    }
    if (cd.cExist(req.body.nickname)) {
      user.nickname = req.body.nickname
    }
    if (cd.cExist(req.body.email)) {
      user.email = req.body.email
    }
    if (cd.cExist(req.body.password)) {
      user.password = req.body.password
    }
    // 保存
    if (db.editUser(user)) {
      res.send({
        msg: '修改成功',
        code: 200
      })
    } else {
      res.send({
        msg: '修改失败，请重试'
      })
    }
  }
}
