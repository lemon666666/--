import {Config} from './config.js';
import {Token} from 'token.js';
class Base{

  constructor(){
      //基础路径
      this.baseRequestUrl = Config.baseRequestUrl;
  }

  //http 请求类, 当noRefech为true时，不重复发送请求, noRefetch 默认为false
  request(params, noRefetch){
    var that = this;
    //路由
    var url = this.baseRequestUrl + params.url;
    //如果请求类型默认为get
    if(!params.type){
      params.type = 'GET';
    }
   wx.request({
     url: url,
     data: params.data,
     method: params.type, 
     header: {
       'Content-Type': 'application/json',
       'token': wx.getStorageSync('token')   //客户端头部携带token  
     },
     success: function (res) {
        //console.log(res);
        //获取HTTP返回的状态码,如果是以2开头的则成功   授权验证
        var code = res.statusCode.toString();
        var startChar = code.charAt(0); //截取第一位数字
       if (startChar == '2'){
          params.sCallBack && params.sCallBack(res.data);
        }else{
          if(code = '401'){
            //只重发一次，防止重发
            if(!noRefetch){
              that._refetch(params);
            }
          }
        }
          params.eCallBack && params.eCallBack(res.data);
      },
     fail: function (err) { 
        console.log(err)
     },
   })

  }

  //点击页面数据重新请求token和初次进入请求token不一样，这次是隐藏的
  _refetch(params){
    var token = new Token();
    //请求token，并且请求token成功后再次请求其他请求
    token.getTokenFromService((token)=>{
      this.request(params, true);   
    })
  }

  //获取元素上绑定的值
  getDataSet(event, key){
    return event.currentTarget.dataset[key];
  }


}


export {Base};