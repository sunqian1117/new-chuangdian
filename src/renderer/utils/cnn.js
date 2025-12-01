import fs from "fs";
import path from "path";
import ndarray from "ndarray";
import ops from "ndarray-ops";
import { Tensor } from "onnxruntime-web";
import * as runModelUtils from "@/utils/runModel"
import * as mathUtils from "@/utils/math"
import * as imagenetUtils from "@/utils/imagenet"
import { env } from "onnxruntime-web";
import { DrawCfg } from "@/config/DrawCfg"

/**
 * 初始化会话并加载模型
 *
 * @param modelFile 模型文件 
 * @returns 返回会话对象
 * @throws 当后端不支持时，抛出错误
 */
export async function initSession(modelFile) {
  env.wasm.wasmPaths = window.location.protocol + '//' + window.location.host + '/static/'
  let imageSize = 224;
  let sessionBackend = 'wasm';
  if (DrawCfg.cnnSession) {
    return DrawCfg.cnnSession;
  }
  try {
    if (sessionBackend === "webgl") {
      DrawCfg.cnnSession = await runModelUtils.createModelGpu(modelFile)
    } else if (sessionBackend === "wasm") {
      DrawCfg.cnnSession = await runModelUtils.createModelCpu(modelFile)
    }
  } catch (e) {
    DrawCfg.cnnSession = undefined;
    console.log(e);
    throw new Error("Error: Backend not supported. ");
  }
  // warm up session with a sample tensor. Use setTimeout(..., 0) to make it an async execution so
  // that UI update can be done.
  setTimeout(() => {
    if (sessionBackend === "webgl") {
      runModelUtils.warmupModel(DrawCfg.cnnSession, [
        1,
        3,
        imageSize,
        imageSize,
        // DrawCfg.Canvas.width,
        // DrawCfg.Canvas.height,
      ]);
    } else {
      runModelUtils.warmupModel(DrawCfg.cnnSession, [
        1,
        3,
        imageSize,
        imageSize,
        // DrawCfg.Canvas.width,
        // DrawCfg.Canvas.height,
      ]);
    }
  }, 0);

}

/**
 * 对图像数据进行预处理
 *
 * @param imageData 包含图像数据的对象，包含 data、width 和 height 属性
 * @returns 预处理后的 Tensor 对象
 */
export function preprocess(imageData) {
  // const { data, width, height } = imageData;
  const { data } = imageData;
  let imageSize = 224;
  let width = imageSize
  let height = imageSize

  // data processing
  const dataTensor = ndarray(new Float32Array(data), [width, height, 4]);
  const dataProcessedTensor = ndarray(new Float32Array(width * height * 3), [
    1,
    3,
    width,
    height,
  ]);

  ops.assign(
    dataProcessedTensor.pick(0, 0, null, null),
    dataTensor.pick(null, null, 0)
  );
  ops.assign(
    dataProcessedTensor.pick(0, 1, null, null),
    dataTensor.pick(null, null, 1)
  );
  ops.assign(
    dataProcessedTensor.pick(0, 2, null, null),
    dataTensor.pick(null, null, 2)
  );

  ops.divseq(dataProcessedTensor, 255);
  ops.subseq(dataProcessedTensor.pick(0, 0, null, null), 0.485);
  ops.subseq(dataProcessedTensor.pick(0, 1, null, null), 0.456);
  ops.subseq(dataProcessedTensor.pick(0, 2, null, null), 0.406);

  ops.divseq(dataProcessedTensor.pick(0, 0, null, null), 0.229);
  ops.divseq(dataProcessedTensor.pick(0, 1, null, null), 0.224);
  ops.divseq(dataProcessedTensor.pick(0, 2, null, null), 0.225);

  const tensor = new Tensor("float32", new Float32Array(width * height * 3), [
    1,
    3,
    width,
    height,
  ]);
  tensor.data.set(dataProcessedTensor.data);
  // (tensor.data as Float32Array).set(dataProcessedTensor.data);
  return tensor;
}



export function getPredictedClass(res) {
  if (!res || res.length === 0) {
    const empty = [];
    for (let i = 0; i < 3; i++) {
      empty.push({ name: "-", probability: 0, index: 0 });
    }
    return empty;
  }
  const output = mathUtils.softmax(Array.prototype.slice.call(res));
  return imagenetUtils.imagenetClassesTopK(output, 2);
}