// components/feedback/feedback.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    answer: {
      type: String
    },
    correct: {
      type: String,
      value: '0000'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    dots: []
  },
  attached () {
    const dots = []
    for (let index = 0; index < 10; index++) {
      dots.push({
      })
    }
    this.setData({
      dots
    })
  },

  observers: {
    'answer, correct': function (answer, correct) {
      const { A, B } = this.check(answer, correct)
      const { dots } = this.data
      dots.forEach(v => {
        v.allCorrect = false
        v.partialCorrect = false
      })
      for (let index = 0; index < A; index++) {
        dots[index].allCorrect = true
      }
      for (let index = 0; index < B; index++) {
        dots[5 + index].partialCorrect = true
      }
      this.setData({
        dots
      })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    check (answer, correct) {
      let A = 0
      let B
      const correctList = correct.split('')
      const answerList = answer.split('')
      B = correctList.filter(v => answerList.includes(v)).length

      answerList.forEach((v, i) => {
        const c = correctList[i]
        if (c === v) {
          A++
          B--
        }
      })
      return {
        A, B
      }
    }

  }
})
