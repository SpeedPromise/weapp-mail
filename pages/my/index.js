const app = getApp()
const CONFIG = require('../../config.js')
const WXAPI = require('../../wxapi/main')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    balance: 0.00,
    freeze: 0,
    score: 0,
    score_sign_continuous: 0
  },
  onLoad() {

  },	
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    let userInfo = wx.getStorageSync('userInfo')
    if (!userInfo) {
      app.goLoginPageTimeout()
    } else {
      that.setData({
        userInfo: userInfo,
        version: CONFIG.version,
        vipLevel: app.globalData.vipLevel
      })
    }
    that.getUserDetail()
    that.getUserAmount()
  },
  // 用户详情
  getUserDetail: function() {
    var that = this
    WXAPI.userDetail(wx.getStorageInfoSync('token')).then(function(res) {

      if (res.code == 0) {
        let _data = {}
        _data.userDetail = res.data
        if (res.data.base.mobile) {
          _data.userMobile = res.data.base.mobile
        }
        that.setData(_data)
      }
    })
  },
  // 用户资产
  getUserAmount: function() {
    var that = this
    WXAPI.userAmount(wx.getStorageInfoSync('token')).then(function(res) {

      if (res.code == 0) {
        this.setData({
          balance: res.data.balance.toFixed(2),
          freeze: res.data.freeze.toFixed(2),
          score: res.data.score
        })
      }
    })
  },
  relogin: function () {
    app.goLoginPageTimeout()
  },
  goAsset: function () {
    wx.navigateTo({
      url: "/pages/asset/index"
    })
  },
  goScore: function () {
    wx.navigateTo({
      url: "/pages/score/index"
    })
  },
  goOrder: function (e) {
    wx.navigateTo({
      url: "/pages/order-list/index?type=" + e.currentTarget.dataset.type
    })
  }
})