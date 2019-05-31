// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    correct: void (0),
    inputAnswers: [
      {
        select: true
      },
      {},
      {},
      {}
    ],
    resultValidations: [],
    residueDegree: 10,
    ruleToggler: false
  },
  _n: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  onLoad: function () {
    this.resultsReset()
    this.setData({
      correct: this.createRandomNumer(4, this._n)
    })
  },
  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  // 生成随机答案
  // 答案规则4个不重复的个位数
  createRandomNumer (n, l) {
    const ns = [...l]
    if (n === (10 - ns.length)) {
      return this._n.filter(v => !ns.includes(v)).sort(() => Math.random() - 0.5).join('')
    } else {
      // delete ns[Math.random(Math.floor(Math.random() * ns.length))]
      // return this.createRandomNumer(n, ns.filter(Boolean))

      ns.splice(Math.floor(Math.random() * ns.length), 1)
      return this.createRandomNumer(n, ns)
    }
  },
  // 输入框选中状态切换
  handleSelect (e) {
    const { index } = e.target.dataset
    const { inputAnswers } = this.data
    inputAnswers.forEach((v, i) => {
      v.select = false
      if (i === index) v.select = true
    })
    this.setData({ inputAnswers })
  },
  // 输入处理
  inputAnswer (e) {
    const { index } = e.target.dataset
    const { inputAnswers } = this.data
    let idx
    let cursorFlag = false
    let value = index
    if (inputAnswers.map(v => v.value).includes(index)) {
      value = undefined
      idx = inputAnswers.map(v => v.value).indexOf(index)
      cursorFlag = true
    }
    inputAnswers.forEach((v, i) => {
      if (cursorFlag) {
        if (i === idx) v.value = value
        v.select = false
      } else {
        if (v.select) {
          v.value = value
          if (!cursorFlag) {
            idx = i
            if (i !== inputAnswers.length - 1) {
              v.select = false
              idx = i + 1
            }
          }
        }
      }
    })
    inputAnswers[idx].select = true
    this.setData({
      inputAnswers
    })
  },
  // 竞猜处理
  guessing () {
    const { residueDegree, resultValidations, correct, inputAnswers } = this.data
    if (inputAnswers.some(v => typeof v.value === 'undefined') || resultValidations === 0) return
    const answer = inputAnswers.map(v => v.value).join('')
    resultValidations[10 - residueDegree].answer = answer
    resultValidations[10 - residueDegree].correct = correct
    resultValidations[10 - residueDegree].check = true
    this.inputReset()
    this.setData({
      residueDegree: residueDegree - 1,
      resultValidations
    })
    if (correct === answer) {
      wx.showModal({
        title: '挑战成功',
        content: '恭喜你成功猜出数字, 超过世界0.5%的人',
        icon: 'success',
        showCancel: false,
        duration: 2000,
        complete: () => {
          this.reset()
        }
      })
    }
  },
  reset () {
    this.inputReset()
    this.resultsReset()
    this.setData({ residueDegree: 10 })
  },
  inputReset () {
    this.setData({
      inputAnswers: [
        {
          select: true
        },
        {},
        {},
        {}
      ]
    })
  },
  resultsReset () {
    const resultValidations = []
    do {
      resultValidations.push({
        check: false
      })
    } while (resultValidations.length < 10)
    this.setData({ resultValidations })
  },
  toggleRule () {
    const { ruleToggler } = this.data
    this.setData({
      ruleToggler: !ruleToggler
    })
  }
})
