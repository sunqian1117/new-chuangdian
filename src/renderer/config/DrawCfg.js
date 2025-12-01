import { LinkType } from "@/config/const"

export class DrawCfg {
  static functionSegments = []
  static toSaveDataPath = ''
  static userDataPath = ''
  static saveTimeStep = 1000 * 60//单位秒
  static checkPos = false
  static showLogo = true
  // static linkType = LinkType.SerialPort
  static linkType = LinkType.WiFi
  static saveValType = 'origin' //origin  mmHg
  static unitOptions = [{
    value: 'mmHg',
    factor: 1,
    label: 'mmHg'
  },
  {
    value: 'gf/cm²',
    factor: 1.35951,
    label: 'gf/cm²'
  },]
  static unit = 'mmHg' //gf/cm²  mmHg
  static unitFactor = 1 //gf/cm²  mmHg
  static wifiPort = 8082
  static dynamicFunction = new Function('pressCount', 'return -0.003663*pressCount +15')
  static test = false
  static isSaving = false
  static maxVal = 100
  static cfgPath = ""
  static fx = {
    a: -0.003663,
    b: 15
  }
  static pressPartBody = {
    pressCount: 50,//单位mmHg
    pressTime: 10,//时长阈值单位秒
    partContainStep: 3,//单位秒
    lastRet: [],//统计结果
  }

  static cnnCfg = {
    modelFilepath: 'static/last.onnx',
  }
  // static isSave = true
  static isSave = false
  static cnnSession = null
  //默认开启显示 数值
  // static drwaLabel = false
  // static drwaBord = false

  static posCheck = false
  static drwaTime = false
  static drwaBord = false
  // static drwaLabel = true
  static drwaLabel = false
  //色盘
  static palette = []

  //旋转
  static rotation = 90

  static Cal = {
    //被计算的最低值
    minCalValue: 0,
    maxCalValue: 4000,
    //统计显示最低值
    minCalRetValue: 0,
    i: 1,
    p: 3.6,
    areaFactor: 10,
    backPercent: 0.0,
  }
  // static xF = 1   1283   520
  // static yF = 1
  static xF = 1.25
  // static xF = 1.6
  static yF = 0.65
  static Canvas = {
    width: 800 * DrawCfg.xF,
    height: 800 * DrawCfg.yF,
    widthPickerNum: 40,
    heightPickerNum: 40,
    widthStep: 40 * DrawCfg.xF,
    heightStep: 40 * DrawCfg.yF,
  }
  //等比缩放
  // static Canvas = {
  //   width: 1200,
  //   height: 600,
  //   widthPickerNum:40,
  //   heightPickerNum:40,
  //   widthStep:60,
  //   heightStep:30,
  // }

  static HotMap = {
    checked: false,
    reshape: true,
    alpha: 0.92,
    minVal: 0,
    //采集点位数据的最值 理论最大值 255 
    // 60 为灰度最会
    maxVal: 100,
    //热力点半径 输出热力点位之间的距离
    // radius: 30,
    radius: 25,
    // radius: ((40 * DrawCfg.xF + 40 * DrawCfg.yF) / 2)*.85,
    colors: [// 自定义颜色
      'rgba(252, 44, 33,1)',
      'rgba(243, 134, 43,1)',
      'rgba(242, 159, 90,1)',
      'rgba(221, 253, 66,1)',
      'rgba(109, 251, 63,1)',
      'rgba(96, 249, 180,1)',
      'rgba(172, 244, 166,1)',
      'rgba(136, 234, 253,1)',
      'rgba(191, 251, 255,1)',
      'rgba(255, 255, 255,1)',
    ],
    colorsRe: [// 自定义颜色
      'rgba(252, 44, 33,1)',
      'rgba(243, 134, 43,1)',
      'rgba(242, 159, 90,1)',
      'rgba(221, 253, 66,1)',
      'rgba(109, 251, 63,1)',
      'rgba(96, 249, 180,1)',
      'rgba(172, 244, 166,1)',
      'rgba(136, 234, 253,1)',
      'rgba(191, 251, 255,1)',
      'rgba(255, 255, 255,1)',
    ].reverse(),
  }

}
