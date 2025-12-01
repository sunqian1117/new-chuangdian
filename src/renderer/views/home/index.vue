<template>
  <div class="bg">
    <div class="bar"></div>
    <div class="logo"></div>
    <div class="sysTitle">
      压力管理防褥疮床垫 
    </div>
    <div class="ops">
      <router-link to="/check">
        <div class="op1">
        </div>
      </router-link>
      <div class="op2"></div>
      <div class="op3"></div>
    </div>
    <div class="opsT">
      <router-link to="/check">
        <div class="opT1">数据采集
        </div>
      </router-link>
      <div class="opT2">历史查询</div>
      <div class="opT3">参数设置</div>
    </div>
    <div class="opsT1">
      <div class="xilog"></div>
      健康与防护智能纺织品研究中心
    </div>
  </div>
</template>

<script>
import { ipcRenderer, shell } from "electron";
export default {
  name: "home",
  data: () => ({
   
  }),
 
  methods: {

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
.bar {
  height: 120px;
}

.logo {
  min-width: 539px;
  min-height: 143px;
  align-self: center;
  background-size: 539px 143px;
  background-image: url('~@/assets/imgs/青岛大学1.png');
}

.sysTitle {
  display: flex;
  margin-top: 90px;
  min-width: 50vw;
  height: 85px;
  font-size: 85px;
  justify-content: center;
  align-items: center;
  color: white;
  letter-spacing: 8px;
}

.xilog {
  min-width: 48px;
  min-height: 54px;
  align-self: center;
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

.bg {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-image: url('~@/assets/imgs/home.png');
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
