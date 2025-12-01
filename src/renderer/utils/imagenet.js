import _ from 'lodash';
import { imagenetClasses } from '@/config/imagenet';

/**
 * Find top k imagenet classes
 */
/**
 * 获取 ImageNet 数据集中概率最高的 k 个类别
 *
 * @param classProbabilities 类别概率数组
 * @param k 需要返回的类别数量，默认为 5
 * @returns 包含 id、index、name 和 probability 的对象数组
 */
export function imagenetClassesTopK(classProbabilities, k = 2) {
  const probs =
    _.isTypedArray(classProbabilities) ? Array.prototype.slice.call(classProbabilities) : classProbabilities;

  const sorted = _.reverse(_.sortBy(probs.map((prob, index) => [prob, index]), probIndex => probIndex[0]));
  console.log('---------------------------');
  console.trace()
    console.log(imagenetClasses[sorted[0][1]]);

  const topK = _.take(sorted, k).map(probIndex => {
    const iClass = imagenetClasses[probIndex[1]];
    // console.log(iClass);
    return {
      id: iClass,
      index: parseInt(probIndex[1], 10),
      name: iClass,
      probability: probIndex[0]
    };
  });
  return topK;
}