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

    selectSize: '选择：',
    selectSizePrice: 0,
    selectScoreToPay: 0,
    shopnum: 0,

  },

  async onLoad(e) {
    this.data.goodsId = e.id
    const that = this

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
      var selectSizeTemp = ''
      if (goodsDetailRes.data.properties) {
        for (let i = 0; i < goodsDetailRes.data.properties.length; i++) {
          selectSizeTemp = selectSizeTemp + ' ' + goodsDetailRes.data.properties[i].name
        }
        that.setData({

          selectSize: that.data.selectSize + selectSizeTemp,
          selectSizePrice: goodsDetailRes.data.basicInfo.miinPrice,
          selectScoreToPay: goodsDetailRes.data.basicInfo.minScore
        })
      }
      if (goodsDetailRes.data.basicInfo.pingtuan) {

      }
      that.setData({
        goodsDetail: goodsDetailRes.data
      })
      
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
  toAddShopCart: function(){

  },
  toBuy() {

  },

})