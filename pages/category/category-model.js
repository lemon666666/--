import { Base } from '../../utils/base.js';

class Category extends Base{
  constructor(){
    super();
  }

  //获取商品分类
  getCategoryAll(callback){
    var param = {
      url : 'category/all',
      sCallBack:function(res){
        callback && callback(res);
      }
    }
    this.request(param);
  }

  //根据分类id查询商品信息
  getCategoryById(id,callback){
    var param = {
      url: 'product/CategoryId?id=' + id,
      sCallBack: function (res) {
        callback && callback(res);
      }
    }
    this.request(param);
  }
}

export {Category}