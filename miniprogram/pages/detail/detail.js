// miniprogram/pages/detail/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tablist: [{
      name: "Height",
      text: "身高"
    },
    {
      name: "Weight",
      text: "体重"
    }],
    curTab:'Height',
    heightReport:{},
    weightReport:{},
    cid:'',
    rid:'',
    heightDetailData: [],
    weightDetailData:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      cid:options.cid,
      rid:options.rid
    },()=>{
      this.getReport()
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
  bindTabChange(e){
    this.setData({
      curTab: e.target.dataset.name
    },()=>{
      if (Object.keys(this.data.heightReport).length === 0 || Object.keys(this.data.weightReport).length === 0){
        this.getReport()
      }
    })
  },
  goHome(){
    wx.navigateTo({
      url: '/pages/home/home',
    })
  },
  ageSuggest(age) {
    let str = "";
    const keys = Object.keys(age);
    let arr = [];
    keys.forEach(item => {
      arr.push(item.split("-"));
    });
    arr.forEach((item, index) => {
      if (this.days >= item[0]) {
        str = age[keys[index]];
      } else {
        str = age[keys[0]];
      }
    });
    return str;
  },
  setAgeSuggest(report) {
    const content = report.content;
    content.forEach(item => {
      if (item.age) item.ageSuggest = this.ageSuggest(item.age)
      if(item.content){
        let reg = new RegExp('<p>', "g");
        item.content = item.content.replace(reg, '\n');
        let reg1 = new RegExp('</p>', "g");
        item.content = item.content.replace(reg1, '');
      }
    })
    return content;
  },
  getReport(){
    wx.showLoading({
      title: '加载中，请稍后',
    })
    const type = this.data.curTab === 'Height' ? 'height' : 'bmi'
    wx.cloud.callFunction({
      //需调用的云函数名
      name: 'compute',
      // 传给云函数的参数
      data: {
        type: type,
        cid: this.data.cid,
        rid: this.data.rid
      },
      // 成功回调
      complete: (res) => {
        console.log(res)
        const result = res.result;
        result.content = this.setAgeSuggest(result);
        let params = {}
        if(type==="height"){
          this.setData({
            heightReport: result,
            heightDetailData: [
              { type: '当前身高', value: result.nowHeight*1 },
              { type: "平均身高", value: result.averageheight }
            ]
          })
          params.averageheight = result.averageheight
          params.heredity = result.heredity
        }else{
          this.setData({
            weightReport: result,
            weightDetailData:[]
          })
          params.averagebmi=result.averagebmi
        }
        this.upadteRecord(params)
        wx.hideLoading()
      }
    })
  },
  upadteRecord(params){
    wx.cloud.callFunction({
      name: 'record',
      data: {
        action: 'updateRecord',
        child_id: this.data.cid,
        record: {
          ...params
        }
      },
      complete:(res)=>{
        console.log(res)
      }
    })
  }
})