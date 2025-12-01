<template>
  <div id="app">
    <c-header></c-header>
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script setup>
import { onMounted,onUnmounted } from "vue";
import CHeader from "./components/title";
import { ipcRenderer } from "electron";
import { DrawCfg } from "@/config/DrawCfg"

onMounted(() => {
  ipcRenderer.invoke("getAppInfo");
  ipcRenderer.on("appInfoOK", (event, dataInfo) => {
    if (dataInfo.userDataPath) {
      DrawCfg.userDataPath = dataInfo.userDataPath
    }
  })
})
onUnmounted(() => {
  ipcRenderer.removeAllListeners("appInfoOK");
})
</script>

<style>
#app {
  height: 100%;
  min-width: 100vh;
}

/* CSS */
</style>
