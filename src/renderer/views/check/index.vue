<template>
  <div class="bg">
    <div class="bar">
      <div class="sysTitle" @click="startReplay">
        压力管理防褥疮床垫
      </div>
    </div>
    <div class="dlogo" @click="goBack">
      <div class="logo"></div>
      <div class="xilog"></div>
    </div>
    <div class="bts">
      <el-button v-if="false" type="primary" size="medium" @click="startReplay">打开</el-button>
      <el-button type="primary" size="medium" @click="dialogVisible = true">参数设置</el-button>
      <el-button type="primary" size="medium" style="margin-left: 20px;" @click="checkPorts">检测串口</el-button>
      <el-select v-model="chooseCom" size="medium" placeholder="请选择" style="width: 100px;">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"
          :disabled="item.disabled">
        </el-option>
      </el-select>
      <el-button type="primary" size="medium" style="margin-left: 20px;">波特率</el-button>
      <el-select v-model="chooseBaud" placeholder="请选择" size="medium" style="width: 120px;">
        <el-option v-for="item in baudOptions" :key="item.value" :label="item.value" :value="item.value"
          :disabled="item.disabled">
        </el-option>
      </el-select>
    </div>
    <div style="position: absolute;z-index: 2;top: 0;left: 0;display: none;">
      <input type="file" name="file" id="file" @change="onchange" />
    </div>
    <div style="display: flex;flex-direction: column;">
      <div style="display: flex;flex-direction: row;justify-content: center;">
        <HotMap :color="'rgba(255, 255, 255, 0.7)'" ref="hotMap" style="margin-top: 40px;padding-right: 80px;"></HotMap>
        <div style="display: flex;flex-direction: column;  align-self: center;transform: translateX(-80px);">
          <div class="legency" :style="{ height: legencyHeight }">
            <div class="colors" :style="{ height: legencyHeight }">
              <div class="blockColor" v-for="cc of colors" :style="{ backgroundColor: cc }"></div>
            </div>
            <div class="txts" :style="{ height: legencyHeight }">
              <div class="blocKTxt" v-for="tt of txts">{{ tt }}</div>
            </div>
          </div>
          <div style="color: white;">mmHg</div>
        </div>
      </div>
    </div>
    <div class="btm">
      <el-descriptions :column="2" border class="btmInfo" style="align-self: center;">
        <el-descriptions-item label="总压力面积/cm²" :contentStyle="{ 'min-width': '200px' }">{{
          allArea }}</el-descriptions-item>
        <el-descriptions-item label="最大压力/mmHg" :contentStyle="{ 'min-width': '200px' }">
          {{ maxPress }}
        </el-descriptions-item>
        <el-descriptions-item label=">50mmHg压力面积/cm²" :contentStyle="{ 'min-width': '200px' }">{{ areaFive
        }}</el-descriptions-item>
        <el-descriptions-item label="平均压力/mmHg" :contentStyle="{ 'min-width': '200px' }">{{ avgPress
        }}</el-descriptions-item>
        <el-descriptions-item label="30~50mmHg压力面积/cm²" :contentStyle="{ 'min-width': '200px' }">{{ areaFiveThree
        }}</el-descriptions-item>
        <el-descriptions-item label="睡姿" :contentStyle="{ 'min-width': '200px' }">{{
          pos
        }}</el-descriptions-item>
          <el-descriptions-item label="呼吸" :contentStyle="{ 'min-width': '200px' }">{{
            breath
          }}</el-descriptions-item>
          <el-descriptions-item label="心率" :contentStyle="{ 'min-width': '200px' }">{{
           heart
          }}</el-descriptions-item>
      </el-descriptions>
      <div class="right">
        <el-button type="primary" size="medium" @click="startCheck">{{ isStartCheck ? '停止测试' : '开始测试' }}</el-button>
        <el-button type="warning" size="medium" style="margin-top: 20px;margin-left:0;" @click="save">保存文件</el-button>
        <el-button type="warning" size="medium" style="margin-top: 20px;margin-left:0" @click="genReport">查看报告</el-button>
      </div>
    </div>
    <el-dialog v-dialogDrags title="参数设置" :visible.sync="dialogVisible" width="50%" style="font-size: 22px;">
      <el-form ref="form" label-width="180px">
        <el-form-item label="小眠串口">
          <el-select v-model="chooseXMCom" size="medium" placeholder="请选择" style="width: 200px;">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"
              :disabled="item.disabled">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="压力时长阈值/秒">
          <el-slider v-model="pressTime" :max="3600" :min="0" :step="60" show-input>
          </el-slider>
        </el-form-item>
        <el-form-item label="压力阈值/mmHg">
          <el-slider v-model="pressCount" :max="200" :min="1" :step="1" show-input>
          </el-slider>
        </el-form-item>
        <el-form-item label="热力显示因子h">
          <el-slider v-model="hotFactor" :max="3" :min="0.5" :step="0.01" show-input>
          </el-slider>
        </el-form-item>
        <el-form-item label="热力显示因子i">
          <el-slider v-model="i" :max="5" :min="0.1" :step="0.01" show-input>
          </el-slider>
        </el-form-item>
        <el-form-item label="热力显示因子p">
          <el-slider v-model="p" :max="5" :min="0.1" :step="0.01" show-input>
          </el-slider>
        </el-form-item>
        <el-form-item label="采样点面积因子">
          <el-slider v-model="areaFactor" :max="30" :min="0.5" :step="0.1" show-input>
          </el-slider>
        </el-form-item>
        <el-form-item label="计算采样最小阈值">
          <el-slider v-model="minCalValue" :max="30" :min="0" :step="0.1" show-input>
          </el-slider>
        </el-form-item>
        <el-form-item label="后置百分比">
          <el-slider v-model="backPercent" :max="1" :min="0" :step="0.1" show-input>
          </el-slider>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="参数设置" :visible.sync="dialogReportVisible" width="1280px" style="font-size: 22px;" class="reportCls">
      <div id="pafDom" style="display: flex;flex-direction: column;">
        <div style="padding-top: 20px;">检测日期： {{ reportTime }}</div>
        <div class="title">
          <div class="xilog"></div>
          身体压力管理报告
        </div>
        <div class="subtitle">身体压力分布图</div>
        <div style="position: relative;">
          <HotMap :color="'rgba(0, 0, 0, 1)'" ref="hotMapReport" class="repHot" @posRest="posRest"
            style="margin-top: 40px;padding-right: 80px;"></HotMap>
          <div style="display: flex;flex-direction: column;  position: absolute;right: 40px;top: 120px;">
            <div class="legency" :style="{ height: legencyHeight }">
              <div class="colors" :style="{ height: legencyHeight, border: '1px solid black' }">
                <div class="blockColor" v-for="cc of colors" :style="{ backgroundColor: cc }"></div>
              </div>
              <div class="txts" :style="{ height: legencyHeight, color: 'black' }">
                <div class="blocKTxt" style="color:black;width: 60px;" v-for="tt of txts">{{ tt }}</div>
              </div>
            </div>
            <div style="color: black;">mmHg</div>
          </div>
        </div>
        <div class="subtitle">压力数据</div>
        <el-descriptions :column="2" border class="btmInfo mbt20">
          <el-descriptions-item label="总压力面积/cm²" :contentStyle="{ 'min-width': '200px' }">{{
            report.allArea }}</el-descriptions-item>
          <el-descriptions-item label="最大压力/mmHg" :contentStyle="{ 'min-width': '200px' }">
            {{ report.maxPress }}
          </el-descriptions-item>
          <el-descriptions-item label=">50mmHg压力面积/cm²" :contentStyle="{ 'min-width': '200px' }">{{ report.areaFive
          }}</el-descriptions-item>
          <el-descriptions-item label="平均压力/mmHg" :contentStyle="{ 'min-width': '200px' }">{{ report.avgPress
          }}</el-descriptions-item>
          <el-descriptions-item label="30~50mmHg压力面积/cm²" :contentStyle="{ 'min-width': '200px' }">{{
            report.areaFiveThree
          }}</el-descriptions-item>
          <el-descriptions-item label="睡姿" :contentStyle="{ 'min-width': '200px' }">{{
            report.pos
          }}</el-descriptions-item>
          <el-descriptions-item label="呼吸" :contentStyle="{ 'min-width': '200px' }">{{
            report.breath
          }}</el-descriptions-item>
          <el-descriptions-item label="心率" :contentStyle="{ 'min-width': '200px' }">{{
            report.heart
          }}</el-descriptions-item>
        </el-descriptions>
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
import domtoimage from 'dom-to-image-more';
import { initSession } from "@/utils/cnn"

export default {
  name: "home",
  components: {
    HotMap
  },
  data: () => ({
    reportTime: '',
    allArea: "",
    areaFive: "",
    areaFiveThree: "",
    pos: "",
    maxPress: "",
    avgPress: "",
    breath: "",
    heart: "",
    report: {
      allArea: "",
      areaFive: "",
      areaFiveThree: "",
      pos: "",
      maxPress: "",
      avgPress: "",
      breath: "",
      heart: "",
    },
    legencyHeight: (DrawCfg.HotMap.colors.length * 40 + 2) + 'px',
    colors: DrawCfg.HotMap.colors,
    txts: DrawCfg.HotMap.txts,
    backPercent: DrawCfg.Cal.backPercent,
    pressTime: DrawCfg.pressPartBody.pressTime,
    pressCount: DrawCfg.pressPartBody.pressCount,
    hotFactor: DrawCfg.Cal.hotFactor,
    p: DrawCfg.Cal.p,
    i: DrawCfg.Cal.i,
    minCalValue: DrawCfg.Cal.minCalValue,
    areaFactor: DrawCfg.Cal.areaFactor,
    // dialogReportVisible: true,
    dialogReportVisible: false,
    dialogVisible: false,
    isStartCheck: false,
    chooseCom: '',
    chooseXMCom: '',
    options: '',
    chooseBaud: '',
    baudOptions: [
      { value: 230400 },
      { value: 115200 },
      { value: 19200 },
    ],
    options: []
  }),
  watch: {
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
      immediate: true,
      deep: true
    },
    hotFactor: {
      handler() {
        DrawCfg.Cal.hotFactor = this.hotFactor
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
    let _this = this
    // fetch(DrawCfg.cnnCfg.modelFilepath).then(response => {
    //   response.arrayBuffer().then(modelFile => {
    //     initSession(modelFile)
    //   });
    // });
    // console.log(DrawCfg.cnnSession);
    ipcRenderer.on("saveOk", (event, dataInfo) => {
      console.log(window.data);
      if (dataInfo.filePath) {
        fs.writeFileSync(
          dataInfo.filePath,
          window.data,
          { encoding: "utf-8" }
        )
        this.$alert("保存完成！", "提示", {
          confirmButtonText: "确定",
          callback: (action) => {
            shell.openPath(dataInfo.filePath);
          },
        });
      }
    })
    ipcRenderer.on("onPorts", (event, arg) => {
      let data = JSON.parse(arg)
      console.log(data);
      this.options = []
      data.forEach(item => {
        this.options.push({
          value: item.path,
          label: item.path,
        })
      })
    })
    ipcRenderer.on("onRecivePortData", (event, data) => {
      window.data += ('[' + _this.formatDate(new Date()) + ']:5A 01 95 6C 00 02 ' + data.join(' ') + '\n')
      // draw.call(this, data);
      window.toReportData = data
      let ret = _this.$refs.hotMap.draw(data)
      _this.getArea(ret)
    })
    ipcRenderer.on("onReciveDiTanPortData", (event, data) => {
      
      console.log(data[4]);
      console.log(data[5]);
      this.heart = data[4]
      this.breath = data[5]

    })
    ipcRenderer.invoke("startCheckPorts");

  },
  methods: {
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
      this.maxPress = max>100?100:max
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
      this.report.maxPress = max>100?100:max
      // document.getElementById('minPress').innerText = mmHgMin.toFixed(2)
      // console.log(sumPress + '/' + pressNum)
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
      let start = 7
      reader.onload = (e) => {
        window.data = e.target.result
        let lines = window.data.split(/\r\n|\n/);
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
            let data = []
            for (let index = 0; index <1600; index++) {
              data[index] = data1[2*index]+ data1[2*index+1]
            }
            
            // let data = lines[line].split(" ").slice(start, 1600 + start)
            let ret = this.$refs.hotMap.draw(data)
            window.toReportData = data
            this.getArea(ret)
          }
          // console.timeEnd('test')
          line++
          // }, 0)
          // }, (250))
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
          console.log(this.report);
        })
      } else {
        this.$message({
          type: 'warning',
          message: '暂无数据'
        })
      }
    },
    save() {
      ipcRenderer.invoke("doSave");
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

            console.log('收到导出pdf的结果', data);
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
        ipcRenderer.invoke("stopCheck");
        // window.toReportData = null
        return
      }
      window.data = ''
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
      if (this.chooseXMCom == '') {
        this.$message(
          {
            message: '请设置呼吸心率设备串口',
            type: 'warning'
          }
        )
      }
      const cfg = {
        path: this.chooseCom,
        dataBits: 8,
        stopBits: 1,
        parity: 'none',
        baudRate: this.chooseBaud,
        chooseXMCom: this.chooseXMCom
      }
      ipcRenderer.invoke("doLinkPort", cfg);


      this.isStartCheck = true
    },
    startReplay() {
      document.getElementById('file').click()
    }
  },
  unmounted() {
    window.toReportData = null
    ipcRenderer.invoke("stopCheck");
    if (window.interval) {
      clearInterval(window.interval)
    }
  },

  destroyed() {
    window.toReportData = null
    ipcRenderer.invoke("stopCheck");
    if (window.interval) {
      clearInterval(window.interval)
    }
    ipcRenderer.removeAllListeners("saveOk");
    ipcRenderer.removeAllListeners("onPorts");
    ipcRenderer.removeAllListeners("onRecivePortData");
    ipcRenderer.removeAllListeners("onReciveDiTanPortData");
  },

  computed: {
    text() {
      return this.$i18n.t("waitDataLoading");
    },
  },
};
</script>

<style lang="scss" scoped>
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
    ;
    font-size: 24px;
    font-weight: 620;
    text-align: center;
    background-image: url('~@/assets/imgs/titlebg.png');
  }

}

.btm {
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: 20px;
  flex: 1;
  //background-color: #1a2e5c;

  ::v-deep .el-descriptions-item__label.is-bordered-label {
    background: transparent;
    color: white;
  }

  ::v-deep .el-descriptions__body {
    background-color: transparent;
    color: white;
  }

}



.blockColor {
  width: 20px;
  height: 40px;
}

.blocKTxt {
  width: 20px;
  height: 40px;
  padding-left: 13px;
  padding-top: 0px;
}

.blocKTxt {
  width: 22px;
  height: 39px;
  color: white;
}

.colors {
  border: 1px solid white;
  width: 22px;
  height: 242px;
}

.txts {
  width: 22px;
  height: 242px;
  color: white;
}

.legency {
  display: flex;
  align-self: center;
  align-self: center;
  flex-direction: row;
  width: 40px;
  height: 242px;
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
  font-size: 32px;

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
  flex-direction: column;
  align-self: center;
}

.bts {
  position: absolute;
  top: 58px;
  right: 30px;
}

.svgCls {
  width: 100vw !important;
  height: 100px !important;
}

.bar {
  height: 95px;
  background-size: 100vw 95px;
  background-image: url('~@/assets/imgs/top.png');
}

.sysTitle {
  display: flex;
  margin-top: 10px;
  min-width: 50vw;
  height: 85px;
  font-size: 42px;
  font-weight: 500;
  justify-content: center;
  align-items: center;
  color: white;
  letter-spacing: 8px;
}

.dlogo {
  width: 200px;
  display: flex;
  flex-direction: row;
  margin: -20px 0 0 120px;
}

.logo {
  min-width: 270px;
  min-height: 72px;
  background-size: 270px 72px;
  background-image: url('~@/assets/imgs/青岛大学1.png');
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

.bts ::v-deep .el-input__inner {
  font-size: 18px !important;
  height: 42px !important;
  line-height: 42px !important;
  background: #409EFF;
  border-color: #409EFF;
  color: white;
}

.bg {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-image: url('~@/assets/imgs/dataBg.png');
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

#logo {
  height: auto;
  margin-bottom: 20px;
  width: 420px;
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
