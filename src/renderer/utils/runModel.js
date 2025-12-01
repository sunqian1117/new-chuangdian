import {InferenceSession, Tensor} from 'onnxruntime-web';
import { getPredictedClass } from "@/utils/cnn"

/**
 * 初始化函数
 *
 * @returns 无返回值
 */
function init() {
  // env.wasm.simd = false;
}

/**
 * 异步创建一个使用CPU进行推理的模型
 *
 * @param model 模型文件
 * @returns 返回一个Promise对象，解析后得到创建的InferenceSession实例
 */
export async function createModelCpu(model){
  init();
  return await InferenceSession.create(model, {executionProviders: ['wasm']});
}
/**
 * 在GPU上创建模型
 *
 * @param model 模型数据
 * @returns 返回一个InferenceSession对象，该对象可用于在GPU上执行模型推理
 */
export async function createModelGpu(model){
  init();
  return await InferenceSession.create(model, {executionProviders: ['webgl']});
}

/**
 * 对模型进行预热
 *
 * @param model 模型对象
 * @param dims 输入数据的维度数组
 * @returns 无返回值，异步执行
 */
export async function warmupModel(model, dims) {
  // OK. we generate a random input and call Session.run() as a warmup query
  const size = dims.reduce((a, b) => a * b);
  const warmupTensor = new Tensor('float32', new Float32Array(size), dims);

  for (let i = 0; i < size; i++) {
    warmupTensor.data[i] = Math.random() * 2.0 - 1.0;  // random value [-1.0, 1.0)
  }
  try {
    const feeds = {};
    feeds[model.inputNames[0]] = warmupTensor;
    await model.run(feeds);
  } catch (e) {
    console.error(e);
  }
}

/**
 * 运行模型并返回输出结果和推理时间
 *
 * @param model 模型对象
 * @param preprocessedData 预处理后的数据
 * @returns 包含输出结果和推理时间的数组
 * @throws 如果在模型运行过程中发生错误，将抛出异常
 */
export async function runModel(model, preprocessedData){
  const start = new Date();
  try {
    const feeds = {};
    console.log('model',model);
    console.log('model.inputNames',model.inputNames);
    feeds[model.inputNames[0]] = preprocessedData;
    const outputData = await model.run(feeds);
    const end = new Date();
    const inferenceTime = (end.getTime() - start.getTime());
    const output = outputData[model.outputNames[0]];
    console.log(output.data);
    console.log( getPredictedClass(Array.prototype.slice.call(output.data))[0])
    return [output, inferenceTime];
  } catch (e) {
    console.error(e);
    throw new Error();
  }
}