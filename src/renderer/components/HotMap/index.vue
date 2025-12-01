<template>
    <div class="bg11">
        <div :style="{ width: 1200 + 'px', height: 520 + 'px' }"
            style="display: flex;justify-content: center;color: white;">
            <!-- /1200   520 -->
            <canvas :id="hotCanvasId" :width="1000" :height="520" style="transform: scale(1.2, 1);">
            </canvas>
            <canvas :id="boardId" :style="{ color }" :width="1200" :height="520"
                style="position: absolute;z-index: 2; ">
            </canvas>
            <div :id="labelContainerId" :style="{ color, width: 1200 + 'px', height: 520 + 'px' }"
                style="position: absolute;z-index: 3; font-size: 12px;">
            </div>
        </div>
    </div>
</template>

<script>
import { DrawCfg } from "@/config/DrawCfg"
import { resizeImageData } from "@/utils/image-compressor/utils"
import { getColorPaint, drawChessBoard, draw } from "@/utils/draw";

export default {
    name: "home",
    props: {
        color: {
            default: 'rgba(255, 255, 255, 0)'
        }
    },
    data: () => ({
        pos:'',
        isCheckingPos: false,
        hotCanvasId: 'hotCanvasId-' + new Date().getTime(),
        boardId: 'boardId-' + new Date().getTime(),
        labelContainerId: 'labelContainerId-' + new Date().getTime(),
        canvas: null,
        context: null,
        Canvas: {
            width: DrawCfg.Canvas.width,
            height: DrawCfg.Canvas.height,
            widthPickerNum: 20,
            heightPickerNum: 20,
        }
    }),
    watch: {

    },
    mounted() {
        //热力图画布
        this.canvas = document.getElementById(this.hotCanvasId);
        this.context = this.canvas.getContext('2d', {
            willReadFrequently: true
        })
   
        this.context.imageSmoothingEnabled = false;
        this.context.backingStorePixelRatio = 1;
   
        //显示数值容器
        this.labelContainer = document.getElementById(this.labelContainerId)
        // DrawCfg.palette = getColorPaint()
        if (DrawCfg.drwaBord) {
            this.$nextTick(() => {
                drawChessBoard(this.boardId)
            })
        }

        // myWorker.addEventListener('message', e => {
        //     this.isCheckingPos = false
        //     const result = e.data;
        //     this.pos = result.name
        //     // console.log('Received result from Worker:', result);  
        //     this.$emit('posRest',result)
        //     // 根据结果进行后续操作
        // }, false);
    },
    methods: {
        checkPos() {
            if (!this.isCheckingPos) {
                this.isCheckingPos = true
                const img = this.context.getImageData(0, 0, DrawCfg.Canvas.width, DrawCfg.Canvas.height)
                resizeImageData(img, 224, 224).then(resizeImg => {
                    // window.myWorker.postMessage(resizeImg);
                    // window.myWorker.postMessage({
                    //     type: 'check',
                    //     options: { imgData: resizeImg }
                    // });
                    

                    // console.log('send11:: ', child.send({
                    //     // img: 'resizeImg', callback: (e) => {
                    //     img: Array.from(resizeImg).length, callback: (e) => {
                    //         console.log('callback111', e);

                    //     }
                    // }));

                    // const preprocessedData = preprocess(resizeImg)
                    // const feeds = {};
                    // feeds[window.cnnSession.inputNames[0]] = preprocessedData;
                    // window.cnnSession.run(feeds).then(outputData => {
                    //     this.isCheckingPos = false
                    //     const output = outputData[window.cnnSession.outputNames[0]];
                    //     console.log('结果：', console.log(getPredictedClass(Array.prototype.slice.call(output.data))[0]));
                    // })
                })
            }
        },
        draw(drawData) {
            // console.log(new Date().getTime()-window.last)
            // window.last = new Date().getTime();
            let ret = draw.call(this, drawData);
            // this.checkPos()
            this.labelContainer.innerHTML = ''
            ret.labels.forEach((label) => {
                this.labelContainer.appendChild(label);
            })
            ret.pos = this.pos 
            return ret;
        },
    }
};
</script>

<style scoped>
.bg11 {
    display: flex;
    justify-content: center;
    border: 1px solid white;
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