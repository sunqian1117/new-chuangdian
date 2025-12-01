<!--  -->
<template>
    <div class="window-title" v-if="!IsUseSysTitle && !IsWeb">
    </div>
</template>

<script>
import { ipcRenderer } from "electron";
export default {
    data: () => ({
        mix: false,
        IsUseSysTitle: false,
        isNotMac: process.platform !== "darwin",
        IsWeb: process.env.IS_WEB
    }),

    components: {},
    created() {
        ipcRenderer.invoke("IsUseSysTitle").then(res => {
            this.IsUseSysTitle = res;
        });
    },

    mounted() {
        ipcRenderer.on("w-max", (event, state) => {
            this.mix = state
        })
    },

    methods: {

    },
    destroyed() {
    }
};
</script>
<style rel='stylesheet/scss' lang='scss' scoped>
</style>