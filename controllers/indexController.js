const { Comment, Article, Category, Sequelize, sequelize } = require("../db")
const Op = Sequelize.Op
// 导入配置
const config = require('../config/index')
// 导入基地址
const { baseUrl } = reqlib("/config")
// 获取转义的工具函数
const {html_decode} = reqlib("/utils/htmlFmt");


const moment = require("moment")

const serverError = res => {
  res.send({
    code: 500,
    msg: "服务器内部错误"
  })
}

module.exports = {
  // 发表评论
  async post_comment(req, res) {
    // 获取数据
    const { author, content, articleId } = req.body
    // 判断数据
    try {
      // 判断文章id
      const articleRes = await Article.findOne({
        where: {
          id: articleId
        }
      })
      if (!articleRes) {
        return res.send({
          code: 400,
          msg: "文章id有误，请检查"
        })
      }
      // 发表评论
      await Comment.create({
        author,
        content,
        date: moment().format("YYYY-MM-DD"),
        time: moment().format("HH:mm:ss"),
        state: "待审核",
        articleId
      })
      res.send({
        code: 201,
        msg: "发表成功"
      })
    } catch (error) {
      serverError(res)
    }
  },
  // 评论列表
  async get_comment(req, res) {
    // 获取文章id
    const { articleId } = req.query
    try {
      // 判断文章是否存在
      const articleRes = await Article.findOne({
        where: {
          id: articleId
        }
      })
      // id异常提示
      if (!articleRes) {
        return res.send({
          code: 400,
          msg: "文章id有误,请检查"
        })
      }
      console.log(articleId)
      // 查询评论
      const commentRes = await Comment.findAll({
        where: {
          articleId,
          state: "已通过"
        },
        order: [
          // 根据id倒序
          ["id", "DESC"]
        ]
      })
      res.send({
        code: 200,
        msg: "获取成功",
        data:commentRes
      })
    } catch (error) {
      console.log(error)
      serverError(res)
    }
  },
  // 文章搜索
  async search(req, res) {
    //   res.send('/query')
    // 数据获取
    const { key, type } = req.query
    let { page, perpage } = req.query
    page = parseInt(page)
    perpage = parseInt(perpage)
    if (!page) {
      page = 1
    }
    if (!perpage) {
      perpage = 6
    }
    // 分页数据判断
    if (typeof page != "number" || typeof perpage != "number") {
      return res.send({
        code: 400,
        msg: "页码，或者页容量类型错误"
      })
    }
    // 计算跳过的页码
    const offset = (page - 1) * perpage
    // 查询条件
    let where = { isDelete: 0 }
    // 查询关键字
    if (key) {
      where[Op.or] = [
        {
          title: {
            [Op.substring]: key
          },
          content: {
            [Op.substring]: key
          }
        }
      ]
    }
    // 查询类型
    if (type) {
      where["categoryId"] = type
    }
    try {
      // 分页查询
      let pageArticleRes = await Article.findAll({
        // 模糊查询
        where,
        include: [
          {
            model: Comment
          },
          {
            model: Category
          }
        ],
        attributes: { exclude: ["isDelete"] },
        // 分页
        limit: perpage,
        // 跳过页码
        offset
      })
      // 处理评论个数
      pageArticleRes = JSON.parse(JSON.stringify(pageArticleRes))
      pageArticleRes.forEach(v => {
        v.comments = v.comments.length
        if (v.cover.indexOf("https://") == -1) {
          v.cover = `${config.baseUrl}:${config.port}/${v.cover}`
        }
        // 类型
        v.category = v.category.name
      })
      // 总页数
      let totalArticleRes = await Article.findAll({
        // 模糊查询
        where
      })
      res.send({
        code: 200,
        msg: "数据获取成功",
        data: {
          totalCount: totalArticleRes.length,
          data: pageArticleRes
        }
      })
    } catch (error) {
      // console.log(error);
      serverError(res)
    }
    // res.send("/search")
  },
  // 文章类型
  async category(req, res) {
    // 获取类型
    try {
      const categoryRes = await Category.findAll({
        attributes: { exclude: ["slug"] }
      })
      res.send({
        code: 200,
        msg: "获取成功",
        data: categoryRes
      })
    } catch (error) {
      serverError(res)
    }
  },
  // 热点图
  async hotpic(req, res) {
    try {
      const picRes = await Article.findAll({
        order:sequelize.random(),
        limit: 5,
        attributes: ["cover","id","title"]
      })
      picRes.forEach(v => {
        if (v.cover.indexOf("https://") == -1) {
          v.cover = `${config.baseUrl}:${config.port}/${v.cover}`
        }
      })
      res.send({
        code: 200,
        msg: "获取成功",
        data: picRes
      })
    } catch (error) {
      serverError(res)
    }
  },
  // 文章热门排行
  async rank(req, res) {
    try {
      const rankRes = await Article.findAll({
        order: [["read", "DESC"]],
        limit: 7,
        attributes: ["title","id"]
      })
      res.send({
        code: 200,
        msg: "获取成功",
        data: rankRes
      })
    } catch (error) {
      serverError(res)
    }
  },
  // 最新资讯
  async latest(req, res) {
    try {
      let latestRes = await Article.findAll({
        where: {
          isDelete: 0
        },
        order: [["id", "DESC"]],
        limit: 5,
        include: [
          {
            model: Comment
          },
          {
            model: Category
          }
        ],
        attributes: { exclude: ["isDelete"] }
      })
      // 处理数据
      latestRes = JSON.parse(JSON.stringify(latestRes))
      latestRes.forEach(v => {
        // 评论数
        v.comments = v.comments.length
        v.content = html_decode(v.content);
        console.log(v.content);
        const index = v.content.indexOf("</p>");
        console.log(index);
        // 简略信息
        if(index==-1){
          v.intro = v.content.substring(0,20)+'...'
        }else{
          v.intro =  v.content.substring(0, index) + "..."
        }
        // 删除内容
        delete v.content
        // 处理封面
        if (v.cover.indexOf("https://") == -1) {
          v.cover = `${config.baseUrl}:${config.port}/${v.cover}`
        }
        // 处理分类名
        v.category = v.category.name
      })
      res.send({
        code: 200,
        msg: "获取成功",
        data: latestRes
      })
    } catch (error) {
      console.log(error)
      serverError(res)
    }
  },
  // 最新评论
  async latest_comment(req, res) {
    try {
      let latestRes = await Comment.findAll({
        order: [["id", "DESC"]],
        limit: 6
      })
      // 处理数据
      latestRes = JSON.parse(JSON.stringify(latestRes))
      latestRes.forEach(v => {
        // 简略信息
        v.intro = v.content.substring(0, 20) + "..."
        // 删除内容
        delete v.content
      })
      res.send({
        code: 200,
        msg: "获取成功",
        data: latestRes
      })
    } catch (error) {
      console.log(error)
      serverError(res)
    }
  },
  // 焦点关注
  async attention(req, res) {
    try {
      let attentionRes = await Article.findAll({
        where: {
          isDelete: 0
        },
        order: sequelize.random(),
        limit: 7,
        attributes: ["content"]
      })
      // 处理数据
      attentionRes = JSON.parse(JSON.stringify(attentionRes))
      attentionRes.forEach(v => {
        // 简略信息
        v.intro = v.content.substring(0, 20) + "..."
        // 删除内容
        delete v.content
      })
      res.send({
        code: 200,
        msg: "获取成功",
        data: attentionRes
      })
    } catch (error) {
      console.log(error)
      serverError(res)
    }
  },
  // 文章详细内容
  async article(req, res) {
    const { id } = req.query
    try {
      // 获取当前这一篇
      let currentArticleRes = await Article.findOne({
        where: {
          id,
          isDelete: 0
        },
        include: [
          {
            model: Comment
          },
          {
            model: Category
          }
        ],
        attributes: { exclude: ["isDelete"] }
      })
      if(!currentArticleRes){
        return res.send({
          code:400,
          msg:'id有误,请检查'
        })
      }
      // 累加
      let read = currentArticleRes.read + 1
      // 累加
      await Article.update(
        {
          read
        },
        {
          where: {
            id
          }
        }
      )
      currentArticleRes = JSON.parse(JSON.stringify(currentArticleRes))
      currentArticleRes.content = html_decode(currentArticleRes.content);
      // 处理封面
      if (currentArticleRes.cover.indexOf("htps://") == -1) {
        currentArticleRes.cover = `${baseUrl}/${currentArticleRes.cover}`
      }
      // 评论
      currentArticleRes.comments = currentArticleRes.comments.length
      // 分类
      currentArticleRes.category = currentArticleRes.category.name
      // 内容
      // 查找上一个
      const prev = await Article.findOne({
        where: {
          id: {
            [Op.lt]: id
          },

          isDelete: 0
        },
        order: [
          // 根据id倒序
          ["id", "DESC"]
        ],
        attributes: ["id", "title"]
      })
      // 查找下一个
      const next = await Article.findOne({
        where: {
          id: {
            [Op.gt]: id
          },
          isDelete: 0
        },
        attributes: ["id", "title"]
      })

      res.send({
        code: 200,
        msg: "获取成功",
        data: {
          ...currentArticleRes,
          prev,
          next
        }
      })
    } catch (error) {
      console.log(error)
      serverError(res)
    }
  }
}
