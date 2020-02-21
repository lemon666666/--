//app.js
import {Token} from '/utils/token.js';
App({
  
  //小程序打开时执行检验token令牌是否过期或者失效，如果是则请求新的token令牌
  onLaunch:function(){
    var token = new Token();
    token.verify();

  }
   
})