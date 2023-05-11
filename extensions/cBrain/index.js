/**
 * Created by tony on 2019/8/30
 */
const Firmata = require('./cBrainFirmata.js');
//const Firmata = require('./firmata.js');
//const Board = require('./firmata.js').Board;
const Emitter = require("events");
window.five = window.require('johnny-five');

const ArgumentType = Scratch.ArgumentType;
const BlockType = Scratch.BlockType;
const formatMessage = Scratch.formatMessage;
const log = Scratch.log;

const menuIconURI = "data:image/png;base64,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";
const blockIconURI = "data:image/png;base64,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";

const Ports_rj = [
  ['', 'A0', 'A1', 'V', 'G', ''],  //port1
  ['', 'A2', 'A3', 'V', 'G', ''],  //port2
  ['', 'A4', 'A5', 'V', 'G', ''],  //port3: A4=SDA, A5=SCL for I2C
  ['', 'A6', 'A7', 'V', 'G', ''],  //port4: not connected
  ['4', '2', '3', 'V', 'G', ''],   //port5
  ['7', '5', '6', 'V', 'G', ''],   //port6
  ['8', '9', '10', 'V', 'G', ''],  //port7
  ['13', '11', '12', 'V', 'G', ''],//port8
];
// pwm: D3、D5、D6、D9、D10、D11
const Sensors = {
  TXpin: 1,
  RXpin: 0,
  button: 4, //port5[0]
  sound: 'A2', //port2[1]
  slider: 'A0', //port1[1]
  light: 'A1', //port1[2]
  rled: 10, //port7[2], pwm
  gled: 11, //port8[1], pwm
  bled: 13, //port8[0]
  buzzer: 9 //port7[1], pwm
};

class TransportStub extends Emitter {
  constructor(path/*, options, openCallback*/) {
    super();
    this.isOpen = true;
    this.baudRate = 0;
    this.path = path;
  }

  write(buffer) {
    //console.log("transport write", buffer);//for debug
    // Tests are written to work with arrays not buffers
    // this shouldn't impact the data, just the container
    // This also should be changed in future test rewrites
    /* istanbul ignore else */
    if (Buffer.isBuffer(buffer)) {
      buffer = Array.from(buffer);
    }

    this.lastWrite = buffer;
    this.emit("write", buffer);
  }

  static list() {
    /* istanbul ignore next */
    return Promise.resolve([]);
  }
}
/*
const wireCommon = gen => {
    gen.setupCodes_['wire'] = `Wire.begin()`;
    gen.includes_['wire'] = '#include <Wire.h>\n';
}
*/
const mpuCommon = gen => {
  gen.includes_['stdint'] = `#include <stdint.h>`;
  gen.includes_['mpu6050'] = `
#include "I2Cdev.h"
#include "MPU6050_6Axis_MotionApps20.h"

// Arduino Wire library is required if I2Cdev I2CDEV_ARDUINO_WIRE implementation
// is used in I2Cdev.h
#if I2CDEV_IMPLEMENTATION == I2CDEV_ARDUINO_WIRE
    #include "Wire.h"
#endif
/*
class cBrainIMU:public MPU6050 {
  public:
    cBrainIMU(){
      yaw_bias=0;
    }
    cBrainIMU(uint8_t address=(MPU6050_IMU::MPU6050_DEFAULT_ADDRESS)):MPU6050(address){
      yaw_bias=0;
    }
    VectorInt16 aa;
    VectorInt16 aaReal;
    VectorInt16 gyro;
    VectorInt16 gravity;
    int16_t yaw;
    int16_t pitch;
    int16_t roll;
    int16_t yaw_bias;
    
}
cBrainIMU mpu;
*/
MPU6050 mpu;
int16_t yaw_bias=0;

//#define DEBUG
`;

  gen.definitions_['mpufailed'] = `
void mpufailed(){
    #define LED_PIN 13
    bool blinkState = false;
    pinMode(LED_PIN, OUTPUT);
    for ( uint8_t i=0; i<5; i++) {
        blinkState = !blinkState;
        digitalWrite(LED_PIN, blinkState);
        delay(500);
    }
}
`;
  gen.definitions_['mpu6050read'] = `
int16_t mpu6050read(uint8_t d, boolean bias=true){
  uint8_t fifoBuffer[42];       // FIFO storage buffer, dmpPacketSize = 42
  Quaternion q;                 // [w, x, y, z]         quaternion container
  VectorInt16 aa;               // [x, y, z]            accel sensor measurements
  static VectorInt16 gyro;      // [x, y, z]            gyro sensor measurements
  static VectorInt16 aaReal;    // [x, y, z]            gravity-free accel sensor measurements
  //VectorInt16 aaWorld;        // [x, y, z]            world-frame accel sensor measurements
  static VectorFloat gravity;   // [x, y, z]            gravity vector
  static float ypr[3];          // [yaw, pitch, roll]   yaw/pitch/roll container and gravity vector

  if (mpu.dmpGetCurrentFIFOPacket(fifoBuffer)) { // Get the Latest packet

    mpu.dmpGetQuaternion(&q, fifoBuffer);
    mpu.dmpGetAccel(&aa, fifoBuffer);
    mpu.dmpGetGyro(&gyro, fifoBuffer);
    mpu.dmpGetGravity(&gravity, &q);
    mpu.dmpGetYawPitchRoll(ypr, &q, &gravity);
    mpu.dmpGetLinearAccel(&aaReal, &aa, &gravity);
    //mpu.dmpGetLinearAccelInWorld(&aaWorld, &aaReal, &q);

    #ifdef DEBUG
        Serial.print("ypr\t");
        Serial.print(ypr[0] * 180/M_PI);
        Serial.print("\t");
        Serial.print(ypr[1] * 180/M_PI);
        Serial.print("\t");
        Serial.println(ypr[2] * 180/M_PI);
        Serial.print("acc\t");
        Serial.print(aa.x);
        Serial.print("\t");
        Serial.print(aa.y);
        Serial.print("\t");
        Serial.println(aa.z);
        Serial.print("gyro\t");
        Serial.print(gyro.x);
        Serial.print("\t");
        Serial.print(gyro.y);
        Serial.print("\t");
        Serial.println(gyro.z);
        Serial.print("areal\t");
        Serial.print(aaReal.x);
        Serial.print("\t");
        Serial.print(aaReal.y);
        Serial.print("\t");
        Serial.println(aaReal.z);
        //Serial.print("arealW\t");
        //Serial.print(aaWorld.x);
        //Serial.print("\t");
        //Serial.print(aaWorld.y);
        //Serial.print("\t");
        //Serial.println(aaWorld.z);
        Serial.print("gravity\t");
        Serial.print(gravity.x);
        Serial.print("\t");
        Serial.print(gravity.y);
        Serial.print("\t");
        Serial.println(gravity.z);
    #endif
    /*
    // imu x-y-z軸與主機不同
    mpu.aa.x = -aa.x; // unit:mm/s2
    mpu.aa.y = -aa.y;
    mpu.aa.z = aa.z;
    mpu.aaReal.x = int((float)-aaReal.x*1.2); // 9800/8192
    mpu.aaReal.y = int((float)-aaReal.y*1.2);
    mpu.aaReal.z = int((float)aaReal.z*1.2);
    mpu.gyro.x = -gyro.x;
    mpu.gyro.y = -gyro.y;
    mpu.gyro.z = gyro.z;
    mpu.gravity.x = int(-1000*gravity.x); // unit:mG, 方向:反作用力
    mpu.gravity.y = int(-1000*gravity.y);
    mpu.gravity.z = int(1000*gravity.z);
    mpu.yaw = int(ypr[0] * -180.0/M_PI);
    mpu.pitch = int(ypr[2] * -180.0/M_PI);
    mpu.roll = int(ypr[1] * 180.0/M_PI);
    */

  } else { 
    #ifdef DEBUG
      Serial.println("no valid data is available");
    #endif    
  }

  switch (d) { // imu x-y-z軸與主機不同
    case 1: //yaw
        if (bias) { return (int(ypr[0] * -180.0/M_PI)-yaw_bias);}
        else { return int(ypr[0] * -180.0/M_PI);}
        //if (bias) { return (mpu.yaw - mpu.yaw_bias);}
        //else { return mpu.yaw;}
      break;
    case 2: //pitch
        //return mpu.pitch;
        return int(ypr[2] * -180.0/M_PI);
      break;
    case 3: //roll
        //return mpu.roll;
        return int(ypr[1] * 180.0/M_PI);
      break;
    case 11: //ax, unit:mm/s2
        //return mpu.aaReal.x;
        return int((float)-aaReal.x*1.2); // 9800/8192=1.2
      break;
    case 22: //ay
        //return mpu.aaReal.y;
        return int((float)-aaReal.y*1.2);
      break;
    case 33: //az
        //return mpu.aaReal.z;
        return int((float)aaReal.z*1.2);
      break;
    case 111: //gx
        //return mpu.gyro.x;
        return -gyro.x;
      break;
    case 122: //gy
        //return mpu.gyro.y;
        return -gyro.y;
      break;
    case 133: //gz
        //return mpu.gyro.z;
        return gyro.z;
      break;
    case 55: // Gx, unit:mG, 方向:反作用力
        return int(-1000*gravity.x);
        //return mpu.gravity.x;
      break;
    case 66: // Gy
        return int(-1000*gravity.y);
        //return mpu.gravity.y;
      break;
    case 77: // Gz
        return int(1000*gravity.z);
        //return mpu.gravity.z;
      break;
    case 255: // shaked? 1G=8192 for mpu6050
        if (abs(aaReal.x)>4000) {
          if (abs(aaReal.y)>4000 || abs(aaReal.z)>4000) return true;
        } else if (abs(aaReal.y)>4000) {
          if (abs(aaReal.z)>4000) return true;
        } else {
          return false;
        }
      break;
    default:
      return;
  }

}
`;

  gen.definitions_['mpu6050shaked'] = `
bool IMUshaked(){
    uint8_t shakeCnt=0;
    uint32_t preT=millis();

    while((millis()-preT)<1500){ 
      if (abs(mpu6050read(11))>4000 || abs(mpu6050read(22))>4000 || abs(mpu6050read(33))>4000) shakeCnt++;
      // ~0.5G, 1G=8192 in mpu6050
      delay(50);
    }
  #ifdef DEBUG
    Serial.print("dT=");
    Serial.println((millis()-preT));
    Serial.print("shakeCnt=");
    Serial.println(shakeCnt);
  #endif
    if (shakeCnt>4) {return true;
    } else {return false;}
}
`;

  gen.setupCodes_['mpu6050'] = `
  // join I2C bus (I2Cdev library doesn't do this automatically)
  #if I2CDEV_IMPLEMENTATION == I2CDEV_ARDUINO_WIRE
      Wire.begin();
      Wire.setClock(400000); // 400kHz I2C clock. Comment this line if having compilation difficulties
  #elif I2CDEV_IMPLEMENTATION == I2CDEV_BUILTIN_FASTWIRE
      Fastwire::setup(400, true);
  #endif

  #ifdef DEBUG
    Serial.begin(115200);
  #endif

  mpu.initialize();
  if (!mpu.testConnection()) {
    mpufailed();
    #ifdef DEBUG
        Serial.println(F("MPU6050 connection failed"));
    #endif
  } else {
    uint8_t devStatus = mpu.dmpInitialize();
    // make sure it worked (returns 0 if so)
    if (devStatus == 0) {
      // Calibration Time: generate offsets and calibrate our MPU6050
      mpu.CalibrateAccel(6);
      mpu.CalibrateGyro(6);
      #ifdef DEBUG
        mpu.PrintActiveOffsets();
      #endif
      mpu.setDMPEnabled(true);
      #ifdef DEBUG
        Serial.println(F("DMP ready!"));
        Serial.println(F("Setting DHPF bandwidth to 5Hz..."));
      #endif
      mpu.setDHPFMode(1);
      mpu.setFreefallDetectionThreshold(17);
      mpu.setFreefallDetectionDuration(2);
      mpu.setMotionDetectionThreshold(2);
      mpu.setMotionDetectionDuration(20);
      mpu.setZeroMotionDetectionThreshold(4);
      mpu.setZeroMotionDetectionDuration(1);
      
      #ifdef DEBUG
        Serial.print(F("FF Threshold:	"));
        Serial.println(mpu.getFreefallDetectionThreshold());
        Serial.print(F("FF duration:	"));
        Serial.println(mpu.getFreefallDetectionDuration());
        Serial.print(F("motion Threshold:	"));
        Serial.println(mpu.getMotionDetectionThreshold());
        Serial.print(F("motion duration:	"));
        Serial.println(mpu.getMotionDetectionDuration());
        Serial.print(F("0 Threshold:	"));
        Serial.println(mpu.getZeroMotionDetectionThreshold());
        Serial.print(F("0 duration:	"));
        Serial.println(mpu.getZeroMotionDetectionDuration());

        Serial.print(F("Int Enable?	"));
        Serial.println(mpu.getIntEnabled(),BIN);
      #endif
    } else {
      mpufailed();
      // ERROR!
      // 1 = initial memory load failed
      // 2 = DMP configuration updates failed
      // (if it's going to break, usually the code will be 1)
      #ifdef DEBUG
        Serial.print(F("DMP Initialization failed (code "));
        Serial.print(devStatus);
        Serial.println(F(")"));
      #endif
    }
  }
`;

}

const pin2firmata = (pin, aidx) => {
  if (pin.startsWith('A')) {
    // A0 starts with 14
    pin = parseInt(pin[1], 10) + 14;
    if (aidx) pin -= 14; // in firmata.js, analogPin with no "A"
  } else {
    pin = parseInt(pin, 10);
  }
  return pin;
}

async function timeout(ms) {
  await new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

class cBrain {
  constructor(runtime) {
    /**
    * Store this for later communication with the Scratch VM runtime.
    * If this extension is running in a sandbox then `runtime` is an async proxy object.
    */
    this.runtime = runtime;
    // communication related
    // 其中comm是kittenblock的通信io实体，session是通信上下文，具体在打开端口后进行实例化。
    this.comm = runtime.ioDevices.comm;
    this.session = null;
    this.runtime.registerPeripheralExtension('cBrain', this);
    this.runtime.on('PROJECT_STOP_ALL', this.stopAll.bind(this));
    // session callbacks
    this.onmessage = this.onmessage.bind(this);
    this.onclose = this.onclose.bind(this);
    this.decoder = new TextDecoder();
    this.lineBuffer = '';
    const firmata = new Firmata();
    this.trans = new TransportStub();
    //this.board = new firmata.Board(this.trans);
    window.board = new firmata.Board(this.trans);
    //console.log("firmata attached(this.board)", this.board);//for debug
    // cross extension usage
    //window.board = this.board;
    board._port = Ports_rj;
    //this.board.sensors = Sensors;
    board.menuIconURI = menuIconURI;
    board.blockIconURI = blockIconURI;
    board.pin2firmata = pin2firmata;
    board.timeout = timeout;
    //board.servo = {};
    //board.matrix = {};
    console.log("firmata attached(window.board)", board);//for debug
    //window.five = window.require('johnny-five');

    this.trans.on("write", data => {
      if (this.session) this.session.write(data);
      //console.log("session write", data);//for debug
    });

    board.once('ready', () => { // when cBrainFirmata firmware loaded
      console.log("firmware ready", board);//for debug
      // ToDo: j5 allows muti-boards by use of Board.id
      // will give a new id when call a new Board
      // but module blocks such like Servo still use old j5board. why?
      //if (!window.j5board){
      window.j5board = new five.Board({
        io: board,
        //id: 'cBrain1',
        debug: false,
        repl: false
      });
      console.log("j5 attached", j5board);//for debug
      //}
      vm.emit('showAlert', { msg: 'online', type: 'info' });
    });
    /*
    const viewedTutorial = localStorage.getItem("showed-arduino-tutorial")
    if (!viewedTutorial){
        runtime.showDeck('arduino-tutorial');
        localStorage.setItem("showed-arduino-tutorial", 1);
    }*/
  }

  onmessage(data) {
    board.transport.emit('data', data);
    //this.board.transport.emit('data', data);
    //console.log("message from cBrainFirmata..", data);//for debug
    //console.log("Firmata status..", board);//for debug
  }

  onclose() {
    this.session = null;
    console.log("cBrain closed");//for debug
    console.log('window.board:', board);
    //console.log('window.j5board:',j5board);
  }

  // method required by vm runtime
  /**
   * Called by the runtime when user wants to scan for an cBrain peripheral.
   */
  scan() {
    this.comm.getDeviceList().then(result => {
      this.runtime.emit(this.runtime.constructor.PERIPHERAL_LIST_UPDATE, result);
    });
  }

  stopAll() {
    this.arduinoStarted = false;
  }
  /**
   * Called by the runtime when user wants to connect to a certain cBrain peripheral.
   * id - the id of the peripheral to connect to.
   */
  connect(id) {
    this.comm.connect(id).then(sess => {
      this.session = sess;
      this.session.onmessage = this.onmessage;
      this.session.onclose = this.onclose;
      console.log("cBrain connected");//for debug
      // notify gui connected
      this.runtime.emit(this.runtime.constructor.PERIPHERAL_CONNECTED);
    }).catch(err => {
      log.warn('connect peripheral fail', err);
    });
  }

  disconnect() {
    this.session.close();
    console.log("cBrain disconnected");//for debug
  }

  isConnected() {
    return Boolean(this.session);
  }

  getInfo() {
    return {
      id: 'cBrain',
      name: 'cBrain',
      /*
      // Optional: the human-readable name of this extension as string.
      // This and any other string to be displayed in the Scratch UI may either be
      // a string or a call to `formatMessage`; a plain string will not be
      // translated whereas a call to `formatMessage` will connect the string
      // to the translation map (see below). The `formatMessage` call is
      // similar to `formatMessage` from `react-intl` in form, but will actually
      // call some extension support code to do its magic. For example, we will
      // internally namespace the messages such that two extensions could have
      // messages with the same ID without colliding.
      // See also: https://github.com/yahoo/react-intl/wiki/API#formatmessage
      */
      color1: '#00979C',
      color2: '#008184',
      color3: '#008184',

      // Optional: URI for a block icon, to display at the edge of each block for this
      // extension. Data URI OK.
      // TODO: what file types are OK? All web images? Just PNG?
      blockIconURI: blockIconURI,

      // Optional: URI for an icon to be displayed in the blocks category menu.
      // If not present, the menu will display the block icon, if one is present.
      // Otherwise, the category menu shows its default filled circle.
      // Data URI OK.
      // TODO: what file types are OK? All web images? Just PNG?
      menuIconURI: menuIconURI,//'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAFCAAAAACyOJm3AAAAFklEQVQYV2P4DwMMEMgAI/+DEUIMBgAEWB7i7uidhAAAAABJRU5ErkJggg==',

      // Optional: Link to documentation content for this extension.
      // If not present, offer no link.
      // docsURI: 'https://....',

      showStatusButton: true,

      blocks: [
        /*
                        {
                            opcode: 'arduinostart',
                            blockType: BlockType.CONDITIONAL,
                            // Required: the kind of block we're defining, from a predefined list.
                            // Fully supported block types:
                            //   BlockType.BOOLEAN - same as REPORTER but returns a Boolean value
                            //   BlockType.COMMAND - a normal command block, like "move {} steps"
                            //   BlockType.HAT - starts a stack if its value changes from falsy to truthy ("edge triggered")
                            //   BlockType.REPORTER - returns a value, like "direction"
                            // Block types in development or for internal use only:
                            //   BlockType.BUTTON - place a button in the block palette
                            //   BlockType.CONDITIONAL - control flow, like "if {}" or "if {} else {}"
                            //     A CONDITIONAL block may return the one-based index of a branch to
                            //     run, or it may return zero/falsy to run no branch.
                            //   BlockType.EVENT - Specialized hat block with no implementation function
                            //     only runs if the corresponding event is emitted by other code
                            //     starts a stack in response to an event (full spec TBD)
                            //   BlockType.LOOP - control flow, like "repeat {} {}" or "forever {}"
                            //     A LOOP block is like a CONDITIONAL block with two differences:
                            //     - the block is assumed to have exactly one child branch, and
                            //     - each time a child branch finishes, the loop block is called again.
        
                            branchCount: 2,
                            // Required for CONDITIONAL blocks, ignored for others: the number of
                            // child branches this block controls. An "if" or "repeat" block would
                            // specify a branch count of 1; an "if-else" block would specify a
                            // branch count of 2.
                            // TODO: should we support dynamic branch count for "switch"-likes?
        
                            isTerminal: true,
                            message2: 'loop',
                            text: ['cBrain Setup', 'loop'],
                            hatType: true,
                            func: 'noop'
                            // Optional: the function implementing this block.
                            // If absent, assume `func` is the same as `opcode`.
        
                        },
                        {
                            opcode: 'serialreadline',
                            blockType: BlockType.CONDITIONAL,
        
                            branchCount: 1,
                            isTerminal: false,
        
                            text: formatMessage({
                                id: 'arduino.serialreadline',
                                default: '[SERIAL] Readline'
                            }),
                            arguments: {
                                SERIAL: {
                                    type: ArgumentType.STRING,
                                    //ArgumentType...
                                      //ANGLE: 'angle', // Numeric value with angle picker -180-180
                                      //BOOLEAN: 'Boolean', // Boolean value with hexagonal placeholder
                                      //COLOR: 'color', // Numeric value with color picker
                                      //NUMBER: 'number', // Numeric value with text field
                                      //SLIDER: 'slider', // -255-255
                                      //SLIDERANALOGWR: 'slideranalogwr', // 0-255
                                      //SLIDERSERVO: 'sliderservo', // 0-180
                                      //LEDMATRIX: 'ledmatrix',
                                      //RGBPANEL: 'rgbpanel',
                                      //BITLEDS: 'bitleds',
                                      //FILEINPUT: 'fileinput',
                                      //STRING: 'string', //String value with text field
                                      //MATRIX: 'matrix', //String value with matrix field
                                      //NOTE: 'note' //MIDI note number with note picker (piano) field
        
                                    menu: 'serialtype',
                                    defaultValue: 'Serial'
                                }
                            },
                            func: 'noop'
                        },
        
                        {
                            opcode: 'softwareserial',
                            blockType: BlockType.COMMAND,
        
                            text: formatMessage({
                                id: 'arduino.softwareserial',
                                default: 'Software Serial TX[TX] RX[RX] [BAUD]'
                            }),
                            arguments: {
                                TX: {
                                    type: ArgumentType.STRING,
                                    defaultValue: '3',
                                    menu: 'digiPin'
                                },
                                RX: {
                                    type: ArgumentType.STRING,
                                    defaultValue: '4',
                                    menu: 'digiPin'
                                },
                                BAUD: {
                                    type: ArgumentType.NUMBER,
                                    defaultValue: 9600
                                }
                            },
                            func: 'noop'
                        },
                        {
                            opcode: 'softwareserialprintln',
                            blockType: BlockType.COMMAND,
        
                            text: formatMessage({
                                id: 'arduino.softwareserialprintln',
                                default: 'Software Serial Println [TEXT]'
                            }),
                            arguments: {
                                TEXT: {
                                    type: ArgumentType.STRING,
                                    defaultValue: 'Hello World'
                                }
                            },
                            func: 'noop'
                        },
                        '---',
                        {
                            opcode: 'pinmode',
                            blockType: BlockType.COMMAND,
        
                            text: formatMessage({
                                id: 'arduino.pinmode',
                                default: 'Pin Mode [PIN] [MODE]'
                            }),
                            arguments: {
                                PIN: {
                                    type: ArgumentType.STRING,
                                    defaultValue: '13',
                                    menu: 'digiPort'
                                },
                                MODE: {
                                    type: ArgumentType.STRING,
                                    menu: 'pinMode',
                                    defaultValue: 1
                                }
                            },
                            func: 'pinMode'
                        },
                        {
                            opcode: 'digitalwrite',
                            blockType: BlockType.COMMAND,
        
                            text: formatMessage({
                                id: 'arduino.digitalwrite',
                                default: 'Digital Write [PIN] [VALUE]'
                            }),
                            arguments: {
                                PIN: {
                                    type: ArgumentType.STRING,
                                    defaultValue: '13',
                                    menu: 'digiPort'
                                },
                                VALUE: {
                                    type: ArgumentType.NUMBER,
                                    menu: 'level',
                                    defaultValue: 1
                                }
                            },
                            func: 'digitalWrite'
                        },
                        {
                            opcode: 'analogwrite',
                            blockType: BlockType.COMMAND,
        
                            text: formatMessage({
                                id: 'arduino.analogwrite',
                                default: 'Analog Write [PIN] [VALUE]'
                            }),
                            arguments: {
                                PIN: {
                                    type: ArgumentType.STRING,
                                    menu: 'analogWritePort',
                                    defaultValue: '3'
                                },
                                VALUE: {
                                    type: ArgumentType.SLIDERANALOGWR,
                                    defaultValue: 120
                                }
                            },
                            func: 'analogWrite'
                        },
                        {
                            opcode: 'digitalread',
                            blockType: BlockType.BOOLEAN,
        
                            text: formatMessage({
                                id: 'arduino.digitalread',
                                default: 'Digital Read [PIN]'
                            }),
                            arguments: {
                                PIN: {
                                    type: ArgumentType.STRING,
                                    defaultValue: '3',
                                    menu: 'digiPort'
                                }
                            },
                            func: 'digitalRead'
                        },
                        {
                            opcode: 'analogread',
                            blockType: BlockType.REPORTER,
        
                            text: formatMessage({
                                id: 'arduino.analogread',
                                default: 'Analog Read [PIN]'
                            }),
                            arguments: {
                                PIN: {
                                    type: ArgumentType.STRING,
                                    defaultValue: 'A0',
                                    menu: 'analogPort'
                                }
                            },
                            func: 'analogRead',
                            sepafter: 36
                        },
        */
        {
          opcode: 'buttonPressed',
          text: 'button pressed?',
          //description: 'is the on-board button pressed?'
          blockType: BlockType.BOOLEAN,
          func: 'buttonPressed',
          gen: {
            arduino: this.buttonPressedGen
          }
        },
        {
          opcode: 'getSound',
          text: 'surrounding volume (0~1023)',
          //description: 'gets measured sound volume'
          blockType: BlockType.REPORTER,
          func: 'getSound',
          gen: {
            arduino: this.getSoundGen
          }
        },
        {
          opcode: 'getBrightness',
          text: 'surrounding brightness (0~1023)',
          //description: 'gets measured brightness'
          blockType: BlockType.REPORTER,
          func: 'getBrightness',
          gen: {
            arduino: this.getBrightnessGen
          }
        },
        {
          opcode: 'getSlider',
          text: 'slide potentiometer value (0~1023)',
          //description: 'gets on-board slide potentiometers value'
          blockType: BlockType.REPORTER,
          func: 'getSlider',
          gen: {
            arduino: this.getSliderGen
          }
        },
        {
          opcode: 'mapping',
          blockType: BlockType.REPORTER,
          text: formatMessage({
            id: 'arduino.mapping',
            default: 'Map [VAL] from [FROMLOW]~[FROMHIGH] to [TOLOW]~[TOHIGH]'
          }),
          arguments: {
            VAL: {
              type: ArgumentType.NUMBER,
              defaultValue: 100
            },
            FROMLOW: {
              type: ArgumentType.NUMBER,
              defaultValue: 0
            },
            FROMHIGH: {
              type: ArgumentType.NUMBER,
              defaultValue: 1023
            },
            TOLOW: {
              type: ArgumentType.NUMBER,
              defaultValue: 0
            },
            TOHIGH: {
              type: ArgumentType.NUMBER,
              defaultValue: 255
            }
          },
          func: 'mapping',
          gen: {
            arduino: this.mappingGen
          }
        },
        '---',
        {
          opcode: 'Gesture',
          blockType: BlockType.BOOLEAN,
          text: '[GESTURE] is up?',
          arguments: {
            GESTURE: {
              type: ArgumentType.STRING,
              defaultValue: '1',
              menu: '#gestureList'
            },
          },
          func: 'isGesture',
          gen: {
            arduino: this.isGestureGen
          }
        },
        {
          opcode: 'Gesture1',
          blockType: BlockType.BOOLEAN,
          text: 'Gesture is [GESTURE]?',
          arguments: {
            GESTURE: {
              type: ArgumentType.STRING,
              defaultValue: '14',
              menu: '#gesture1List'
            },
          },
          func: 'isGesture',
          gen: {
            arduino: this.isGestureGen
          }
        },
        {
          opcode: 'Motion',
          blockType: BlockType.BOOLEAN,
          text: 'motion state is [GESTURE]?',
          arguments: {
            GESTURE: {
              type: ArgumentType.STRING,
              defaultValue: '21',
              menu: '#motionList'
            },
          },
          func: 'isGesture',
          gen: {
            arduino: this.isGestureGen
          }
        },
        {
          opcode: 'Motion1',
          blockType: BlockType.BOOLEAN,
          text: 'state is [GESTURE]?',
          arguments: {
            GESTURE: {
              type: ArgumentType.STRING,
              defaultValue: 'shake',
              menu: 'm1'
            },
          },
          func: 'isGesture',
          gen: {
            arduino: this.isGestureGen
          }
        },
        '---',
        {
          opcode: 'resetYaw',
          blockType: BlockType.COMMAND,
          text: 'reset Yaw angle',
          func: 'resetyaw',
          gen: {
            arduino: this.resetyawGen
          }
        },
        {
          opcode: 'imuYPR',
          blockType: BlockType.REPORTER,
          text: 'IMU [IMU] reading(°)',
          arguments: {
            IMU: {
              type: ArgumentType.STRING,
              defaultValue: 'yaw',
              menu: 'ypr'
            }
          },
          func: 'imuRead',
          gen: {
            arduino: this.imuReadGen
          }
        },
        {
          opcode: 'imuG',
          blockType: BlockType.REPORTER,
          text: 'IMU [IMU] reading(mg)',
          arguments: {
            IMU: {
              type: ArgumentType.STRING,
              defaultValue: 'Gx',
              menu: 'accG'
            }
          },
          func: 'imuRead',
          gen: {
            arduino: this.imuReadGen
          }
        },
        {
          opcode: 'imuAcc',
          blockType: BlockType.REPORTER,
          text: 'IMU [IMU] reading(mm/s²)',
          arguments: {
            IMU: {
              type: ArgumentType.STRING,
              defaultValue: 'ax',
              menu: 'acc'
            }
          },
          func: 'imuRead',
          gen: {
            arduino: this.imuReadGen
          }
        },
        {
          opcode: 'imuAV',
          blockType: BlockType.REPORTER,
          text: 'IMU [IMU] reading(°/s)',
          arguments: {
            IMU: {
              type: ArgumentType.STRING,
              defaultValue: 'gx',
              menu: 'av'
            }
          },
          func: 'imuRead',
          gen: {
            arduino: this.imuReadGen
          }
        },
        '---',
        {
          opcode: 'led',
          blockType: BlockType.COMMAND,
          text: '[VALUE] [PIN] LED',
          arguments: {
            PIN: {
              type: ArgumentType.STRING,
              defaultValue: 'Red', //Sensors.rled,
              menu: 'ledpin'
            },
            VALUE: {
              type: ArgumentType.STRING,
              menu: 'onoff',
              defaultValue: 'ON', //'1'
            }
          },
          func: 'led',
          gen: {
            arduino: this.ledGen
          }
        },
        '---',
        {
          opcode: 'soundeffect',
          blockType: BlockType.COMMAND,
          text: 'play sound effect [SOUND]',
          arguments: {
            SOUND: {
              type: ArgumentType.NUMBER,
              menu: 'Sounds',
              defaultValue: 1
            }
          },
          func: 'soundeffect',
          gen: {
            arduino: this.soundeffectGen
          }
        },
        {
          opcode: 'music',
          blockType: BlockType.COMMAND,
          text: 'play music [NOTES]',
          arguments: {
            NOTES: {
              type: ArgumentType.STRING,
              defaultValue: 'g5:1 d c g4:2 b:1 c5:3 '
            }
          },
          func: 'music',
          gen: {
            arduino: this.musicGen
          }
        },
        {
          opcode: 'scale',
          blockType: BlockType.COMMAND,
          text: 'play note [FREQ] in beat [DELAY]',
          arguments: {
            FREQ: {
              type: ArgumentType.STRING, //gen can not transfer NOTE
              menu: 'Scale',
              defaultValue: '262',//:frequency, //60: midi id = C4
            },
            DELAY: {
              type: ArgumentType.STRING,
              menu: 'Beats',
              defaultValue: '500'
            }
          },
          func: 'buzzer',//'scale',
          gen: {
            arduino: this.buzzerGen
          }
        },
        {
          opcode: 'buzzer',
          blockType: BlockType.COMMAND,
          text: 'play sound with [FREQ](Hz), delay [DELAY](ms)',
          arguments: {
            FREQ: {
              type: ArgumentType.NUMBER,
              defaultValue: 262 //C4
            },
            DELAY: {
              type: ArgumentType.NUMBER,
              defaultValue: 500
            }
          },
          func: 'buzzer',
          gen: {
            arduino: this.buzzerGen
          }
        },
        '---',
        {
          func: 'noop',
          blockType: BlockType.DIVLABEL,
          text: 'Serial..'
        },
        {
          opcode: 'serialbegin',
          blockType: BlockType.COMMAND,
          text: 'Serial Begin',
          func: 'noop',
          gen: {
            arduino: this.serBeginGen
          }
        },
        {
          opcode: 'serialend',
          blockType: BlockType.COMMAND,
          text: 'Serial End',
          func: 'noop',
          gen: {
            arduino: this.serEndGen
          }
        },
        {
          opcode: 'serialif',
          blockType: BlockType.BOOLEAN,
          text: 'Serial openned?',
          func: 'noop',
          gen: {
            arduino: this.serIfGen
          }
        },
        '---',
        {
          opcode: 'serialavailable',
          blockType: BlockType.REPORTER,
          text: 'Serial Available',
          func: 'noop',
          gen: {
            arduino: this.serAvailableGen
          }
        },
        {
          opcode: 'serialread',
          blockType: BlockType.REPORTER,
          text: 'Serial Read',
          func: 'noop',
          gen: {
            arduino: this.serReadGen
          }
        },
        {
          opcode: 'serialreadstring',
          blockType: BlockType.REPORTER,
          text: 'Serial Read String Until [TERMINATOR]',
          arguments: {
            TERMINATOR: {
              type: ArgumentType.STRING,
              //menu: 'terminator',
              defaultValue: '#'
            }
          },
          func: 'noop',
          gen: {
            arduino: this.serReadStringGen
          }
        },
        {
          opcode: 'stringlength',
          blockType: BlockType.REPORTER,
          text: 'String [TEXT] length',
          arguments: {
            TEXT: {
              type: ArgumentType.STRING,
              defaultValue: 'funXbot'
            }
          },
          func: 'noop',
          gen: {
            arduino: this.strLengthGen
          }
        },
        {
          opcode: 'substring',
          blockType: BlockType.REPORTER,
          text: '[TEXT].substring [FROM] [TO]',
          arguments: {
            TEXT: {
              type: ArgumentType.STRING,
              defaultValue: 'funXbot'
            },
            FROM: {
              type: ArgumentType.NUMBER,
              defaultValue: 1
            },
            TO: {
              type: ArgumentType.NUMBER,
              defaultValue: 3
            }
          },
          func: 'noop',
          gen: {
            arduino: this.subStringGen
          }
        },
        {
          opcode: 'text2number',
          blockType: BlockType.REPORTER,
          text: 'transfer text [TEXT] to number',
          arguments: {
            TEXT: {
              type: ArgumentType.STRING,
              defaultValue: '-123'
            }
          },
          func: 'noop',
          gen: {
            arduino: this.text2numberGen
          }
        },
        '---',
        {
          opcode: 'serialavailable4write',
          blockType: BlockType.REPORTER,
          text: 'Serial Available for Write',
          func: 'noop',
          gen: {
            arduino: this.serAvailable4WriteGen
          }
        },
        {
          opcode: 'serialwrite',
          blockType: BlockType.COMMAND,
          text: 'Serial Write [VALUE] (0-255)',
          arguments: {
            VALUE: {
              type: ArgumentType.SLIDERANALOGWR,
              defaultValue: 0
            }
          },
          func: 'noop',
          gen: {
            arduino: this.serWriteGen
          }
        },
        {
          opcode: 'serialprint',
          blockType: BlockType.COMMAND,
          text: 'Serial Print [TEXT]',
          arguments: {
            TEXT: {
              type: ArgumentType.STRING,
              defaultValue: 'Hello World'
            }
          },
          func: 'noop',
          gen: {
            arduino: this.serPrintGen
          }
        },
        {
          opcode: 'println',
          blockType: BlockType.COMMAND,
          text: 'Serial Print Line [TEXT]',
          arguments: {
            TEXT: {
              type: ArgumentType.STRING,
              defaultValue: 'Hello World'
            }
          },
          func: 'noop',
          gen: {
            arduino: this.printlnGen
          }
        },
        {
          opcode: 'printvalue',
          blockType: BlockType.COMMAND,
          text: 'Serial Print [TEXT] = [VALUE]',
          arguments: {
            TEXT: {
              type: ArgumentType.STRING,
              defaultValue: 'Distance'
            },
            VALUE: {
              type: ArgumentType.STRING,
              defaultValue: '123'
            }
          },
          func: 'noop',
          gen: {
            arduino: this.printvalueGen
          }
        },
        {
          opcode: 'stringtypo',
          blockType: BlockType.REPORTER,
          text: 'String[TEXT],[TYPO]',
          arguments: {
            TEXT: {
              type: ArgumentType.STRING,
              defaultValue: '123'
            },
            TYPO: {
              type: ArgumentType.STRING,
              defaultValue: 'HEX',
              menu: 'StrTypo'
            }
          },
          func: 'noop',
          gen: {
            arduino: this.stringtypoGen
          }
        },
        '---',
        {
          func: 'noop',
          blockType: BlockType.DIVLABEL,
          text: 'more..'
        },
        {
          opcode: 'var',
          blockType: BlockType.COMMAND,
          text: 'variable [VAR] = [VALUE] ([TYPO], [SCOPE])',
          arguments: {
            VAR: {
              type: ArgumentType.STRING,
              defaultValue: 'c'
            },
            VALUE: {
              type: ArgumentType.STRING,
              defaultValue: 0
            },
            TYPO: {
              type: ArgumentType.STRING,
              defaultValue: 'bool',
              menu: 'Typo1'
            },
            SCOPE: {
              type: ArgumentType.STRING,
              defaultValue: 'local',
              menu: 'Scope'
            }
          },
          func: 'noop',
          gen: {
            arduino: this.varGen
          }
        },
        {
          opcode: 'var_data',
          blockType: BlockType.COMMAND,
          text: 'variable [VAR] = [VALUE]',
          arguments: {
            VAR: {
              type: ArgumentType.STRING,
              defaultValue: 'c',
            },
            VALUE: {
              type: ArgumentType.NUMBER,
              defaultValue: 0
            }
          },
          func: 'noop',
          gen: {
            arduino: this.var_dataGen
          }
        },
        {
          opcode: 'var_value',
          blockType: BlockType.REPORTER,
          text: 'variable [VAR]',
          arguments: {
            VAR: {
              type: ArgumentType.STRING,
              defaultValue: 'c',
            }
          },
          func: 'noop',
          gen: {
            arduino: this.var_valueGen
          }
        },
        {
          opcode: 'typecast',
          blockType: BlockType.REPORTER,
          text: formatMessage({
            id: 'arduino.typecast',
            default: 'Cast [VALUE] to [TYPO]'
          }),
          arguments: {
            VALUE: {
              type: ArgumentType.STRING,
              defaultValue: '123'
            },
            TYPO: {
              type: ArgumentType.STRING,
              defaultValue: 'TEXT',
              menu: 'Typo2'
            }
          },
          func: 'noop',
          gen: {
            arduino: this.typecastGen
          }
        },
        '---',
        {
          opcode: 'coreTemp',
          blockType: BlockType.REPORTER,
          text: 'core temperature (°[IMU])',
          arguments: {
            IMU: {
              type: ArgumentType.STRING,
              menu: 'tu',
              defaultValue: 'C',
            },
          },
          func: 'imuRead',
          gen: {
            arduino: this.imuReadGen
          }
        },
        {
          opcode: 'v',
          blockType: BlockType.REPORTER,
          text: 'Vcc reading (mV)',
          func: 'noop',
          gen: {
            arduino: this.vGen
          }
        },
        {
          opcode: 'millis',
          blockType: BlockType.REPORTER,
          text: formatMessage({
            id: 'arduino.millis',
            default: 'millis'
          }),
          func: 'noop',
          gen: {
            arduino: this.millisGen
          }
        },
        {
          opcode: 'reset',
          blockType: BlockType.COMMAND,
          text: 'reset',
          func: 'reset',
          gen: {
            arduino: this.resetGen
          }
        },

        /*
        {
            opcode: 's4xparse',
            blockType: BlockType.COMMAND,

            text: formatMessage({
                id: 'arduino.s4xparse',
                default: 'S4X Parse [PARAM]'
            }),
            arguments: {
                PARAM: {
                    type: ArgumentType.STRING,
                    defaultValue: 'Apple'
                }
            },
            func: 'noop',
            sepafter: 36
        },
        '---',
        */

        '---',
        /*{
            opcode: 'wireBegin',
            blockType: BlockType.COMMAND,
            text: formatMessage({
                id: 'arduino.wiretrans',
                default: 'Wire Begin Trans [ADDR]'
            }),
            arguments: {
                ADDR: {
                    type: ArgumentType.STRING,
                    defaultValue: '0x12'
                }
            },
            func: 'wireBegin',
            gen: {
                arduino: this.wireBeginGen
            }
        },
        {
            opcode: 'wireWrite',
            blockType: BlockType.COMMAND,
            text: formatMessage({
                id: 'arduino.wirewrite',
                default: 'Wire Write [DATA]'
            }),
            arguments: {
                DATA: {
                    type: ArgumentType.STRING,
                    defaultValue: 'abc'
                }
            },
            func: 'wireWrite',
            gen: {
                arduino: this.wireWriteGen
            }
        },
        {
            opcode: 'wireRead',
            blockType: BlockType.REPORTER,
            text: formatMessage({
                id: 'arduino.wireread',
                default: 'Wire Read [ADDR] Bytes [LEN]'
            }),
            arguments: {
                ADDR: {
                    type: ArgumentType.STRING,
                    defaultValue: '0x12'
                },
                LEN: {
                    type: ArgumentType.NUMBER,
                    defaultValue: 6
                }
            },
            func: 'wireRead',
            gen: {
                arduino: this.wireReadGen
            }
        },
        {
            opcode: 'wireEnd',
            blockType: BlockType.COMMAND,
            text: formatMessage({
                id: 'arduino.wireEnd',
                default: 'Wire End'
            }),
            func: 'wireEnd',
            gen: {
                arduino: this.wireEndGen
            }
        },
        {
            opcode: 'wireEndRet',
            blockType: BlockType.REPORTER,
            text: formatMessage({
                id: 'arduino.wireEnd',
                default: 'Wire End'
            }),
            func: 'noop',
            gen: {
                arduino: this.wireEndRetGen
            }
        },*/
      ],

      menus: {
        /*
          pinMode: [{text:'INPUT', value: '0'}, {text: 'OUTPUT', value: '1'}, {text: 'INPUT_PULLUP', value: '2'}],
          level: [{text: 'HIGH', value: '1'}, {text: 'LOW', value: '0'}],
          digiPin: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13',
              'A0', 'A1', 'A2', 'A3', 'A4', 'A5'],
          analogPin: ['A0', 'A1', 'A2', 'A3', 'A4', 'A5'],
          analogWritePin: ['3', '5', '6', '9', '10', '11'],
          serialtype: [{text: 'Serial', value: 'Serial'}, {text: 'Soft Serial', value: 'softser'}],
        */
        onoff: ['ON', 'OFF'],
        ledpin: ['Red', 'Green', 'Blue'],
        Scale: [
          { text: 'C4', value: '262' },
          { text: 'D4', value: '294' },
          { text: 'E4', value: '330' },
          { text: 'F4', value: '349' },
          { text: 'G4', value: '392' },
          { text: 'A4', value: '440' },
          { text: 'B4', value: '494' },

          { text: 'C5', value: '523' },
          { text: 'D5', value: '587' },
          { text: 'E5', value: '659' },
          { text: 'F5', value: '698' },
          { text: 'G5', value: '784' },
          { text: 'A5', value: '880' },
          { text: 'B5', value: '988' },

          { text: 'C6', value: '1047' },
          { text: 'D6', value: '1175' },
          { text: 'E6', value: '1319' },
          { text: 'F6', value: '1397' },
          { text: 'G6', value: '1568' },
          { text: 'A6', value: '1760' },
          { text: 'B6', value: '1976' }
        ],
        Beats: [
          { text: '1/2', value: '500' },
          { text: '1/4', value: '250' },
          { text: '1/8', value: '125' },
          { text: '1/1', value: '1000' },
          { text: '2/1', value: '2000' }
        ],
        Sounds: this._buildMenu(this.SOUNDS_INFO),
        //Sounds: [],
        terminator: [{ text: '#', value: '#' },
        { text: 'Enter', value: 13 },
        { text: 'Tab', value: 9 },
        { text: 'Space', value: ' ' }],
        StrTypo: ['HEX', 'BIN', 'DEC'],
        Scope: ['local', 'global'],
        Typo1: ['bool', 'int8_t', 'uint8_t', 'int16_t', 'uint16_t', 'int32_t', 'uint32_t', 'float', 'String'],
        Typo2: ['char', 'byte', 'int', 'word', 'long', 'float', 'String', 'TEXT'],
        ypr: ['yaw', 'pitch', 'roll'],
        accG: ['Gx', 'Gy', 'Gz'],
        acc: ['ax', 'ay', 'az'],
        av: ['gx', 'gy', 'gz'],
        tu: ['C', 'F'],
        m1: ['freefall', 'shake', 'still'],
        '#gestureList': [
          {
            src: 'static/extension-assets/Robot4FUN-cBrain-assets/up.png',
            value: '1', width: 95, height: 95, alt: ''
          }, //
          {
            src: 'static/extension-assets/Robot4FUN-cBrain-assets/down.png',
            value: '2', width: 95, height: 95, alt: ''
          }, //
          {
            src: 'static/extension-assets/Robot4FUN-cBrain-assets/left.png',
            value: '3', width: 95, height: 95, alt: ''
          }, //
          {
            src: 'static/extension-assets/Robot4FUN-cBrain-assets/right.png',
            value: '4', width: 95, height: 95, alt: ''
          }, //
          {
            src: 'static/extension-assets/Robot4FUN-cBrain-assets/faceup.png',
            value: '5', width: 95, height: 95, alt: ''
          }, //
          {
            src: 'static/extension-assets/Robot4FUN-cBrain-assets/facedown.png',
            value: '6', width: 95, height: 95, alt: ''
          }, //
        ],
        '#gesture1List': [
          {
            src: 'static/extension-assets/Robot4FUN-cBrain-assets/yawcc.png',
            value: '11', width: 95, height: 95, alt: ''
          }, //逆旋
          {
            src: 'static/extension-assets/Robot4FUN-cBrain-assets/yawc.png',
            value: '12', width: 95, height: 95, alt: ''
          }, //順旋
          {
            src: 'static/extension-assets/Robot4FUN-cBrain-assets/pitchdown.png',
            value: '13', width: 95, height: 95, alt: ''
          }, //前俯
          {
            src: 'static/extension-assets/Robot4FUN-cBrain-assets/pitchup.png',
            value: '14', width: 95, height: 95, alt: ''
          }, //後仰
          {
            src: 'static/extension-assets/Robot4FUN-cBrain-assets/rollleft.png',
            value: '15', width: 95, height: 95, alt: ''
          }, //左傾
          {
            src: 'static/extension-assets/Robot4FUN-cBrain-assets/rollright.png',
            value: '16', width: 95, height: 95, alt: ''
          }, //右傾
        ],
        '#motionList': [
          {
            src: 'static/extension-assets/Robot4FUN-cBrain-assets/forward.png',
            value: '21', width: 95, height: 95, alt: ''
          }, //往前
          {
            src: 'static/extension-assets/Robot4FUN-cBrain-assets/back.png',
            value: '22', width: 95, height: 95, alt: ''
          }, //往後
          {
            src: 'static/extension-assets/Robot4FUN-cBrain-assets/moveleft.png',
            value: '23', width: 95, height: 95, alt: ''
          }, //往左
          {
            src: 'static/extension-assets/Robot4FUN-cBrain-assets/moveright.png',
            value: '24', width: 95, height: 95, alt: ''
          }, //往右
          {
            src: 'static/extension-assets/Robot4FUN-cBrain-assets/moveup.png',
            value: '25', width: 95, height: 95, alt: ''
          }, //往上
          {
            src: 'static/extension-assets/Robot4FUN-cBrain-assets/movedown.png',
            value: '26', width: 95, height: 95, alt: ''
          }, //往下
        ],
      },

      translation_map: {
        'zh-tw': {
          //'cBrain.categoryName': '雞車腦',
          'buttonPressed': '按下按鈕?',
          'getSound': '環境音量 (0~1023)',
          'getBrightness': '周遭亮度 (0~1023)',
          'getSlider': '紅嘴位置 (0~1023)',
          'scale': '播放音調[FREQ], 持續[DELAY]拍',
          'buzzer': '播放音頻[FREQ]赫兹, 持續[DELAY]毫秒',
          'music': '演奏旋律[NOTES]',
          'soundeffect': '播放音效[SOUND]',
          'reset': '重啟',
          'led': '[VALUE][PIN]LED燈',
          'ledpin': { 'Red': '紅色', 'Green': '綠色', 'Blue': '藍色' },
          'onoff': { 'ON': '打開', 'OFF': '關閉' },
          'v': '電源電壓 (mV)',
          'stringtypo': '將[TEXT]以[TYPO]進制展示',
          'StrTypo': { 'HEX': '十六', 'BIN': '二', 'DEC': '十' },
          'Scope': { 'local': '區域', 'global': '全域' },
          'Typo1': { 'bool': '布林', 'float': '小數', 'String': '字串' },
          'Typo2': {
            'char': 'int8_t', 'byte': 'uint8_t', 'int': 'int16_t', 'word': 'uint16_t',
            'long': 'int32_t', 'float': '小數', 'String': '字串', 'TEXT': '字符'
          },
          'typecast': '轉換[VALUE]的資料型態為[TYPO]',
          'var': '變數[VAR]設為[VALUE], 資料型態為[TYPO], 範圍:[SCOPE]',
          'var_data': '變數[VAR]設為[VALUE]',
          'var_value': '變數[VAR]',
          'imuYPR': '[IMU]角度(°)',
          'imuG': '反作用力的[IMU]G值(mg)',
          'imuAcc': '[IMU]的加速度(mm/s²)',
          'imuAV': '[IMU]的角速度(°/s)',
          'ypr': { 'yaw': '偏航', 'pitch': '俯仰', 'roll': '翻滾' },
          'accG': { 'Gx': 'x軸', 'Gy': 'y軸', 'Gz': 'z軸' },
          'acc': { 'ax': 'x軸', 'ay': 'y軸', 'az': 'z軸' },
          'av': { 'gx': 'x軸', 'gy': 'y軸', 'gz': 'z軸' },
          'm1': { 'freefall': '自由掉落', 'shake': '搖晃', 'still': '靜止' },
          'Gesture': '[GESTURE]朝上?',
          'Gesture1': '姿態是[GESTURE]?',
          'Motion': '揮動方向是[GESTURE]?',
          'Motion1': '狀態是[GESTURE]?',
          'resetYaw': '將偏航角歸零',
          'coreTemp': '內部溫度(°[IMU])',
          'serialbegin': '開啟串流通訊',
          'serialend': '關閉串流通訊',
          'serialif': '串流通訊已開啟?',
          'serialavailable': '收訊暫存區的位元組數',
          'serialread': '串流進來的首個位元組',
          'serialreadstring': '從串流讀到的字串 ([TERMINATOR]前 )',
          'serialavailable4write': '發訊暫存區的空位',
          'serialwrite': '串流發送位元組[VALUE](0-255)',
          'serialprint': '串流發送字串[TEXT]',
          'println': '串流發送字串[TEXT]並換行',
          'printvalue': '串流發送[TEXT]=[VALUE], 並換行',
          'text2number': '轉換字串[TEXT]為數字',
          'substring': '擷取字串[TEXT]的第[FROM]到[TO]字',
          'stringlength': '字串[TEXT]長度',
        },
        'zh-cn': { // 簡體中文
          //'cBrain': '鸡车脑',
          'buttonPressed': '按下按钮?',
          'getSound': '环境音量 (0~1023)',
          'getBrightness': '周围亮度 (0~1023)',
          'getSlider': '红嘴位置 (0~1023)',
          'scale': '播放音符[FREQ], 持续[DELAY]拍',
          'buzzer': '播放音频[FREQ]赫兹, 持续[DELAY]毫秒',
          'music': '演奏旋律[NOTES]',
          'soundeffect': '播放音效[SOUND]',
          'reset': '重启',
          'led': '[VALUE][PIN]LED灯',
          'ledpin': { 'Red': '红色', 'Green': '绿色', 'Blue': '蓝色' },
          'onoff': { 'ON': '打开', 'OFF': '关闭' },
          'v': '电源电压 (mV)',
          'stringtypo': '将[TEXT]以[TYPO]进制展示',
          'StrTypo': { 'HEX': '十六', 'BIN': '二', 'DEC': '十' },
          'Scope': { 'local': '局部', 'global': '全局' },
          'Typo1': { 'bool': '布尔', 'float': '小数', 'String': '字符串' },
          'Typo2': {
            'char': 'int8_t', 'byte': 'uint8_t', 'int': 'int16_t', 'word': 'uint16_t',
            'long': 'int32_t', 'float': '小数', 'String': '字符串', 'TEXT': '字符'
          },
          'typecast': '转换[VALUE]的资料型态为[TYPO]',
          'var': '变数[VAR]设为[VALUE], 资料型态为[TYPO], 作用域为[SCOPE]',
          'var_data': '变数[VAR]设为[VALUE]',
          'var_value': '变数[VAR]',
          'imuYPR': '[IMU]角度(°)',
          'imuG': '反作用力的[IMU]G值(mg)',
          'imuAcc': '[IMU]的加速度(mm/s²)',
          'imuAV': '[IMU]的角速度(°/s)',
          'ypr': { 'yaw': '航向', 'pitch': '俯仰', 'roll': '橫滚' },
          'accG': { 'Gx': 'x轴', 'Gy': 'y轴', 'Gz': 'z轴' },
          'acc': { 'ax': 'x轴', 'ay': 'y轴', 'az': 'z轴' },
          'av': { 'gx': 'x轴', 'gy': 'y轴', 'gz': 'z轴' },
          'm1': { 'freefall': '自由掉落', 'shake': '摇晃', 'still': '静止' },
          'Gesture': '[GESTURE]朝上?',
          'Gesture1': '姿态是[GESTURE]?',
          'Motion': '挥动方向是[GESTURE]?',
          'Motion1': '状态是[GESTURE]?',
          'resetYaw': '将航向角归零',
          'coreTemp': '內部溫度(°[IMU])',
          'serialbegin': '开启串口通信',
          'serialend': '关闭串口通信',
          'serialif': '串口通信已开启?',
          'serialavailable': '收信暂存区的字节数',
          'serialread': '串口接收到的首个字节',
          'serialreadstring': '从串口读到的字符串 ([TERMINATOR]前 )',
          'serialavailable4write': '发信暂存区的空位',
          'serialwrite': '串口传送[VALUE](0-255)',
          'serialprint': '串口传送字符串[TEXT]',
          'println': '串口传送字符串[TEXT][TEXT]并回车',
          'printvalue': '串口传送[TEXT]=[VALUE], 并回车',
          'text2number': '转换字符串[TEXT]为数字',
          'substring': '撷取字符串[TEXT]的第[FROM]到[TO]字',
          'stringlength': '字符串[TEXT]长度',
        },
      }

    };
  }

  _buildMenu(info) {
    return info.map((entry, index) => {
      const obj = {};
      obj.text = entry.name;
      obj.value = String(index + 1);
      return obj;
    });
  }

  get SOUNDS_INFO() {
    return [
      {
        name: formatMessage({
          id: 'OttoDIY.Connection',
          default: 'Connection'
        })
      },
      {
        name: formatMessage({
          id: 'OttoDIY.Disconnection',
          default: 'Disconnection'
        })
      },
      {
        name: formatMessage({
          id: 'OttoDIY.OhOoh',
          default: 'OhOoh'
        })
      },
      {
        name: formatMessage({
          id: 'OttoDIY.OhOoh2',
          default: 'OhOoh2'
        })
      },
      {
        name: formatMessage({
          id: 'OttoDIY.Cuddly',
          default: 'Cuddly'
        })
      },
      {
        name: formatMessage({
          id: 'OttoDIY.Sleeping',
          default: 'Sleeping'
        })
      },
      {
        name: formatMessage({
          id: 'OttoDIY.Happy',
          default: 'Happy'
        })
      },
      {
        name: formatMessage({
          id: 'OttoDIY.Supperhappy',
          default: 'Supperhappy'
        })
      },
      {
        name: formatMessage({
          id: 'OttoDIY.Happy_short',
          default: 'Happy short'
        })
      },
      {
        name: formatMessage({
          id: 'OttoDIY.Sad',
          default: 'Sad'
        })
      },
      {
        name: formatMessage({
          id: 'OttoDIY.Confused',
          default: 'Confused'
        })
      },
      {
        name: formatMessage({
          id: 'OttoDIY.Fart1',
          default: 'Fart1'
        })
      },
      {
        name: formatMessage({
          id: 'OttoDIY.Fart2',
          default: 'Fart2'
        })
      },
      {
        name: formatMessage({
          id: 'OttoDIY.Fart3',
          default: 'Fart3'
        })
      },
      {
        name: formatMessage({
          id: 'OttoDIY.Surprise',
          default: 'Surprise'
        })
      },
      {
        name: formatMessage({
          id: 'OttoDIY.mode1',
          default: 'mode1'
        })
      },
      {
        name: formatMessage({
          id: 'OttoDIY.mode2',
          default: 'mode2'
        })
      },
      {
        name: formatMessage({
          id: 'OttoDIY.mode3',
          default: 'mode3'
        })
      },
      {
        name: formatMessage({
          id: 'OttoDIY.buttonPushed',
          default: 'buttonPushed'
        })
      }
    ];
  }

  noop() {
    return Promise.reject(formatMessage({
      id: 'kblock.notify.nosupportonlinemode',
      defaultMessage: 'Not support in online mode'
    }));
  }
  /*
  serialbegin (){
      // just a fake empty function
  }


  pinMode (args){
      const pin = args.PIN;
      const mode = args.MODE;
      const mode2firmata = {
          '0': board.MODES.INPUT,
          '1': board.MODES.OUTPUT,
          '2': board.MODES.PULLUP
      }
      board.pinMode(pin2firmata(pin), mode2firmata[mode]);
  }

  digitalWrite (args){
      const pin = args.PIN;
      const pinId = pin2firmata(pin);
      const value = parseInt(args.VALUE, 10);
      board.digitalWrite(pinId, value ? 1 : 0);
  }

  led (args){
      const pin = args.PIN;
      const value = parseInt(args.VALUE, 10);
      board.digitalWrite(pin2firmata(pin), value ? 0 : 1); // inverse for kittenbot's led module
  }

  analogWrite (args){
      const pin = args.PIN;
      const v = parseInt(args.VALUE, 10);
      const pinId = pin2firmata(pin);
      const p = board.pins[pinId];
      if (p.mode !== 3){
          board.pinMode(pinId, 3);
      }
      board.analogWrite(pinId,v)
  }

  digitalRead (args) {
      const pin = args.PIN;
      // board.pinMode(pin2firmata(pin), board.MODES.INPUT);
      const pinId = pin2firmata(pin);
      const p = board.pins[pinId];
      if (p.mode === undefined){
          vm.emit('showAlert', {msg: 'PinMode Undefined'});
          return;
      }
      if (board.eventNames().indexOf(`digital-read-${pinId}`) === -1){
          board.digitalRead(pinId, ret => {
              // board.reportDigitalPin(pinId, 0);
          });
      }
      return p.value;
  }

  analogRead (args){
      const pin = args.PIN;
      const pinId = pin2firmata(pin,1);
      return new Promise(resolve => {
          board.analogRead(pinId, ret => {
              board.reportAnalogPin(pinId, 0);
              resolve(ret);
          })
      });
  }    */

  buttonPressed(args) {
    const pin = Sensors.button;
    if (board.pins[pin].mode != board.MODES.INPUT) {
      board.pinMode(pin, board.MODES.INPUT);
      //in firmata.js, All digital pins are set to board.MODES.OUTPUT by default
    }

    if (board.eventNames().indexOf(`digital-read-${pin}`) === -1) { // just call digitalRead() once
      board.digitalRead(pin, value => {   //because只要call一次,即使沒執行此block仍會一直回報..
        //console.log('pin value=', value); // let the data being fresh
      });
    }
    //console.log('stored pin value=', board.pins[pin].value); // for debug
    return board.pins[pin].value;//stored value at any other time 有誤差
  }

  buttonPressedGen(gen, block) {
    const pin = Sensors.button;
    gen.setupCodes_['button' + pin] = `pinMode(${pin},INPUT)`;
    return [`digitalRead(${pin})`, gen.ORDER_ATOMIC];
  }

  getSound(args) {
    const pin = board.pin2firmata(Sensors.sound, 1);// 1: in firmata.js, analogPin with no "A"
    // in Firmata.js, all analog pins are set to board.MODES.ANALOG (analog input) by default.
    return new Promise(resolve => {
      board.analogRead(pin, ret => {
        board.reportAnalogPin(pin, 0);
        resolve(ret);
      })
    });
  }

  getSoundGen(gen, block) {
    const pin = Sensors.sound;
    gen.setupCodes_['sound' + pin] = `pinMode(${pin},INPUT)`;
    return [`analogRead(${pin})`, gen.ORDER_ATOMIC];
  }

  getBrightness(args) {
    const pin = board.pin2firmata(Sensors.light, 1);
    return new Promise(resolve => {
      board.analogRead(pin, ret => {
        board.reportAnalogPin(pin, 0);
        resolve(ret);
      })
    });
  }

  getBrightnessGen(gen, block) {
    const pin = Sensors.light;
    gen.setupCodes_['light' + pin] = `pinMode(${pin},INPUT)`;
    return [`analogRead(${pin})`, gen.ORDER_ATOMIC];
  }

  getSlider(args) {
    const pin = board.pin2firmata(Sensors.slider, 1);
    return new Promise(resolve => {
      board.analogRead(pin, ret => {
        board.reportAnalogPin(pin, 0);
        resolve(ret);
      })
    });
  }

  getSliderGen(gen, block) {
    const pin = Sensors.slider;
    gen.setupCodes_['slider' + pin] = `pinMode(${pin},INPUT)`;
    return [`analogRead(${pin})`, gen.ORDER_ATOMIC];
  }

  resetyaw(args) {
    if (!this.imu) {
      this.imu = new five.IMU({
        controller: "MPU6050",
        board: j5board,
      });
      this.imu.yaw_bias = 0;
    }

    this.imu.yaw_bias = 15 * this.imu.gyro.yaw.angle;
  }

  resetyawGen(gen, block) {
    mpuCommon(gen);
    //return gen.line(`mpu.yaw_bias = mpu6050read(1,false)`);
    return gen.line(`yaw_bias = mpu6050read(1,false)`);
  }

  async isGesture(args) {
    if (!this.imu) {
      this.imu = new five.IMU({
        controller: "MPU6050",
        board: j5board,
      });
      this.imu.yaw_bias = 0;
    }
    if (!this.imu.set) {
      board.i2cConfig();
      let _dhpf = await new Promise(resolve => {
        board.i2cReadOnce(0x68, 0x1C, 1, reply => {
          //console.log('reg 1C:', reply);
          resolve(reply);
        });
      });
      //console.log('DHPF reg:', _dhpf);
      _dhpf = _dhpf & 0b11111000;
      _dhpf = _dhpf | 0b00000001;
      //console.log('set DHPF to', _dhpf);
      board.i2cWrite(0x68, 0x1C, _dhpf); // Setting DHPF bandwidth to 5Hz
      board.i2cWrite(0x68, 0x1D, 17); //setFreefallDetectionThreshold
      board.i2cWrite(0x68, 0x1E, 2); //setFreefallDetectionDuration
      board.i2cWrite(0x68, 0x1F, 2); //setMotionDetectionThreshold
      board.i2cWrite(0x68, 0x20, 20); //setMotionDetectionDuration
      board.i2cWrite(0x68, 0x21, 4); //setZeroMotionDetectionThreshold
      board.i2cWrite(0x68, 0x22, 1); //setZeroMotionDetectionDuration
      this.imu.set = true;
    }

    //console.log('args.GESTURE=',typeof args.GESTURE, args.GESTURE);
    switch (args.GESTURE) { // imu x-y-z軸與主機不同
      case '1': //up
        return (Math.abs(this.imu.accelerometer.y + 1) < 0.13);
        break;
      case '2': //down
        return (Math.abs(this.imu.accelerometer.y - 1) < 0.13);
        break;
      case '3': //left
        return (Math.abs(this.imu.accelerometer.x + 1) < 0.13);
        break;
      case '4': //right
        return (Math.abs(this.imu.accelerometer.x - 1) < 0.13);
        break;
      case '5': //face up
        return (Math.abs(this.imu.accelerometer.z - 1) < 0.13);
        break;
      case '6': //face down
        return (Math.abs(this.imu.accelerometer.z + 1) < 0.13);
        break;
      case '11': //逆時針旋
        return ((15 * this.imu.gyro.yaw.angle - this.imu.yaw_bias) > 5);
        break;
      case '12': //順時針旋
        return ((15 * this.imu.gyro.yaw.angle - this.imu.yaw_bias) < -5);
        break;
      case '13': //前俯
        return (-1 * this.imu.accelerometer.roll < -5);
        break;
      case '14': //後仰
        return (-1 * this.imu.accelerometer.roll > 5);
        break;
      case '15': //左傾
        return this.imu.accelerometer.pitch < -5;
        break;
      case '16': //右傾
        return this.imu.accelerometer.pitch > 5;
        break;
      case '21': //往前
        return this.imu.accelerometer.y < -1.3;
        break;
      case '22': //往後
        return this.imu.accelerometer.y > 1.3;
        break;
      case '23': //往左
        return this.imu.accelerometer.x > 1.3;
        break;
      case '24': //往右
        return this.imu.accelerometer.x < -1.3;
        break;
      case '25': //往上
        return this.imu.accelerometer.z > 1.3;
        break;
      case '26': //往下
        return this.imu.accelerometer.z < -1.3;
        break;
      case 'freefall': //free fall
        {
          let ffbit = await new Promise(resolve => {
            board.i2cReadOnce(0x68, 0x3A, 1, reply => {
              console.log('INT_STATUS register:', reply);
              resolve(reply);
            });
          });
          console.log('FF bit:', ffbit & 0b10000000);
          if ((ffbit & 0b10000000) === 0b10000000) {
            return true;
          } else { return false; }
        }
        break;
      case 'shake': //shake
        {
          let shakeCnt = 0;
          let preT = Date.now();
          while ((Date.now() - preT) < 1500) {
            if (Math.abs(this.imu.accelerometer.x) > 1.3 || Math.abs(this.imu.accelerometer.y) > 1.3
              || Math.abs(this.imu.accelerometer.z) > 1.3) ++shakeCnt;
            await timeout(50);
          }
          console.log('dT=', (Date.now() - preT));
          console.log('shakeCnt=', shakeCnt);
          if (shakeCnt > 4) {
            return true;
          } else { return false; }
        }
        break;
      case 'still': //靜止
        {
          let zerobit = await new Promise(resolve => {
            board.i2cReadOnce(0x68, 0x61, 1, reply => {
              console.log('MotionStatus:', reply);
              resolve(reply);
            });
          });
          console.log('zero bit:', zerobit & 0b00000001);
          if ((zerobit & 0b00000001) === 0b00000001) {
            return true;
          } else { return false; }
        }
        break;
      default:
        return;
    }
  }

  isGestureGen(gen, block) {
    mpuCommon(gen);
    const x = gen.valueToCode(block, 'GESTURE');
    //console.log('x=',typeof x, x);
    switch (x) {
      case '1': //up
        return [`abs(mpu6050read(66)-1000)<100`, gen.ORDER_ATOMIC];
        break;
      case '2': //down
        return [`abs(mpu6050read(66)+1000)<100`, gen.ORDER_ATOMIC];
        break;
      case '3': //left
        return [`abs(mpu6050read(55)-1000)<100`, gen.ORDER_ATOMIC];
        break;
      case '4': //right
        return [`abs(mpu6050read(55)+1000)<100`, gen.ORDER_ATOMIC];
        break;
      case '5': //face up
        return [`abs(mpu6050read(77)-1000)<100`, gen.ORDER_ATOMIC];
        break;
      case '6': //face down
        return [`abs(mpu6050read(77)+1000)<100`, gen.ORDER_ATOMIC];
        break;
      case '11': //逆時針旋
        return [`mpu6050read(1)>5`, gen.ORDER_ATOMIC];
        break;
      case '12': //順時針旋
        return [`mpu6050read(1)<-5`, gen.ORDER_ATOMIC];
        break;
      case '13': //前俯
        return [`mpu6050read(2)<-5`, gen.ORDER_ATOMIC];
        break;
      case '14': //後仰
        return [`mpu6050read(2)>5`, gen.ORDER_ATOMIC];
        break;
      case '15': //左傾
        return [`mpu6050read(3)<-5`, gen.ORDER_ATOMIC];
        break;
      case '16': //右傾
        return [`mpu6050read(3)>5`, gen.ORDER_ATOMIC];
        break;
      case '21': //往前
        return [`mpu.getYNegMotionDetected()`, gen.ORDER_ATOMIC];
        break;
      case '22': //往後
        return [`mpu.getYPosMotionDetected()`, gen.ORDER_ATOMIC];
        break;
      case '23': //往左
        return [`mpu.getXPosMotionDetected()`, gen.ORDER_ATOMIC];
        break;
      case '24': //往右
        return [`mpu.getXNegMotionDetected()`, gen.ORDER_ATOMIC];
        break;
      case '25': //往上
        return [`mpu.getZPosMotionDetected()`, gen.ORDER_ATOMIC];
        break;
      case '26': //往下
        return [`mpu.getZNegMotionDetected()`, gen.ORDER_ATOMIC];
        break;
      case 'freefall': //free fall
        return [`mpu.getIntFreefallStatus()`, gen.ORDER_ATOMIC];
        break;
      case 'shake': //shake
        //return [`mpu6050read(255)`, gen.ORDER_ATOMIC];
        return [`IMUshaked()`, gen.ORDER_ATOMIC];
        break;
      case 'still': //靜止
        return [`mpu.getZeroMotionDetected()`, gen.ORDER_ATOMIC];
        break;
      default:
        return;
    }

  }

  imuRead(args) {
    if (!this.imu) {
      this.imu = new five.IMU({
        controller: "MPU6050",
        board: j5board,
      });
      this.imu.yaw_bias = 0;
    }
    //console.log('imuAllData:',this.imu);
    //console.log('args.IMU=',typeof args.IMU, args.IMU);
    switch (args.IMU) {  // imu x-y-z軸與主機不同
      case 'yaw':
        return (15 * this.imu.gyro.yaw.angle - this.imu.yaw_bias);
        break;
      case 'pitch':
        return -1 * this.imu.accelerometer.roll;
        break;
      case 'roll':
        return this.imu.accelerometer.pitch;
        break;
      case 'ax':
        return;
        break;
      case 'ay':
        return;
        break;
      case 'az':
        return;
        break;
      case 'gx':
        return -1 * this.imu.gyro.rate.x;
        break;
      case 'gy':
        return -1 * this.imu.gyro.rate.y;
        break;
      case 'gz':
        return this.imu.gyro.rate.z;
        break;
      case 'Gx':
        return -1000 * this.imu.accelerometer.x;
        break;
      case 'Gy':
        return -1000 * this.imu.accelerometer.y;
        break;
      case 'Gz':
        return 1000 * this.imu.accelerometer.z;
        break;
      case 'C':
        return this.imu.thermometer.celsius;
        break;
      case 'F':
        return this.imu.thermometer.fahrenheit;
        break;
      default:
        return;
    }
  }

  imuReadGen(gen, block) {
    mpuCommon(gen);
    const x = gen.valueToCode(block, 'IMU');
    //console.log('x=',typeof x, x);
    let d = 0; // uint8_t 0-255
    switch (x) {
      case 'yaw':
        d = 1;
        break;
      case 'pitch':
        d = 2;
        break;
      case 'roll':
        d = 3;
        break;
      case 'ax':
        d = 11;
        break;
      case 'ay':
        d = 22;
        break;
      case 'az':
        d = 33;
        break;
      case 'gx':
        d = 111;
        break;
      case 'gy':
        d = 122;
        break;
      case 'gz':
        d = 133;
        break;
      case 'Gx':
        d = 55;
        break;
      case 'Gy':
        d = 66;
        break;
      case 'Gz':
        d = 77;
        break;
      case 'C':
        return [`((float)mpu.getTemperature()/340.0 + 36.53)`, gen.ORDER_ATOMIC];
        break;
      case 'F':
        return [`(((float)mpu.getTemperature()/340.0 + 36.53)*1.8 + 32.0)`, gen.ORDER_ATOMIC];
        break;
      default:
        d = 0;
    }

    return [`mpu6050read(${d})`, gen.ORDER_ATOMIC];
  }

  led(args) {
    let pin = null;
    if (args.PIN == 'Red') {
      pin = Sensors.rled;
    } else if (args.PIN == 'Green') {
      pin = Sensors.gled;
    } else if (args.PIN == 'Blue') {
      pin = Sensors.bled;
    } else {
      vm.emit('showAlert', { msg: 'Input value out of range' });
    }

    let onoff = null;
    if (args.VALUE == 'ON') {
      onoff = board.HIGH;
    } else if (args.VALUE == 'OFF') {
      onoff = board.LOW;
    } else {
      vm.emit('showAlert', { msg: 'Input value out of range' });
    }

    if (board.pins[pin].mode != board.MODES.OUTPUT) {
      //vm.emit('showAlert', {msg: 'Wrong PinMode defined'});
      board.pinMode(pin, board.MODES.OUTPUT);
      //in Firmata.js, All digital pins are set to board.MODES.OUTPUT by default
    }
    board.digitalWrite(pin, onoff);
  }

  ledGen(gen, block) {
    let pin = gen.valueToCode(block, 'PIN');
    if (pin == 'Red') {
      pin = Sensors.rled;
    } else if (pin == 'Green') {
      pin = Sensors.gled;
    } else if (pin == 'Blue') {
      pin = Sensors.bled;
    } else {
      return;
    }
    let onoff = gen.valueToCode(block, 'VALUE');
    if (onoff == 'ON') {
      onoff = 1;
    } else if (onoff == 'OFF') {
      onoff = 0;
    } else {
      return;
    }
    gen.setupCodes_['led' + pin] = `pinMode(${pin},OUTPUT)`;
    return gen.line(`digitalWrite(${pin},${onoff})`);
  }

  tone(pin, freq, delay) {
    const FIRMATA_7BIT_MASK = 0x7F,
      BUZZER_MESSAGE = 0x7C;
    let data = [];
    data.push(BUZZER_MESSAGE);
    data.push(pin);
    data.push(freq & FIRMATA_7BIT_MASK);
    data.push((freq >> 7) & FIRMATA_7BIT_MASK);
    data.push((freq >> 14) & FIRMATA_7BIT_MASK);
    data.push((freq >> 21) & FIRMATA_7BIT_MASK);
    data.push(delay & FIRMATA_7BIT_MASK);
    data.push((delay >> 7) & FIRMATA_7BIT_MASK);
    data.push((delay >> 14) & FIRMATA_7BIT_MASK);
    data.push((delay >> 21) & FIRMATA_7BIT_MASK);
    board.sysexCommand(data); //send command to MCU
  }

  scale(args) {
    const pin = Sensors.buzzer;
    //const pin = board.pin2firmata(Sensors.buzzer);
    /*if (!this.bz || this.bz.pin != pin){
        this.bz = new five.Piezo(pin);
    }*/
    if (board.pins[pin].mode != board.MODES.OUTPUT) {
      board.pinMode(pin, board.MODES.OUTPUT);
      //in Firmata.js, All digital pins are set to board.MODES.OUTPUT by default
    }
    if (!this.midi2freq) {
      this.midi2freq = require('./scale.js');
    }
    const freq = this.midi2freq[parseInt(args.FREQ)];
    //console.log('FREQ=', typeof args.FREQ,args.FREQ); // for debug
    //console.log('freq=', typeof freq,freq); // for debug
    //this.bz.frequency(freq, parseInt(args.DELAY));
    this.tone(pin, freq, parseInt(args.DELAY));
  }

  buzzer(args) {
    const pin = Sensors.buzzer;
    //console.log('FREQ=', typeof args.FREQ,args.FREQ); // for debug
    if (board.pins[pin].mode != board.MODES.OUTPUT) {
      board.pinMode(pin, board.MODES.OUTPUT);
      //in Firmata.js, All digital pins are set to board.MODES.OUTPUT by default
    }
    this.tone(pin, parseInt(args.FREQ), parseInt(args.DELAY));
  }

  buzzerGen(gen, block) {
    const pin = Sensors.buzzer;
    const freq = gen.valueToCode(block, 'FREQ'); // can not transfer ArgumentType.NOTE
    //console.log('FREQ=', typeof freq, freq); // string but nothing
    const delay = gen.valueToCode(block, 'DELAY');
    gen.setupCodes_['buzzer' + pin] = `pinMode(${pin},OUTPUT)`;
    return gen.line(`tone(${pin}, ${freq}, ${delay})`);
  }

  async music(args) {
    const pin = Sensors.buzzer;
    if (board.pins[pin].mode != board.MODES.OUTPUT) {
      board.pinMode(pin, board.MODES.OUTPUT);
      //in Firmata.js, All digital pins are set to board.MODES.OUTPUT by default
    }
    const notes = args.NOTES;
    const song = [];
    let note = 'C';
    let octave = '4';
    //let clap = 0.128;
    let clap = 250;
    for (let i = 0; i < notes.length; i++) {
      if (notes[i] >= 'a' && notes[i] <= 'g') {
        note = notes[i];
      } else if (notes[i] == 'r') {
        note = null;
      } else if (notes[i] >= '2' && notes[i] <= '6') {
        octave = notes[i] - '0';
      } else if (notes[i] == ':') {
        i++;
        //clap = parseInt(notes[i])*0.125;
        clap = parseInt(notes[i]) * 250;
      } else if (notes[i] == ' ') { // play until we meet a space
        this.tone(pin, five.Piezo.Notes[note + octave], clap);
        await timeout(clap);
        //console.log('freq=', typeof five.Piezo.Notes[note+octave], five.Piezo.Notes[note+octave]);
        //console.log('delay=', typeof clap, clap);
      }
    }
  }

  musicGen(gen, block) {
    gen.definitions_['buzzMusic'] = `const int noteMap[] = {440, 494, 262, 294, 330, 349, 392};
void buzzMusic(int pin, const char * notes){
    int freq;
    int len = strlen(notes);
    int octave = 4;
    int duration = 500;
    for(int i=0;i < len;i++){
        if(notes[i]>='a' && notes[i]<='g'){
          freq = noteMap[notes[i]-'a'];
        }else if(notes[i]=='r'){
          freq = 0;
        }else if(notes[i]>='2' && notes[i]<='6'){
          octave = notes[i] - '0';
        }else if(notes[i]==':'){
          i++;
          duration = (notes[i] - '0')*125;
        }else if(notes[i]==' '){ // play until we meet a space
          freq *= pow(2, octave-4);
          tone(pin, freq, duration);
          delay(duration);
        }
    }
}`;
    const pin = Sensors.buzzer;
    const notes = gen.valueToCode(block, 'NOTES');
    gen.setupCodes_['buzzer' + pin] = `pinMode(${pin},OUTPUT)`;
    return gen.line(`buzzMusic(${pin}, ${notes})`);
  }

  async soundeffect(args) {
    const pin = Sensors.buzzer;
    if (board.pins[pin].mode != board.MODES.OUTPUT) {
      board.pinMode(pin, board.MODES.OUTPUT);
      //in Firmata.js, All digital pins are set to board.MODES.OUTPUT by default
    }
    //console.log('SOUND=', typeof args.SOUND,args.SOUND);
    switch (parseInt(args.SOUND)) {
      case 1: //Connection
        this.tone(pin, 659, 50);
        await timeout(30);
        this.tone(pin, 1319, 55);
        await timeout(25);
        this.tone(pin, 1760, 60);
        await timeout(10);
        break;
      case 2: //disConnection
        this.tone(pin, 659, 50);
        await timeout(30);
        this.tone(pin, 1760, 55);
        await timeout(25);
        this.tone(pin, 1319, 50);
        await timeout(10);
        break;
      case 3: //OhOoh
        for (let i = 880; i < 2000; i = i * 1.04) {
          this.tone(pin, i, 8);
          await timeout(3);
        }
        await timeout(200);
        for (let i = 880; i < 2000; i = i * 1.04) {
          this.tone(pin, 988, 5);
          await timeout(10);
        }
        break;
      case 4: //OhOoh2
        for (let i = 1880; i < 3000; i = i * 1.03) {
          this.tone(pin, i, 8);
          await timeout(3);
        }
        await timeout(200);
        for (let i = 1880; i < 3000; i = i * 1.03) {
          this.tone(pin, 1047, 10);
          await timeout(10);
        }
        break;
      case 5: //cuddly
        for (let i = 700; i < 900; i = i * 1.03) {
          this.tone(pin, i, 16);
          await timeout(4);
        }
        for (let i = 899; i > 650; i = i / 1.01) {
          this.tone(pin, i, 18);
          await timeout(7);
        }
        break;
      case 6: //sleeping
        for (let i = 100; i < 500; i = i * 1.04) {
          this.tone(pin, i, 10);
          await timeout(10);
        }
        await timeout(500);
        for (let i = 400; i > 100; i = i / 1.04) {
          this.tone(pin, i, 10);
          await timeout(1);
        }
        break;
      case 7: //happy
        for (let i = 1500; i < 2500; i = i * 1.05) {
          this.tone(pin, i, 20);
          await timeout(8);
        }
        for (let i = 2499; i > 1550; i = i / 1.05) {
          this.tone(pin, i, 25);
          await timeout(8);
        }
        break;
      case 8: //superHappy
        for (let i = 2000; i < 6000; i = i * 1.05) {
          this.tone(pin, i, 8);
          await timeout(3);
        }
        await timeout(50);
        for (let i = 5999; i > 2000; i = i / 1.05) {
          this.tone(pin, i, 13);
          await timeout(2);
        }
        break;
      case 9: //happy_short
        for (let i = 1500; i < 2000; i = i * 1.05) {
          this.tone(pin, i, 15);
          await timeout(8);
        }
        await timeout(100);
        for (let i = 1900; i < 2500; i = i * 1.05) {
          this.tone(pin, i, 10);
          await timeout(8);
        }
        break;
      case 10: //sad
        for (let i = 880; i > 669; i = i / 1.02) {
          this.tone(pin, i, 20);
          await timeout(200);
        }
        break;
      case 11: //confused
        for (let i = 1000; i < 1700; i = i * 1.03) {
          this.tone(pin, i, 8);
          await timeout(2);
        }
        for (let i = 1699; i > 500; i = i / 1.04) {
          this.tone(pin, i, 8);
          await timeout(3);
        }
        for (let i = 1000; i < 1700; i = i * 1.05) {
          this.tone(pin, i, 9);
          await timeout(10);
        }
        break;
      case 12: //fart1
        for (let i = 1600; i < 3000; i = i * 1.02) {
          this.tone(pin, i, 2);
          await timeout(15);
        }
        break;
      case 13: //fart2
        for (let i = 2000; i < 6000; i = i * 1.02) {
          this.tone(pin, i, 2);
          await timeout(20);
        }
        break;
      case 14: //fart3
        for (let i = 1600; i < 4000; i = i * 1.02) {
          this.tone(pin, i, 2);
          await timeout(20);
        }
        for (let i = 4000; i > 3000; i = i / 1.02) {
          this.tone(pin, i, 2);
          await timeout(20);
        }
        break;
      case 15: //surprise
        for (let i = 800; i < 2150; i = i * 1.02) {
          this.tone(pin, i, 10);
          await timeout(1);
        }
        for (let i = 2149; i > 800; i = i / 1.03) {
          this.tone(pin, i, 7);
          await timeout(1);
        }
        break;
      case 16: //mode1
        for (let i = 1319; i < 1760; i = i * 1.02) {
          this.tone(pin, i, 30);
          await timeout(10);
        }
        break;
      case 17: //mode2
        for (let i = 1568; i < 2350; i = i * 1.03) {
          this.tone(pin, i, 30);
          await timeout(10);
        }
        break;
      case 18: //mode3
        this.tone(pin, 1319, 50);
        await timeout(100);
        this.tone(pin, 1568, 50);
        await timeout(80);
        this.tone(pin, 2349, 300);
        await timeout(1);
        break;
      case 19: //buttonPushed
        for (let i = 1319; i < 1568; i = i * 1.03) {
          this.tone(pin, i, 20);
          await timeout(2);
        }
        await timeout(30);
        for (let i = 1319; i < 2350; i = i * 1.04) {
          this.tone(pin, i, 10);
          await timeout(2);
        }
        break;
      default:
        vm.emit('showAlert', { msg: 'wrong arguments' });
    }
  }

  soundeffectGen(gen, block) {
    gen.includes_['soundeffect'] = `#include "scale.h"`;
    gen.definitions_['soundeffect'] = `
void _tone (int pinBuzzer, float noteFrequency, long noteDuration, int silentDuration){

      if(silentDuration==0){silentDuration=1;}

      tone(pinBuzzer, noteFrequency, noteDuration);
      delay(noteDuration);       //milliseconds to microseconds
      //noTone(PIN_Buzzer);
      delay(silentDuration);
}

void bendTones (int pinBuzzer, float initFrequency, float finalFrequency, float prop, long noteDuration, int silentDuration){

  //Examples:
  //  bendTones (880, 2093, 1.02, 18, 1);
  //  bendTones (note_A5, note_C7, 1.02, 18, 0);

  if(silentDuration==0){silentDuration=1;}

  if(initFrequency < finalFrequency)
  {
      for (int i=initFrequency; i<finalFrequency; i=i*prop) {
          _tone(pinBuzzer, i, noteDuration, silentDuration);
      }

  } else{

      for (int i=initFrequency; i>finalFrequency; i=i/prop) {
          _tone(pinBuzzer, i, noteDuration, silentDuration);
      }
  }
}

//-- Function to receive sing commands
void receiveSing(int pin, int song){
    switch (song) {
      case 1: //Connection
        _tone(pin, note_E5,50,30);
        _tone(pin, note_E6,55,25);
        _tone(pin, note_A6,60,10);
        break;
      case 2: //disConnection
        _tone(pin,note_E5,50,30);
        _tone(pin,note_A6,55,25);
        _tone(pin,note_E6,50,10);
        break;
      case 3: //OhOoh
        bendTones(pin, 880, 2000, 1.04, 8, 3); //A5 = 880
        delay(200);

        for (int i=880; i<2000; i=i*1.04) {
           _tone(pin, note_B5,5,10);
        }
        break;
      case 4: //OhOoh2
        bendTones(pin, 1880, 3000, 1.03, 8, 3);
        delay(200);

        for (int i=1880; i<3000; i=i*1.03) {
          _tone(pin, note_C6,10,10);
        }
        break;
      case 5: //cuddly
        bendTones(pin,700, 900, 1.03, 16, 4);
        bendTones(pin,899, 650, 1.01, 18, 7);
        break;
      case 6: //sleeping
        bendTones(pin,100, 500, 1.04, 10, 10);
        delay(500);
        bendTones(pin,400, 100, 1.04, 10, 1);
        break;
      case 7: //happy
        bendTones(pin,1500, 2500, 1.05, 20, 8);
        bendTones(pin,2499, 1500, 1.05, 25, 8);
        break;
      case 8: //superHappy
        bendTones(pin,2000, 6000, 1.05, 8, 3);
        delay(50);
        bendTones(pin,5999, 2000, 1.05, 13, 2);
        break;
      case 9: //happy_short
        bendTones(pin,1500, 2000, 1.05, 15, 8);
        delay(100);
        bendTones(pin,1900, 2500, 1.05, 10, 8);
        break;
      case 10: //sad
        bendTones(pin,880, 669, 1.02, 20, 200);
        break;
      case 11: //confused
        bendTones(pin,1000, 1700, 1.03, 8, 2);
        bendTones(pin,1699, 500, 1.04, 8, 3);
        bendTones(pin,1000, 1700, 1.05, 9, 10);
        break;
      case 12: //fart1
        bendTones(pin,1600, 3000, 1.02, 2, 15);
        break;
      case 13: //fart2
        bendTones(pin,2000, 6000, 1.02, 2, 20);
        break;
      case 14: //fart3
        bendTones(pin,1600, 4000, 1.02, 2, 20);
        bendTones(pin,4000, 3000, 1.02, 2, 20);
        break;
      case 15: //surprise
        bendTones(pin, 800, 2150, 1.02, 10, 1);
        bendTones(pin, 2149, 800, 1.03, 7, 1);
        break;
      case 16: //mode1
        bendTones (pin,note_E6, note_A6, 1.02, 30, 10);
        break;
      case 17: //mode2
        bendTones (pin,note_G6, note_D7, 1.03, 30, 10);
        break;
      case 18: //mode3
        _tone(pin,note_E6,50,100);
        _tone(pin,note_G6,50,80);
        _tone(pin,note_D7,300,0);
        break;
      case 19: //buttonPushed
        bendTones (pin,note_E6, note_G6, 1.03, 20, 2);
        delay(30);
        bendTones (pin,note_E6, note_D7, 1.04, 10, 2);
        break;
      default:
        break;
    }
}`;
    const pin = Sensors.buzzer;
    const sound = gen.valueToCode(block, 'SOUND');
    gen.setupCodes_['buzzer' + pin] = `pinMode(${pin},OUTPUT)`;
    return gen.line(`receiveSing(${pin}, ${sound})`);
  }

  serBeginGen(gen, block) {
    return gen.line(`Serial.begin(115200)`);
  }

  serEndGen(gen, block) {
    return gen.line(`Serial.end()`);
  }

  serIfGen(gen, block) {
    return [`Serial`, 0];
  }

  serAvailableGen(gen, block) {
    //const sertype = gen.valueToCode(block, 'SERIAL');
    //const code = `${sertype}.available()`;
    const code = `Serial.available()`;
    return [code, 0];
  }

  serReadGen(gen, block) {
    return [`Serial.read()`, 0];
  }

  serReadStringGen(gen, block) {
    let ter = gen.valueToCode(block, 'TERMINATOR');
    ter = ter.substr(1, ter.length - 2);
    return [`Serial.readStringUntil('${ter}')`, 0];
  }

  serAvailable4WriteGen(gen, block) {
    return [`Serial.availableForWrite()`, 0];
  }

  serWriteGen(gen, block) {
    const v = gen.valueToCode(block, 'VALUE');
    return gen.line(`Serial.write(byte(${v}))`);
  }

  serPrintGen(gen, block) {
    const s = gen.valueToCode(block, 'TEXT');
    return gen.line(`Serial.print(${s})`);
  }

  printlnGen(gen, block) {
    //gen.setupCodes_['println'] = `Serial.begin(115200)`;
    const s = gen.valueToCode(block, 'TEXT');
    return gen.line(`Serial.println(${s})`);
  }

  printvalueGen(gen, block) {
    //gen.setupCodes_['println'] = `Serial.begin(115200)`;
    const s = gen.valueToCode(block, 'TEXT');
    const v = gen.valueToCode(block, 'VALUE');
    return gen.line(`Serial.println(String(${s}) + String("=") + String(${v}))`);
  }

  mapping(args) {
    const x = parseInt(args.VAL);
    const in_min = parseInt(args.FROMLOW);
    const in_max = parseInt(args.FROMHIGH);
    const out_min = parseInt(args.TOLOW);
    //console.log('TOLOW=',typeof args.TOLOW,args.TOLOW);
    //console.log('out_min=',typeof out_min,out_min);
    const out_max = parseInt(args.TOHIGH);
    //return parseFloat(((x - in_min) * (out_max - out_min) / (in_max - in_min)) + out_min).toFixed(2);
    return five.Fn.fmap(x, in_min, in_max, out_min, out_max);
  }

  mappingGen(gen, block) {
    const v = gen.valueToCode(block, 'VAL');
    const fl = gen.valueToCode(block, 'FROMLOW');
    const fh = gen.valueToCode(block, 'FROMHIGH');
    const tl = gen.valueToCode(block, 'TOLOW');
    const th = gen.valueToCode(block, 'TOHIGH');
    return [`map(${v},${fl},${fh},${tl},${th})`, 0];
  }

  millisGen(gen, block) {
    return ['millis()', 0];
  }

  // bellow is for I2C
  /*wiretrans (gen, block){
      let branch = gen.statementToCode(block, 'SUBSTACK');

      gen.includes_['wire'] = '#include <Wire.h>\n';
      let code = `
while (${sertype}.available()) {
  char c = ${sertype}.read();
  buf[bufindex++] = c;
  if (c == '\\n') {
    buf[bufindex] = '\\0';
    ${branch}
    memset(buf, 0, 64);
    bufindex = 0;
  }
  if (bufindex >= 64) {
    bufindex = 0;
  }
}\n`;
      return code;
  }

  wireBegin (args){
      this.i2cAddr = parseInt(args.ADDR, 16);
      board.i2cConfig();
  }

  wireBeginGen (gen, block){
      wireCommon(gen);
      const addr = gen.valueToCode(block, 'ADDR');
      return `Wire.beginTransmission(${addr})`;
  }

  wireWrite (args){
      const data = args.DATA;
      board.i2cWrite(this.i2cAddr, data, data.length);
  }

  wireWriteGen (gen, block){
      const data = gen.valueToCode(block, 'DATA');
      return `Wire.write(${data})`;
  }

  wireRead (args){
      const reg = parseInt(args.ADDR, 16);
      const len = parseInt(args.LEN);
      // board.i2cWrite(this.i2cAddr, data, data.length);
      return new Promise(resolve => {
          board.i2cReadOnce(this.i2cAddr, reg, len, ret => {
              resolve(ret);
          });
      });
  }

  wireReadGen (gen, block){
      return ['Wire.read()', 0];
  }

  wireEnd (){
      board.i2cStop(this.i2cAddr);
  }

  wireEndGen (gen, block){
      return 'Wire.endTransmission()';
  }

  wireEndRetGen (gen, block){
      return ['Wire.endTransmission()', 0];
  }    */

  stringtypoGen(gen, block) {
    const text = gen.valueToCode(block, 'TEXT');
    const typo = gen.valueToCode(block, 'TYPO');
    const code = `String(${text}, ${typo})`;
    return [code, 0];
  }

  typecastGen(gen, block) {
    const value = gen.valueToCode(block, 'VALUE');
    const typo = gen.valueToCode(block, 'TYPO');
    if (typo == 'TEXT') {
      return [`'${value}'`, 0];
    } else {
      return [`${typo}(${value})`, 0];
    }
  }

  varGen(gen, block) {
    let va = gen.valueToCode(block, 'VAR');
    const value = gen.valueToCode(block, 'VALUE');
    const typo = gen.valueToCode(block, 'TYPO');
    const _scope = gen.valueToCode(block, 'SCOPE');
    va = va.substr(1, va.length - 2);
    gen.includes_['stdint'] = `#include <stdint.h>`;
    if (_scope == 'global') {
      gen.definitions_['var' + va] = `${typo} ${va};`;
      return gen.line(`${va} = ${value}`);
    } else {
      return gen.line(`${typo} ${va} = ${value}`);
    }
  }

  var_dataGen(gen, block) {
    let va = gen.valueToCode(block, 'VAR');
    const value = gen.valueToCode(block, 'VALUE');
    va = va.substr(1, va.length - 2);
    return gen.line(`${va} = ${value}`);
  }

  var_valueGen(gen, block) {
    let va = gen.valueToCode(block, 'VAR');
    va = va.substr(1, va.length - 2);
    const code = `${va}`;
    return [code, 0];
  }

  text2numberGen(gen, block) {
    const te = gen.valueToCode(block, 'TEXT');
    return [`String(${te}).toInt()`, 0];
  }

  strLengthGen(gen, block) {
    const te = gen.valueToCode(block, 'TEXT');
    return [`String(${te}).length()`, 0];
  }

  subStringGen(gen, block) {
    const te = gen.valueToCode(block, 'TEXT');
    const fr = gen.valueToCode(block, 'FROM');
    const to = gen.valueToCode(block, 'TO');

    return [`String(${te}).substring(${fr}-1, ${to})`, 0];
  }

  async reset() { // todo: how to reset j5?
    //console.log('isConnected?',this.isConnected());
    if (this.isConnected()) {
      board.reset();
      //console.log('before.. board.event:', board.eventNames());
      for (let pin = 0; pin < board.pins.length; pin++) {
        board.removeAllListeners("digital-read-" + pin);
        board.pins[pin].mode = undefined;
        board.pins[pin].value = 0;
      }
      //console.log('after.. board.event:', board.eventNames());
      //board.servo = {};
      //board.matrix = {};
      //console.log('now board:', board);
      //await board.reportVersion(data=>{
      //console.log(data);
      //});
    }
  }

  resetGen(gen, block) {
    gen.definitions_['reset'] = `
void(* resetFunc) (void) = 0;//declare reset function at address 0`;
    return gen.line(`resetFunc()`);
  }

  vGen(gen, block) {
    gen.definitions_['v'] = `
uint16_t readVcc() {
  // Read 1.1V reference against AVcc
  // set the reference to Vcc and the measurement to the internal 1.1V reference

  #if defined(__AVR_ATmega32U4__) || defined(__AVR_ATmega1280__) || defined(__AVR_ATmega2560__)
    ADMUX = _BV(REFS0) | _BV(MUX4) | _BV(MUX3) | _BV(MUX2) | _BV(MUX1);
  #elif defined (__AVR_ATtiny24__) || defined(__AVR_ATtiny44__) || defined(__AVR_ATtiny84__)
    ADMUX = _BV(MUX5) | _BV(MUX0);
  #elif defined (__AVR_ATtiny25__) || defined(__AVR_ATtiny45__) || defined(__AVR_ATtiny85__)
    ADMUX = _BV(MUX3) | _BV(MUX2);
  #else
    ADMUX = _BV(REFS0) | _BV(MUX3) | _BV(MUX2) | _BV(MUX1);
  #endif

  delayMicroseconds(350);  // Wait for Vref to settle
  ADCSRA |= _BV(ADSC); // Start conversion
  while (bit_is_set(ADCSRA,ADSC)); // measuring

  uint8_t low = ADCL; // must read ADCL first - it then locks ADCH  
  uint8_t high = ADCH; // unlocks both

  uint16_t result = (high<<8) | low;

  result = 1125300 / result; // Calculate Vcc (in mV); 1125300 = 1.1*1023*1000
  return result; // Vcc in millivolts
}
`;
    return [`readVcc()`, gen.ORDER_ATOMIC];
  }
}

module.exports = cBrain;
