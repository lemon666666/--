// pages/my/my.js
import {My} from 'my-model.js';
import {Address} from '../../utils/address.js'
import { Order } from '../order/order-model.js';
var my = new My();
var order = new Order();
var address = new Address();

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: 1,  //订单页面从1开始
    //订单上拉刷新追加数据 分页
    newOrders: [],
    isLoadingAll: false, //是否全部加载完毕
    auth: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //判断当前是否已经登录
    if(this.data.userInfo){
      //获取保存在服务器的地址信息
      this.getUserAddress(); 
    }
    //加载商品订单信息
    this._getOrders()
  },
  //加载订单商品信息
  _getOrders: function(callback){
    order.getOrders(this.data.index, (res)=> {
      var data = res.data;
      //判断每次加载的数据是否大于0，最后一次小于0，停止上拉刷新
      if(data.length > 0){
        //累加订单信息
        this.data.newOrders.concat(data)
        this.setData({
          orders: this.data.newOrders
        })
      }else{
        this.data.isLoadingAll = true;
      }
      callback && callback()
    })
  },
  //获取用户地址信息
  getUserAddress:function(){
    var that = this;
    address.getAddressFromService((addressInfo)=>{
      that._bindAddressInfo(addressInfo);
    })
  },

  //获取用户信息
  openSetting:function(e){
    this.setData({
      userInfo: e.detail.userInfo
    })
    //触发下拉刷新
    this.onPullDownRefresh()
  },

  //绑定地址信息
  _bindAddressInfo:function(addressInfo){
      this.setData({
        addressInfo: addressInfo
      })
      
  },
  //跳转到订单详情
  JumpOrderDetail:function(e){
    var id = my.getDataSet(e, 'id');
    wx.navigateTo({
      url: '../order/order?from=order&id=' + id
    });
  },

  //付款
  repay:function(e) {
    var id = order.getDataSet(e, 'id'),
        index = order.getDataSet(e, 'index');
        //根据id进行支付
      this._execPay(id, index)
  },

  _execPay: function(id, index) {
    var that = this;
    order.execPay(id, (statusCode)=> {
      //statusCode大于0   1 代表未付款 2 代表已付款
      if(statusCode > 0 ){
        var flag = statusCode == 2;
        //如果flag为真，更新订单状态
        if(flag){
          //设置data中newOrders状态数据
          that.data.newOrders[index].status = 2;
          //更新订单值
          that.setData({
            newOrders: that.data.newOrders
          })
        }

        wx.navigateTo({
          url: '../pay_result/pay_result?id=' + id + '&flag=' + flag + '&from=my'
        });
      }else {
          that.showTips('支付失败', '商品下架或库存不足')
      }
    })
  },

  showTips: function (title, content) {
    wx.showModal({
      title: title,
      content: content,
      showCancel: false
    });
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
    //有新下单的才刷新
    if(order.hasNewOrder) {
      this.refresh();
    }
    
  },

  //在购物车下单后点击我的页面刷新订单列表
  refresh: function() {
    var that = this;
    this.data.newOrders = [];
    this._getOrders(()=> {
      that.data.isLoadingAll = false; //是否全部加载完毕
      that.data.index = 1;
      order.execSetStorageSync(false)
    })
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
    //判断当前是否已经登录  登录获取服务器默认地址  
    if(this.data.userInfo){
      //获取保存在服务器的地址信息
      this.getUserAddress(); 
    }
    return;
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    //如果订单信息未加载完毕
    if(!this.data.isLoadingAll){
      //页数+1
      this.data.index++;
      //继续加载
      this._getOrders();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})