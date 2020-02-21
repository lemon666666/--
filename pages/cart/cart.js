// pages/cart/cart.js
import {Cart} from 'cart-model.js';
const app = getApp();
var cart = new Cart();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectedCounts: 0, //总的商品数
    selectedTypeCounts: 0, //总的商品类型数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
    //获取购物车商品
    var cartData = cart.getCartDataFromLocal();
  //  var countsInfo = cart.getCartTotalCounts(true);
    //获取总价格，总数量
    var cal = this._OrderTotalAccountAndCounts(cartData);
    this.setData({
      selectedCounts : cal.selectedCounts,  //选中的商品数量
      cartData : cartData,    //购物车商品
      account: cal.account,     //总价格
      selectedTypeCounts: cal.selectedTypeCounts   //类型
    })
    
  },



  //订单总金额
  _OrderTotalAccountAndCounts : function(data){
    var len = data.length,   //取到购物车长度
      account = 0,            //总价格排除掉未选中的商品
      selectedCounts = 0,    //选择的商品总数
      selectedTypeCounts = 0;  //选择的商品类型   全选
    let multiple = 100;
    for(let i=0;i<len;i++){
      //遍历购物车商品数量,如果当前购物车商品中状态为true
      if(data[i].selectStatus){
        //避免 0.05 + 0.01 = 0.060 000 000 000 000 005 的问题，乘以 100 *100
        account += data[i].counts * multiple * Number(data[i].price) * multiple;
        selectedCounts += data[i].counts;   //选中的商品总数
        selectedTypeCounts++;             //选中的商品类型
      }
    }
    return {
      selectedCounts: selectedCounts,
      selectedTypeCounts: selectedTypeCounts,
      account: account / (multiple * multiple)
    }
  },



  /*更新购物车商品数据*/
  _resetCartData: function () {
    var newData = this._OrderTotalAccountAndCounts(this.data.cartData); /*重新计算总金额和商品总数*/
    this.setData({
      account: newData.account,
      selectedCounts: newData.selectedCounts,
      selectedTypeCounts: newData.selectedTypeCounts,
      cartData: this.data.cartData
    });
  },

  //点击单选框
  /*选择商品*/
  toggleSelect:function(e){
    // console.log(e);
     var id = cart.getDataSet(e, 'id'),
       status = cart.getDataSet(e, 'status'),
       index = this._getProductIndexById(id);
       //得到该下标下的商品信息
     this.data.cartData[index].selectStatus = !status;
     this._resetCartData();
   },

  /*全选*/
  toggleSelectAll: function (e) {
    var status = cart.getDataSet(e, 'status') == 'true';
    var data = this.data.cartData,
      len = data.length;
      console.log(status)
    for (let i = 0; i < len; i++) {
      data[i].selectStatus = !status;
    }
    this._resetCartData();
  },

  /*根据商品id得到 商品所在下标*/
  _getProductIndexById: function (id) {
    var data = this.data.cartData,
      len = data.length;
    for (let i = 0; i < len; i++) {
      if (data[i].id == id) {
        return i;
      }
    }
  },

  /*调整商品数目*/
  changeCounts: function (e) {
    var id = cart.getDataSet(e, 'id'),
      type = cart.getDataSet(e, 'type'), //是加还是减
      index = this._getProductIndexById(id), //得到商品下标
      counts = 1;                           //最小数量
    if (type == 'add') {
      cart.addCounts(id);
    } else {
      counts = -1;    //数量减1
      cart.cutCounts(id);
    }
    //更新商品页面   缓存数据已经加或减，我们需要对购物车页面的数据进行更新
    this.data.cartData[index].counts += counts;
    this._resetCartData();
  },

  /*UI页面中删除商品*/
  delete: function (event) {
    var id = cart.getDataSet(event, 'id'),
      index = this._getProductIndexById(id);
    this.data.cartData.splice(index, 1);//删除某一项商品

    this._resetCartData();
    //this.toggleSelectAll();

    cart.delete(id);  //缓存中删除该商品
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    /*离开页面时，更新本地缓存*/
    cart.execSetStorageSync(this.data.cartData);
  },
  /*提交订单*/
  submitOrder: function () {
    wx.navigateTo({
      url: '../order/order?account=' + this.data.account + '&from=cart'
    });
  },

  /*查看商品详情*/
  onProductsItemTap: function (e) {
    var id = cart.getDataSet(e, 'id');
    wx.navigateTo({
      url: '../product/product?id=' + id
    })
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