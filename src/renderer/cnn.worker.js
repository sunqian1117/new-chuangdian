import { preprocess } from "@/utils/cnn"
import { InferenceSession, env } from 'onnxruntime-web';
import { getPredictedClass } from "@/utils/cnn"
import _ from 'lodash';

let session = null
// worker.js
self.addEventListener('message', function (e) {
  const data = e.data;
  switch (data.type) {
    case 'init':
      env.wasm.wasmPaths = data.options.wasmPaths
      if (process.env.NODE_ENV === 'development') {
        InferenceSession.create('static/last.onnx').then(ss => {
          session = ss
        })
      } else {
        InferenceSession.create('resources/app/dist/electron/static/last.onnx').then(ss => {
          session = ss
        })
      }


      break;
    case 'check':
      if(session==null){
        return
      }
      const preprocessedData = preprocess(data.options.imgData)
      const feeds = {};
      feeds[session.inputNames[0]] = preprocessedData;
      session.run(feeds).then(outputData => {
        this.isCheckingPos = false
        const output = outputData[session.outputNames[0]];
        let result = getPredictedClass(Array.prototype.slice.call(output.data))[0]
       
        setTimeout(() => { self.postMessage(result) }, 2000);
      })
      break;

    default:
      break;
  }
  // 处理收到的数据并进行计算或处理
}, false);