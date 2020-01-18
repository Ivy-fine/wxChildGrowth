// miniprogram/pages/evaluation/evaluation.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    childInfo: {
      name: '',
      gender: '0',
      birthday: '请选择宝宝生日',
      dadHeight: '',
      momHeight: ''
    },
    nowHeight:'',
    nowWeight:'',
    nowDate:'请选择测量日期',
    newChildFlag:true,
    childInd:0,
    cid:"",
    rid:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const eventChannel = this.getOpenerEventChannel()
    // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    eventChannel.on('newchild',  (data)=> {
      this.setData({
        newChildFlag:data.newchild,
        cid:options.cid,
        birthday:options.birthday
      })
    })
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
  formSubmit: function(e) {
    const { name, gender, birthday, dadHeight, momHeight, nowDate, nowHeight, nowWeight} = e.detail.value
    if (this.data.newChildFlag) {
      if (name !== "" && gender !== "" && birthday !== "" && dadHeight !== "" && momHeight !== ""&&nowDate !== "" && nowHeight !== "" && nowWeight !== "") {
        this.addChild(name, gender, birthday, dadHeight, momHeight, nowHeight, nowWeight, nowDate);
        // this.goDetail()
      }else{
        wx.showToast({
          title: '请填写完整信息',
          icon: 'none',
          duration: 2000
        })
      }
    } else {
        if (nowDate !== "" && nowHeight !== "" && nowWeight !== "") {
        // const children = wx.getStorageSync('children')
        // const { cid, birthday } = children[this.data.childInd] 
        // this.setData({
        //   cid : cid,
        //   rid : this.addRecord(cid, birthday, nowHeight, nowWeight, nowDate)
        // })
        // this.goDetail()
        this.addRecord(this.data.cid,this.data.birthday,nowHeight,nowWeight,nowDate)
        } else {
          wx.showToast({
            title: '请填写完整信息',
            icon: 'none',
            duration: 2000
          })
        }
    }
    
  },
  addChild(name, gender, birthday, dadHeight, momHeight, nowHeight, nowWeight, nowDate) {
    // const cid = new Date() * 1;
    // let children = wx.getStorageSync('children') || [];
    const heredity = this.getHeredity(gender, dadHeight, momHeight);
    // children = [
    //   ...children,
    //   { cid, name, gender, birthday, dadHeight, momHeight, heredity }
    // ];
    // wx.setStorageSync("children", children)
    wx.cloud.callFunction({
      //需调用的云函数名
      name: 'children',
      // 传给云函数的参数
      data: {
        user_id: getApp().globalData.user_id,
        child:{
          name, gender, birthday, dadHeight, momHeight, heredity
        }
      },
      // 成功回调
      complete: (res) => {
        this.addRecord(res.result.result._id, birthday, nowHeight, nowWeight, nowDate)
      }
    })
    // this.setData({
    //   rid: this.addRecord(cid, birthday, nowHeight, nowWeight, nowDate)
    // })
  },
  addRecord(cid, birthday, nowHeight, nowWeight, nowDate) {
    wx.showLoading({
      title: '提交中，请稍后',
    })
    const days =
      (new Date(nowDate) * 1 - new Date(birthday) * 1) / 1000 / 3600 / 24; //出生天数
    // const rid = new Date(nowDate) * 1;
    // const record = wx.getStorageSync('historyRecord')
    // let historyRecord = record ? record : {}
    const bmi = nowWeight / Math.pow(nowHeight / 100, 2);
    //  体质指数（BMI）=体重（kg）÷身高^2（m）
    // if (historyRecord[cid]) {
    //   historyRecord[cid] = [
    //     ...historyRecord[cid],
    //     { rid, nowHeight, nowWeight, nowDate, days, bmi }
    //   ];
    // } else {
    //   historyRecord[cid] = [{ rid, nowHeight, nowWeight, nowDate, days, bmi }];
    // }
    // wx.setStorageSync("historyRecord", historyRecord)
    // return rid;
    wx.cloud.callFunction({
      //需调用的云函数名
      name: 'record',
      // 传给云函数的参数
      data: {
        action:'addRecord',
        child_id: cid,
        record: {
          nowHeight, nowWeight, nowDate, days, bmi
        }
      },
      // 成功回调
      complete: (res) => {
        const rid = res.result.result._id
        this.goDetail(cid,rid)
      }
    })
  },
  getHeredity(gender, fh, mh) {
    //遗传身高
    if (gender === "0") {
      return (fh * 1 - 14 + mh * 1) / 2;
    } else {
      return (fh * 1 + mh * 1 + 14) / 2;
    }
  },
  bindBirthdayChange: function (e) {
    const childInfo = this.data.childInfo;
    childInfo.birthday = e.detail.value
    this.setData({
      childInfo
    })
  },
  bindDateChange: function (e) {
    this.setData({
      nowDate:e.detail.value
    })
  },
  goDetail:function(cid,rid){
    wx.showToast({
      title: '提交成功',
      icon: 'success',
      duration: 2000
    })
    wx.navigateTo({
      url: '/pages/detail/detail?cid='+cid+'&rid='+rid,
    })
  }
})