$(function () {
  const config = {
    w: 800,
    h: 800
  }

  // 渲染
  async function render () {
    const { w, h } = config
    const canvas = document.getElementById('graphics')
    const ctx = canvas.getContext('2d')

    // 设置画布宽高
    canvas.width = w
    canvas.height = h

    // 绘制图片，图片建议为在线地址，不然浏览器会报跨域错误
    await drawImage({ ctx, imageUrl: 'static/images/cow.png' })
  }
  // 绘制图片
  async function drawImage ({
    ctx,
    imageUrl = ''
  }) {
    if (!imageUrl) return

    const imageObj = new Image()

    imageObj.src = imageUrl
    await new Promise(resolve => {
      imageObj.onload = () => {
        const { width, height } = imageObj
        const { w, h } = config
        const x = (w - width) / 2
        const y = (h - height) / 2

        // 绘制图片
        ctx.drawImage(imageObj, x, y, width, height)
        // 获取图片像素颜色
        const imageColor = getImageColor({
          ctx,
          x,
          y,
          width,
          height
        })
        resolve()
      }
    })
  }
  // 获取图片每个坐标点的颜色
  function getImageColor ({ ctx, x, y, width, height }) {
    const contour = []

    for (let i = x; i < x + width; i++) {
      for (let j = y; j < y + height; j++) {
        const { data: [r, g, b, alpha] } = ctx.getImageData(i, j, 1, 1)
        
        if (r === 135 && g === 206 && b === 255) {
          contour.push({
            x: i,
            y: j
          })
        }
      }
    }

    // 清除图片
    // ctx.clearRect(x, y, width, height)
    // 在图片有效区域内填充内容
    fillContent({
      ctx,
      coordinate: contour
    })
  }
  // 在指定坐标区域内，填充数字
  function fillContent ({ ctx, coordinate, x, y }) {
    // 填充的数量
    const count = 200
    const renderText = []

    for (let i = 0; i < count; i++) {
      // 随机填充数字
      let num = randomCoordinate(1, 100)
      // 随机旋转角度
      let rotate = randomCoordinate(0, 2, true) * Math.PI
      let index = randomCoordinate(0, coordinate.length - 1)
      let posX = coordinate[index].x
      let posY = coordinate[index].y
      let color = `#${Math.random().toString(16).substr(-6)}`

      ctx.save()
      // 文字字体
      ctx.font = "24px Microsoft YaHei"
      // 文字样色
      ctx.fillStyle = color;
      // 水平对齐方式
      ctx.textAlign = "center"
      // 垂直对齐方式
      ctx.textBaseline = "middle"
      // 设置文字旋转中心坐标
      ctx.translate(posX, posY)
      // 设置文字旋转角度
      ctx.rotate(rotate)
      // 绘制文字
      ctx.fillText(num, 0, 0)
      ctx.restore()
      renderText.push(coordinate[index])
    }
  }
  // 生成随机数
  function randomCoordinate (min, max, status) {
    if (status) {
      return Math.random() * (max - min) + min
    } else {
      return Math.floor(Math.random() * (max - min) ) + min
    }
  }

  render()
})