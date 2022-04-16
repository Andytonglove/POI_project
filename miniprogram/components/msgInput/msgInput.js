Component({
  /**
   * 组件的属性列表
   */
  properties: {
    inputValue: String,
    title: String,
    showInput: {
      value: false,
      type: Boolean
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    autoSize: {
      maxHeight: 100,
      minHeight: 100
    },
    show: false,
    value: "",
    bottom: 0,
    isBlur: true,
    blurBottom: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    keyboardheightchange (e) {
      // this.setData({
      //   bottom: e.detail.height
      // })
    },
    onFoucs (e) {
      this.setData({
        bottom: e.detail.height,
        isBlur: false
      })
    },
    onLineChange (e) {
    },
    onBlur (e) {
      this.setData({
        isBlur: true
      })
    },
    onShowInput () {
      this.setData({
        show: true
      })
    },
    onCancel () {
      console.log("点击了取消")
      this.setData({
        show: false
      })
      this.triggerEvent("close")
    },
    onComfirm () {
      if (!this.data.inputValue.trim()) {
        wx.showToast({
          title: "未填写错误内容",
          icon: 'none',
          duration: 2000
        })
      }else{
        this.triggerEvent("confirm", this.data.inputValue)
        this.triggerEvent("close")
      }
    },
    onChange (e) {
      this.data.inputValue = e.detail
      this.triggerEvent("onInput", e.detail)
    },
  }
})
