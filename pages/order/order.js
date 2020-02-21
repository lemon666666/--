// pages/order/order.js
import {Cart} from '../cart/cart-model.js';
import {Address} from '../../utils/address.js';
import {Order} from './order-model.js';
const app = getApp();
var address = new Address();
var cart = new Cart();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // var productsArr;
    // //获取购物车总价格
    // this.data.account = options.account;
    // //得到购物车数量   +true 表示已经选中的商品
    // productsArr = cart.getCartDataFromLocal(true);

    // this.setData({
    //   productsArr : productsArr,
    //   account : options.account,
    //   orderStatus : 0   //订单状态0 未付款
    // });


    // /*显示收获地址*/
    // address.getAddressFromService((res) => {
    //   this._bindAddressInfo(res);
    // });
    //获取是购物车页面的from参数还是我的页面的参数
    var from = options.from;
    if( from == 'cart'){
      this._fromCart(options.account)
    }else{
      //获取我的页面中的商品的id
      var id = options.id;
      this._fromOrders(id)
    }

  },

  //缓存中的购物车数据
  _fromCart(account){
    var productsArr;
    //获取购物车总价格
    this.data.account = account;
    //得到购物车数量   +true 表示已经选中的商品
    productsArr = cart.getCartDataFromLocal(true);

    this.setData({
      productsArr : productsArr,
      account : account,
      orderStatus : 0   //订单状态0 未付款
    });

    /*显示收获地址*/
    address.getAddressFromService((res) => {
      this._bindAddressInfo(res);
    });
  },

//服务器中的订单信息
_fromOrders(id){
  if(id) {
    //生成订单号后刷新页面,
    //如果当前页面订单id存在
      //下单后，支付成功或者失败后，点击返回能够更新订单状态，所以放在onshow中
      order.getOrderInfoById(id, (data)=> {
        this.setData({
          orderStatus: data.status,
          productsArr: data.snap_items,
          account: data.total_price,
          basicInfo: {
            orderTime: data.create_time,
            orderNo: data.order_no
          }
        })
      });

      //快照地址
      var addressInfo = data.snap_address;
      addressInfo.totalDetail = address.setAddressInfo(addressInfo);
      this._bindAddressInfo(addressInfo)
    }
},
  //添加地址
  editAddress:function(){
    var that = this;
    wx.chooseAddress({
      success:function(res){
        console.log(res)
        var addressInfo = {
          name: res.userName,
          mobile: res.telNumber,
          totalDetail: address.setAddressInfo(res)
        };
        //绑定地址
        that._bindAddressInfo(addressInfo);

        //保存地址
        address.submitAddress(res, (flag) => {
          if (!flag) {
            that.showTips('操作提示', '地址信息更新失败！');
          }
        });
      }
    })
  },

  /*绑定地址信息*/
  _bindAddressInfo: function (addressInfo) {
    this.setData({
      addressInfo: addressInfo
    });
  },


  /*
       * 提示窗口
       * params:
       * title - {string}标题
       * content - {string}内容
       * flag - {bool}是否跳转到 "我的页面"
       */
  showTips: function (title, content, flag) {
    wx.showModal({
      title: title,
      content: content,
      showCancel: false,
      success: function (res) {
        if (flag) {
          wx.switchTab({
            url: '/pages/my/my'   //跳转到tarBar页面
          });
        }
      }
    });
  },
  //下单
  pay:function(){
    //如果地址不填
    if(!this.data.addressInfo){
      this.showTips('下单提示','请填写您的收货地址!');
      return ;
    }
    //订单状态为0,为第一次添加商品，第一次支付
    if(this.data.orderStatus==0){
        this._firstTimePay();
    }else{
        this._zaiCiTimePay();
    }
  },
  //第一次支付
    _firstTimePay:function(){
      //订单信息
      var orderInfo = [],
          productInfo = this.data.productsArr,  //商品信息
          order = new Order();
     for(let i = 0;i<productInfo.length;i++){
       orderInfo.push({
         product_id: productInfo[i].id,   //每个商品id
         count: productInfo[i].counts      //商品数量
       })
     }
      var that = this;
     //支付分两步，第一步是生成订单号，然后根据订单号支付
      order.doOrder(orderInfo,(data)=> {
        //订单生成成功
        if(data.pass){
          //更新订单状态  生成订单号
          var id = data.order_id;
          that.data.id = id;
      //    that.data.fromCartFlag = false;

          // 开始支付
          this._execPay(id);
        }else{
          //下单失败
          that._orderFail(data);
        }
      })

    },
    //再次支付
    _zaiCiTimePay:function() {

    },

    //开始支付
    _execPay: function(id) {
      order.execPay(id, (statusCode)=> {
        //当支付订单状态不等于0时，
        if(statusCode != 0) {
          //将生成订单号的商品从购物车删除
          this.deleteProducts();
          //判断flag为true 表明支付成功
          var flag = statusCode == 2;
          wx.navigateTo({
            url: '../pay-result/pay-result?id=' + id + '&flag=' + flag + '&from=order'
          });
        }
      })
    },
    //将生成订单号的商品从购物车删除
    deleteProducts: function() {

    },

    //下单失败
    _orderFail:function() {
      
    },
      /*
        * 提示窗口
        * params:
        * title - {string}标题
        * content - {string}内容
        * flag - {bool}是否跳转到 "我的页面"
        */
  showTips:function(title,content,flag){
    wx.showModal({
      title: title,
      content: content,
      showCancel: false,
      success:function(res){
        if(flag){
          wx.switchTab({
            url: '/pages/my/my',
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if(this.data.id){
      this._fromOrders(this.data.id)
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})