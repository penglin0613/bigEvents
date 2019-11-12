const { Category, Article, Sequelize } = require("../db");
// 获取运算符
const Op = Sequelize.Op;
const { baseUrl, port } = reqlib("/config");

const fs = require("fs");
const path = require("path");

// 获取转义的工具函数
const { html_encode, html_decode } = reqlib("/utils/htmlFmt");

const serverError = res => {
  res.status(500).send({
    code: 500,
    msg: "服务器内部错误"
  });
};
module.exports = {
  // 文章发布
  async publish(req, res) {
    // 获取分类id
    const { categoryId } = req.body;
    try {
      // 判断文章分类id是否存在
      const findResult = await Category.findAll({
        where: {
          id: categoryId
        }
      });
      if (findResult.length == 0) {
        return res.send({
          code: 400,
          msg: "分类id不对，请检查"
        });
      }
      let { state } = req.body;
      if (!state) {
        state = "草稿";
      }
      // 获取文章的其他信息
      const { title, date } = req.body;
      let { content } = req.body;
      content = html_encode(content);
      console.log(content);
      // 获取封面
      const { filename: cover } = req.file;

      // 判断类型是否匹配
      if (["草稿", "已发布"].indexOf(state) == -1) {
        return res.send({
          code: 400,
          msg: "state类型不对，请检查"
        });
      }

      // 创建新文章
      const addResult = await Article.create({
        title,
        categoryId,
        date,
        content,
        cover,
        isDelete: 0,
        state,
        author: "管理员",
        read: 0
      });
      // 返回提示消息
      res.send({
        msg: "文章新增成功",
        code: 200
      });
    } catch (error) {
      serverError(res);
      console.log(error);
    }
  },
  // 根据id获取文章
  async search(req, res) {
    const { id } = req.query;
    try {
      let findRes = await Article.findOne({
        where: {
          id,
          isDelete: 0
        },
        include: [
          {
            model: Category
          }
        ],
        attributes: { exclude: ["read", "isDelete", ["category"]] }
        // 查询指定字段
      });
      if (!findRes) {
        return res.send({
          code: 400,
          msg: "id有误，请检查"
        });
      }
      // 处理数据
      findRes = JSON.parse(JSON.stringify(findRes));

      findRes.content = html_decode(findRes.content);

      // 判断分类是否已经不存在
      if (!findRes.categoryId) {
        return res.send({
          code: 400,
          msg: "id有误，请检查"
        });
      }
      // 返回获取到的数据
      if (findRes.cover.indexOf("https://") == -1) {
        findRes.cover = `${baseUrl}:${port}/${findRes.cover}`;
      }
      // 删除 category字段
      delete findRes.category;
      res.send({
        code: 200,
        msg: "获取成功",
        data: findRes
      });
    } catch (error) {
      serverError(res);
    }
  },
  // 编辑文章
  async edit(req, res) {
    // 获取文航id
    const { id } = req.body;
    try {
      // 查询文章id
      const articleRes = await Article.findAll({
        where: {
          id,
          isDelete: 0
        }
      });
      // 检验文章id是否正确
      if (articleRes.length == 0) {
        return res.send({
          msg: "文章id有问题,请检查",
          code: 400
        });
      }
      // 获取分类id
      const { categoryId } = req.body;
      // 判断文章分类id是否存在
      const categoryResult = await Category.findAll({
        where: {
          id: categoryId
        }
      });
      if (categoryResult.length == 0) {
        return res.send({
          code: 400,
          msg: "分类id不对，请检查"
        });
      }

      // 获取数据 除文件
      const { title, date } = req.body;
      let { content } = req.body;
      content = html_encode(content);

      // 获取分类
      let { state } = req.body;
      if (!state) {
        state = "草稿";
      }
      // 判断类型是否匹配
      if (["草稿", "已发布"].indexOf(state) == -1) {
        return res.send({
          code: 400,
          msg: "state类型不对，请检查"
        });
      }

      // 获取数据 文件
      if (!req.file) {
        await Article.update(
          {
            title,
            date,
            content,
            categoryId,
            state
          },
          {
            where: {
              id
            }
          }
        );
        res.send({
          code: 200,
          msg: "修改成功"
        });
      } else {
        const { filename: cover } = req.file;

        const updateRes = await Article.update(
          {
            title,
            date,
            content,
            categoryId,
            cover,
            state
          },
          {
            where: {
              id
            }
          }
        );
        res.send({
          code: 200,
          msg: "修改成功"
        });
        // 删除之前的图片
        fs.unlinkSync(path.join(__dirname, "../uploads/", articleRes[0].cover));
      }

      // 获取最新的值
    } catch (error) {
      console.log(res);
      serverError(res);
    }
  },
  // 删除文章
  async _delete(req, res) {
    // 获取id
    const { id } = req.body;

    try {
      const articleRes = await Article.findAll({
        where: {
          id,
          isDelete: 0
        }
      });
      if (articleRes.length == 0) {
        return res.send({
          msg: "id有误,请检查",
          code: 400
        });
      }
      // 修改数据
      const result = await Article.update(
        {
          isDelete: true
        },
        {
          where: {
            id
          }
        }
      );
      // res.send(result)
      if (result[0] == 1) {
        return res.send({
          code: 204,
          msg: "文章删除成功"
        });
      }
      res.send({
        code: 400,
        msg: "文章删除失败,请检查id"
      });
    } catch (error) {
      console.log(error);
      serverError(res);
    }
  },
  // 搜索文航
  async query(req, res) {
    //   res.send('/query')
    // 数据获取
    const { key, type, state } = req.query;
    let { page, perpage } = req.query;
    // 查询状态判断
    if (["草稿", "已发布", "", undefined].indexOf(state) == -1) {
      return res.send({
        code: 400,
        msg: "文章状态传递错误，请检查"
      });
    }
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
    // 计算跳过的页码
    const offset = (page - 1) * perpage;
    // 查询条件
    let where = {};
    if (state) {
      where["state"] = state;
    }
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
      ];
    }
    // 查询类型
    if (type) {
      where["categoryId"] = type;
    }
    where["isDelete"] = 0;
    // 增加
    try {
      // 分页查询
      let pageArticleRes = await Article.findAll({
        // 模糊查询
        where,
        // 按照时间的方式倒序排列
        order: [["id", "DESC"]],
        include: [
          {
            model: Category,
            required: true
          }
        ],
        // 分页
        limit: perpage,
        // 跳过页码
        offset
      });
      // 数据转换
      pageArticleRes = JSON.parse(JSON.stringify(pageArticleRes));
      // 处理分页数据
      pageArticleRes.forEach(v => {
        v.category = v.category.name;
        if (v.cover.indexOf("htps://") == -1) {
          v.cover = `${baseUrl}/${v.cover}`;
        }
        delete v.isDelete;
      });
      // 总页数
      let totalArticleRes = await Article.findAll({
        // 模糊查询
        where
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
