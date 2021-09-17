$(function () {
  // 配置文件
  const config = {
    // 转盘背景色
    bgColor: '#FF4500',
    // 转盘半径（px）
    radius: 300,
    // 奖项数据
    awards: [{
      // 奖项等级
      level: 1,
      // 所占比例，0~100
      scale: 60,
      // 奖项背景色
      bgColor: '#EE8262',
      message: '恭喜您获得一等奖'
    }, {
      // 奖项等级
      level: 2,
      // 所占比例，0~100
      scale: 60,
      bgColor: '#EE7600',
      message: '恭喜您获得二等奖'
    }, {
      // 奖项等级
      level: 3,
      // 所占比例，0~100
      scale: 60,
      bgColor: '#AEEEEE',
      message: '恭喜您获得三等奖'
    }, {
      // 奖项等级
      level: 1,
      // 所占比例，0~100
      scale: 60,
      bgColor: '#EE8262',
      message: '恭喜您获得一等奖'
    }, {
      // 奖项等级
      level: 2,
      // 所占比例，0~100
      scale: 60,
      bgColor: '#EE7600',
      message: '恭喜您获得二等奖'
    }, {
      // 奖项等级
      level: 3,
      // 所占比例，0~100
      scale: 60,
      bgColor: '#AEEEEE',
      message: '恭喜您获得三等奖'
    }]
  }
  // 动画定时器
  let timer
  // 转盘当前旋转的角度
  let rotate = 0

  // 转盘渲染
  function render () {
    const { radius = 300, awards = [], bgColor } = config
    let rotateAmount = 0
    let html = ''

    awards.forEach(item => {
      const n = Math.ceil(item.scale / 90)
      const scaleArray = []
      const bgColor = item.bgColor || randomColor()

      if (n === 1) {
        scaleArray.push(item.scale)
      } else if (n === 2) {
        scaleArray.push(90, item.scale - 90)
      } else if (n === 3) {
        scaleArray.push(90, 90, item.scale - 180)
      } else if (n === 4) {
        scaleArray.push(90, 90, 90, item.scale - 270)
      }

      scaleArray.forEach(scale => {
        let template = generateTemplate({
          radius,
          level: item.level,
          scale,
          rotate: rotateAmount,
          bgColor
        })
        rotateAmount += scale
        html += template
      })
    })
    $('.app').css({
      backgroundColor: bgColor || randomColor()
    })
    $('.box').css({
      width: `${radius * 2}px`,
      height: `${radius * 2}px`
    })
    $('.box').html(html)
  }
  // 生成奖励元素模块
  function generateTemplate ({
    radius,
    level,
    scale,
    rotate,
    bgColor
  }) {
    const skew = 90 - scale
    const transform = `rotate(${rotate}deg) skew(${skew}deg)`
    const template = `
      <div class="awards" level="${level}" style="
        width: ${radius}px;
        height: ${radius}px;
        background-color: ${bgColor};
        transform: ${transform};
      "><p class="text" style="
        transform: translate(-72%, -72%) skew(-${scale / 2}deg)
      "><span style="
        transform: rotate(-${scale}deg)
      ">${['', '一等奖', '二等奖', '三等奖'][level]}</span></p></div>
    `

    return template
  }
  // 随机生成16进制颜色值
  function randomColor () {
    return `#${Math.random().toString(16).substr(-6)}`
  }
  // 旋转动画
  function eventMonitoring () {
    $('.pointer').click(function () {
      if (timer) return

      const degree = Math.floor(Math.random() * 360) + 10800 + rotate

      rotate = degree
      $('.box').css({ transform: `rotate(${degree}deg)` })
      timer = setTimeout(() => {
        getLotteryRes()
        clearTimeout(timer)
        timer = null
      }, 10000)
    })
  }
  // 判断最后抽奖结果
  function getLotteryRes () {
    const remainder = rotate % 360
    const { awards } = config
    let amount = 0
    let keyPoint = 270
    let res = ''

    for (let i = 0; i < awards.length; i++) {
      let { scale, message } = awards[i]
      let min = keyPoint + amount + remainder
      let max = keyPoint + scale + amount + remainder

      if (min >= 360) {
        min = min % 360
      }
      if (max >= 360) {
        max = max % 360
      }

      if (max <= min) {
        res = message
        break
      } else {
        amount += scale
      }
    }

    alert(res)
  }


  render()
  eventMonitoring()
})