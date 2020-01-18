// components/records/records.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    records:{
      type:Array,
      value:[]
    },
    show:{
      type:Boolean,
      value:false
    },
    cid:{
      type:String,
      value:''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    goDetail(e){
      // console.log(e,this.properties.cid)
      const rid = e.target.dataset.rid;
      const cid = this.properties.cid
      wx.navigateTo({
        url: '/pages/detail/detail?cid='+cid+'&rid='+rid,
      })
    }
  }
})
