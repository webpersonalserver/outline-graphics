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
      level: 0,
      angle: 60,
      bgColor: '#FFFFFF',
      message: '谢谢参与'
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
    let sAngle = 0

    // 绘制转盘圆形区域
    ctx.beginPath()
    ctx.arc(radius, radius, radius, 0, 2 * Math.PI, false)

    // 绘制转盘数据
    data.forEach(({ angle, bgColor, level }) => {
      sAngle = drawSector({
        ctx,
        angle,
        bgColor,
        radius,
        sAngle,
        level
      })
    })
  }
  // 绘制指定角度的扇形
  function drawSector ({
    ctx,
    angle,
    bgColor,
    radius,
    sAngle,
    level
  }) {
    // 圆心X轴
    const x = radius
    // 文字的Y轴坐标
    const y = radius
    // 设置文字
    const text = ['谢谢参与', '一等奖', '二等奖', '三等奖'][level]
    // 文字半径
    const textRadius = radius * 3 / 4
    // 文字开始弧度
    const textStartRadian = (sAngle + angle / 360) * Math.PI

    // 保存之前绘制
    ctx.save()
    // 开始绘制
    ctx.beginPath()
    // 绘制指定角度的圆弧
    ctx.arc(x, y, radius, sAngle * Math.PI, Math.PI * (sAngle + angle / 180), false)
    // 移动笔触到圆心
    ctx.lineTo(x, y)
    // 闭合路劲
    ctx.closePath()
    // 设置扇形填充色
    ctx.fillStyle = bgColor
    // 填充背景色
    ctx.fill()
    // 重置绘制角度
    ctx.restore()

    // 保存绘制
    ctx.save()
    // 绘制文本
    ctx.beginPath()
    // 文字字体
    ctx.font = "24px Microsoft YaHei"
    // 文字样色
    ctx.fillStyle = "#666666";
    // 水平对齐方式
    ctx.textAlign = "center"
    // 垂直对齐方式
    ctx.textBaseline = "middle"
    // 设置文字旋转中心点
    ctx.translate(x + Math.cos(textStartRadian) * textRadius, y + Math.sin(textStartRadian) * textRadius)
    // // 设置文字旋转角度
    ctx.rotate(Math.PI / 2 + textStartRadian)
    // 填充文字
    ctx.fillText(text, 0, 0)
    // 重置绘制角度
    ctx.restore()
    
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
    // 获奖角度
    let awardPoint = 270
    // 角度总和
    let amount = 0
    // 开始角度
    let startPoint = 0
    let res = ''

    for (let i = 0; i < data.length; i++) {
      let { angle, message } = data[i]
      let min = startPoint + amount + remainder
      let max = startPoint + angle + amount + remainder

      if (min >= 360) {
        min = min % 360
      }
      if (max >= 360) {
        max = max % 360
      }

      if ((max >= min && min <= awardPoint && max >= awardPoint)
        || (max < min && min <= awardPoint)) {
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