const app = getApp();
const db = wx.cloud.database()
const store = db.collection('store');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    numbers: 0,
    stores: [],
    searched: false // 搜索节流阀
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.loadData();
  },
  loadData: function() {
    store.where({
      ischecked:0
    }).get().then(res => {
      /**
       * 如果没有数据，就提示没有代办了，并返回。
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
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.loadData();
  },
  navigateToSearch:function(e){
    wx.redirectTo({
      url: '../search/search',
    })
  }
})