import {Product} from 'product-model.js';
import {Cart} from '../cart/cart-model.js';
var product = new Product();
var cart = new Cart();
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
      productCount : 1,
      countsArr : [1,2,3,4,5,6,7,8,9,10],
      currentIndex:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id;
    this.data.id = id;
    this._loadData();
  },


  _loadData:function(){
      //获取商品详情信息
    product.getProductDetail(this.data.id, (res)=>{
    //  console.log(res);
      this.setData({
        cartTotalCounts: cart.getCartTotalCounts(),
        product : res
      })
    })
  },

  //获取弹出器数据
  bindPickerChange:function(e){
   //   console.log(e)
   var index = e.detail.value;
   var selectCount = this.data.countsArr[index];
   this.setData({
     productCount : selectCount
   })
  },


  //点击商品列一行
  onTabsItemTap:function(e){
   // console.log(e)
    var index = product.getDataSet(e,'index');
    this.setData({
      currentIndex : index
    })
  },


  //添加购物车
  onAddToCartTap:function(){
    this.addToCart();
  //  var realCounts = this.data.productCount + this.data.cartTotalCounts;
    this.setData({
      cartTotalCounts : cart.getCartTotalCounts(true)
    })
  },

  addToCart(){
    var tempObj = {};
    //获取商品详情指定内容，不需要全部
    var keys = [ 'id', 'name', 'main_img_url', 'price'];
    for(var key in this.data.product){
      if(keys.indexOf(key) >= 0){
        tempObj[key] = this.data.product[key];
      }
    }
    //添加到购物车  商品和数量
    cart.add(tempObj, this.data.productCount);
  },


  /*跳转到购物车*/
  onCartTap: function () {
    wx.switchTab({
      url: '/pages/cart/cart'
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