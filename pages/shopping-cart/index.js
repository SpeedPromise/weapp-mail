// pages/shopping_cart/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsList: {
      list: [],
      selected: 0,
      allSelected: false,
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
    for (var i = 0; i < shopList.length; i++) {
      shopList[i].active = false
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
    var totalPrice = 0
    var selected = 0
    var allSelected = false
    for (var i = 0; i < list.length; i++) {
      if (list[i].active) {
        totalPrice += parseFloat(list[i].price) * list[i].buyNum
        selected++
      }
    }
    if (selected == list.length) {allSelected = true}
    totalPrice = parseFloat(totalPrice.toFixed(2))
    this.setData({
      goodsList: {
        list: list,
        totalPrice: totalPrice,
        selected: selected,
        allSelected: allSelected
      }
    })
    var shopCartInfo = {}
    shopCartInfo.shopList = list
    shopCartInfo.shopNum = list.reduce((pre, cur) => {
      return cur.buyNum + pre
    }, 0)
    wx.setStorage({
      key: "shopCartInfo",
      data: shopCartInfo
    })
  },

  touchS: function(e) {
    if (e.touches.length == 1) {
      this.setData({
        startX: e.touches[0].clientX 
      })
    }
  },
  touchE: function(e) {
    var index = e.currentTarget.dataset.index
    if (e.changedTouches.length == 1) {
      var endX = e.changedTouches[0].clientX
      var d = this.data.startX - endX
      var delBtnWidth = this.data.delBtnWidth
      var left = d > delBtnWidth / 2 ? delBtnWidth : 0
      var list = this.data.goodsList.list
      
      if (index !== "" && index != null){
        list[parseInt(index)].left = left
        this.setGoodsList(list)
      }
    }
  },

  delItem: function(e) {
    var index = e.currentTarget.dataset.index
    var list = this.data.goodsList.list
    list.splice(index, 1)
    this.setGoodsList(list)
  },

  numSubTap: function(e){
    var index = e.currentTarget.dataset.index
    var list = this.data.goodsList.list
    if (list[parseInt(index)].buyNum > 1) {
      list[parseInt(index)].buyNum--
    }
    this.setGoodsList(list)
  },
  numAddTap: function(e){
    var index = e.currentTarget.dataset.index
    var list = this.data.goodsList.list
    if (list[parseInt(index)].buyNum < list[parseInt(index)].buyNumMax) {
      list[parseInt(index)].buyNum++
    }
    this.setGoodsList(list)
  },

  selectTap: function(e) {
    var index = e.currentTarget.dataset.index
    var list = this.data.goodsList.list
    if (index !== "" && index != null) {
      list[parseInt(index)].active = !list[parseInt(index)].active
      this.setGoodsList(list)
    }
  },

  bindAllSelected: function(){
    var list = this.data.goodsList.list
    var allSelected = this.data.goodsList.allSelected
    if (allSelected){
      for (var i = 0; i < list.length; i++) {
        list[i].active = false
      }
    } else {
      for (var i = 0; i < list.length; i++) {
        list[i].active = true
      }
    }
    this.setGoodsList(list)
  },

  toPay: function(){

  },

 
})