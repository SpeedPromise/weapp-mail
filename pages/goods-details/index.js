// pages/goods-detail/index.js
const WXAPI = require('../../wxapi/main.js')
const WxParse = require('../../wxParse/wxParse.js')
const regeneratorRuntime = require('../../utils/runtime.js')
const app = getApp();

Page({
  data: {
    interval: 3500,
    duration: 1000,

    goodsDetail: {},   //商品信息
    shopCartInfo: {},  // 购物车信息
    swiperCurrent: 0,

    hasMoreSelect: false,
    hideShopPopup: true,
    canSubmit: false, // 选规格后是否允许加入购物车
    shopType: 1,  // 1加入购物车或 2立即购买

    price: 0,
    scoreToPay: 0,
    shopNum: 0,
    buyNum: 1,    // 购买数量
    buyNumMin: 1,
    buyNumMax: 0,
  },

  async onLoad(e) {
    this.data.goodsId = e.id
    const that = this
    wx.getStorage({
      key: 'shopCartInfo',
      success: function(res) {
        that.setData({
          shopCartInfo: res.data,
          shopNum: res.data.shopNum
        })
      },
    })
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
        goodsDetail: goodsDetailRes.data,
        buyNumMax: goodsDetailRes.data.basicInfo.stores
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
      url: '/pages/shopping-cart/index'
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
    if (this.data.buyNum > this.data.buyNumMin) {
      var curNum = this.data.buyNum - 1
      this.setData({
        buyNum: curNum
      })
    }
  },
  numAddTap: function(){
    
    if (this.data.buyNum < this.data.buyNumMax) {
      var curNum = this.data.buyNum + 1
      this.setData({
        buyNum: curNum
      })
    }
  },

  buildShopCartInfo: function(){
    var shopCartMap = {};
    let goodsDetail = this.data.goodsDetail
    shopCartMap.goodsId = goodsDetail.basicInfo.id
    shopCartMap.name = goodsDetail.basicInfo.name
    shopCartMap.pic = goodsDetail.basicInfo.pic
    shopCartMap.price = this.data.price
    shopCartMap.score = this.data.score
    shopCartMap.buyNum = this.data.buyNum
    shopCartMap.weight = goodsDetail.basicInfo.weight

    let shopCartInfo = this.data.shopCartInfo
    if (!shopCartInfo.shopNum) {
      shopCartInfo.shopNum = 0;
    }
    if (!shopCartInfo.shopList) {
      shopCartInfo.shopList = []
    }
    var hasSameGoodsIndex = -1
    for (var i = 0; i < shopCartInfo.shopList.length; i++) {
      var tmp = shopCartInfo.shopList[i]
      if (tmp.goodsId == shopCartMap.goodsId) {
        hasSameGoodsIndex = i
        shopCartMap.buyNum += tmp.buyNum
        break
      }
    }

    shopCartInfo.shopNum += this.data.buyNum
    if (hasSameGoodsIndex > -1) {
      shopCartInfo.shopList.splice(hasSameGoodsIndex, 1, shopCartMap)
    } else {
      shopCartInfo.shopList.push(shopCartMap)
    }
    return shopCartInfo
  },
  addShopCart: function(){
    let shopCartInfo = this.buildShopCartInfo()
    this.setData({
      shopCartInfo: shopCartInfo,
      shopNum: shopCartInfo.shopNum
    })
    wx.setStorage({
      key: 'shopCartInfo',
      data: shopCartInfo,
    })
    this.closePopupTap()
    wx.showToast({
      title: '加入购物车成功',
      icon: 'success',
      duration: 1500
    })
    console.log(shopCartInfo)
  },

  buyNow: function(){

  },
})