const app = getApp();
const db = wx.cloud.database();
const store = db.collection("store");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    titleColor: {
      address: "black",
      problemLabel: "black",
      images: "black",
    },
    verifiers:[], // 核验者 
    // 以下为弹出框部分
    autoSize: {
      maxHeight: 100,
      minHeight: 100
    },
    show: false,
    value: "",
    bottom: 0,
    isBlur: true,
    blurBottom: 0,
    errorContent:"",
    id:"",
    timeString:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: "加载中...",
    });

    // 获取url页面参数
    this.setData({
      id:options.id,
    })

    store.doc(this.data.id).get()
      .then((res) => {
        this.setData(
          {
            store: res.data,
            is_administrator: app.globalData.is_administrator,
          },
          (res) => {
            wx.hideLoading();
          }
        );
        this.setData({
          timeString:`${res.data.createTime.getFullYear()}年${res.data.createTime.getMonth() + 1}月${res.data.createTime.getDate()}日 ${res.data.createTime.getHours()}:${res.data.createTime.getMinutes()}:${res.data.createTime.getSeconds()}`
        })
      });
  },

  getData: function (options){
    wx.showLoading({
      title: "加载中...",
    });

    // 获取url页面参数
    console.log("id", options.id);

    store.doc(options.id).get()
      .then((res) => {
        this.setData(
          {
            store: res.data,
            is_administrator: app.globalData.is_administrator,
          },
          (res) => {
            wx.hideLoading();
          }
        );
        this.setData({
          timeString:`${res.data.createTime.getFullYear()}年${res.data.createTime.getMonth() + 1}月${res.data.createTime.getDate()}日 ${res.data.createTime.getHours()}:${res.data.createTime.getMinutes()}:${res.data.createTime.getSeconds()}`
        })
      });
  },

  onError: function(options){
    this.setData({
      show:true,
    })
    // wx.showModal({
    //   title: "核验确认通知",
    //   content: "是否确定驳回？",
    //   success: (res) => {
    //     if (res.cancel == false && res.confirm == true) {
    //       store.where({
    //         _id: this.options.id,
    //       })
    //       .update({
    //         data:{
    //           isChecked: 2, // 该状态表示有错误需要修改
    //         }
    //       });
    //       wx.showToast({
    //         title: "成功驳回",
    //         icon: "none",
    //       });
    //       }
    //     }
    // });
  },

  onPass: function(options){
    wx.showModal({
      title: "核验确认通知",
      content: "是否核验通过？",
      success: (res) => {
        if (res.cancel == false && res.confirm == true) {
          store.where({
            _id: this.options.id,
          })
          .update({
            data:{
              isChecked: 1, // 该状态表示已通过
            }
          });
          wx.showToast({
            title: "核验通过",
            icon: "none",
          });
          }
        }
    });
  },
  
  close: function(e){
    this.setData({
      show:false,
    })
  },

  confirm: function(e){
    wx.showModal({
      title: "核验确认通知",
      content: "是否确定驳回？",
      success: (res) => {
        if (res.cancel == false && res.confirm == true) {
          store.where({
            _id: this.data.id,
          })
          .update({
            data:{
              isChecked: 2, // 该状态表示有错误需要修改
              errorContent: e.detail, // 输入的错误信息
            }
          });
          console.log(e.detail)
          wx.showToast({
            title: "成功驳回",
            icon: "none",
          });
          }
        }
    });
  }
})