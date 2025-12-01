import { DrawCfg } from "@/config/DrawCfg"

/**
 * 计算压力部位时长统计
 * 坐标周边单位内认为是一个部位
 * 
 * @param {*} arr 
 * @returns 
 */1
export function calBodyPress(arr) {
  let labels = []
  let curRet = []
  arr.forEach(element => {
    if (element.value >= DrawCfg.pressPartBody.pressCount) {
      
      let isNear = false

      curRet.forEach(curItem => {
        if (Math.abs(element.x - curItem.x) <= DrawCfg.pressPartBody.partContainStep &&
          Math.abs(element.y - curItem.y) <= DrawCfg.pressPartBody.partContainStep) {
          //忽略该压力点
          isNear = true
        }
      })
      //是新的部位压力达到阈值
      if (!isNear) {
        //新压力阈值 判断是否临近上次的结果
        let startTime = new Date().getTime()
        DrawCfg.pressPartBody.lastRet.forEach(lastItem => {
          if (Math.abs(element.x - lastItem.x) <= DrawCfg.pressPartBody.partContainStep &&
            Math.abs(element.y - lastItem.y) <= DrawCfg.pressPartBody.partContainStep) {
            startTime = lastItem.startTime || new Date().getTime()
          }
        })
        element['startTime'] = startTime


        curRet.push(element)
        let label = document.createElement("label");  //创建一个label标签
        // let miaoTotal = 10000
        let miaoTotalOri = parseInt((new Date().getTime() - element.startTime) / 1000)
        if (miaoTotalOri > DrawCfg.pressPartBody.pressTime) {
          let miaoTotal = parseInt((new Date().getTime() - element.startTime) / 1000) - DrawCfg.pressPartBody.pressTime
          let miao = miaoTotal % 60
          let retTime = String(miao) + '\'\''
          if (miaoTotal > 60 * 60) {
            retTime = (parseInt(miaoTotal % (60)) + '\'') + retTime
            retTime = (parseInt(miaoTotal / (60 * 60)) + ':') + retTime
          } else if (miaoTotal > 60) {//大于1分钟
            retTime = (parseInt(miaoTotal / 60) + '\'') + retTime
          }
          label.innerText = retTime
          // label.innerText = element.value
          label.style = "color:black;border-radius:20px;height:40px;line-height:40px;width:40px;text-align:center;background:rgba(193, 193, 193,0.6);position: absolute; top: "
            + (element.top - 20) + "px;left: " + (element.left - 20) + "px;"; //设置他的属性
          (miaoTotal != 0) && labels.push(label)
        }

      }
    }
  });
  DrawCfg.pressPartBody.lastRet = curRet
  return labels
} 