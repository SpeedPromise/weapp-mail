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
    goodsRecommend: [], // 精选
    goodsNew: [],  // 新品
    goodsSeason: [], // 当季
    goodsHot: [], // 热销

    interval: 3500,
    duration: 1000,

    swiperCurrent: 0,
    activeCategoryId: 0,
    category_width: 750,
    
    curPage: 1,
    pageSize: 20,
    cateScrollTop: 0,

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
  // 商品列表
  getGoodList: function() {

  },
  // 点击商品类别
  tabClick: function(e) {
    let offset = e.currentTarget.offsetLeft
    if (offset > 150) {
      offset = offset - 150
    } else {
      offset = 0
    }
    this.setData({
      activeCategoryId: e.currentTarget.id,
      curPage: 1,
      cateScrollTop: offset
    })
    this.getGoodList(this.data.activeCategoryId)
  },
  // 点击轮播图
  tapBanner: function(e) {
    if (e.currentTarget.dataset.id != 0) {
      wx.navigateTo({
        url: 'pages/goods-details/index?id=' + e.currentTarget.dataset.id
      })
    }
  },
  // 记录当前轮播页
  swiperChange: function(e) {
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  // 商品详情
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
  // 刷新
  onPullDownRefresh: function() {
    this.setData({
      curPage: 1
    })
    this.getGoodList(this.data.activeCategoryId)
  }
  
})