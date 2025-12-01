import { globalShortcut } from 'electron'
import { SerialPortParserTypeOptions } from "./const"

export default {
  //默认定长触发读取数据
  ParserType: SerialPortParserTypeOptions.DelimiterParser,
  // ParserType: SerialPortParserTypeOptions.ByteLengthParser,
  //默认 Parse 配置
  ParserCfg: {
    // 默认的定长值触发
    DiTabByteLength: 122,
    ByteLength: 3206,
    // ByteLength: 3206*3,
    // ByteLength: 1608,
    // 默认的分隔符值触发
    // Delimiter: '5A 01 95 6C 00 02 ',
    Delimiter: [0x5a, 0x01, 0x95, 0x6c, 0x00, 0x02],
  }
}
