// pages/category/index.js
const WXAPI = require('../../wxapi/main')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    categories: [],
    goodsList: {},
    curId: ''
  },

  onLoad: function (options) {
    this.init()
  },
  init: function(){
    let that = this
    wx.showNavigationBarLoading()
    WXAPI.goodsCategory().then((res) => {
      var categories = [];
      if (res.code === 0) {
        for (var i = 0; i < res.data.length; i++){
          let item = res.data[i]
          item.id = 's' + item.id
          categories.push(item)
        }
        that.setData({
          id: categories[0].id,
          categories: categories
        })
      }
      that.getGoodsList(0)
    }).catch((e) => wx.hideNavigationBarLoading())
  },
  getGoodsList: function(cateId){
    let that = this
    WXAPI.goods({
      recommendStatus: 1
    }).then((res) => {
      if (res.code == 404 || res.code == 700) {return}
      let goodsList = []
      that.data.categories.forEach((o, i) => {
        let tmp = {}
        tmp.id = o.id
        tmp.name = o.name
        let list = []
        tmp.list = list
        res.data.forEach((item, i) => {
          if ('s'+item.categoryId == tmp.id) {
            list.push(item)
          }
        })
        goodsList.push(tmp)
      })
      that.setData({
        goodsList: goodsList
      })
      // console.log(goodsList)
      wx.hideNavigationBarLoading()
    }).catch((e) => wx.hideNavigationBarLoading())
  },
  toDetailsTap: function(e){
    wx.navigateTo({
      url: '/pages/goods-details/index?id=' + e.currentTarget.dataset.id,
    })
  },

  onItemClick: function(e){
    let id = e.currentTarget.dataset.id
    this.setData({
      curId: id
    })
  }
})