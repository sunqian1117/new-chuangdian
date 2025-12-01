
import { DrawCfg } from "@/config/DrawCfg"
import { calBodyPress } from "@/utils/bodyUtil"
import { resizeImageDataAndSave } from "@/utils/image-compressor/utils"

function formatDate(date) {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    const seconds = ('0' + date.getSeconds()).slice(-2);
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
//绘制一帧数据
export function draw(data) {
    let calRet = {
        //压力点数据之和
        sumPress: 0,
        //压力点总数
        pressNum: 0,
        //大于50和
        sumFifNum: 0,
        //小于50 大于30和
        sumFifThreNum: 0,
        //最大压力
        max: 0,
        //平均压力
        avgPress: 0,
        //要显示 Lable 
        labels: [],
    }
    let maxOri = 0
    let perFrameCalData = []
    let perFrameOri = []
    let maxPositionList = []
    if (DrawCfg.rotation == 90) {
        let matrix = []
        data.forEach((i, index) => {
            let x = index % DrawCfg.Canvas.widthPickerNum, y = parseInt(index / DrawCfg.Canvas.heightPickerNum)
            let di = parseInt('0x' + i)
            i = cal3200(di)
            i > maxOri ? maxOri = i : maxOri = maxOri
            let t = i > 3 ? i : 0
            // i = cal3200(i)
            //原始值  统计起始值
            if (t > DrawCfg.Cal.minCalValue) {
                perFrameCalData.push(i);
                perFrameOri.push(t);
            }
            //压力值  统计起始值
            if (i > DrawCfg.Cal.minCalRetValue) {
                maxPositionList.push(
                    { y: 40 - y, x, value: i }
                    // { x, y, value: i }
                )
                calRet.sumPress += parseFloat(i);
            }
            if (i > 0 && i > 50) {
                calRet.sumFifNum++
            } else if (i <= 50 && i > 30) {
                calRet.sumFifThreNum++
            }
            //
            matrix[(x + 1) * DrawCfg.Canvas.widthPickerNum - y] = t
            //TODO 对折
            // matrix[x * DrawCfg.Canvas.widthPickerNum + y] = i
        })
        data = matrix
        data.shift()
        if (DrawCfg.isSaving && DrawCfg.saveValType == 'mmHg') {
            window.data += ('[' + formatDate(new Date()) + ']: ' + data.join(' ') + '\n')
            // window.data += ('[' + formatDate(new Date()) + ']: 5A 01 95 6C 00 02 ' + data.join(' ') + '\n')
        }
    }
    this.context.clearRect(0, 0, DrawCfg.Canvas.width, DrawCfg.Canvas.height)
    let points = []
    let arr = []
    data.forEach((i, index) => {
        let x = index % 40, y = parseInt(index / 40)
        //计算第y行第x列
        if (i > 0) {
            if (i > DrawCfg.Cal.minCalRetValue) {
                let label = document.createElement("label");  //创建一个label标签
                label.innerText = parseInt(i)
                let top = y % 2 == 0 ? y * DrawCfg.Canvas.heightStep / 2 + 1 : y * DrawCfg.Canvas.heightStep / 2 - 1
                let left = x % 2 == 0 ? x * 60 / 2 + 6 : x * 60 / 2 + 4
                label.style = "color:black;position: absolute; top: " + top + "px;left: " + left + "px;line-height:12px"; //设置他的属性
                DrawCfg.drwaLabel && calRet.labels.push(label)
                arr.push(
                    { x, y, top, left, value: parseInt(i) }
                )
            }

        }
        //点阵均匀分布在图像上
        let factorX = DrawCfg.Canvas.widthStep / 2//宽度/横向点阵数
        let factorY = DrawCfg.Canvas.heightStep / 2//高度/纵向点阵数 
        // points.push([x * factorX, y * factorY, i * 1]);
        if (DrawCfg.HotMap.reshape) {
            points.push([x * factorX + DrawCfg.Canvas.heightStep / 3, y * factorY + DrawCfg.Canvas.heightStep / 6, i]);
        } else {
            points.push([x * factorX, y * factorY, i]);
        }
    })
    arr.sort((a, b) => b.value - a.value)
    if (DrawCfg.drwaTime) {
        calRet.labels.push(...calBodyPress(arr))
    }

    perFrameCalData = perFrameCalData.sort((a, b) => a - b)
    perFrameOri = perFrameOri.sort((a, b) => a - b)
    let sum = 0
    perFrameOri.forEach(i => { sum += parseInt(i) })
    calRet.pressNum = perFrameCalData.length;
    let p = DrawCfg.Cal.backPercent * (perFrameCalData.length - 1)
    let maxIndex = perFrameCalData.length - (parseInt(p) + 1)
    let calR = perFrameCalData.slice(0, maxIndex)
    // calRet.avgPress = calR.length==0 ? '0.00' :(sum / calR.length).toFixed(2);
    calRet.avgPress = calR.length == 0 ? '0.00' : (sum / perFrameCalData.length).toFixed(2);
    calRet.max = perFrameCalData.length == 0 ? '0.00' : perFrameCalData[maxIndex] //perFrameCalData.length > 30 ? perFrameCalData[maxIndex] : 0
    // 生成灰度图;
    points.forEach(point => {
        this.context.beginPath()
        let alpha = (point[2] - DrawCfg.HotMap.minVal) / (DrawCfg.HotMap.maxVal - DrawCfg.HotMap.minVal)// 根据权重count计算出当前点的alpha
        alpha = alpha > 1 ? 1 : alpha
        alpha = alpha < 0 ? 0 : alpha
        alpha *= DrawCfg.HotMap.alpha
        this.context.globalAlpha = 1 //设置 alpha 透明度
        // this.context.globalAlpha = alpha*0.8 //设置 alpha 透明度
        this.context.arc(point[0], point[1], DrawCfg.HotMap.radius, 0, Math.PI * 2, true)
        // this.context.ellipse(point[0], point[1], DrawCfg.HotMap.radius/2, DrawCfg.HotMap.radius, 0, 0, Math.PI * 2)
        let gradient = this.context.createRadialGradient(point[0], point[1], 0, point[0], point[1], DrawCfg.HotMap.radius)
        gradient.addColorStop(0, 'rgba(0,0,0,' + alpha + ')')
        // gradient.addColorStop(0.7, 'rgba(0,0,0,'+0.5+')')
        // gradient.addColorStop(0.7, 'rgba(0,0,0,'+0.2+')')
        gradient.addColorStop(1, 'rgba(0,0,0,0)')
        this.context.fillStyle = gradient
        this.context.closePath()
        this.context.fill()
    })
    let img = this.context.getImageData(0, 0, DrawCfg.Canvas.width, DrawCfg.Canvas.height)
    let imgData = img.data
    let len = imgData.length
    for (let i = 3; i < len; i += 4) {
        let alpha = imgData[i]
        let offset = alpha * 4
        if (!offset) {
            continue
        }
        //映射颜色RGB值
        imgData[i - 3] = DrawCfg.palette[offset]
        imgData[i - 2] = DrawCfg.palette[offset + 1]
        imgData[i - 1] = DrawCfg.palette[offset + 2]
        // imgData[i] = 255
        imgData[i] = imgData[i] * 10
    }
    this.context.putImageData(img, 0, 0, 0, 0, DrawCfg.Canvas.width, DrawCfg.Canvas.height)

    if (DrawCfg.isSave) {
        const img = this.context.getImageData(0, 0, DrawCfg.Canvas.width, DrawCfg.Canvas.height)
        resizeImageDataAndSave(img, 224, 224)
    }

    return calRet
}



export function cal3200(pressCount) {
    // let mmgh = ((-0.01561 * pressCount + 59.48597) / 0.0006)*0.0075
    let a, b;
    if (DrawCfg.functionSegments[0].min < pressCount <= DrawCfg.functionSegments[0].max) {
        a = DrawCfg.functionSegments[0].a
        b = DrawCfg.functionSegments[0].b
    } else if (DrawCfg.functionSegments[1].min < pressCount <= DrawCfg.functionSegments[1].max) {
        a = DrawCfg.functionSegments[1].a
        b = DrawCfg.functionSegments[1].b
    } else if (DrawCfg.functionSegments[2].min < pressCount <= DrawCfg.functionSegments[2].max) {
        a = DrawCfg.functionSegments[2].a
        b = DrawCfg.functionSegments[2].b
    } else if (DrawCfg.functionSegments[3].min < pressCount <= DrawCfg.functionSegments[3].max) {
        a = DrawCfg.functionSegments[3].a
        b = DrawCfg.functionSegments[3].b
    }
    a = parseFloat(a)
    b = parseFloat(b)
    let mmgh = a * pressCount + b
    let ret = (mmgh * 7.5).toFixed(2)
    ret = ret < 5 ? 0 : ret
    ret = ret * DrawCfg.unitFactor
    return ret > DrawCfg.maxVal ? DrawCfg.maxVal : ret
}

//获取颜色盘 根据某一个像素的灰度值 0-255 获取对应的热力图颜色值
export function getColorPaint1() {
    // const paletteCanvas = document.getElementById("canvas");
    // const paletteCtx = canvas.getContext("2d");
    let paletteCanvas = document.createElement('canvas')
    let paletteCtx = paletteCanvas.getContext('2d')
    paletteCanvas.width = 256
    paletteCanvas.height = 1
    let step = 256 / DrawCfg.HotMap.colors.length
    DrawCfg.HotMap.colorsRe.forEach((color, index) => {
        paletteCtx.fillStyle = color
        paletteCtx.fillRect(step * index, 0, step, 1)
    })
    return paletteCtx.getImageData(0, 0, 256, 1).data
}
export function getColorPaint() {
    // const paletteCanvas = document.getElementById("canvas");
    // const paletteCtx = canvas.getContext("2d");
    let paletteCanvas = document.createElement('canvas')
    let paletteCtx = paletteCanvas.getContext('2d')
    paletteCanvas.width = 256
    paletteCanvas.height = 1
    let gradient = paletteCtx.createLinearGradient(0, 0, 256, 1)// 创建一个长256px的线性渐变条
    let step = 1 / DrawCfg.HotMap.colors.length
    DrawCfg.HotMap.colorsRe.forEach((color, index) => {
        // DrawCfg.HotMap.colors.reverse().forEach((color,index)=>{
        gradient.addColorStop(index * step, color)
    })
    paletteCtx.fillStyle = gradient
    paletteCtx.fillRect(0, 0, 256, 1)
    return paletteCtx.getImageData(0, 0, 256, 1).data
}
//画格子
export function drawChessBoard(boardId) {
    var c = document.getElementById(boardId);
    let context = c.getContext("2d");
    context.fillStyle = 'rgb(0, 0, 0)';
    context.fillRect(0, DrawCfg.Canvas.height, 0, DrawCfg.Canvas.width);
    context.strokeStyle = 'rgb(0, 0, 0)';
    for (var i = 0; i <= 20; i++) {
        //竖线
        context.moveTo(i * DrawCfg.Canvas.widthStep - 0.5, 0 - 0.5);
        context.lineTo(i * DrawCfg.Canvas.widthStep - 0.5, DrawCfg.Canvas.height - 0.5);
        context.lineWidth = 0.5;
        context.stroke();
        //横线
        context.moveTo(0 - 0.5, i * DrawCfg.Canvas.heightStep - 0.5);
        context.lineTo(DrawCfg.Canvas.width - 0.5, i * DrawCfg.Canvas.heightStep - 0.5);
        //水平方向画15根，相距30px
    }
    context.stroke();
}