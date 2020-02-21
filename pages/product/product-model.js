import { Base } from '../../utils/base.js';

class Product extends Base{

  constructor(){
    super();
  }

  //获取商品详情信息
  getProductDetail(id,callback){
    var params = {
      url : 'product/' + id,
      sCallBack : function(res){
        callback && callback(res);
      }
    }
    this.request(params);
  }
}


export {Product};