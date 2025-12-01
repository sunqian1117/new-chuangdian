<template>
  <div class="app-wrapper" :class="IsUseSysTitle ? 'UseSysTitle' : 'NoUseSysTitle'">
    <!-- <div :class="classObj">
      <navbar></navbar>
      <div class="container-set">
        <sidebar class="sidebar-container" :class="IsUseSysTitle ? 'UseSysTitle' : 'NoUseSysTitle'"></sidebar>
        <div class="main-container">
          <app-main></app-main>
        </div>
      </div>
    </div> -->
    <app-main></app-main>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import AppMain from "./components/AppMain";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { useAppStore } from "@/store/app";
import { ipcRenderer } from "electron";
import { cfg } from "@/api/cfg";

const net = require("net")

const { sidebarStatus } = useAppStore();
const IsUseSysTitle = ref(true);
const sidebarSwitch = computed(() => sidebarStatus.opened)

// const host = '192.168.0.109'
// const port = '8877'
// cfg({ sn: '332016836731', host, port }).then(res => {
//   ipcRenderer.invoke("startServer");

//   // ipcRenderer.invoke("startServer").then(res => {
//   // });
// })

ipcRenderer.invoke("IsUseSysTitle").then(res => {
  IsUseSysTitle.value = res;
});

const classObj = computed(() => {
  return {
    hideSidebar: !sidebarSwitch.value,
    openSidebar: sidebarSwitch.value
  };
});

</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "@/styles/mixin.scss";

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;

  .container-set {
    position: relative;
    padding-top: 62px;
  }
}

.UseSysTitle {
  top: 0px;
}

.NoUseSysTitle {
  top: 0px
}
</style>
