// miniprogram/pages/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    children:[],
    records:[],
    info: {
      age: {
        text: "年龄",
        val: "2岁"
      },
      height: {
        text: "身高",
        val: "48.5cm"
      },
      weight: {
        text: "体重",
        val: "3.08kg"
      },
      bmi: {
        text: "BMI指数",
        val: "1"
      },
      heredity: {
        text: "遗传身高",
        val: "49cm"
      }
    },
    tablist: [{
      name: "Record",
      text: "成长记录"
    },
    {
      name: "Curve",
      text: "生长曲线"
    }],
    curTab:"Record",
    childInd:0,
    cid:'',
    rid:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getData(this.data.childInd)
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
  onChildChange:function(e){
    this.setData({
      childInd:e.detail
    })
    // this.getData(e.detail)
    const {children} = this.data
    const cid = children[e.detail]._id
    this.getRecords(cid,children,e.detail)
  },
  bindTabChange:function(e){
    this.setData({
      curTab:e.target.dataset.name
    })
  },
  goEvaluation:function(e){
    console.log(e)
    const newChild = e.target.dataset.newchild;
    wx.navigateTo({
      url: '/pages/evaluation/evaluation?cid=' + this.data.cid+'&birthday='+this.data.children[this.data.childInd].birthday,
      success:function(res){
        res.eventChannel.emit('newchild', { newchild: newChild })
      }
    })
  },
  getData: function (childInd){
    wx.showLoading({
      title: '',
    })
    wx.cloud.callFunction({
      //需调用的云函数名
      name: 'children',
      // 传给云函数的参数
      data: {
        user_id: getApp().globalData.user_id
      },
      // 成功回调
      complete: (res) => {
        const children = res.result.result.data
        const cid = children[childInd]._id
        this.setData({
          children,
          cid
        })
        this.getRecords(cid, children, childInd)
      }
    })
    // const children = wx.getStorageSync('children');
    // const cid = children[childInd].cid;
    // const records = wx.getStorageSync('historyRecord')[cid]
    // this.setData({
    //   children,
    //   records
    // })
    // this.getChildInfo(childInd)
  },
  getRecords(cid, children,  childInd){
    wx.showLoading({
      title: '',
    })
    wx.cloud.callFunction({
      //需调用的云函数名
      name: 'record',
      // 传给云函数的参数
      data: {
        action: "getRecord",
        child_id: cid
      },
      // 成功回调
      complete: (res) => {
        console.log(res)
        const records = res.result.result.data
        this.getChildInfo(children, records, childInd)
        wx.hideLoading()
      }
    })
  },
  getChildInfo(children,records,ind) {
    // const children = wx.getStorageSync('children');
    // if (!children) {
    //   return;
    // }
    const child = children[ind];
    this.setData({
      cid:child._id
    })
    // const records = wx.getStorageSync('historyRecord');
    const childRecords = records;
    childRecords.sort((a, b) => {
      return b.nowHeight - a.nowHeight;
    });
    this.setData({
      records:childRecords
    })
    const { nowHeight, nowWeight, nowDate, bmi, days } = childRecords[0];
    const height = nowHeight + "cm";
    const weight = nowWeight + "kg";
    const rbmi = bmi.toFixed(2);
    const heredity = child.heredity + "cm";
    const year = Math.floor(days / 365);
    const month = Math.floor((days % 365) / 30);
    const age =
      year === 0
        ? `${month}月`
        : month === 0
          ? `${year}岁`
          : `${year}岁${month}月`;
    if (month === 0 && year === 0) {
      const age = Math.floor((days % 365) % 30) + "天";
    }
    this.setData({
      info: {
        age: {
          text: "年龄",
          val: age
        },
        height: {
          text: "身高",
          val: height
        },
        weight: {
          text: "体重",
          val: weight
        },
        bmi: {
          text: "BMI指数",
          val: rbmi
        },
        heredity: {
          text: "遗传身高",
          val: heredity
        }
      }
    })
  }
})