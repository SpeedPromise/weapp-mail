//index.js
//获取应用实例
const app = getApp()
const WXAPI = require('../../wxapi/main.js')
const CONFIG = require('../../config.js')

Page({
  data: {
    inputShowed: false, // 是否显示搜索框
    inputVal: '', //搜索内容

    categories: [],
    goodsRecommend: [],
    goodsNew: [],
    goodsSeason: [],
    goodsHot: [],

    interval: 3500,
    duration: 1000,

    swiperCurrent: 0,
    activeCategoryId: 0,
    category_width: 750,

  },
  onLoad: function(e) {
    const that = this
    if (e && e.scene) {
      const scene = decodeURIComponent(e.scene)
      if (scene) {
        wx.setStorageSync('referrer', scene.substring(11))
      }
      wx.getst
    }
    wx.setNavigationBarTitle({
      title: wx.getStorageSync('mailName'),
    })

    WXAPI.banners({
      type: 'new'
    }).then(function (res) {
      if (res.code == 700) {
        wx.showModal({
          title: '提示',
          content: '请在后台添加轮播图',
          showCancel: false
        })
      } else {
        that.setData({
          banners: res.data
        })
      }
    }).catch(function(e) {
      wx.showToast({
        title: res.msg,
        icon: 'none'
      })
    })
    WXAPI.goodsCategory({
      type: 'category'
    }).then(function(res) {
      let categories = [{
        id: 0,
        icon: '/images/category.png',
        name: '全部'
      }]
      if (res.code === 0) {
        categories = categories.concat(res.data)
      }
      const n = Math.ceil(categories.length / 2)
      that.setData({
        categories: categories,
        category_width: 150 * n,
        activeCategoryId: 0,
        curPage: 1
      })
      that.getGoodList(1);
    })
    WXAPI.goods({
      recommendStatus: 1
    }).then(res => {
      if (res.code === 0) {
        that.setData({
          goodsRecommend: res.data
        })
      }
    })

  },

  getGoodList: function() {

  },

  tapBanner: function(e) {
    if (e.currentTarget.dataset.id != 0) {
      wx.navigateTo({
        url: 'pages/goods-details/index?id=' + e.currentTarget.dataset.id
      })
    }
  },
  swiperChange: function(e) {
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  toDetail: function(e) {
    wx.navigateTo({
      url: 'pages/goods-details/index?id=' + e.currentTarget.dataset.id
    })
  },

  // 搜索框事件
  toSearch: function() {

  },
  showInput: function() {
    this.setData({
      inputShowed: true
    })
  },
  hideInput: function() {
    this.setData({
      inputShowed: false
    })
  },
  clearInput: function() {
    this.setData({
      inputVal: ''
    })
  },
  inputTyping: function(e) {
    this.setData({
      inputVal: e.detail.value
    })
  },

  
})