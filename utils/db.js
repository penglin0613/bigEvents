const fs = require('fs')
const path = require('path')
// 基地址
const basePath = path.join(__dirname, '../db')

// 读取数据
module.exports = {
  getArticle() {
    try {
      return JSON.parse(
        fs.readFileSync(path.join(basePath, 'article.json'), 'utf-8')
      )
    } catch (err) {
      const article = [
        {
          id: 1,
          title: '西兰花好好吃',
          content: '多次西兰花有益身心健康',
          cover:
            'https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=2189299806,3304117673&fm=179&app=42&f=JPEG?w=121&h=140',
          type: '1',
          read: '10',
          comment: '10',
          date: '2019-5-22'
        },
        {
          id: 2,
          title: '花菜也不错哦',
          content: '他是西兰花的兄弟肯定好吃啦',
          cover:
            'https://ss2.baidu.com/6ONYsjip0QIZ8tyhnq/it/u=2946378002,1623249294&fm=58&bpow=700&bpoh=528',
          type: '2',
          read: '11',
          comment: '16',
          date: '2019-5-22'
        }
      ]
      fs.writeFileSync(
        path.join(basePath, 'article.json'),
        JSON.stringify(article)
      )
      return article
    }
  },
  getUser() {
    try {
      return JSON.parse(
        fs.readFileSync(path.join(basePath, 'user.json'), 'utf-8')
      )
    } catch (err) {
      const user = {
        username: 'admin',
        nickname: '小小黑',
        email: 'littleBlack@itcast.cn',
        user_pic: '/static/icon.gif',
        password: '123456'
      }
      fs.writeFileSync(path.join('user.json'), JSON.stringify(user))
      return user
    }
  },
  // 添加文章
  addArticle({ title, content, cover, type, date }) {
    const article = this.getArticle()
    article.push({
      id: article.length,
      title,
      content,
      cover,
      type,
      read: 0,
      comment: 0,
      date,
      author:'管理员',
      state: '草稿',
      isDelete: false
    })
    try {
      fs.writeFileSync(
        path.join(basePath, 'article.json'),
        JSON.stringify(article)
      )
      return true
    } catch (error) {
      return false
    }
  },
  // 修改文章
  editArticle({ id, title, content, cover, type, isDelete }) {
    let article = this.getArticle()
    let editOne = article.filter(v => {
      return v.id == id
    })[0]
    if (!editOne) {
      return false
    }
    if (title) {
      editOne.title = title
    }
    if (content) {
      editOne.content = content
    }
    if (type) {
      editOne.type = type
    }
    if (cover) {
      // 获取图片名
      const fileArr = editOne.cover.split('/')
      // 删除之前的图片
      fs.unlinkSync(
        path.join(__dirname, '../uploads/articles', fileArr[fileArr.length - 1])
      )
      editOne.cover = cover
    }
    if (isDelete) {
      editOne.isDelete = isDelete
    }
    // log(editOne);
    // 保存
    try {
      fs.writeFileSync(
        path.join(basePath, 'article.json'),
        JSON.stringify(article)
      )
      return true
    } catch (error) {
      return false
    }
  },
  // 评论
  getComments() {
    try {
      return JSON.parse(
        fs.readFileSync(path.join(basePath, 'comments.json'), 'utf-8')
      )
    } catch (err) {
      const comments = []
      fs.writeFileSync(path.join('comments.json'), JSON.stringify(comments))
      return comments
    }
  },
  // 获取评论
  getCategory() {
    try {
      let category = JSON.parse(
        fs.readFileSync(path.join(basePath, 'category.json'), 'utf-8')
      )
      return category
      // return category.filter(v=>{
      //   return !v.isDelete 
      // })
    } catch (error) {
      let data = [
        {
          id: 1,
          name: '科技',
          slug: 'keji',
          isDelete: false
        },
        {
          id: 2,
          name: '财经',
          slug: 'money',
          isDelete: false
        }
      ]
      fs.writeFileSync(
        path.join(basePath, 'category.json'),
        JSON.stringify(data)
      )
      return data
    }
  },
  addCategory({ name, slug }) {
    let categorys = this.getCategory()
    categorys.push({
      id: categorys.length + 1,
      name,
      slug,
      isDelete: false
    })
    try {
      fs.writeFileSync(
        path.join(basePath, 'category.json'),
        JSON.stringify(categorys)
      )
      return true
    } catch (error) {
      return false
    }
  },
  editCategory({ id, name, slug, isDelete }) {
    let categorys = this.getCategory()
    if (name) {
      categorys[id - 1].name = name
    }
    if (slug) {
      categorys[id - 1].slug = slug
    }
    if (isDelete) {
      categorys[id - 1].isDelete = isDelete
    }

    try {
      fs.writeFileSync(
        path.join(basePath, 'category.json'),
        JSON.stringify(categorys)
      )
      return true
    } catch (error) {
      return false
    }
  },
  // 获取评论数据
  getComments() {
    try {
      return JSON.parse(fs.readFileSync(path.join(basePath, 'comments.json')))
    } catch (error) {
      const comments = []
      fs.writeFileSync(path.join(basePath, 'comments.json'), JSON.stringify([]))
      return []
    }
  },
  // 通过评论
  passComments(id, isPass) {
    let comments = this.getComments()
    comments[id - 1].state = isPass ? '批准' : '不通过'
    try {
      fs.writeFileSync(
        path.join(basePath, 'comments.json'),
        JSON.stringify(comments)
      )
      return true
    } catch (error) {
      return false
    }
  },
  // 删除评论
  deleteComments(id) {
    let comments = this.getComments()
    comments[id - 1].isDelete = true
    try {
      fs.writeFileSync(
        path.join(basePath, 'comments.json'),
        JSON.stringify(comments)
      )
      return true
    } catch (error) {
      return false
    }
  },
  // 保存用户
  editUser(user) {
    try {
      fs.writeFileSync(path.join(basePath, 'user.json'), JSON.stringify(user))
      return true
    } catch (error) {
      return false
    }
  }
}
