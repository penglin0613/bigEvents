// 导入express
const express = require('express')
// 导入路由
const router = express.Router()
// 导入信息
const message = require('../utils/message')
// 导入数据
const db = require('../utils/db')

// 文章搜索
router.get('/search',(req,res)=>{
  // 参数获取
  const key = req.query.key||''
  const type = req.query.type||''
  const page = req.query.page ||1
  const perpage = req.query.perpage||6

  // 类型判断
  if(isNaN(page)||isNaN(perpage)){
    message.invalidParameter(res)
    return;
  }
  // 数据获取
  const article = db.getArticle()

  // 根据类型检索数据
  
  

})

// 暴露
module.exports = router
