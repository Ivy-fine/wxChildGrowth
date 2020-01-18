// components/swiper/swiper.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    children:{
      type:Array,
      value:[]
    },
    duration: {
      type:Number,
      value:500
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    imgUrl:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1573272863461&di=561848c7355a388e958a9a992c8bbdb6&imgtype=0&src=http%3A%2F%2Fimg3.duitang.com%2Fuploads%2Fitem%2F201504%2F07%2F20150407H4809_fzN5t.thumb.700_0.jpeg',
    curIndex: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    bindSwiperChange:function(e){
      this.setData({
        curIndex:e.detail.current
      })
      this.triggerEvent("changechild",e.detail.current)
    },
  }
})
