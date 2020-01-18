Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type: Boolean,
      defalut: false
    },
    report: {
      type:Object,
      default:{}
    },
    detailData:{
      type:Array,
      default:[]
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    opts:{
      lazyload:true
    }
  },
  attached() {
    this.ecComponent = this.selectComponent('#height-detail-dom'); 
  },
  observers: {
    'detailData': function (data) {
      // 在 numberA 或者 numberB 被设置时，执行这个函数
      if(data.length>0){
        this.ecComponent.init(this.setChart(data));
      }
    }
  },
  detached(){
  },
  /**
   * 组件的方法列表
   */
  methods: {
   setChart(data){
     let chart = null;
     return function initChart(canvas, width, height, F2) {
       chart = new F2.Chart({
         el: canvas,
         width,
         height
       });
       chart.source(data, {
         value: {
           tickCount: 5
         }
       });
       chart.tooltip({
         showItemMarker: false,
         onShow(ev) {
           const { items } = ev;
           items[0].name = null;
           items[0].name = items[0].title;
           items[0].value = items[0].origin.value + 'cm';
         }
       });
       chart.interval().position('type*value');
       chart.render();
       return chart;
     }
   }
  }
})