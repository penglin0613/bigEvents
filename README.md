## 基地址

本地基础地址为 http://localhost:8000/
网络基础地址为:https://autumnfish.cn/big/admin/

## 状态说明

| _状态码_ | _含义_                | _说明_                                              |
| -------- | --------------------- | --------------------------------------------------- |
| 200      | OK                    | 请求成功                                            |
| 201      | CREATED               | 创建成功                                            |
| 204      | DELETED               | 删除成功                                            |
| 400      | BAD REQUEST           | 请求的地址不存在或者包含不支持的参数                |
| 401      | UNAUTHORIZED          | 未授权                                              |
| 403      | FORBIDDEN             | 被禁止访问                                          |
| 404      | NOT FOUND             | 请求的资源不存在                                    |
| 422      | Unprocesable entity   | [POST/PUT/PATCH] 当创建一个对象时，发生一个验证错误 |
| 500      | INTERNAL SERVER ERROR | 内部错误                                            |

##

## 前台接口(未完成)

#### 1、文章搜索

请求地址：/search

请求方式：get

请求参数：

|  名称   |  类型  | 说明                                         |
| :-----: | :----: | -------------------------------------------- |
|   key   | string | 搜索关键词，可以为空，为空返回某类型所有文章 |
|  type   | string | 文章类型，可以为空，为空返回所有类型文章     |
|  page   | number | 当前页，为空返回第 1 页                      |
| perpage | number | 每页显示条数，为空默认每页 6 条              |

返回数据：

| 名称  |  类型  | 说明                                                                                                                                                                                                                                                                                                                                        |
| :---: | :----: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| pages | number | 总页数                                                                                                                                                                                                                                                                                                                                      |
| page  | number | 当前页                                                                                                                                                                                                                                                                                                                                      |
| data  | array  | 文章数据数组，其中每个成员包含字段：<br />id: number 类型，文章 id<br />title: string 类型，文章标题<br />intro: string 类型，文章文字内容截取<br />cover: string 类型，文章封面图片地址<br />type: string 类型，文章类型<br />read: number 类型，文章阅读次数<br />comment: number 类型，文章评论次数<br />date:string 类型， 文章发布时间 |

返回数据结构示例：

```json
{
    "pages":5,
    "page":2,
    "data":[
        {
            "id":1,
            "title":'文章标题文字...',
            "intro":'文章内容文字...',
            "cover":'dfgh/hijk/iui8989.jpg'
            ......
        },
        {
            "id":2,
            "title":'文章标题文字...',
            "intro":'文章内容文字...',
            "cover":'dfgh/hijk/iui8989.jpg'
            ......
        },
        {
            "id":3,
            "title":'文章标题文字...',
            "intro":'文章内容文字...',
            "cover":'dfgh/hijk/iui8989.jpg'
            ......
        }
        ......
    ]
}
```

#### 2、文章类型

请求地址：/category

请求方式：get

请求参数：无

返回数据：

| 名称 | 类型        | 说明     |
| ---- | ----------- | -------- |
| id   | number 类型 | 类别 id  |
| name | string 类型 | 类别名称 |

#### 3、热点图

请求地址：/hotpic

请求方式：get

请求参数：无

返回数据：（只返回 5 条）

| 名称   | 类型        | 说明            |
| ------ | ----------- | --------------- |
| id     | number 类型 | 图片对应文章 id |
| imgurl | string 类型 | 图片地址        |

#### 4、文章热门排行

请求地址：/rank

请求方式：get

请求参数：无

返回数据：（只返回 7 条）

| 名称  | 类型        | 说明     |
| ----- | ----------- | -------- |
| id    | number 类型 | 文章 id  |
| title | string      | 文章标题 |

#### 5、最新资讯

请求地址：/latest

请求方式：get

请求参数：无

返回数据：（只返回 5 条）

| 名称    | 类型        | 说明             |
| ------- | ----------- | ---------------- |
| id      | number 类型 | 文章 id          |
| title   | string 类型 | 文章标题         |
| intro   | string 类型 | 文章文字内容截取 |
| cover   | string 类型 | 文章封面图片地址 |
| type    | string 类型 | 文章类型         |
| read    | number 类型 | 文章阅读次数     |
| comment | number 类型 | 评论条数         |
| date    | string 类型 | 文章发布时间     |

#### 6、最新评论

请求地址：/latest_comment

请求方式：get

请求参数：无

返回数据：（只返回 6 条）

|   名称    |  类型  | 说明         |
| :-------: | :----: | ------------ |
| user_name | string | 用户名称     |
|   date    | string | 评论时间     |
|   intro   | string | 评论内容截取 |

#### 7、焦点关注 ？

#### 8、文章详细内容

请求地址：/artitle

请求方式：get

请求参数：

| 名称 | 类型   | 说明    |
| ---- | ------ | ------- |
| id   | string | 文章 id |

返回数据：

| 名称    | 类型   | 说明                                                              |
| ------- | ------ | ----------------------------------------------------------------- |
| title   | string | 文章标题                                                          |
| author  | string | 文章作者                                                          |
| type    | string | 文章类型                                                          |
| date    | string | 文章发布时间                                                      |
| read    | number | 阅读次数                                                          |
| comment | number | 评论条数                                                          |
| content | string | 文章内容                                                          |
| prev    | array  | 上一篇文章<br />id： 上一篇文章的 id<br />title：上一篇文章的标题 |
| next    | array  | 下一篇文章<br />id： 下一篇文章的 id<br />title：下一篇文章的标题 |

#### 9、发表评论

请求地址：/post_comment

请求方式：post

请求参数：

| 名称      | 类型   | 说明     |
| --------- | ------ | -------- |
| user_name | string | 用户名称 |
| content   | string | 评论内容 |

返回数据：‘发表成功’ ‘发表失败’

#### 10、评论列表

请求地址：/get_comment

请求方式：get

请求参数：

| 名称 | 类型   | 说明    |
| ---- | ------ | ------- |
| id   | string | 文章 id |

返回数据：

|   名称    |  类型  | 说明         |
| :-------: | :----: | ------------ |
| user_name | string | 用户名称     |
|   date    | string | 评论时间     |
|  content  | string | 评论完整内容 |

## 后台接口

#### 1、用户登录

请求地址：http://localhost:8000/admin/login
网络地址: https://autumnfish.cn/big/admin/login

请求方式：post

请求参数：

| 名称      | 类型   | 说明            |
| --------- | ------ | --------------- |
| user_name | string | 用户名（admin） |
| password  | string | 密码(123456)    |

返回数据：

| 名称 |  类型  | 说明                                   |
| :--: | :----: | -------------------------------------- |
| msg  | string | 文字信息 ‘登录成功’ ‘用户名或密码出错’ |

#### 2、退出登录

请求地址：http://localhost:8000/admin/logout
网络地址: https://autumnfish.cn/big/admin/logout

请求方式：post

请求参数：无

返回数据：无

#### 3、获取用户信息

请求地址：http://localhost:8000/admin/getuser
网络地址: https://autumnfish.cn/big/admin/getuser

请求方式：get

请求参数：

返回数据：

|   名称   |  类型  | 说明         |
| :------: | :----: | ------------ |
| nickname | string | 用户昵称     |
| user_pic | string | 用户图片地址 |

#### 4、文章数量统计

请求地址：http://localhost:8000/admin/article_count
网络地址: https://autumnfish.cn/big/admin/article_count

请求方式：get

请求参数：

返回数据：

|   名称    |  类型  | 说明                 |
| :-------: | :----: | -------------------- |
| all_count | number | 文章总数             |
| day_count | number | 当天文章发布文章总数 |

#### 5、评论数量统计

请求地址：http://localhost:8000/admin/comment_count
网络地址: https://autumnfish.cn/big/admin/comment_count

请求方式：get

请求参数：

返回数据：

|   名称    |  类型  | 说明             |
| :-------: | :----: | ---------------- |
| all_count | number | 评论总数         |
| day_count | number | 当天发布评论总数 |

#### 6、月新增文章数

请求地址：http://localhost:8000/admin/month_article_count
网络地址: https://autumnfish.cn/big/admin/month_article_count

请求方式：get

请求参数：

返回数据：（返回 30 条）

|   名称    |  类型  | 说明           |
| :-------: | :----: | -------------- |
|    day    | string | 日期           |
| day_count | number | 当天新增文章数 |

返回数据结构示例：

```json
[
    {
        "day":"2019-04-18",
        "day_count":135
    },
    {
        "day":"2019-04-19",
        "day_count":145
    },
    {
        "day":"2019-04-20",
        "day_count":168
    },
	{
        "day":"2019-04-21",
        "day_count":110
    },
	{
        "day":"2019-04-22",
        "day_count":147
    }
    ......
]
```

#### 7、各类型文章数量统计

请求地址：http://localhost:8000/admin/article_category_count
网络地址: https://autumnfish.cn/big/admin/article_category_count

请求方式：get

请求参数：

返回数据：（有多少类型，就返回多少条）

|   名称    |  类型  | 说明           |
| :-------: | :----: | -------------- |
|   type    | string | 文章类型       |
| all_count | number | 该类型文章总数 |

#### 8、月文章访问量

请求地址：http://localhost:8000/admin/article_category_visit
网络地址: https://autumnfish.cn/big/admin/article_category_visit

请求方式：post

请求参数：

返回数据：（返回最近 6 各月的，也就是 6 条）

|   名称    |  类型  | 说明                                                                                    |
| :-------: | :----: | --------------------------------------------------------------------------------------- |
|   month   | string | 月份                                                                                    |
| all_count | array  | 该月份各类型文章访问量<br />type：string，文章类型<br />count：number，该类型文章访问量 |

返回数据结构示例：

```json
[
    {
        "month":'1月',
        "all_count":[
            {
             "type":"科技",
             "count":237
            },
            {
             "type":"经济",
             "count":237
            },
            {
             "type":"股市",
             "count":237
            },
    		{
             "type":"商品",
             "count":237
            },
            {
             "type":"外汇",
             "count":237
            }
        ]
    },
    {
        "month":'2月',
        "all_count":[
            {
             "type":"科技",
             "count":237
            },
            {
             "type":"经济",
             "count":237
            },
            {
             "type":"股市",
             "count":237
            },
    		{
             "type":"商品",
             "count":237
            },
            {
             "type":"外汇",
             "count":237
            }
        ]
    },
    {
        "month":'三月',
        "all_count":[
            {
             "type":"科技",
             "count":237
            },
            {
             "type":"经济",
             "count":237
            },
            {
             "type":"股市",
             "count":237
            },
    		{
             "type":"商品",
             "count":237
            },
            {
             "type":"外汇",
             "count":237
            }
        ]
    }
    ......

]
```

#### 9、文章搜索

请求地址：http://localhost:8000/admin/search
网络地址: https://autumnfish.cn/big/admin/search

请求方式：get

请求参数：

|  名称   |  类型  | 说明                                         |
| :-----: | :----: | -------------------------------------------- |
|   key   | string | 搜索关键词，可以为空，为空返回某类型所有文章 |
|  type   | string | 文章类型，可以为空，为空返回所有类型文章     |
|  state  | string | 文章状态，草稿或者已发布                     |
|  page   | number | 当前页，为空返回第 1 页                      |
| perpage | number | 每页显示条数，为空默认每页 6 条              |
|   id    | number | 文章 id，根据 id 查询时，其余参数可以不选择  |

返回数据：

| 名称  |  类型  | 说明                                                                                                                                                                                                                                                                                                                                                                         |
| :---: | :----: | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| pages | number | 总页数                                                                                                                                                                                                                                                                                                                                                                       |
| page  | number | 当前页                                                                                                                                                                                                                                                                                                                                                                       |
| data  | array  | 文章数据数组，其中每个成员包含字段：<br />id: number 类型，文章 id<br />title: string 类型，文章标题<br />intro: string 类型，文章文字内容截取<br />cover: string 类型，文章封面图片地址<br />type: string 类型，文章类型<br />read: number 类型，文章阅读次数<br />comment: number 类型，文章评论次数<br />date:string 类型， 文章发布时间<br />state:string 类型，文章状态 |

#### 10、发布文章

请求地址：http://localhost:8000/admin/article_publish
网络地址: https://autumnfish.cn/big/admin/article_publish

请求方式：post

请求参数：formData

| 名称    | 类型   | 说明                   |
| ------- | ------ | ---------------------- |
| title   | string | 文章标题               |
| cover   | file   | 文章封面图片           |
| type    | number | 文章类型 id            |
| date    | string | 日期                   |
| content | string | 文章内容               |
| state   | string | 文章状态(草稿或已发布) |

返回数据：

| 名称 |  类型  | 说明                           |
| :--: | :----: | ------------------------------ |
| msg  | string | 文字信息 ‘发布成功’ ‘发布失败’ |

#### 11、文章编辑

请求地址：http://localhost:8000/admin/article_edit
网络地址: https://autumnfish.cn/big/admin/article_edit

请求方式：post

请求参数：

| 名称    | 类型   | 说明         |
| ------- | ------ | ------------ |
| id      | number | 文章 id      |
| title   | string | 文章标题     |
| cover   | file   | 文章封面图片 |
| type    | number | 文章类型 id  |
| date    | string | 日期         |
| content | string | 文章内容     |

返回数据：

| 名称 |  类型  | 说明                           |
| :--: | :----: | ------------------------------ |
| msg  | string | 文字信息 ‘修改成功’ ‘修改失败’ |

#### 12、删除文章

请求地址：http://localhost:8000/admin/article_delete
网络地址: https://autumnfish.cn/big/admin/article_delete

请求方式：get

请求参数：

| 名称 | 类型   | 说明    |
| ---- | ------ | ------- |
| id   | number | 文章 id |

返回数据：

| 名称 |  类型  | 说明                           |
| :--: | :----: | ------------------------------ |
| msg  | string | 文字信息 ‘删除成功’ ‘删除失败’ |

#### 13、文章类别搜索

请求地址：http://localhost:8000/admin/category_search
网络地址: https://autumnfish.cn/big/admin/category_search

请求方式：get

请求参数：无

返回数据：

| 名称 |  类型  | 说明     |
| :--: | :----: | -------- |
|  id  | number | 类别     |
| name | string | 类别名称 |
| slug | string | 别名     |

#### 14、新增文章类别

请求地址：http://localhost:8000/admin/category_add
网络地址: https://autumnfish.cn/big/admin/category_add

请求方式：post

请求参数：

| 名称 | 类型   | 说明     |
| ---- | ------ | -------- |
| name | string | 类别名称 |
| slug | string | 别名     |

返回数据：

| 名称 |  类型  | 说明                           |
| :--: | :----: | ------------------------------ |
| msg  | string | 文字信息 ‘增加成功’ ‘增加失败’ |

#### 15、编辑文章类别

请求地址：http://localhost:8000/admin/category_edit
网络地址: https://autumnfish.cn/big/admin/category_edit

请求方式：post

请求参数：

| 名称 | 类型   | 说明     |
| ---- | ------ | -------- |
| id   | number | 文章 id  |
| name | string | 类别名称 |
| slug | string | 别名     |

返回数据：

| 名称 |  类型  | 说明                           |
| :--: | :----: | ------------------------------ |
| msg  | string | 文字信息 ‘编辑成功’ ‘编辑失败’ |

#### 16、删除文章类别

请求地址：http://localhost:8000/admin/category_delete
网络地址: https://autumnfish.cn/big/admin/category_delete

请求方式：post

请求参数：

| 名称 | 类型   | 说明    |
| ---- | ------ | ------- |
| id   | number | 类别 id |

返回数据：

| 名称 |  类型  | 说明                           |
| :--: | :----: | ------------------------------ |
| msg  | string | 文字信息 ‘删除成功’ ‘删除失败’ |

#### 17、文章评论搜索

请求地址：http://localhost:8000/admin/comment_search
网络地址: https://autumnfish.cn/big/admin/comment_search

请求方式：get

请求参数：

|  名称   |  类型  | 说明                            |
| :-----: | :----: | ------------------------------- |
|  page   | number | 当前页，为空返回第 1 页         |
| perpage | number | 每页显示条数，为空默认每页 6 条 |

返回数据：

|  名称   |  类型  | 说明                     |
| :-----: | :----: | ------------------------ |
|   id    | number | 评论 id                  |
| author  | string | 评论作者                 |
| content | string | 评论内容                 |
|   aid   | number | 对应文章 id              |
|  title  | string | 对应文章标题             |
|  date   | string | 评论发表时间             |
|  state  | string | 评论状态 ‘批准’ ‘待审核’ |

#### 18、评论审核通过

请求地址：http://localhost:8000/admin/comment_pass
网络地址: https://autumnfish.cn/big/admin/comment_pass

请求方式：post

请求参数：

| 名称 | 类型   | 说明    |
| ---- | ------ | ------- |
| id   | number | 评论 id |

返回数据：

| 名称 |  类型  | 说明                           |
| :--: | :----: | ------------------------------ |
| msg  | string | 文字信息 ‘设置成功’ ‘设置失败’ |

#### 19、评论审核不通过

请求地址：http://localhost:8000/admin/comment_reject
网络地址: https://autumnfish.cn/big/admin/comment_reject

请求方式：post

请求参数：

| 名称 | 类型   | 说明    |
| ---- | ------ | ------- |
| id   | number | 评论 id |

返回数据：

| 名称 |  类型  | 说明                           |
| :--: | :----: | ------------------------------ |
| msg  | string | 文字信息 ‘设置成功’ ‘设置失败’ |

#### 20、删除评论

请求地址：http://localhost:8000/admin/comment_delete
网络地址: https://autumnfish.cn/big/admin/comment_delete

请求方式：post

请求参数：

| 名称 | 类型   | 说明    |
| ---- | ------ | ------- |
| id   | number | 评论 id |

返回数据：

| 名称 |  类型  | 说明                           |
| :--: | :----: | ------------------------------ |
| msg  | string | 文字信息 ‘删除成功’ ‘删除失败’ |

#### 21、获取用户信息

请求地址：http://localhost:8000/admin/userinfo_get
网络地址: https://autumnfish.cn/big/admin/userinfo_get

请求方式：get

请求参数：无

返回数据：

|   名称   |  类型  | 说明         |
| :------: | :----: | ------------ |
| username | string | 用户名称     |
| nickname | string | 用户昵称     |
|  email   | string | 用户邮箱     |
| user_pic | string | 用户图片地址 |
| password | string | 用户密码     |

#### 22、编辑用户信息

请求地址：http://localhost:8000/admin/userinfo_edit
网络地址: https://autumnfish.cn/big/admin/userinfo_edit

请求方式：post

请求参数：使用 formdata 提交

|   名称   |  类型  | 说明         |
| :------: | :----: | ------------ |
| username | string | 用户名称     |
| nickname | string | 用户昵称     |
|  email   | string | 用户邮箱     |
| user_pic | string | 用户图片地址 |
| password | string | 用户密码     |

返回数据：

| 名称 |  类型  | 说明                           |
| :--: | :----: | ------------------------------ |
| msg  | string | 文字信息 ‘修改成功’ ‘修改失败’ |
