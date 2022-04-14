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
    searched:false,
    worktype:app.globalData.is_verifier
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.LoadData();
  },

  LoadData:function(e){
    if(this.worktype){
    store.where({
      isChecked:0
    }).get().then(res => {
        /**
         * 如果没有数据，就提示没有待办了，并返回。
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
  }else{
    const _userId = wx.getStorageSync("openId");
    store.where({
      _openid:_userId,
      isChecked:2,
    }).get().then(res => {
        /**
         * 如果没有数据，就提示没有待办了，并返回。
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
  }
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
    this.LoadData();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})