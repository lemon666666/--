// pages/category/category.js
import {Category} from 'category-model.js';

var category = new Category();

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    transClassArr: ['tanslate0', 'tanslate1', 'tanslate2', 'tanslate3', 'tanslate4', 'tanslate5'],
    currentIndex:0,
    loadingHidden: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this._loadData();
  },

  
  _loadData(){
    var that = this;
    //获取分类数据
    category.getCategoryAll((res)=>{
    //  console.log(res);
      that.setData({
        categoryAll : res,
        loadingHidden: true
      })

      //获取分类中第一条默认加载   获取头部图片和分类名称和产品
      that.getProductsByCategory(res[0].id, (data) => {
       // console.log(data);
        var obj = {
          data : data,
          headImg : res[0].img.url,
          name : res[0].name
        }
        that.setData({
          loadingHidden: true,
         categoryInfo0 : obj
       })
      })
    
    })
  },
  /*切换分类*/
  changeCategory(e){
    //  console.log(e)
    //获取data- 属性值
    var index = category.getDataSet(e,'index'),
        id = category.getDataSet(e,'id');
        this.setData({
          currentIndex : index
        });
      //如果数据是第一次请求
      if(!this.isLoadedData(index)){
        var that = this;
        this.getProductsByCategory(id,(res)=>{
          that.setData(that.getOtherProductByCategory(index,res));
        })
      }
   
  },

  //查看左侧是否被点击
  isLoadedData: function (index) {
    var that = this;
    if (this.data['categoryInfo' + index]) {
      return true;
    }
     return false;
  },

  //获取分类id商品
  getProductsByCategory: function (id, callback) {
    category.getCategoryById(id, (data) => {
      callback && callback(data);
    });
  },
//得到其他分类id商品
  getOtherProductByCategory:function(index,res){
    var obj = {},
        arr = [0,1,2,3,4,5],
      baseData = this.data.categoryAll[index];
      for(var item in arr){
        if(item == arr[index]){
          obj['categoryInfo' + item] = {
            data: res,
            headImg: baseData.img.url,
            name: baseData.name
          }
          return obj;
        }
      }
  },

 
  /*跳转到商品详情*/
  onProductsItemTap: function (event) {
    var id = category.getDataSet(event, 'id');
    wx.navigateTo({
      url: '../product/product?id=' + id
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