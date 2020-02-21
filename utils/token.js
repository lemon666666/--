import {Config} from 'config.js';


class Token {
  constructor(){
     this.tokenUrl = Config.baseRequestUrl + 'token/user';    //获取登录用户token
     this.verifyTokenUrl = Config.baseRequestUrl + 'token/verify';   //确认token是否存在
  } 


  //验证token是否过期
  verify(){
    //取得缓存中的token
    var token = wx.getStorageSync('token');
    //如果token不存在则请求服务器获取token，反之检验token是否过期
    if(!token){
      this.getTokenFromService();
    }else{
      this._VerifyTokenFromService(token);
    }
  }


  //请求服务器获取token
  getTokenFromService(callback) {
    var that = this;
    wx.login({
      success:function(res){
        var code = res.code;   //作为参数传递给后台
        if(code){
          wx.request({
            url: that.tokenUrl,
            method: 'POST',
            data: {
              code : code
            },
            success:function(res){
              //保存token到缓存中
              var token = wx.setStorageSync('token', res.data.token);
              callback && callback(res.data.token);
            }
          })
        }
      }
    })
  }

  //token过期或者失效
  _VerifyTokenFromService(token){
    var that = this;
      wx.request({
        url: that.verifyTokenUrl,
        method: 'POST',
        data:{
          token: token
        },
        success:function(res){
          //检验token返回结果 bool  
          var valid = res.data.isValid;
          //如果token不为true  则重新从服务器获取token
          if(!valid){
            this.getTokenFromService();
          }
        }
      })
  }



}

export {Token};