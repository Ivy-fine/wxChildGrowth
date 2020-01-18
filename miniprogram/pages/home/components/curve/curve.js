// components/curve/curve.js
let timer = null;
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    childInd:{
      type:Number,
      value:0
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
    heightOpts: {
      lazyload:true
    },
    weightOpts:{
      lazyload: true
    },
    tablist: [
      {
        name: "Height",
        text: "身高曲线"
      },
      {
        name: "Weight",
        text: "体重曲线"
      }
    ],
    curTab:'Height',
    canvasData:[]
  },
  attached(){
    this.ecComponent = this.selectComponent('#height-dom');
    this.getCanvasData('Height')
  },
  detached(){
    clearInterval(timer)
  },
  observers: {
    'cid': function (cid) {
     this.setData({
       curTab:'Height'
     })
     this.getCanvasData('Height')
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    bindTabChange: function (e) {
      const curTab = e.target.dataset.name
      this.setData({
        curTab: curTab
      })
      this.getCanvasData(curTab)
    },
    getCanvasData: function (curTab) {
      wx.showLoading({
        title: '',
      })
      let cdata1 = [];
      let cdata2 = [];
      wx.cloud.callFunction({
        //需调用的云函数名
        name: 'record',
        // 传给云函数的参数
        data: {
          action: "getRecord",
          child_id: this.properties.cid
        },
        // 成功回调
        complete: (res) => {
          console.log(res)
          const data = res.result.result.data
          if (curTab === 'Height') {
            cdata1 = data.map(item => {
              return {
                time: item.days,
                value: item.nowHeight * 1,
                type: "实测身高"
              };
            });
            cdata2 = data.map(item => {
              return {
                time: item.days,
                value: item.averageheight,
                type: "平均身高"
              };
            });
          } else {
            cdata1 = data.map(item => {
              return {
                time: item.days,
                value: item.bmi.toFixed(2) * 1,
                type: "实测bmi"
              };
            });
            cdata2 = data.map(item => {
              return {
                time: item.days,
                value: item.averagebmi,
                type: "平均bmi"
              };
            });
          }
          wx.hideLoading()
          this.ecComponent.init(this.setCanvas(curTab, [...cdata1, ...cdata2]));
        }
      })
    },
    setCanvas: function (curTab,data){
      let chart = null;
      console.log(data)
      return function (canvas, width, height, F2) {
        chart = new F2.Chart({
          el: canvas,
          width,
          height
        });
        chart.source(data, {
          time: {
            // tickCount: 3,
            range: [0, 1],
            formatter: function formatter(ivalue) {
              const year = Math.floor(ivalue / 365);
              const month = Math.floor((ivalue % 365) / 30);
              return year + "岁" + month + "月";
            }
          },
          value: {
            tickCount: 3,
            formatter: function formatter(ivalue) {
              const type = curTab === 'Height' ? "cm" : "";
              return ivalue + type;
            }
          }
        })
        chart
          .line()
          .position("time*value")
          .color("type")
          .shape("type", function (type) {
            const types =
              curTab === 'Height' ? ["实测身高", "平均身高"] : ["实测bmi", "平均bmi"];
            if (type === types[0]) {
              return "line";
            }
            if (type === types[1]) {
              return "dash";
            }
          });

        chart.render();
        return chart;
      }
    }
  }
})
