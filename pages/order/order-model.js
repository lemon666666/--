import {Base} from '../../utils/base.js';

class Order extends Base{
  constructor(){
    super();
    this._storageKeyName = 'newOrder';
  }

//下订单
  doOrder(param,callback){
    var that = this;
    var allParams = {
      url: 'order',
      type: 'post',
      data: {
        products : param
      },
      sCallback: function(data){
        //将购物车状态设置为true，防止下单进入我的页面重复请求更新订单
        that.execSetStorageSync(true);
        callback && callback(data);
      },
      eCallback: function(){

      }
    };
    this.request(allParams);
  }

  //开始支付  参数 订单id
  execPay(id, callback) {
    var params = {
      url: 'pay/pre_order',
      type: 'post',
      data: {
        id: id
      },
      sCallBack: function(data) {
        //当前时间戳
        var timeStamp = data.timeStamp;
        if(timeStamp) {
          wx.requestPayment({
            'timeStamp': timeStamp.toString(),
            'nonceStr': data.nonceStr,
            'package': data.package,
            'signType': data.signType,
            'paySign': data.paySign,
            success: (res)=>{
              callback && callback(2)
            },
            fail: ()=>{
              callback && callback(1)
            }
          });
        }else {
          callback && callback(0)
        }
      }
    }
    //发起请求
    this.request(params)
  }
  //生成订单号后刷新页面,
  getOrderInfoById(id, callback) {
    var params = {
      url: 'order/' + id,
      sCallBack: function(data){
        callback && callback(data)
      },
      eCallBack: function(){}
    }

    this.request(params)
  }

  /*本地缓存 保存／更新 将购物车设置为false*/
  execSetStorageSync(data){
    wx.setStorageSync(this._storageKeyName, data)
  }


  //获取所有订单 index从1开始
  getOrders(index, callback){
    var params = {
      url: 'order/by_user',
      data: {
        page: index
      },
      sCallBack: function(res){
        callback&&callback(res)
      }
    }
    this.request(params)
  }

  //我的页面订单刷新  （有新订单才刷新）
  hasNewOrder() {
    var flag = wx.getStorageSync(this._storageKeyName);  //购物车值缓存默认为false
    return flag == true;
  }

}

export {Order};