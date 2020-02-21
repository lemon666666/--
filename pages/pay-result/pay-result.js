// pages/pay-result/pay-result.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //代表是否支付成功标识
    var flag = options.flag;
    var id = options.id;
    var from = options.from;
    this.setData({
      payResult: flag,
      id,
      from
    })
  },
  //查看订单
  viewOrder: function() {
    wx.navigateBack({
      delta: 1
    });
  }
})