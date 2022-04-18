const app = getApp();
const db = wx.cloud.database()
const store = db.collection('store');
const _ = db.command;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    numbers: 0,
    stores: [],
    focus:false,
    searched:false,
    keywords: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      focus:true,
      keywords: options.keywords
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  onReachBottom: function () {
    this.loadData();
  },
  loadData:function(keywords){
    store.skip(this.data.numbers).where(
      // 在数组中放查找的多个字段搜索
      _.or([
        {
          problemLabel: db.RegExp({
            regexp: this.data.keywords,
            options: 'i',
          })
        },{
          type: db.RegExp({
            regexp: this.data.keywords,
            options: 'i',
          })
        },{
          address: db.RegExp({
            regexp: this.data.keywords,
            options: 'i',
          })
        }
      ])).get().then(res => {
      /**
       * 如果没有数据，就提示没有商户了，并返回。
       */
      if (res.data.length == 0) {
        this.setData({
          searched:true
        })
      }
      this.setData({
        stores: this.data.stores.concat(res.data),
        numbers: this.data.numbers + res.data.length
      });
    })
  },
  search:function(e){
    this.setData({
      keywords: e.detail.value
    },res => {
      this.loadData();
    }) 
  },
  // 热搜跳转
  ClickHotSearchItem : function (e) {
    this.setData({
      keywords: e.target.dataset.text,
    })
  }
})