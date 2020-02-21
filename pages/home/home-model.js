import {Base} from '../../utils/base.js';

class Home extends Base{

  constructor(){
      super();
  }

  //获取首页数据   callBack回调return res
  getBannerData(id, callback){
    var params = {
      url : 'banner/' + id,
      sCallBack : function(res){
        callback && callback(res.items);
      }
    }
    this.request(params);
  //  wx.request({
  //    url: 'http://z.cn:8080/api/v1/banner/'+id,
  //   method: 'GET',
  //    success: function(res){
  //     //  console.log(res)
  //      callBack(res);
  //    }
  //  })
  }

  //获取主题数据
  getThemeData(callback){
    var params = {
      url: 'theme?ids=1,2,3',
      sCallBack: function (res) {
        callback && callback(res);
      }
    }
    this.request(params);
  }

//获取最近新品
getProductsRecent(callback){
  var params = {
    url: 'product/recent',
    sCallBack: function (res) {
      callback && callback(res);
    }
  }
  this.request(params);
}


}

export {Home};