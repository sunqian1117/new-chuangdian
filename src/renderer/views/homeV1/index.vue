<template>
  <div class="bg">
    <div class="name"></div>
    <el-button icon="el-icon-setting" type="primary" size="small"
      style="margin-top: 20px; width:100px;margin-left: 20px;" @click="settingDlgVisible = true">设置</el-button>
    <div class="center">
      <router-link to="/checkV1">
        <div class="linkItem" @click="changeType(1)">
          <img width="510" height="210" src="~@/assets/imgsV1/center.png" />
          <span style="margin-top: 20px;">串口</span>
        </div>
      </router-link>
      <router-link to="/checkV1">
        <div class="linkItem" @click="changeType(2)">
          <img width="510" height="210" src="~@/assets/imgsV1/center.png" />
          <span style="margin-top: 20px;">WiFi</span>
        </div>
      </router-link>
    </div>
    <div class="opsT1">
      <div class="xilog"></div>
      — 健康与科技睡眠研究中心 —
    </div>
    <el-dialog title="注册码" :visible.sync="dialogFormVisible" :before-close="handleClose" :close-on-click-modal="false">
      <el-input v-model="code" autocomplete="off" placeholder="请输入注册码"></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" style="margin-right: 60px;" @click="checkCode">确 定</el-button>
        <el-button style="margin-right: 60px;" @click="handleClose">退 出</el-button>
      </div>
    </el-dialog>
    <el-dialog title="设置" :visible.sync="settingDlgVisible" :close-on-click-modal="false">
      <el-form label-width="180px">
        <el-form-item label="WIFI 端口号">
          <el-input v-model="port" autocomplete="off" placeholder="请输入端口号"></el-input>
        </el-form-item>
        <el-form-item label="保存值类型">
          <el-radio-group v-model="saveValType">
            <el-radio label="origin">原始值</el-radio>
            <el-radio label="mmHg">压力值</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="公式">
          <!-- <el-input v-model="mathStr" autocomplete="off" placeholder="请输入公式"></el-input> -->
          <div style="margin-top: 10px;">
            <!-- <div style="margin-bottom: 10px;">
              <el-button type="primary" size="small" @click="addNewSegment">添加函数段</el-button>
              <el-button type="warning" size="small" @click="resetSegments">重置</el-button>
            </div> -->
            <el-table :data="functionSegments" border style="width: 100%">
              <el-table-column label="斜率(a)">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.a" :precision="7" size="mini"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="截距(b)">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.b" :precision="6" size="mini"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="最小值">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.min" size="mini"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="最大值">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.max" size="mini"></el-input>
                </template>
              </el-table-column>
              <!-- <el-table-column label="操作" >
                <template slot-scope="scope">
                  <el-button type="danger" size="mini" @click="removeSegment(scope.$index)"
                    :disabled="functionSegments.length <= 1">删除</el-button>
                </template>
              </el-table-column> -->
            </el-table>
            <el-button type="primary"  @click="reset">恢复默认</el-button>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" style="margin-right: 60px;" @click="settingOk">保 存</el-button>
        <el-button style="margin-right: 60px;" @click="settingDlgVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { ipcRenderer, shell } from "electron";
const fs = require('fs');
const path = require('path');
import { aesDecrypt, aesEncrypt } from "../../utils/aes"
import { NtpTimeSync } from "ntp-time-sync";
import { DrawCfg } from "@/config/DrawCfg"
import { LinkType } from "@/config/const"

export default {
  name: "home",
  data: () => ({
    settingDlgVisible: false,
    dialogFormVisible: false,
    code: '',
    saveValType: DrawCfg.saveValType,
    port: DrawCfg.wifiPort,
    functionSegments: [

    ], // 压力函数段配置

  }),
  watch: {
    saveValType: {
      handler() {
        DrawCfg.saveValType = this.saveValType
      },
    },
  },
  mounted() {
    let functionSegments = localStorage.getItem('cd_functionSegments');
    if (functionSegments) {
      this.functionSegments = JSON.parse(functionSegments)
    } else {
      this.reset()
      localStorage.setItem('cd_functionSegments', JSON.stringify(this.functionSegments));
    }
    DrawCfg.functionSegments = this.functionSegments

    // this.code = localStorage.getItem('code');
    // if (this.code) {
    //   this.checkCode()
    // } else {
    //   this.dialogFormVisible = true
    // }
  },
  methods: {
    reset(){
      this.functionSegments = [
        {
          a: -0.003663,
          b: 15,
          min: 0,
          max: 4095
        },
        {
          a: 0,
          b: 0,
          min: 0,
          max: 0
        },
        {
          a: 0,
          b: 0,
          min: 0,
          max: 0
        },
        {
          a: 0,
          b: 0,
          min: 0,
          max: 0
        }]
    },
    settingOk() {
      DrawCfg.wifiPort = this.port
      DrawCfg.functionSegments = this.functionSegments
      localStorage.setItem('cd_functionSegments', JSON.stringify(this.functionSegments));
      this.settingDlgVisible = false
    },
    changeType(type) {
      switch (type) {
        case 1:
          DrawCfg.linkType = LinkType.SerialPort
          break
        case 2:
          DrawCfg.linkType = LinkType.WiFi
          break
      }
    },
    handleClose() {
      ipcRenderer.invoke("exitApp");
    },
    checkCode() {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      const key = "abcdef0123456789";
      const iv = "0123456789abcdef";
      let decrypted = ''
      this.code = this.code.trim()
      try {
        decrypted = aesDecrypt(key, iv, this.code);
      } catch (error) {
        this.$message.error("无效注册码");
        loading.close();
        return
      }
      const timeSync = NtpTimeSync.getInstance();
      // timeSync.getTime(['ntp1.aliyun.com'
      timeSync.getTime(['cn.pool.ntp.org'
        , 'time.windows.com', 'time.nist.gov'
      ], { timeout: 500 })
        .then(time => {
          loading.close();
          if (decrypted < Math.round(new Date(time.now).getTime() / 1000)) {
            this.$message.error("无效注册码");
            this.dialogFormVisible = true
          } else {
            this.dialogFormVisible = false
            localStorage.setItem('code', this.code);
          }
        })
        .catch(error => {
          loading.close();
          this.$confirm('连接网络超时, 请检测网络后重试?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.checkCode()
          }).catch(() => {
            ipcRenderer.invoke("exitApp");
          });
        })

    },
    start() {
    }
  },
  destroyed() {

  },
  computed: {
    text() {
      return this.$i18n.t("waitDataLoading");
    },
  },
};
</script>

<style>
.linkItem {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 26px;
  color: white;
}

.el-input__inner::placeholder {
  color: #747679 !important;
}

.bar {
  height: 120px;
}

.window-title .windows-icon-bg {
  color: #ffffff !important;
}

.logo {
  display: none;
}

.logoback {
  min-width: 510px;
  min-height: 72px;
  margin-top: 50px;
  align-self: center;
  background-size: 510px 72px;
  background-image: url('~@/assets/imgsV1/logo.png');
}

.name {
  min-width: 510px;
  min-height: 60px;
  align-self: center;
  margin-top: 50px;
  background-size: 510px 60px;
  background-image: url('~@/assets/imgsV1/name.png');
}

.center {
  flex: 1;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
}


.opsT1 {
  display: flex;
  width: 100vw;
  height: 57px;
  margin-bottom: 50px;
  font-size: 48px;
  justify-content: center;
  align-items: center;
  color: white;
  letter-spacing: 14px;
}

.bg {
  height: 100vh;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-image: url('~@/assets/imgsV1/homeBg.png');
}

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
</style>
