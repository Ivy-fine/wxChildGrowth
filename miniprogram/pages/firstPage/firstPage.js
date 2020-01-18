// miniprogram/pages/firstPage/firstPage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const children = wx.getStorageSync('children');
    // if (children) {
    //   wx.redirectTo({
    //     url: '/pages/home/home',
    //   })
    // }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  goTest:function () {
    console.log(getApp().globalData)
    wx.showLoading({
      title: '',
    })
    const _this = this;
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              getApp().globalData.userInfo = res.userInfo
              wx.cloud.callFunction({
                //需调用的云函数名
                name: 'login',
                // 传给云函数的参数
                data: {
                  userInfo: res.userInfo
                },
                // 成功回调
                complete: (res) => {
                  // console.log(res)
                  getApp().globalData.user_id = res.result.result
                  _this.getChildren(res.result.result)
                }
              })
            }
          })
        }
      }
    })
    // wx.authorize({
    //   scope: 'scope.userInfo',
    //   success() {
    //     wx.getUserInfo({
    //       success(res){
    //         getApp().globalData.userInfo = res.userInfo
            // wx.cloud.callFunction({
            //   //需调用的云函数名
            //   name: 'login',
            //   // 传给云函数的参数
            //   data: {
            //     userInfo:res.userInfo
            //   },
            //   // 成功回调
            //   complete: (res) => {
            //     // console.log(res)
            //     getApp().globalData.user_id = res.result.result
            //     _this.getChildren(res.result.result)
            //   }
            // })
    //       }
    //     })
    //   },
    //   fail(){
    //     wx.hideLoading()
    //   }
    // })
    
    
  },
  getChildren(id){
    wx.cloud.callFunction({
      //需调用的云函数名
      name: 'children',
      // 传给云函数的参数
      data: {
        user_id:id
      },
      // 成功回调
      complete: (res) => {
        getApp().globalData.children = res.result.result.data
        if(res.result.result.data.length>0){
          wx.navigateTo({
            url: '/pages/home/home',
          })
        }else{
          wx.navigateTo({
            url: '/pages/evaluation/evaluation',
          })
        }
      }
    })
  }
})