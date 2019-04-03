// pages/goods-detail/index.js
const WXAPI = require('../../wxapi/main.js')
const WxParse = require('../../wxParse/wxParse.js')
const regeneratorRuntime = require('../../utils/runtime.js')
const app = getApp();

Page({
  data: {
    interval: 3500,
    duration: 1000,

    goodsDetail: {},
    swiperCurrent: 0,

    hasMoreSelect: false,
    hideShopPopup: true,
    canSubmit: false, // 选规格后是否允许加入购物车
    shopType: 1,  // 1加入购物车或 2立即购买

    price: 0,
    scoreToPay: 0,
    shopnum: 0,
    buyNum: 0,
  },

  async onLoad(e) {
    this.data.goodsId = e.id
    const that = this

    this.reputation(e.id)
  },

  onShow: function() {
    this.getGoodsDetail(this.data.goodsId)
  },

  swiperChange: function(e) {
    this.setData({
      swiperCurrent: e.detail.current
    })
  },

  async getGoodsDetail(goodsId) {
    const that = this
    const goodsDetailRes = await WXAPI.goodsDetail(goodsId)

    console.log(goodsDetailRes)

    if (goodsDetailRes.code === 0) {

      that.setData({
        price: goodsDetailRes.data.basicInfo.minPrice,
        scoreToPay: goodsDetailRes.data.basicInfo.minScore,
        goodsDetail: goodsDetailRes.data
      })

      if (goodsDetailRes.data.basicInfo.pingtuan) {

      }

      if (goodsDetailRes.data.basicInfo.videoId) {

      }

      WxParse.wxParse('article', 'html', goodsDetailRes.data.content, that, 5)
    }
  },

  // 获取视频连接
  getVideoSrc: function(videoId) {
    var that = this
    WXAPI.videoDetail(videoId).then(function(res) {
      if (res.code === 0) {
        that.setData({
          videoMp4Src: res.data.fdMp4
        })
      }
    })
  },
  goShopCart: function() {
    wx.reLaunch({
      url: '/pages/shopping-cart/index',
    })
  },
  // 按钮事件
  toAddShopCart: function() {
    this.setData({
      shopType: 1
    })
    this.bindGuiGeTap();
  },
  toBuy: function() {
    this.setData({
      shopType: 2
    })
    this.bindGuiGeTap()
  },
  // 规格选择框
  bindGuiGeTap: function() {
    this.setData({
      hideShopPopup:false
    })
  },
  closePopupTap: function() {
    this.setData({
      hideShopPopup:true
    })
  },

  reputation: function(goodsId) {
    var that = this
    WXAPI.goodsReputation({
      goodsId: goodsId
    }).then(function(res){
      if(res.code == 0){
        that.setData({
          reputation: res.data
        })
      }
    })
  },

  numSubTap: function(){

  },
  numAddTap: function(){

  },

  addShopCart: function(){

  },
  buyNow: function(){

  },
})