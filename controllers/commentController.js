const { Comment, Article } = require("../db");

// 服务器内部错误
const serverError = res => {
  res.send({
    code: 500,
    msg: "服务器内部错误"
  });
};

module.exports = {
  // 评论审核通过
  async pass(req, res) {
    // 获取id
    const { id } = req.body;
    try {
      // 查询数据
      const commentRes = await Comment.findOne({
        where: {
          id
        }
      });
      // id判断
      if (!commentRes) {
        res.send({
          code: 400,
          msg: "id有误,请检查"
        });
      }
      // 修改评论状态
      const updateRes = await Comment.update(
        {
          state: "已通过"
        },
        {
          where: {
            id
          }
        }
      );
      if (updateRes[0] == 1) {
        res.send({
          msg: "已通过",
          code: 200
        });
      } else {
        res.send({
          msg: "已批准，不要重复操作",
          code: 400
        });
      }
    } catch (error) {
      serverError(res);
    }
  },
  // 评论审核不通过
  async reject(req, res) {
    // 获取id
    const { id } = req.body;
    try {
      // 查询数据
      const commentRes = await Comment.findOne({
        where: {
          id
        }
      });
      // id判断
      if (!commentRes) {
        res.send({
          code: 400,
          msg: "id有误,请检查"
        });
      }
      // 修改评论状态
      const updateRes = await Comment.update(
        {
          state: "已拒绝"
        },
        {
          where: {
            id
          }
        }
      );
      if (updateRes[0] == 1) {
        res.send({
          msg: "已拒绝",
          code: 200
        });
      } else {
        res.send({
          msg: "已拒绝，不要重复操作",
          code: 400
        });
      }
    } catch (error) {
      serverError(res);
    }
  },
  // 删除评论
  async _delete(req, res) {
    // 获取id
    const { id } = req.body;
    try {
      // 查询数据
      const commentRes = await Comment.findOne({
        where: {
          id
        }
      });
      // id判断
      if (!commentRes) {
        res.send({
          code: 400,
          msg: "id有误,请检查"
        });
      }
      // 修改评论状态
      const destroyRes = await Comment.destroy({
        where: {
          id
        }
      });
      res.send({
        msg: "已删除",
        code: 200
      });
    } catch (error) {
      serverError(res);
    }
  },
  // 搜索评论
  async search(req, res) {
    // 获取页码和页容量
    let { page, perpage } = req.query;
    try {
      if (!page) {
        page = 1;
      }
      if (!perpage) {
        perpage = 6;
      }
      // 分页数据判断
      page = parseInt(page);
      perpage = parseInt(perpage);
      if (typeof page != "number" || typeof perpage != "number") {
        return res.send({
          code: 400,
          msg: "页码，或者页容量类型错误"
        });
      }
      // 数据查询
      // 计算跳过的页码
      const offset = (page - 1) * perpage;
      // 查询条件
      let where = {};
      // 查询
      // 分页查询
      let pageArticleRes = await Comment.findAll({
        // 分页
        limit: perpage,
        // 跳过页码
        offset,
        // 连表
        include: [
          {
            model: Article,
            require: true
          }
        ],
        order: [
          	// 根据id倒序
                ["id", "DESC"]
        ]
      });
     // 总页数
      let totalArticleRes = await Comment.findAll({
        // 模糊查询
        where
      });
      pageArticleRes = JSON.parse(JSON.stringify(pageArticleRes));
      pageArticleRes.forEach(v => {
        v.title = v.article.title
        delete v.article
      });
      res.send({
        code: 200,
        msg: "数据获取成功",
        data: {
          totalCount: totalArticleRes.length,
          totalPage: Math.ceil(totalArticleRes.length / perpage),
          data: pageArticleRes
        }
      });
    } catch (error) {
      serverError(res);
    }
  }
};
