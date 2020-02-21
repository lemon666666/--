
import {Home} from 'home-model.js'; 

var home = new Home();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 500,
    circular: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     this._loadData();
  },

  //获取头部数据
  _loadData:function(){
    var id = 1;
    home.getBannerData(id,(res)=>{
       console.log(res);
  //数据绑定
    this.setData({
      'bannerArr' : res
    })    
    });
  //获取主题数据
    home.getThemeData((res)=>{
      console.log(res);
      //数据绑定
      this.setData({
        'themeArr': res
      })    
    })
  //获取最近新品
    home.getProductsRecent((res)=>{
    console.log(res);
    //数据绑定
    this.setData({
      'productsArr': res
    })    
  })


  },

  //点击商品跳转
  onProductItemTap : function(e){
  //  console.log(e);
    var id = home.getDataSet(e,'id');
    wx.navigateTo({
      url: '../product/product?id=' + id,
    })
  },

  //点击主题跳转
  onThemeItemTap: function (e) {
   // console.log(e);
    var id = home.getDataSet(e, 'id');
    var name = home.getDataSet(e,'name');
    wx.navigateTo({
      url: '../theme/theme?id=' + id + '&name=' + name,
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