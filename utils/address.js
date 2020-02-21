import { Base } from 'base.js';
import { Config } from 'config.js';


class Address extends Base{
  constructor(){
    super();
  }

  /*
    *根据省市县信息组装地址信息
    * provinceName , province 前者为 微信选择控件返回结果，后者为查询地址时，自己服务器后台返回结果,拼接详细地址
    */

  setAddressInfo(res) {
    var province = res.provinceName || res.province,
      city = res.cityName || res.city,
      country = res.countyName || res.country,
      detail = res.detailInfo || res.detail;
      //获取详细地址
    var totalDetail = city + country + detail;
    console.log(res);

    //直辖市，取出省部分
    if (!this.isCenterCity(province)) {
      totalDetail = province + totalDetail;
    };

    return totalDetail;

  }


  /*是否为直辖市*/
  isCenterCity(name) {
    var centerCitys = ['北京市', '天津市', '上海市', '重庆市'],
      flag = centerCitys.indexOf(name) >= 0;   //bool
    return flag;
  }


  /*更新保存地址*/
  submitAddress(data, callback) {
    var data = this._setUpAddress(data);
    var param = {
      url: 'address',
      type: 'post',
      data: data,
      sCallback: function (res) {
        callback && callback(true, res);
      },
      eCallback(res) {
        callback && callback(false, res);
      }
    };
    this.request(param);
  }

  /*保存地址拼接数据*/
  _setUpAddress(res, callback) {
    var formData = {
      name: res.userName,
      province: res.provinceName,
      city: res.cityName,
      country: res.countyName,
      mobile: res.telNumber,
      detail: res.detailInfo
    };
    return formData;
  }

  //从服务器获取地址接口
  getAddressFromService(callback){
    var that = this;
    var params = {
      url : 'address',
      sCallBack:function(res){
        if(res){
          //设置地址
          res.totalDetail = that.setAddressInfo(res);
          //返回回调函数
          callback && callback(res);
        }
      }
    };
    this.request(params);
  }

}


export {Address};