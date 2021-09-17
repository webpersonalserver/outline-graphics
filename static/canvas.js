$(function () {
  const config = {
    // 半径
    radius: 300,
    // 转盘数据
    data: [{
      level: 1,
      angle: 60,
      bgColor: '#EE8262',
      message: '恭喜您获得一等奖'
    }, {
      level: 2,
      angle: 60,
      bgColor: '#EE7600',
      message: '恭喜您获得二等奖'
    }, {
      level: 3,
      angle: 60,
      bgColor: '#AEEEEE',
      message: '恭喜您获得三等奖'
    }, {
      level: 1,
      angle: 60,
      bgColor: '#EE8262',
      message: '恭喜您获得一等奖'
    }, {
      level: 2,
      angle: 60,
      bgColor: '#EE7600',
      message: '恭喜您获得二等奖'
    }, {
      level: 3,
      angle: 60,
      bgColor: '#AEEEEE',
      message: '恭喜您获得三等奖'
    }]
  }
  // 旋转动画定时器
  let timer
  // 当下转盘旋转的总角度
  let angleAmount = 0

  // 渲染转盘
  function render () {
    const { radius, data = [] } = config
    const canvas = document.getElementById('turntable')
    const ctx = canvas.getContext('2d')
    let sAngle = 1

    // 绘制转盘圆形区域
    ctx.beginPath()
    ctx.strokeStyle = 'rgba(0, 0, 0, 0)'
    ctx.arc(radius, radius, radius, 0, 2 * Math.PI, false)
    ctx.stroke()

    // 绘制转盘数据
    data.forEach(({ angle, bgColor }) => {
      sAngle = drawSector({
        ctx,
        angle,
        bgColor,
        radius,
        sAngle
      })
    })
  }
  // 绘制指定角度的扇形
  function drawSector ({
    ctx,
    angle,
    bgColor,
    radius,
    sAngle
  }) {
    // 开始绘制
    ctx.beginPath()
    // 绘制指定角度的圆弧
    ctx.arc(radius, radius, radius, sAngle * Math.PI, Math.PI * (sAngle + angle / 180), false)
    // 移动笔触到圆心
    ctx.lineTo(radius, radius)
    // 闭合路劲
    ctx.closePath()
    // 设置扇形填充色
    ctx.fillStyle = bgColor
    // 填充背景色
    ctx.fill()
    // 保存绘制
    ctx.save()
    // 返回下次绘制的起始角
    return sAngle + angle / 180
  }
  // 事件监听
  function eventMonitoring () {
    $('.pointer').click(function () {
      if (timer) return

      const rotate = Math.floor(Math.random() * 360) + 10800 + angleAmount
      angleAmount = rotate

      $('#turntable').css({ transform: `rotate(${rotate}deg)` })
      timer = setTimeout(() => {
        getLotteryRes()
        clearTimeout(timer)
        timer = null
      }, 10000)
    })
  }
  // 判断最后抽奖结果
  function getLotteryRes () {
    const remainder = angleAmount % 360
    const { data = [] } = config
    let amount = 0
    let keyPoint = 270
    let res = ''

    for (let i = 0; i < data.length; i++) {
      let { angle, message } = data[i]
      let min = keyPoint + amount + remainder
      let max = keyPoint + angle + amount + remainder

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
        amount += angle
      }
    }

    alert(res)
  }

  render()
  eventMonitoring()
})