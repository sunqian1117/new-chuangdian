import { BrowserWindow, Menu, app, ipcMain } from 'electron'
import { platform } from "os"
import menuconfig from '../config/menu'
import { hexToBuf, bufToHex } from '../../renderer/utils/convert'
import { getIpAddress } from '../../renderer/utils/net'
import { openDevTools, IsUseSysTitle, UseStartupChart } from '../config/const'
import setIpc from './ipcMain'
const path = require('node:path')
const fs = require('node:fs')
import { winURL, loadingURL } from '../config/StaticPath'
import SerialPortCfg from '../config/SerialPortCfg'
import { SerialPortParserTypeOptions } from '../config/const'
const { SerialPort } = require("serialport");
const { ByteLengthParser } = require('@serialport/parser-byte-length');
const { DelimiterParser } = require('@serialport/parser-delimiter');
const { InterByteTimeoutParser } = require('@serialport/parser-inter-byte-timeout');
const log = require('electron-log')
log.transports.file.resolvePathFn = () => path.join(app.getAppPath(), 'logs/main.log');
import { format } from "date-fns";

import net from 'net';
let server
function createServer(port) {
  const HOST = getIpAddress();
  // const HOST = '127.0.0.1';
  // const port = 7899;
  if (server) {
    server.close();
  }

  server = net.createServer();

  server.listen(port, HOST, function () {
    log.info('Server listen on port:' + server.address().port);
    log.info('Server listen on address:' + server.address().address);
    log.info('--------------------------------------服务正在监听中---------------------------------------');
    mainWindow.webContents.send('start-server', '服务正在监听中，server is listening...');
  });


  server.on('connection', socket => {
    log.info('--------------------------------------connection---------------------------------------');
    mainWindow.webContents.send('connect-server', 'Get conneciton from:' + socket.remoteAddress);
    socket.on('data', data => {
      log.info('--------------------------------------data---------------------------------------');
      //  mainWindow.webContents.send('data-server', 'Get data from socket:' + socket.remoteAddress + '. The data:' + data);
      socket.write('you said:' + data);
    });

    socket.on('close', () => {
      log.info('--------------------------------------close---------------------------------------');
      mainWindow.webContents.send('close-server', 'Socket:' + socket.remoteAddress + " closed");
    })
  });

}




var loadWindow = null
var mainWindow = null
setIpc.Mainfunc(IsUseSysTitle)
let port = null; 
let isChecking = false;
let receivedData = false;

function createMainWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    fullscreen: false,
    useContentSize: true,
    show: false,
    frame: IsUseSysTitle,
    titleBarStyle: platform().includes('win32') ? 'default' : 'hidden',
    // titleBarStyle: platform().includes('win32') ? 'default' : 'hidden',
    webPreferences: {
      nodeIntegrationInWorker: true,
      contextIsolation: false,
      nodeIntegration: true,
      webSecurity: false,
      // 如果是开发模式可以使用devTools
      devTools: process.env.NODE_ENV === 'development' || openDevTools,
      // devTools: true,
      // 在macos中启用橡皮动画
      scrollBounce: process.platform === 'darwin'
    }
  })
  // 这里设置只有开发环境才注入显示开发者模式
  // if (process.env.NODE_ENV === 'development' || openDevTools) {
  if (process.env.NODE_ENV === 'development' || openDevTools) {
    menuconfig.push({
      label: '开发者设置',
      submenu: [{
        label: '切换到开发者模式',
        accelerator: 'CmdOrCtrl+I',
        role: 'toggledevtools'
      }]
    })
  }
  // 载入菜单
  const menu = Menu.buildFromTemplate(menuconfig)
  Menu.setApplicationMenu(menu)
  mainWindow.loadURL(winURL)
  //启动TCP服务
  ipcMain.handle('startServer', (event, cfg) => {
    createServer(8877)
  })  
  ipcMain.handle('getAppInfo', () => {
    const data = {
      userDataPath:app.getPath('userData')
    }
    mainWindow.webContents.send('appInfoOK', data)
  })

  ipcMain.handle('doSave', () => {
    const filePath = path.join(app.getPath('userData'), format(new Date(), "yyyy/MM/dd_HH:mm") + '_data.txt')
    const data = {
      filePath
    }
    mainWindow.webContents.send('saveOk', data)
  })
  ipcMain.handle('getCfgInfo', () => {
    const cfgPath = path.join(app.getPath('userData'), 'cfg.json')
    const data = {
      cfgPath
    }
    mainWindow.webContents.send('cfgInfoOk', data)
  })
  ipcMain.handle('exitApp', () => {
    app.exit()
  })

  ipcMain.handle('startCheckPorts', () => {
    SerialPort.list().then(
      ports => {
        mainWindow.webContents.send('onPorts', JSON.stringify(ports))
      }
    )
  })
  ipcMain.handle('stopCheck', (event, cfg) => {
    isChecking = false
  })
  ipcMain.handle('doLinkPort', (event, cfg) => {
    log.info('doLinkPort')
    log.info('isChecking:'+isChecking)
    log.info(cfg)
    if (port == null) {
      port = new SerialPort(cfg);
      port.on('open', (data) => {
        log.info('open'+format(new Date(), "yyyy/MM/dd_HH:mm"));
        isChecking = true
      });
      let parser = null
      switch (SerialPortCfg.ParserType) {
        case SerialPortParserTypeOptions.ByteLengthParser:
          log.info(SerialPortCfg.ParserCfg.ByteLength)
          parser = port.pipe(new ByteLengthParser({ length: SerialPortCfg.ParserCfg.ByteLength }));
          break;
        case SerialPortParserTypeOptions.DelimiterParser:
          parser = port.pipe(new DelimiterParser({ delimiter: SerialPortCfg.ParserCfg.Delimiter }));
          break;
        default:
          break;
      }
      parser.on("close", (() => { console.log('close'+format(new Date(), "yyyy/MM/dd_HH:mm")) }));
      parser.on("drain", (() => { console.log('drain'+format(new Date(), "yyyy/MM/dd_HH:mm")) }));
      parser.on("end", (() => { console.log('end'+format(new Date(), "yyyy/MM/dd_HH:mm")) }));
      parser.on("error", (() => { console.log('error'+format(new Date(), "yyyy/MM/dd_HH:mm")) }));
      parser.on("finish", (() => { console.log('finish'+format(new Date(), "yyyy/MM/dd_HH:mm")) }));
      parser.on("pause", (() => { console.log('pause'+format(new Date(), "yyyy/MM/dd_HH:mm")) }));
      parser.on("pipe", (() => { console.log('pipe'+format(new Date(), "yyyy/MM/dd_HH:mm")) }));
      // parser.on("readable", (() => { console.log('readable') })); 
      parser.on("resume", (() => { console.log('resume'+format(new Date(), "yyyy/MM/dd_HH:mm")) }));
      // parser.on("unpipe", (() => { console.log('unpipe') }));

      parser.on('data', chunk => {
         console.log('data'+format(new Date(), "yyyy/MM/dd_HH:mm")) 
        receivedData = true
        switch (SerialPortCfg.ParserType) {
          case SerialPortParserTypeOptions.ByteLengthParser:
            let lists = chunk
            if (lists[0] == "5A" && lists[1] == "01" && lists[2] == "95" &&
              lists[3] == "6C" && lists[4] == "00" && lists[5] == "02") {
              let start = 6
              mainWindow.webContents.send('onRecivePortData', lists.slice(start, 1600 + start))
            }
            break;
          case SerialPortParserTypeOptions.DelimiterParser:
            let lists1 = bufToHex(chunk).split(' ')
            mainWindow.webContents.send('onRecivePortData', lists1)
            break;
          default:
            break;
        }
      });
    } else {
      isChecking = true
    }
  })
  mainWindow.webContents.once('dom-ready', () => {
    mainWindow.show()
    if (process.env.NODE_ENV === 'development' || openDevTools) mainWindow.webContents.openDevTools(true)
    if (UseStartupChart) loadWindow.destroy()
  })
  // mainWindow.on
  ipcMain.handle('export-pdf', (_event, obj) => {
    // log.info('=======' + obj.imgData);
    let pdfWindow = new BrowserWindow({
      webPreferences: {
        nodeIntegration: true,
        webSecurity: false,
        enableRemoteModule: true
      },
      show: true, // 如果不想显示窗口可以改为false
      width: 800,
      height: 600,
      fullscreenable: true,
      minimizable: false
    });
    let html = `<img src="${obj.imgData}"/>`
    pdfWindow.loadURL(`data:text/html;charset=utf-8,<body>${html}</body>`);
    pdfWindow.webContents.on('did-finish-load', () => {
      // const pdfPath = obj.filePath;
      const pdfPath = path.join(app.getPath('userData'), obj.fileName.split(':').join('：'))
      // const pdfPath = path.join(app.getPath('userData'), new Date().getTime() + '.pdf')
      pdfWindow.webContents.printToPDF({
        printBackground: true,
        margins: {
          top: 0,
          bottom: 0,
          left: 0,
          right: 0
        },
      }).then(data => {
        log.info(pdfPath)
        fs.writeFile(pdfPath, data, error => {
          if (error) throw error;
          mainWindow.webContents.send('export-pdf-res', { success: `导出成功，路径：${pdfPath}`, pdfPath });
          pdfWindow.close();// 保存pdf过后关闭该窗口
          pdfWindow = null;
        });
      }).catch(error => {
        mainWindow.webContents.send('export-pdf-res', { failed: `导出失败，路径：${JSON.stringify(error)}` });
      });
    });
  });

  mainWindow.on('maximize', () => {
    mainWindow.webContents.send("w-max", true)
  })
  mainWindow.on('unmaximize', () => {
    mainWindow.webContents.send("w-max", false)
  })
  mainWindow.on('closed', () => {
    mainWindow = null
    app.quit();
  })
}

function loadingWindow() {
  loadWindow = new BrowserWindow({
    width: 400,
    height: 600,
    frame: false,
    backgroundColor: '#222',
    skipTaskbar: true,
    transparent: true,
    resizable: false,
    webPreferences: { experimentalFeatures: true }
  })

  loadWindow.loadURL(loadingURL)

  loadWindow.show()

  setTimeout(() => {
    createMainWindow()
  }, 2000)

  loadWindow.on('closed', () => {
    loadWindow = null
  })
}

function initWindow() {
  if (UseStartupChart) {
    return loadingWindow()
  } else {
    return createMainWindow()
  }
}
export default initWindow
