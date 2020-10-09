/* eslint-disable prefer-const */
'use strict';

// eslint-disable-next-line no-unused-vars
const Controller = require('egg').Controller;

class MainController extends Controller {

  async index() {
    this.ctx.body = 'admin apiiiiiiiii';
  }

  async checkLogin() {
    const userName = this.ctx.request.body.userName;
    const password = this.ctx.request.body.password;
    const sql = " SELECT userName FROM admin_user WHERE userName = '" + userName +
                  "' AND password = '" + password + "'";

    const res = await this.app.mysql.query(sql);
    if (res.length > 0) {
      // 登录成功,进行session缓存
      const openId = new Date().getTime();
      this.ctx.session.openId = { openId };
      this.ctx.session.user = {
        userName,
        password,
      };
      this.ctx.body = { data: '登录成功', openId };
    } else {
      this.ctx.body = { data: '登录失败' };
    }
  }

  // 后台文章分类信息
  async getTypeInfo() {
    const resType = await this.app.mysql.select('type');
    this.ctx.body = { data: resType };
  }
  // 添加文章
  async addArticle() {
    const tmpArticle = this.ctx.request.body;
    const result = await this.app.mysql.insert('article', tmpArticle);
    const insertSuccess = result.affectedRows === 1;
    const insertId = result.insertId;
    console.log(result);
    this.ctx.body = {
      isSuccess: insertSuccess,
      insertId,
    };
  }
  // 修改文章
  async updateArticle() {
    const tmpArticle = this.ctx.request.body;
    const result = await this.app.mysql.update('article', tmpArticle);
    const updateSuccess = result.affectedRows === 1;
    this.ctx.body = {
      isScuccess: updateSuccess,
    };
  }
  // 获得文章列表
  async getArticleList() {

    const sql = 'SELECT article.id as id,' +
              'article.title as title,' +
              'article.introduce as introduce,' +
              "FROM_UNIXTIME(article.addTime,'%Y-%m-%d' ) as addTime," +
              'type.typeName as typeName ' +
              'FROM article LEFT JOIN type ON article.type_id = type.Id ' +
              'ORDER BY article.id DESC ';

    const resList = await this.app.mysql.query(sql);
    this.ctx.body = { list: resList };

  }

  // 删除文章
  async delArticle() {
    // eslint-disable-next-line prefer-const
    let id = this.ctx.params.id;
    const res = await this.app.mysql.delete('article', { id });
    this.ctx.body = { data: res };
  }
  // 修改文章
  async getArticleById() {
    let id = this.ctx.params.id;

    let sql = 'SELECT article.id as id,' +
    'article.title as title,' +
    'article.introduce as introduce,' +
    'article.article_content as article_content,' +
    "FROM_UNIXTIME(article.addTime,'%Y-%m-%d' ) as addTime," +
    'article.view_count as view_count ,' +
    'type.typeName as typeName ,' +
    'type.id as typeId ' +
    'FROM article LEFT JOIN type ON article.type_id = type.Id ' +
    'WHERE article.id=' + id;
    const result = await this.app.mysql.query(sql);
    this.ctx.body = { data: result };
  }
}

module.exports = MainController;
