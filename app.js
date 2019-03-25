const WXAPI = require('wxapi/main')
App({
  navigateToLogin: false,
  onLaunch: function () {
    const that = this
    // 判断网络情况
    wx.getNetworkType({
      success: function(res) {
        const networkType = res.networkType;
        if (networkType === 'none') {
          that.globalData.isConnected = false
          wx.showToast({
            title: '无网络连接',
            icon: 'loading',
            duration: 1500
          })
        }
      },
    });

    // 监听网络状态
    wx.onNetworkStatusChange(function(res){
      if (!res.isConnected) {
        that.globalData.isConnected = false
        wx.showToast({
          title: '网络已断开',
          icon: 'loading',
          duration: 1500,
          complete: function() {
            that.goStartIndexPage()
          }
        })
      } else {
        that.globalData.isConnected = true
        wx.hideToast()
      }
    });
    // 获取接口和后台权限
    WXAPI.vipLevel().then(res => {
      that.globalData.vipLevel = res.data
    });
    // 获取商城名称
    WXAPI.queryConfig({
      key: 'mailName'
    }).then(function(res) {
      if (res.code == 0) {
        wx.setStorageSync('mailName', res.data.value)
      }
    });
    // 获取积分
    WXAPI.scoreRules({
      code: 'goodReputation'
    }).then(function(res) {
      if (res.code == 0) {
        that.globalData.order_reputation_score = res.data[0].score
      }
    });
    // 获取充值的最低金额
    WXAPI.queryConfig({
      key: 'recharge_amount_min'
    }).then(function (res) {
      if (res.code == 0) {
        that.globalData.recharge_amount_min = res.data.value;
      }
    });
    // 登录判断
    // let token = wx.getStorageInfoSync('token')
    // if (!token) {
    //   that.goLoginPageTimeout()
    //   return
    // }
    // WXAPI.checkToken(token).then(function(res) {
    //   if (res.code != 0) {
    //     wx.removeStorageSync('token')
    //     that.goLoginPageTimeout()
    //   }
    // }) 
  },
  goLoginPageTimeout: function () {
    if (this.navigateToLogin) {
      return
    }
    wx.removeStorageSync('token')
    this.navigateToLogin = true
    setTimeout(function () {
      wx.navigateTo({
        url: '/pages/authorize/index',
      })
    }, 1000)
  },
  // 启动页
  goStartIndexPage: function() {
    setTimeout(function() {
      wx.redirectTo({
        url: '/pages/start/index'
      })
    }, 1000)
  },
  onShow (e) {
    this.globalData.launchOption = e;
    if (e && e.query && e.query.inviter_id) {
      wx.setStorageSync('referrer', e.query.inviter_id);
    }
  },
  globalData: {
    isConnected: true,
    launchOption: undefined,
    vipLevel: 0
  }
})