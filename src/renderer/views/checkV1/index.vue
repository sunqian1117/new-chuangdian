<template>
  <div class="bg">
    <div class="bar">
      <div class="sysTitle">
        <img class="topTlbg" :src="topTitle">
      </div>
    </div>
    <div v-if="showLogo" class="logoback" @click="goBack"></div>
    <i v-else class="el-icon-s-home" style="color: white;font-size: 32px;margin-left: 100px;" @click="goBack"></i>
    <div style="position: absolute;z-index: 2;top: 0;left: 0;display: none;">
      <input type="file" name="file" id="file" @change="onchange" />
    </div>
    <div style="display: flex;flex-direction: row;justify-content: center;z-index: 10;margin-top: 20px;">
      <div class="btm1">
        <div class="bts">
          <div v-if="linkType == LinkType.SerialPort">
            <!-- <el-button type="primary" size="medium" @click="dialogVisible = true">参数设置</el-button> -->
            <el-select v-model="chooseCom" @visible-change="checkPorts" size="medium" placeholder="请选择"
              style="width: 140px;margin-right: 20px;">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"
                :disabled="item.disabled">
              </el-option>
            </el-select>
          </div>
          <div v-if="linkType == LinkType.WiFi">
            <el-button type="primary" size="medium" class="el-icon--right" :loading="sock == null" @click="handleWiFi"
              style="width: 200px;">{{ sock ? '断开连接' : '等待连接设备'
              }}</el-button>
          </div>
          <el-select v-model="chooseUnit" size="medium" placeholder="请选择" style="width: 160px;margin:0 20px;">
            <el-option v-for="item in unitOptions" :key="item.value" :label="item.label" :value="item.value"
              :disabled="item.disabled">
            </el-option>
          </el-select>
          <el-button icon="el-icon-monitor" type="primary" size="medium" style="margin-left: 20px;"
            :style="{ color: showData ? 'white' : 'rgba(0,0,0,0.5)' }" @click="showData = !showData"></el-button>
          <!-- <i class="el-icon-data-analysis" style="font-size: 32px;margin-left: 60px;color:white;cursor: pointer;"></i> -->
        </div>
        <div v-if="test">
          透明<el-slider v-model="alpha" :max="1" :min="0" :step="0.02" show-input>
          </el-slider>
          半径<el-slider v-model="radius" :max="60" :min="1" :step="0.5" show-input>
          </el-slider>
          <el-checkbox v-model="reshape">方/长</el-checkbox>
          <el-checkbox v-model="checked">画板渐变</el-checkbox>
        </div>
        <div style="display: flex;margin-top: 20px;">
          <div class="itemInfo"
            style="flex-direction: column;border-radius: 30px; padding: 10px 10px;height: 120px;width: 235px;">
            <div class="itemName">最大压力{{ chooseUnit }}</div>
            <div class="itemValue">{{ maxPress }}</div>
          </div>
          <div class="itemInfo"
            style="flex-direction: column;border-radius: 30px;padding: 10px 10px;height: 120px;margin-left: 10px;width: 235px;">
            <div class="itemName">平均压力{{ chooseUnit }}</div>
            <div class="itemValue">{{ avgPress }}</div>
          </div>
        </div>
        <div class="itemInfo" style="padding:  40px 30px;width: 480px;">
          <div class="itemName">总压力面积/cm²</div>
          <div class="itemValue" style="margin-left: 23px;">{{ allArea }}</div>
        </div>
        <div class="itemInfo2">
          <div class="itemName2">压力面积/cm² 30-50{{ chooseUnit }}</div>
          <div class="itemValue" style="margin-left: 23px;">{{ areaFiveThree }}</div>
        </div>
        <div class="itemInfo2">
          <div class="itemName2">压力面积/cm² 大于50{{ chooseUnit }}</div>
          <div class="itemValue" style="margin-left: 23px;">{{ areaFive }}</div>
        </div>

        <div class="itemInfo" style="padding: 40px 30px;width: 480px;">
          <div class="itemName">当前睡姿</div>
          <div class="itemValue" style="margin-left: 23px;">{{ pos || '未检测' }}</div>
        </div>

      </div>
      <div
        style="display: flex;flex-direction: row;justify-content: center;z-index: 10;padding: 20px 30px;border-radius: 10px;">
        <div class="hotMapBg">
          <HotMap :color="'rgba(255, 255, 255, 0.7)'" ref="hotMap" class="hotMapBg" style="border: 0px solid black;">
          </HotMap>
          <div style="display: flex;justify-content: end;align-items: center;color: white;">
            <img :src="ktlogo">
            <span style="margin: 0 10px;font-size: 16px;font-weight: 550;"> 健康与防护智能纺织品研究中心 </span>
          </div>
        </div>
        <div class="lContainer">
          <div class="legency">
            <div class="colorsBlk">
              <div class="blockColor2" v-for="(cc, index) of colors" :style="{ backgroundColor: cc }">
              </div>
            </div>
            <div class="colorsBlkT">
              <div class="blockColor2" v-for="(tt, index) of txts" v-if="index != 10">
                <el-input-number size="mini" v-if="index == 0" v-model="max" controls-position="right"
                  :min="min + 10"></el-input-number>
                <label v-else>{{ tt }} </label>
              </div>
            </div>
          </div>
          <el-input-number v-model="min" size="mini" controls-position="right" :max="max - 10"></el-input-number>
          <div style="color: white;margin-top: 10px;">{{ chooseUnit }}</div>
        </div>
      </div>

    </div>
    <div style="display: flex;justify-content:center;">
      <div class="bobts">
        <el-button @click="startCheck">{{ isStartCheck ? '停止测试' : '开始测试' }}</el-button>
        <el-button @click="save">{{ isSaving ? '结束保存' : '开始保存' }}</el-button>
        <el-button @click="genReport">查看报告</el-button>
        <el-button @click="startReplay">数据回放</el-button>
      </div>
      <!-- <div style="font-size: 32px;color: black;margin-left: 20px;display: none;">青岛大学联合研发
        <img :src="qcode" width="60" height="60" />
      </div> -->
    </div>

    <el-dialog v-dialogDrags title="参数设置" :visible.sync="dialogVisible" width="50%" style="font-size: 22px;">
      <div slot="title">参数设置
        <!-- <el-button type="text" @click="openCfg" icon="el-icon-edit-outline"  > </el-button> -->
      </div>
      <el-form ref="form" label-width="180px">
        <el-form-item label="a">
          <el-input v-model="a" show-input>
          </el-input>
        </el-form-item>
        <el-form-item label="b">
          <el-input v-model="b" show-input>
          </el-input>
        </el-form-item>
        <el-form-item label="采样点面积因子">
          <el-slider v-model="areaFactor" :max="30" :min="0.5" :step="0.1" show-input>
          </el-slider>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="参数设置" :visible.sync="dialogReportVisible" width="1280px" style="font-size: 22px;"
      class="reportCls">
      <div id="pafDom" style="display: flex;flex-direction: column;">
        <div style="padding-top: 20px;">检测日期： {{ reportTime }}</div>
        <div class="title">
          <div class="xilog"></div>
          身体压力管理报告
        </div>
        <div class="subtitle">身体压力分布图</div>
        <div style="position: relative;">
          <HotMap :color="'rgba(0, 0, 0, 1)'" ref="hotMapReport" class="repHot" @posRest="posRest"
            style="margin-top: 40px;background:white;padding-right: 80px;"></HotMap>
          <div
            style="display: flex;flex-direction: column;  align-self: center; position: absolute;right: 40px;top: 120px;">
            <div class="legency" :style="{ height: legencyHeight }">
              <div class="colors" :style="{ height: legencyHeight, border: '1px solid black' }">
                <div class="blockColor" v-for="cc of colors" :style="{ backgroundColor: cc }"></div>
              </div>
              <div class="txts" :style="{ height: legencyHeight, color: 'black' }">
                <div class="blocKTxt" style="color:black;width: 60px;" v-for="tt of txts">{{ tt }}</div>
              </div>
            </div>
            <div style="color: black;">{{ chooseUnit }}</div>
          </div>
        </div>
        <div class="subtitle">压力数据</div>
        <el-descriptions :column="2" border class="btmInfo mbt20">
          <el-descriptions-item label="总压力面积/cm²" :contentStyle="{ 'min-width': '200px' }">
            {{ report.allArea }} </el-descriptions-item>
          <el-descriptions-item :label="'最大压力' + chooseUnit" :contentStyle="{ 'min-width': '200px' }">
            {{ report.maxPress }}
          </el-descriptions-item>
          <el-descriptions-item :label="'大于50' + chooseUnit + '压力面积/cm²'" :contentStyle="{ 'min-width': '200px' }">{{
            report.areaFive
          }}</el-descriptions-item>
          <el-descriptions-item :label="'平均压力' + chooseUnit" :contentStyle="{ 'min-width': '200px' }">{{ report.avgPress
          }}</el-descriptions-item>
          <el-descriptions-item :label="'30-50' + chooseUnit + '压力面积/cm²'" :contentStyle="{ 'min-width': '200px' }">{{
            report.areaFiveThree
          }}</el-descriptions-item>
          <el-descriptions-item label="睡姿" :contentStyle="{ 'min-width': '200px' }">{{
            report.pos || '未检测'
          }}</el-descriptions-item>
        </el-descriptions>
        <div style="font-size: 32px;color: black;margin-left: 20px;">青岛大学联合研发
          <img :src="qcode" width="60" height="60" />
        </div>
      </div>
      <el-button id="saveBt" type="warning" size="medium" style="position:absolute;top:20px;right:20px;"
        @click="savePdf">保存</el-button>
    </el-dialog>
  </div>
</template>

<script>
import HotMap from "@/components/HotMap";
import { DrawCfg } from "@/config/DrawCfg"
import { ipcRenderer, shell } from "electron";
const fs = window.require('fs');
const path = window.require('path');
import os from "os"
import qcode from '@/assets/imgs/qcode.jpg'
import domtoimage from 'dom-to-image-more';
import { getColorPaint, getColorPaint1 } from "@/utils/draw";
import topTitle from '@/assets/imgsV1/content_top_title.png'
import nnn from '@/assets/imgsV1/nnn.png'
import ktlogo from '@/assets/imgsV1/ktlogo.png'
import { hexToBuf, bufToHex } from '../../utils/convert'
import net from 'net';
import { LinkType } from "@/config/const"
import { log } from "console";
import { format } from "date-fns";

export default {
  name: "home",
  components: {
    HotMap
  },
  data: () => {

    return {
      isSaving: false,
      sock: null,
      LinkType,
      linkType: DrawCfg.linkType,
      showLogo: DrawCfg.showLogo,
      test: DrawCfg.test,
      qcode,
      ktlogo,
      nnn,
      topTitle,
      showData: false,
      a: DrawCfg.fx.a,
      b: DrawCfg.fx.b,
      max: DrawCfg.HotMap.maxVal,
      min: DrawCfg.HotMap.minVal,
      reportTime: '',
      allArea: "",
      areaFive: "",
      areaFiveThree: "",
      pos: "",
      maxPress: "",
      avgPress: "",
      report: {
        allArea: "",
        areaFive: "",
        areaFiveThree: "",
        pos: "",
        maxPress: "",
        avgPress: "",
      },
      legencyHeight: (DrawCfg.HotMap.colors.length * 40 + 2) + 'px',
      colors: DrawCfg.HotMap.colors,
      txts: [],
      backPercent: DrawCfg.Cal.backPercent,
      pressTime: DrawCfg.pressPartBody.pressTime,
      pressCount: DrawCfg.pressPartBody.pressCount,
      hotFactor: DrawCfg.Cal.hotFactor,
      p: DrawCfg.Cal.p,
      i: DrawCfg.Cal.i,
      minCalValue: DrawCfg.Cal.minCalValue,
      areaFactor: DrawCfg.Cal.areaFactor,
      radius: DrawCfg.HotMap.radius,
      alpha: DrawCfg.HotMap.alpha,
      checked: DrawCfg.HotMap.checked,
      reshape: DrawCfg.HotMap.reshape,
      // dialogReportVisible: true,
      dialogReportVisible: false,
      dialogVisible: false,
      isStartCheck: false,
      chooseCom: '',
      chooseUnit: DrawCfg.unit,
      chooseBaud: 230400,
      baudOptions: [
        { value: 230400 },
        { value: 115200 },
        { value: 19200 },
      ],
      unitOptions: DrawCfg.unitOptions,
      options: []
    }
  },
  watch: {
    chooseUnit: {
      handler() {
        DrawCfg.unit = this.chooseUnit
        DrawCfg.unitFactor = DrawCfg.unitOptions.filter(a => a.value == this.chooseUnit)[0].factor
      }
    },
    isSaving: {
      handler() {
        DrawCfg.isSaving = this.isSaving
      },
      immediate: true,
    },
    showData: {
      handler() {
        DrawCfg.drwaLabel = this.showData
      },
      immediate: true,
      deep: true
    },
    max: {
      handler() {
        // this.max = this.max||(this.min+10)
        if (this.max) {
          DrawCfg.HotMap.maxVal = parseFloat(this.max)
          this.reGenTxt()
        } else {
          this.$nextTick(() => {
            this.max = parseInt(DrawCfg.HotMap.maxVal)
          })
        }
      },
      immediate: true,
      deep: true
    },
    min: {
      handler() {
        if (this.min) {
          DrawCfg.HotMap.minVal = parseFloat(this.min)
          this.reGenTxt()
        } else {
          this.$nextTick(() => {
            this.min = parseInt(DrawCfg.HotMap.minVal)
          })
        }
      },
      immediate: true,
      deep: true
    },
    a: {
      handler() {
        DrawCfg.fx.a = parseFloat(this.a)
      },
      immediate: true,
      deep: true
    },
    b: {
      handler() {
        DrawCfg.fx.b = parseFloat(this.b)
      },
      immediate: true,
      deep: true
    },
    backPercent: {
      handler() {
        DrawCfg.Cal.backPercent = this.backPercent
      },
      immediate: true,
      deep: true
    },
    minCalValue: {
      handler() {
        DrawCfg.Cal.minCalValue = this.minCalValue
      },
      immediate: true,
      deep: true
    },
    areaFactor: {
      handler() {
        DrawCfg.Cal.areaFactor = this.areaFactor
      },
      // immediate: true,
      deep: true
    },
    radius: {
      handler() {
        DrawCfg.HotMap.radius = this.radius
        this.drawTest()
      },
      // immediate: true,
      deep: true
    },
    alpha: {
      handler() {
        DrawCfg.HotMap.alpha = this.alpha
        this.drawTest()
      },
      // immediate: true,
      deep: true
    },
    radius: {
      handler() {
        DrawCfg.HotMap.radius = this.radius
        this.drawTest()
      },
      // immediate: true,
      deep: true
    },
    reshape: {
      handler() {
        DrawCfg.HotMap.reshape = this.reshape
        if (this.reshape) {
          DrawCfg.xF = 1
          DrawCfg.yF = 1
        } else {
          DrawCfg.xF = 1.2
          DrawCfg.yF = 0.65
        }
        this.drawTest()
      },
      // immediate: true,
      deep: true
    },
    checked: {
      handler() {
        if (this.checked) {
          DrawCfg.palette = getColorPaint1()
        } else {
          DrawCfg.palette = getColorPaint1()
        }
        this.drawTest()
      },
      immediate: true,
      deep: true
    },
    pressTime: {
      handler() {
        DrawCfg.pressPartBody.pressTime = this.pressTime
      },
      immediate: true,
      deep: true
    },
    pressCount: {
      handler() {
        DrawCfg.pressPartBody.pressCount = this.pressCount
      },
      immediate: true,
      deep: true
    },
    i: {
      handler() {
        DrawCfg.Cal.i = this.i
      },
      immediate: true,
      deep: true
    },
    p: {
      handler() {
        DrawCfg.Cal.p = this.p
      },
      immediate: true,
      deep: true
    }
  },
  created() {
    DrawCfg.pressPartBody.lastRet = []
    // fetch(DrawCfg.cnnCfg.modelFilepath).then(response => {
    //   response.arrayBuffer().then(modelFile => {
    //     initSession(modelFile)
    //   });
    // });
    ipcRenderer.on("cfgInfoOk", (event, dataInfo) => {
      const { cfgPath } = dataInfo
      DrawCfg.cfgPath = cfgPath
      if (fs.existsSync(cfgPath)) {
        fs.readFile(cfgPath, 'utf-8', (err, data) => {
          if (err) {
            throw err;
          }
          const cfg = JSON.parse(data.toString());
          DrawCfg.fx.a = cfg.a
          DrawCfg.fx.b = cfg.b
          DrawCfg.Cal.areaFactor = cfg.areaFactor
          DrawCfg.HotMap.maxVal = cfg.max
          DrawCfg.HotMap.minVal = cfg.min
          DrawCfg.maxVal = cfg.maxVal || 100
          this.a = cfg.a
          this.b = cfg.b
          this.areaFactor = cfg.areaFactor
          this.max = cfg.max
          this.min = cfg.min
        });
      } else {
        fs.writeFileSync(
          cfgPath,
          JSON.stringify({
            a: DrawCfg.fx.a,
            b: DrawCfg.fx.b,
            max: DrawCfg.HotMap.maxVal,
            min: DrawCfg.HotMap.minVal,
            areaFactor: DrawCfg.Cal.areaFactor,
            maxVal: DrawCfg.maxVal,
          }, null, "\t"),
          { encoding: "utf-8" }
        )
      }
    })
    ipcRenderer.on("onPorts", (event, arg) => {
      let data = JSON.parse(arg)
      this.options = []
      data.forEach(item => {
        this.options.push({
          value: item.path,
          label: item.path,
        })
      })
    })
    let server = net.createServer()
    this.server = server
    server.listen(DrawCfg.wifiPort)
    server.on('connection', sock => {
      this.sock = sock
      // 为这个socket实例添加一个"data"事件处理函数
      sock.on('data', data => {

        if (!this.isStartCheck) {
          return
        }
        data = bufToHex(data)
        if (data.startsWith('5A 01 95 6C 00 02') && data.substr(22, 1) == 1) {
          console.time('a')
          this.data1 = data
          this.lastData = 1
        } else if (data.startsWith('5A 01 95 6C 00 02') && data.substr(22, 1) == 2) {
          this.data2 = data
          this.lastData = 2
        } else {
          if (this.lastData == 1) {
            this.data1 += data
          } else if (this.lastData == 2) {
            console.timeEnd('a')
            this.data2 += data
            if (this.data1 && this.data2) {
              let data1 = [...this.data1.split(' ').slice(8, 1600 + 8), ...this.data2.split(' ').slice(8, 1600 + 8)]
              if (data1.length == 3200) {
                this.handleData(data1)
              }
            }

          }
        }
        // this.lastData = 0
        // data += ''
        // if (data.startsWith('5A 01 95 6C 00 02 DE 01')) {
        //   this.data1 = data.split(' ').slice(8, 1600 + 8)
        // } else if (this.data1 && data.startsWith('5A 01 95 6C 00 02 DE 02')) {
        //   data = [...this.data1,...(data.split(' ').slice(8, 1600 + 8))]
        //   this.data1 = null
        //   this.handleData(data)
        // }
      });
      // 为这个socket实例添加一个"close"事件处理函数
      sock.on('close', function (data) {
      });
      sock.on('error', function (e) {
      });
    });
    ipcRenderer.on("onRecivePortData", (event, data) => {
      this.handleData(data)
    })
    ipcRenderer.invoke("startCheckPorts");
    ipcRenderer.invoke("getCfgInfo");


  },
  mounted() {
    this.txts = []
    let step = (DrawCfg.HotMap.maxVal - DrawCfg.HotMap.minVal) / DrawCfg.HotMap.colors.length
    for (let i = 0; i <= DrawCfg.HotMap.colors.length; i++) {
      this.txts.push(parseInt(DrawCfg.HotMap.maxVal - i * step))
    }
    if (DrawCfg.test) {
      this.drawTest()
    }
  },
  methods: {
    saveData(filePath, toSaveData, isOpen) {
      console.log(filePath);
      fs.appendFileSync(
        filePath,
        toSaveData,
        { encoding: "utf-8" }
      )
      if (isOpen) {
        this.$alert("保存完成！", "提示", {
          confirmButtonText: "确定",
          callback: (action) => {
            shell.openPath(filePath);
          },
        });
      }
    },
    handleWiFi() {
      if (this.sock) {
        if (this.isStartCheck) {
          this.$message.error("正在测试中，请先停止测试！");
          return
        }
        this.sock.end()
        this.sock.destroy()
        this.sock = null
      }
    },
    handleData(data) {
      let _this = this
      if (!this.isStartCheck) {
        return
      }
      if (this.isSaving && DrawCfg.saveValType == 'origin') {
        console.log('recording....');
        window.data += ('[' + _this.formatDate(new Date()) + ']: 5A 01 95 6C 00 02 ' + data.join(' ') + '\n')
      }
      // draw.call(this, data);
      let data1 = []
      for (let index = 0; index < 1600; index++) {
        data1[index] = data[2 * index + 1] + data[2 * index]
      }
      let ret = _this.$refs.hotMap.draw(data1)
      window.toReportData = data1
      _this.getArea(ret)
    },

    drawTest() {
      if (DrawCfg.test == false) return;
      let start = 9
      let line = "[2024-10-14 10:17:04]: 5A 01 95 6C 00 02 5B 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F EE 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F D3 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F EE 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F 90 0F B0 0E FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F E2 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F 67 0A A8 07 46 0D FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F 88 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F EE 0F 39 09 E4 02 7C 0B FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F 74 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F C0 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F DC 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F 61 0F D3 0F F3 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F E1 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F AB 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F F9 0F B9 0F FF 0F F3 0F 81 0F 74 0F 33 0F 26 0E 8F 0C 05 0D 83 0D 33 0C 9A 0D 1D 0C A8 0B 9C 0D 43 0F DF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F D0 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F DB 0F 8C 0F BF 0F FF 0F FF 0F C2 0F 86 0E A9 0C 03 0B 0F 0B 45 0C F9 0B 93 0B 27 0C AA 0C E5 0B D9 0A E8 0B 7B 0E 90 0F DE 0F FF 0F FF 0F FE 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F C9 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F E5 0F CC 0F FF 0F FF 0F FF 0F FF 0F D6 0F 0D 0F B9 0D 44 0D 36 0C E1 0B 14 0C 54 0B 82 0B E3 0B F4 0A 21 0C 95 0F FF 0F FF 0F FF 0F FF 0F FF 0F EF 0F D5 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F E6 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F B0 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F C3 0E 32 0D AB 0B D7 09 3F 0A C9 09 5A 0B AB 0C DC 0E FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F B3 0F FF 0F FF 0F FF 0F FF 0F FF 0F F9 0F FF 0F FF 0F FF 0F FF 0F F3 0D E2 04 85 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F 0C 0F 43 0E 16 0D 64 0D 81 0E 5D 0D 14 0D FC 0D BA 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F F1 0F BC 0E AC 0F FF 0F FF 0F FF 0F F6 0F FF 0F FF 0F FF 0F FF 0F 00 0E FE 0C FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F BF 0E A8 0E 20 0F FF 0F 85 0F 3A 0E C6 0D FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F B8 08 82 0A 47 0F FF 0F FF 0F 95 0F FF 0F FF 0F FF 0F FF 0F 8E 0E 48 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F A7 0F 51 0F E1 0F FF 0F 75 0F 97 0E 38 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F A1 0F 9D 0E FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F A1 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F C7 0F 96 0F 6E 0E B0 0C 00 01 E8 0B A1 0E 35 0F 57 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F 79 0F D7 0F FF 0F FF 0F B5 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F AE 0F 82 0E 23 0D 40 0D EB 0C A3 0C 9F 09 99 0B A4 0B AB 0D 5B 0E 77 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F 6D 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F EE 0E 52 0E AA 0D BE 0C DE 0A 15 08 47 05 0E 05 0B 08 B0 0A A8 0C A6 0E 81 0E EF 0E FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F B3 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F 70 0F E8 0D B3 0C 67 0D C5 0B 3E 0A 41 09 7E 08 73 09 D3 09 A6 0A 2A 0C 22 0D 0B 0E C9 0E 8B 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F A5 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F 37 0F 70 0D 4B 0C B7 0C 48 0B AA 0B BD 0B 2C 0D 3B 0E 45 0C 72 0B B2 0B F1 0B 9B 0C 24 0E 89 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F F0 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F 9E 0F 52 0D 5F 0C F7 0C D4 0D C2 0E 49 0F F0 0F FF 0F D9 0F 82 0E 0D 0D 80 0C B5 0B C9 0C F8 0E FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0E 12 0E 65 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F BC 0F B8 0E EB 0D E8 0E FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F E6 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F 67 0F C9 0E 91 0E FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F 24 0F CD 0E 13 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F 9F 0F EF 0D 59 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F DD 0F FD 0E E4 0E FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F AC 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F F4 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F A4 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F C9 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F ED 0E 07 0E 44 0E FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F F1 0D 9C 0D B9 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F E5 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F B9 0E E3 0B A6 0C 6E 0E FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F 0D 0F 83 0B 8A 0B 2D 0D FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F 69 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F C3 0F 71 0D C5 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F 1A 0E AC 0E FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F AE 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F 7D 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F DD 0F F0 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F ED 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F BE 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F 52 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F B6 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F A0 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F BA 0F D3 0E FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F A4 0D FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF 0F FF"
      let data1 = line.split(" ").slice(start, 3200 + 9)
      let data = []
      for (let index = 0; index < 1600; index++) {
        data[index] = data1[2 * index] + data1[2 * index + 1]
      }
      let ret = this.$refs.hotMap.draw(data)
      window.toReportData = data
      this.getArea(ret)
      this.$nextTick(() => {
        this.showData = true
      })
    },
    openCfg() {
      shell.openPath(DrawCfg.cfgPath);
    },
    reGenTxt() {
      this.txts = []
      let step = (DrawCfg.HotMap.maxVal - DrawCfg.HotMap.minVal) / DrawCfg.HotMap.colors.length
      for (let i = 0; i <= DrawCfg.HotMap.colors.length; i++) {
        this.txts.push(parseInt(DrawCfg.HotMap.maxVal - i * step))
      }
    },
    posRest(ret) {
      this.report.pos = ret.name
    },
    getArea(ret) {
      let { pressNum, sumFifNum, sumFifThreNum, pos, max, avgPress } = ret
      let pressAre = (pressNum * DrawCfg.Cal.areaFactor).toFixed(2);
      let pressFifAre = (sumFifNum * DrawCfg.Cal.areaFactor).toFixed(2);
      let pressFifThreeAre = (sumFifThreNum * DrawCfg.Cal.areaFactor).toFixed(2);
      this.allArea = pressAre
      this.areaFive = pressFifAre
      this.areaFiveThree = pressFifThreeAre
      this.pos = pos
      this.maxPress = max > DrawCfg.maxVal ? DrawCfg.maxVal : max
      this.maxPress = new Number(this.maxPress).toFixed(2)
      // document.getElementById('minPress').innerText = mmHgMin.toFixed(2)
      this.avgPress = avgPress
      // this.avgPress = (pressNum == 0 ? 0 : sumPress / pressNum).toFixed(2)
    },
    getReportArea(ret) {
      let { pressNum, sumFifNum, sumFifThreNum, pos, max, avgPress } = ret
      let pressAre = (pressNum * DrawCfg.Cal.areaFactor).toFixed(2);
      let pressFifAre = (sumFifNum * DrawCfg.Cal.areaFactor).toFixed(2);
      let pressFifThreeAre = (sumFifThreNum * DrawCfg.Cal.areaFactor).toFixed(2);
      this.report.allArea = pressAre
      this.report.areaFive = pressFifAre
      this.report.areaFiveThree = pressFifThreeAre
      this.report.pos = pos
      this.report.maxPress = max > DrawCfg.maxVal ? DrawCfg.maxVal : max
      this.report.maxPress = new Number(this.report.maxPress).toFixed(2)
      // document.getElementById('minPress').innerText = mmHgMin.toFixed(2)
      this.report.avgPress = avgPress
      // this.report.avgPress = (pressNum == 0 ? 0 : sumPress / pressNum).toFixed(2)
    },
    onchange(evt) {
      if (evt.target.files.length == 0) {
        return
      }
      if (window.interval) {
        clearInterval(window.interval)
      }
      let file = evt.target.files[0];
      let reader = new FileReader();
      let start = 9
      reader.onload = (e) => {
        window.data = ''
        let dataAll = e.target.result
        let lines = dataAll.split(/\r\n|\n/);
        let line = 0
        if (window.interval) {
          clearInterval(window.interval)
        }
        window.interval = setInterval(() => {
          // console.time('test')
          if (line >= lines.length) {
            clearInterval(window.interval)
          }
          if (lines[line]) {
            window.timeName = lines[line].substr(1, 19)
            let data1 = lines[line].split(" ").slice(start, 3200 + start)
            data1.push('FF')
            if (this.isSaving && DrawCfg.saveValType == 'origin') {
              window.data += ('[' + this.formatDate(new Date()) + ']: 5A 01 95 6C 00 02 ' + data1.join(' ') + '\n')
            }
            let data = []
            for (let index = 0; index < 1600; index++) {
              data[index] = data1[2 * index] + data1[2 * index + 1]
            }
            // let data = lines[line].split(" ").slice(start, 1600 + start)
            let ret = this.$refs.hotMap.draw(data)
            window.toReportData = data
            this.getArea(ret)
          }
          // console.timeEnd('test')
          line++
          // }, 0)
          // }, (3000))
        }, (1000 / 8))
      };
      reader.readAsText(file);
      evt.target.value = null
    },
    formatDate(date) {
      const year = date.getFullYear();
      const month = ('0' + (date.getMonth() + 1)).slice(-2);
      const day = ('0' + date.getDate()).slice(-2);
      const hours = ('0' + date.getHours()).slice(-2);
      const minutes = ('0' + date.getMinutes()).slice(-2);
      const seconds = ('0' + date.getSeconds()).slice(-2);
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    },
    genReport() {
      // window.toReportData = '00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 01 00 00 00 01 01 04 01 01 02 01 01 01 00 00 00 00 01 03 24 0E 01 00 00 00 00 00 00 00 02 09 36 08 02 01 00 00 00 00 00 00 01 00 00 00 01 02 00 00 00 00 00 00 00 00 00 00 00 02 1E 0D 01 00 00 00 00 00 00 00 01 02 18 0D 01 00 00 00 00 00 00 00 02 00 00 00 00 01 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 01 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 01 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 01 02 01 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 01 07 04 00 00 00 00 00 00 00 00 00 00 01 0D 10 0D 02 00 00 00 00 00 00 00 00 00 00 00 01 00 00 00 00 00 00 00 00 00 01 07 1F 19 04 00 00 00 00 00 00 00 00 01 13 31 24 24 04 01 00 00 00 00 00 00 00 00 00 00 01 00 00 00 00 00 00 00 00 00 01 08 1A 13 02 00 00 00 00 00 00 00 00 01 10 2C 1B 15 02 01 00 00 00 00 00 00 02 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 02 01 00 00 00 00 00 00 00 00 00 00 02 08 04 01 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 01 00 00 01 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 01 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 01 00 00 00 00 00 01 02 00 00 02 04 01 03 01 00 01 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 01 01 00 00 01 00 00 01 01 00 00 01 02 02 01 01 01 01 00 00 01 03 01 01 00 00 00 00 00 02 03 02 01 00 00 00 00 01 00 00 02 03 00 00 01 00 00 02 02 01 00 02 0B 1B 11 0F 0D 05 01 05 11 18 0F 0E 08 07 09 0A 0C 15 12 0F 04 01 00 00 01 09 16 09 18 06 01 00 00 00 00 01 01 01 00 00 00 02 03 02 01 03 01 02 0A 0D 10 16 22 31 3A 2E 1B 13 0C 06 01 00 00 00 01 00 00 01 04 00 00 00 00 00 00 01 01 00 00 00 00 00 00 00 01 01 01 02 08 0A 0F 1F 34 39 33 3D 28 1C 11 07 01 00 00 00 01 00 00 02 04 00 00 00 00 00 00 00 02 01 00 00 00 00 08 06 01 01 00 00 00 01 01 02 04 04 07 06 03 01 00 00 00 00 00 00 01 00 01 08 02 00 00 00 00 00 00 00 01 01 00 00 00 01 11 19 07 01 00 00 00 00 00 00 00 00 01 02 02 00 00 00 00 00 00 00 00 00 06 14 02 00 00 00 00 00 00 00 02 01 00 00 00 01 08 1F 12 02 00 00 00 00 00 00 01 01 02 05 09 04 01 01 00 00 00 00 00 01 24 2C 02 00 00 00 00 00 00 01 01 00 00 00 00 01 03 0F 0F 02 00 01 00 00 00 01 05 03 02 06 0C 0B 02 01 00 00 00 00 01 02 0C 08 00 00 00 00 00 00 00 01 01 00 00 00 00 00 01 02 05 02 00 01 00 00 01 08 0B 09 0A 0B 12 14 0B 02 01 00 00 00 00 00 00 00 00 00 00 00 00 00 00 01 01 01 00 00 00 00 00 00 01 00 01 01 02 06 0F 1E 17 13 18 19 1B 1F 21 19 06 01 01 01 01 00 00 00 00 00 00 00 01 00 00 01 00 01 00 00 00 00 00 00 01 01 02 04 0F 24 2C 27 1B 15 13 16 1E 26 3C 3D 1A 05 02 02 02 01 00 00 00 00 00 00 00 00 00 02 00 01 01 00 00 00 00 00 01 01 01 02 01 04 08 0B 0A 05 03 06 0C 0B 0B 04 02 01 00 00 01 00 00 00 00 00 00 00 00 00 00 01 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 01 01 00 00 00 00 00 00 00 00 00 00 00 01 00 00 00 00 00 00 00 00 00 00 01 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 01 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 01 01 00 01 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 03 05 02 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 01 00 02 01 00 00 00 00 00 00 00 00 00 00 00 00 01 00 03 17 1F 12 02 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 03 00 01 00 00 00 00 00 00 00 00 00 00 00 00 00 01 03 06 02 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 02 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 01 00 01 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 44 05'.split(' ')
      if (window.toReportData) {
        this.reportTime = this.formatDate(new Date())
        this.dialogReportVisible = true
        let start = 6
        this.$nextTick(() => {
          let ret = this.$refs.hotMapReport.draw(window.toReportData)
          this.getReportArea(ret)
        })
      } else {
        this.$message({
          type: 'warning',
          message: '暂无数据'
        })
      }
    },
    save() {
      this.isSaving = !this.isSaving
      if (this.isSaving) {
        window.data = ''
        //开始保存每个一分钟保存一次数据；点击保存执行最后的数据保存，清理数据及轮询 new Date().getTime() + 'data.txt')
        DrawCfg.toSaveDataPath = path.join(DrawCfg.userDataPath, new Date().getTime() + 'data.txt')
        // DrawCfg.toSaveDataPath = path.join(DrawCfg.userDataPath, format(new Date(), "yyyy/MM/dd_HH:mm") + '_data.txt')
        this.saveInterval = setInterval(() => {
          if (window.data) {
            window.toSaveData = window.data
            window.data = null
            this.saveData(DrawCfg.toSaveDataPath, window.toSaveData, false)
            window.toSaveData = null
            console.log('saving...');
          }
        }, DrawCfg.saveTimeStep)
      }else{
        if(this.saveInterval){
         clearInterval(this.saveInterval)
        }
      }
      console.log(DrawCfg.toSaveDataPath);
      //保存最后一段数据
      if (!this.isSaving && window.data) {
        this.saveData(DrawCfg.toSaveDataPath, window.data, true)
        window.data = null
      }
    },

    //保存报告为 PDF
    savePdf() {
      const filePath = path.join(os.homedir(), 'Desktop', 'temp.pdf')//文件存储的路径
      let node = document.getElementById('pafDom');
      let saveBt = document.getElementById('saveBt');
      // saveBt.style.display = 'none'
      domtoimage
        .toPng(node)
        .then((imgData) => {
          // saveBt.style.display = ''
          ipcRenderer.invoke('export-pdf', { imgData, fileName: this.reportTime + '.pdf' }); // 告诉主线程执行导出pdf的任务
          ipcRenderer.once('export-pdf-res', (_e, data) => {
            shell.openPath(data.pdfPath);
          });
        }).catch(function (error) {
          console.error('oops, something went wrong!', error);
        });
    },
    checkPorts() {
      ipcRenderer.invoke("startCheckPorts");
    },
    goBack() {
      ipcRenderer.invoke("stopCheck");
      window.toReportData = null
      if (window.interval) {
        clearInterval(window.interval)
      }
      this.$router.back()
    },
    startCheck() {
      if (this.isStartCheck) {
        this.isStartCheck = !this.isStartCheck
        if (this.linkType == LinkType.SerialPort) {
          ipcRenderer.invoke("stopCheck");
        }
        // window.toReportData = null
        return
      }
      window.data = ''
      if (this.linkType == LinkType.SerialPort) {
        if (this.chooseCom == '') {
          this.$message(
            {
              message: '请选择串口',
              type: 'warning'
            }
          )
          return
        }
        if (this.chooseBaud == '') {
          this.$message(
            {
              message: '请选择设备波特率',
              type: 'warning'
            }
          )
          return
        }
        const cfg = {
          path: this.chooseCom,
          dataBits: 8,
          stopBits: 1,
          parity: 'none',
          baudRate: this.chooseBaud
        }
        ipcRenderer.invoke("doLinkPort", cfg);
      }

      this.isStartCheck = true
      this.startTime = parseInt(new Date().getTime() / 1000)
    },
    startReplay() {
      document.getElementById('file').click()
    }
  },

  unmounted() {
    window.data = null
    window.toReportData = null
    ipcRenderer.invoke("stopCheck");
    if (window.interval) {
      clearInterval(window.interval)
    }
    if (this.saveInterval) {
      clearInterval(this.saveInterval)
    }
  },

  destroyed() {
    window.data = null
    window.toReportData = null
    ipcRenderer.invoke("stopCheck");
    if (window.interval) {
      clearInterval(window.interval)
    }
    if (this.saveInterval) {
      clearInterval(this.saveInterval)
    }
    ipcRenderer.removeAllListeners("onPorts");
    ipcRenderer.removeAllListeners("cfgInfoOk");
    ipcRenderer.removeAllListeners("onRecivePortData");
    if (this.server) {
      this.server.close(() => {
      });
    }
    if (this.sock) {
      this.sock.end()
      this.sock.destroy()
    }
  },

  computed: {
    text() {
      return this.$i18n.t("waitDataLoading");
    },
  },
};
</script>
<style>
.el-input__inner::placeholder {
  color: white !important;
}
</style>

<style lang="scss" scoped>
@import '../../styles/variables.scss';




.hotMapBg {
  background: $hotMapBg;
}

.center {
  flex: 1;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
}

// .logo {
//   min-width: 219px;
//   min-height: 95px;
//   margin-top: 20px;
//   margin-left: 60px;
//   align-self: flex-start;
//   background-size: 219px 95px;
//   background-image: url('~@/assets/imgsV1/sm_logo.png');
// }
//.logo {
//min-width: 306px;
//min-height: 56px;
//margin-top: 20px;
//margin-left: 60px;
//align-self: flex-start;
//background-size: 306px 56px;
//background-image: url('~@/assets/imgsV1/gj_logo.png');
//}

.logoback {
  min-width: 255px;
  min-height: 81px;
  margin-top: 20px;
  margin-left: 60px;
  align-self: flex-start;
  background-size: 255px 81px;
  background-image: url('~@/assets/imgsV1/logos.png');
}

.mbt20 {
  margin-bottom: 20px;
}

.reportCls {
  color: black;



  ::v-deep .el-dialog {
    margin-top: 0 !important;
    height: 100vh;
    overflow-y: scroll !important;
    padding: 0 20px;
  }


  ::v-deep .el-overlay {
    background-color: black !important;
  }

  ::v-deep .el-dialog__body {
    padding: 0;

  }

  ::v-deep .el-descriptions-item__cell {
    border: 2px solid #969696;

  }

  ::v-deep .el-descriptions-item__label.is-bordered-label {
    background: transparent;

    color: black;
  }

  ::v-deep .el-descriptions__body {
    background-color: transparent;
    color: black;
  }


  ::v-deep .el-dialog__header {
    display: none;
  }

  .repHot {
    border: 2px solid #969696;
    margin: 0 20px;
  }

  .title {
    position: relative;
    font-size: 48px;
    margin-top: 60px;
    text-align: center;
    font-weight: bold;
    color: black;

    .xilog {
      position: absolute;
      top: 0;
      left: 54px;
      min-width: 54px;
      min-height: 54px;
      background-size: 54px 54px;
      background-image: url('~@/assets/imgs/itemGroupLogo.jpg');
    }
  }

  .subtitle {
    width: calc(100% - 40px);
    color: #000;
    height: 34px;
    line-height: 34px;
    margin: 40px 20px 20px 20px;
    font-size: 24px;
    font-weight: 620;
    text-align: center;
    background-image: url('~@/assets/imgs/titlebg.png');
  }

}

.btm1 {
  display: flex;
  flex-direction: column;
  // background-color: #1a2e5c;
}

.btm {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: 20px;
  width: 580px;
  // background-color: #1a2e5c;

  ::v-deep .el-descriptions-item__label.is-bordered-label {
    background: transparent;
    color: #004492;
    width: 220px;
    white-space: pre-wrap;
  }

  ::v-deep .el-descriptions__body {
    background-color: transparent;
    color: #004492;
  }

}



.blockColor {
  width: 20px;
  height: 40px;
}

.blockColor2 {
  width: 20px;
  height: 52px;
  color: black;
}

.blocKTxt2 {
  width: 20px;
  height: 52px;
  padding-left: 13px;
  padding-top: 0px;
}

.itemInfo {
  display: flex;
  flex-direction: row;
  background: linear-gradient(#88d0cf, #2727d5);
  color: white;
  font-size: 26px;
  border-radius: 30px;
  margin-top: 30px;
  padding: 50px 10px;
  align-items: center;
  height: 48px;
  line-height: 48px;
}

.itemInfo2 {
  display: flex;
  flex-direction: row;
  background: linear-gradient(#88d0cf, #2727d5);
  color: white;
  font-size: 26px;
  padding-left: 36px;
  border-radius: 48px;
  margin-top: 20px;
  height: 96px;
  align-items: center;
  line-height: 46px;
  padding-top: 4px;
  width: 480px;
}

.itemValue {
  min-width: 130px;
}

.itemName2 {
  width: 190px;
  line-height: 34px;
}

.blocKTxt {
  width: 20px;
  height: 40px;
  padding-left: 13px;
  padding-top: 0px;
}


.blocKTxtBlk {
  width: 22px;
  line-height: 52px;
  margin-left: 2px;
  text-align: bottom;
  color: black;
}

.colors {
  border: 1px solid white;
  width: 24px;
  height: 242px;
}

.colorsBlk {
  border: 0px solid black !important;
  width: 24px;
}

.colorsBlkT {
  width: 24px;
  margin-left: -25px;
}


.txts {
  width: 22px;
  height: 242px;
  color: white;
}

.legency {
  display: flex;
  flex: 1;
  flex-direction: row;
  width: 40px;
  background-color: transparent;
}

.el-button {
  font-size: 18px !important;
  padding: 12px 24px !important;
}

.btmInfo {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  width: 1120px;
  font-size: 28px;

  color: black;
}

.num {
  border-bottom: 1px solid white;
}

.left {
  display: flex;
  flex-direction: column;
  width: 560px;
}

.center {
  display: flex;
  flex-direction: column;
  width: 400px;
}

.right {
  display: flex;
  flex-direction: row;
  align-self: end;
  margin-right: 25px;
  margin-top: -15px;

  ::v-deep .el-button {
    border-radius: 25px;
    margin-right: 25px;
    font-size: 28px !important;
  }
}

.bts {
  display: flex;
  height: 48px;
  margin-top: 20px;

  ::v-deep .el-button {
    border-width: 0;
    border-radius: 24px;
    font-size: 22px !important;
    background: linear-gradient(#3fbbfe, #a541ff);
  }
}

.bobts {
  display: flex;
  justify-content: space-between;
  width: 50vw;
  height: 48px;
  margin-top: 10px;
  margin-bottom: 10px;

  ::v-deep .el-button {
    border-width: 0;
    border-radius: 22px;
    padding: 8px 20px !important;
    font-size: 20px !important;
    color: white;
    background: linear-gradient(#01e8bd, #007edd);
  }
}

.bts ::v-deep .el-input__inner {
  font-size: 22px !important;
  height: 48px !important;
  padding: 8px 20px !important;
  line-height: 32px !important;
  margin-left: 0px !important;
  background: linear-gradient(#3fbbfe, #a541ff);
  border-color: transparent;
  border-radius: 24px;
  border-width: 0;
  color: white;
}

.bts ::v-deep .el-input .el-input__inner::placeholder {
  font-size: 18px !important;
  color: white !important;
}

.svgCls {
  width: 100vw !important;
  height: 100px !important;
}

.bar {
  height: 96px;
}

.sysTitle {
  display: flex;
  min-width: 50vw;
  justify-content: center;
  align-items: center;

  .topTlbg {
    margin-top: 80px;
    width: 737px;
    height: 80px;
  }
}

.dlogo {
  width: 200px;
  display: flex;
  flex-direction: row;
  margin: -20px 0 0 120px;
}

.xilog {
  min-width: 48px;
  min-height: 54px;
  margin-left: 20px;
  align-self: center;
  transform: scale(1.3);
  margin-right: 20px;
  margin-top: 8px;
  background-size: 48px 54px;
  background-image: url('~@/assets/imgs/课题组logo纯白色版.png');
}



.ops {
  display: flex;
  flex-direction: row;
  min-width: 50vw;
  margin-top: 10px;
  height: 357px;
  justify-content: space-between;
  align-self: center;
}

.op1 {
  width: 357px;
  height: 357px;
  align-self: center;
  background-size: 357px 357px;
  background-image: url('~@/assets/imgs/sjcj.png');
}

.op2 {
  width: 334px;
  height: 265px;
  align-self: center;
  background-size: 334px 265px;
  background-image: url('~@/assets/imgs/lscx.png');
}

.op3 {
  width: 341px;
  height: 231px;
  align-self: center;
  background-size: 341px 231px;
  background-image: url('~@/assets/imgs/cssz.png');
}


.opsT {
  display: flex;
  min-width: 50vw;
  height: 57px;
  margin-top: -40px;
  justify-content: space-between;
  align-self: center;
  font-size: 38px;
  font-weight: 520;
  color: white;
}

.opT1 {
  width: 357px;
  height: 57px;
  text-align: center;
}

.opT2 {
  width: 334px;
  height: 57px;
  text-align: center;
}

.opT3 {
  width: 341px;
  height: 57px;
  text-align: center;
}

.opsT1 {
  flex: 1;
  display: flex;
  width: 100vw;
  height: 57px;
  font-size: 48px;
  justify-content: center;
  align-items: center;
  color: white;
  letter-spacing: 14px;
}

.lContainer {
  display: flex;
  flex-direction: column;
  margin-left: 20px;
}

.lContainer ::v-deep .el-input-number {
  width: 62px;
}

.lContainer ::v-deep .el-input__inner {
  text-align: left;
  width: 50px;
  background: transparent;
  border-color: transparent;
  color: black;
  padding: 0 !important;
  font-size: 16px;
  border-color: transparent;
}

.lContainer ::v-deep .el-input__inner:hover {
  width: 50px;
  background: transparent;
  border-color: transparent;
  color: black;
  padding: 0 !important;
  font-size: 16px;
  border-color: transparent;
}

.bg {
  height: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-image: url('~@/assets/imgsV1/contentBg.png');
}
</style>
<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: "Source Sans Pro", sans-serif;
}

#wrapper {
  padding: 60px 80px;
}


main {
  display: flex;
  justify-content: space-between;
}

main>div {
  flex-basis: 50%;
}

.left-side {
  display: flex;
  flex-direction: column;
}

.welcome {
  color: #555;
  font-size: 23px;
  margin-bottom: 10px;
}

.title {
  color: #2c3e50;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 6px;
}

.title.alt {
  font-size: 18px;
  margin-bottom: 10px;
}

.doc {
  margin-bottom: 10px;
}

.doc p {
  color: black;
  margin-bottom: 10px;
}

.doc .el-button {
  margin-top: 10px;
  margin-right: 10px;
}

.doc .el-button+.el-button {
  margin-left: 0;
}

.conten {
  text-align: center;
}

.el-input__inner::placeholder {
  color: white;
  font-size: 18px;
}
</style>
