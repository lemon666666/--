import { Base } from '../../utils/base.js';

class Theme extends Base{
  
  constructor() {
    super();
  }


  //获取主题下的商品列表  id-对应主题id号
  getProductsData(id,callback){
    var params = {
      url: 'theme/' + id,
      sCallBack: function (res) {
        callback && callback(res);
      }
    }
    this.request(params);

  }
}


export {Theme};