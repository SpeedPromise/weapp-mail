// pages/shopping_cart/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsList: {
      list: [],
      allSelected: true,
      noSelected: false,
      totalPrice: 0.00,
      offer: 0.00,
    },
    delBtnWidth: 120,
  },

  getWidth: function(w){
    var width = 0;
    try {
      // 以750px设计标准自适应屏幕
      var res = wx.getSystemInfoSync().windowWidth;
      var scale = (750 / 2) / (w / 2);
      width = Math.floor(res / scale)
      return width
    } catch (e) {
      return false
    }
  },
  initWidth: function(){
    var delBtnWidth = this.getWidth(this.data.delBtnWidth)
    this.setData({
      delBtnWidth: delBtnWidth
    })
  },

  onLoad: function (options) {
    this.initWidth()
    
  },

  onShow: function () {
    var shopList = []
    var shopCartInfo = wx.getStorageSync('shopCartInfo')
    if (shopCartInfo && shopCartInfo.shopList){
      shopList = shopCartInfo.shopList
    }
    this.data.goodsList.list = shopList;
    this.setGoodsList(shopList);
  },


  jumpIndex: function(){
    wx.switchTab({
      url: '/pages/index/index',
    })
  },

  setGoodsList: function(list){
    this.setData({
      goodsList: {
        list: list
      }
    })
  },

  numSubTap: function(){

  },
  numAddTap: function(){

  },

  bindAllSelected: function(){
    let allSelected = this.data.goodsList.allSelected ? false : true
    this.setData({
      goodsList: {
        allSelected: allSelected
      }
    })
  },

  toPay: function(){

  },

 
})