import {Theme} from 'theme-model.js';

var theme = new Theme();

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },
  //主题页跳转到详情页
  onProductItemTap:function(e){
    console.log(e)
    var id = theme.getDataSet(e, 'id');
    wx.navigateTo({
      url: '../product/product?id=' + id + '&from=themeItem'
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id;
    var name = options.name;
    this.data.id = id;
    this.data.name = name;
    this._loadData();
  },

  _loadData:function(){
    //获取主题商品信息
    theme.getProductsData(this.data.id,(res)=>{
    //  console.log(res)
      this.setData({
        'themeInfo' : res
      })
    })
  },



  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.setNavigationBarTitle({
      title: this.data.name,
    })
  },
 
})