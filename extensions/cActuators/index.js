/**
 * Created by tony on 2019/8/8
 */

const ArgumentType = Scratch.ArgumentType;
const BlockType = Scratch.BlockType;
const formatMessage = Scratch.formatMessage;
const log = Scratch.log;

class cActuatorsExtension{
    constructor (runtime){
        this.runtime = runtime;
    }

    getInfo (){
        return {
            id: 'cActuators',
            name: formatMessage({
                id: 'Actuator.categoryName',
                default: 'Actuator'
            }),
            color1: '#8d0ca8',
            color2: '#bd10e0',
            color3: '#bd10e0',
            //menuIconURI: board.menuIconURI,
            blockIconURI: board.blockIconURI,

            blocks: [
              {
                  opcode: 'motorH',
                  blockType: BlockType.COMMAND,
                  text: 'Set the big motor speed at port [PIN] to [SPEED](-255~255)',
                  arguments: {
                      PIN: {
                          type: ArgumentType.STRING,
                          defaultValue: '6',
                          menu: 'pwmPort2'
                      },
                      SPEED: {
                          type: ArgumentType.SLIDER,
                          defaultValue: 100
                      }
                  },
                  func: 'motorH',
                  gen: {
                      arduino: this.motorHGen
                  }
              },
              {
                opcode: 'motorHstop',
                blockType: BlockType.COMMAND,
                text: 'Stop the big motor at port [PIN]',
                arguments: {
                    PIN: {
                        type: ArgumentType.STRING,
                        defaultValue: '6',
                        menu: 'pwmPort2'
                    }
                },
                func: 'motorHstop',
                gen: {
                    arduino: this.motorHstopGen
                }
            },
            '---',
            {
                  opcode: 'continuousServo',
                  blockType: BlockType.COMMAND,
                  text: 'Set the small motor speed at port [PIN] to [SPEED](-255~255)',
                  arguments: {
                      PIN: {
                          type: ArgumentType.STRING,
                          defaultValue: '6',
                          menu: 'dPort'//'mPort'//'dPort3'//'pwmPort'
                      },
                      SPEED: {
                          type: ArgumentType.SLIDER,
                          defaultValue: 100
                      }
                  },
                  func: 'continuousServo',
                  gen: {
                      arduino: this.continuousServoGen
                  }
              },
                '---',
                {
                    opcode: 'servoGo',
                    blockType: BlockType.COMMAND,
                    text: 'Servo motor at port [PIN] (angle range total [MAX]°) rotate to [DEG]°.  speed:[SPEED](1~255)',
                    arguments: {
                        MAX: {
                            type: ArgumentType.STRING,
                            defaultValue: '180',//'270',
                            menu: 'maxAngle'
                        },
                        PIN: {
                            type: ArgumentType.STRING,
                            defaultValue: '6',
                            menu: 'pwmPort'//'dPort'
                        },
                        DEG: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        SPEED: {
                            type: ArgumentType.SLIDERANALOGWR,//NUMBER,
                            defaultValue: 255
                        }
                    },
                    func: 'servoGo',
                    gen: {
                        arduino: this.servoGoGen
                    }
                },
                {
                    opcode: 'getServoDeg',
                    blockType: BlockType.REPORTER,
                    text: 'Servo motor angle reading at port [PIN] (angle range total [MAX]°)',
                        //description: 'get the measured degrees a servo has turned'
                    arguments: {
                        MAX: {
                            type: ArgumentType.STRING,
                            defaultValue: '180',//'270',
                            menu: 'maxAngle'
                        },
                        PIN: {
                            type: ArgumentType.STRING,
                            defaultValue: '6',
                            menu: 'pwmPort'//'dPort'//
                        }
                    },
                    func: 'getServoDeg',
                    gen: {
                        arduino: this.getServoDegGen
                    }
                },
                '---',
                {
                    func: 'noop',
                    blockType: BlockType.DIVLABEL,
                    text: 'more..'
                },
                {
                    opcode: 'McontinuousServo',
                    blockType: BlockType.COMMAND,
                    text: 'Set the small motor speed at port [PORT][PIN] to [SPEED](-255~255)',
                    arguments: {
                        PORT: {
                          type: ArgumentType.STRING,
                          defaultValue: '6',
                          menu: 'dPort'//'pwmPort2'
                        },
                        PIN: {
                            type: ArgumentType.STRING,
                            defaultValue: 2,
                            menu: 'pwmPin'
                        },
                        SPEED: {
                            type: ArgumentType.SLIDER,
                            defaultValue: 0
                        }
                    },
                    func: 'continuousServo',
                    gen: {
                        arduino: this.continuousServoGen
                    }
                },
                '---',
                {
                    opcode: 'MservoGo',
                    blockType: BlockType.COMMAND,
                    text: 'Servo motor at port [PORT][PIN](angle range total [MAX]°) rotate to [DEG]°.  speed:[SPEED](1~255)',
                    arguments: {
                        MAX: {
                            type: ArgumentType.STRING,
                            defaultValue: '360',
                            menu: 'maxAngle'
                        },
                        PORT: {
                            type: ArgumentType.STRING,
                            defaultValue: '6',
                            menu: 'pwmPort2'
                        },
                        PIN: {
                            type: ArgumentType.STRING,
                            defaultValue: 2,
                            menu: 'pwmPin'
                        },
                        DEG: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        SPEED: {
                            type: ArgumentType.SLIDERANALOGWR,//NUMBER,
                            defaultValue: 255
                        }
                    },
                    func: 'servoGo',
                    gen: {
                        arduino: this.servoGoGen
                    }
                },
                {
                    opcode: 'MgetServoDeg',
                    blockType: BlockType.REPORTER,
                    text: 'Servo motor angle reading at port [PORT][PIN] (angle range total [MAX]°)',
                    arguments: {
                        MAX: {
                            type: ArgumentType.STRING,
                            defaultValue: '360',
                            menu: 'maxAngle'
                        },
                        PORT: {
                            type: ArgumentType.STRING,
                            defaultValue: '6',
                            menu: 'pwmPort2'
                        },
                        PIN: {
                            type: ArgumentType.STRING,
                            defaultValue: 2,
                            menu: 'pwmPin'
                        },
                    },
                    func: 'getServoDeg',
                    gen: {
                        arduino: this.getServoDegGen
                    }
                },
                '---',
                /*
                {
                    opcode: 'relay',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'Actuator.relay',
                        default: 'Relay Pin [PIN] [ONOFF]'
                    }),
                    arguments: {
                        PIN: {
                            type: ArgumentType.STRING,
                            defaultValue: '5',
                            menu: 'digiPin'
                        },
                        ONOFF: {
                            type: ArgumentType.STRING,
                            defaultValue: 'HIGH',
                            menu: 'onoff'
                        }
                    },
                    func: 'relay',
                    gen: {
                        arduino: this.relayGen
                    }
                },
                */
            ],

            menus: {
              maxAngle: ['180', '270', '360'],
              dPort: ['1','2','3','5','6','7','8'],
              dPort3: ['5','6','7','8'],
              mPort: ['6',/*'7',*/'8'],
              pwmPort: ['5','6','7'],
              pwmPort2: ['6','7'],
              pwmPin: [
                {text: 'A', value: 2},
                {text: 'B', value: 1},
              ],
              dPin3: [
                {text: 'A', value: 2},
                {text: 'B', value: 1},
                {text: 'C', value: 0},
              ],
              //motorDir: ['0','+','-'],
            },

            translation_map: {
                'zh-tw': {
                    'servoGo': '接口[PIN]的伺服馬達( 角度範圍共[MAX]° )轉動到[DEG]°，速度為[SPEED](1~255)',
                    'MservoGo': '接口[PORT][PIN]的伺服馬達( 角度範圍共[MAX]° )轉動到[DEG]°，速度為[SPEED](1~255)',
                    'getServoDeg': '接口[PIN]的伺服馬達角度讀值（角度範圍共[MAX]°）',
                    'MgetServoDeg': '接口[PORT][PIN]的伺服馬達角度讀值（角度範圍共[MAX]°）',
                    'continuousServo': '接口[PIN]的小馬達轉動速度設為[SPEED](-255~255)',
                    'McontinuousServo': '接口[PORT][PIN]的小馬達轉動速度設為[SPEED](-255~255)',
                    'motorH': '接口[PIN]的大馬達轉動速度設為[SPEED](-255~255)',
                    'motorHstop': '停止接口[PIN]的大馬達',
                  },
                'zh-cn': {
                    'servoGo': '端口[PIN]的舵机( 角度范围[MAX]° )转动到[DEG]°，速度为[SPEED](1~255)',
                    'MservoGo': '端口[PORT][PIN]的舵机( 角度范围[MAX]° )转动到[DEG]°，速度为[SPEED](1~255)',
                    'getServoDeg': '端口[PIN]的舵机角度读数（角度范围[MAX]°）',
                    'MgetServoDeg': '端口[PORT][PIN]的舵机角度读数（角度范围[MAX]°）',
                    'continuousServo': '端口[PIN]的小电机转动速度设为[SPEED](-255~255)',
                    'McontinuousServo': '端口[PORT][PIN]的小电机转动速度设为[SPEED](-255~255)',
                    'motorH': '端口[PIN]的大电机转动速度设为[SPEED](-255~255)',
                    'motorHstop': '停止端口[PIN]的大电机',
                  },
            }
        };
    }

    noop (){
        return Promise.reject(formatMessage({
            id: 'kblock.notify.nosupportonlinemode',
            defaultMessage: 'Not support in online mode'
        }));
    }

    servoGo (args){
      const port = parseInt(args.PORT);
      //console.log('port=',typeof port,port);
      let pin = parseInt(args.PIN);
      //console.log('pin=',typeof pin,pin);
      if (port) {
        pin = board.pin2firmata(board._port[port-1][pin]);
        //pin = board._port[port-1][pin]; // in j5, can just use 'Ax' as pin
      } else {
        pin = board.pin2firmata(board._port[pin-1][2]);
        //pin = board._port[pin-1][2]; // in j5, can just use 'Ax' as pin
      }
      //console.log('pin=',typeof pin,pin);
      // cBrainFirmata allows controlling servos from analog pins..
      // but actually only pwm pins work. why?
      if (pin >= 14){
          return Promise.reject(`servo not allowed at port ${args.PIN} for online mode`);
      };
      const max = parseInt(args.MAX, 10);
      /*
      // use board.servo for cBrain.reset block
      if (!board.servo[pin] || board.servo[pin].pin != pin){
          board.servo[pin] = new five.Servo({
            pin: pin,
            //id: pin,
            pwmRange: [600, 2400],
            degreeRange: [0, max],
            range: [0,max],
          });
          //board.pinMode(pin, board.MODES.SERVO); // will be done in j5
          console.log(`servo[${pin}] attached as`, board.servo[pin]);//for debug
      };
      console.log(`servo status is`, board.servo);//for debug
      */
      if (board.pins[pin].mode != board.MODES.SERVO){
        board.servoConfig(pin, 544, 2500);
      }
      //const deg = parseInt(args.DEG, 10);
      const deg = parseInt(args.DEG, 10)*180/max; // degree mapping
      const sp = five.Fn.constrain(parseInt(args.SPEED, 10), 1, 255);
      // also can use j5board.constrain()
      //if (sp<=0) sp= 1;
      //if (sp>255) sp=255;

      //board.servo[pin].to(deg, 255*(max/18)/sp); // *max/18 : for matching to off-line speed
      board.VservoWrite(pin, deg, sp);
      //board.servo[pin].position = parseInt(args.DEG, 10);
    }

    servoGoGen (gen, block){
        gen.includes_['servo'] = `#include <VarSpeedServo.h>\n`;
        const port = gen.valueToCode(block, 'PORT');
        //console.log('port=',typeof port,port);
        let pin = gen.valueToCode(block,'PIN');
        //console.log('PIN=',typeof pin,pin);
        if (port) {
          pin = board.pin2firmata(board._port[port-1][pin]);
        } else {
          pin = board.pin2firmata(board._port[pin-1][2]);
        }
        //console.log('pin=',typeof pin,pin);
        gen.definitions_['servo_'+pin] = `VarSpeedServo servo_${pin};`;
        gen.setupCodes_['servo_'+pin] = `servo_${pin}.attach(${pin},544,2500)`;
        const max = gen.valueToCode(block, 'MAX');
        const deg = gen.valueToCode(block, 'DEG');//*180/max;
        const sp = gen.valueToCode(block, 'SPEED');

        return `servo_${pin}.write(map(${deg},0,${max},544,2500),constrain(${sp},1,255))`;
    }

    getServoDeg (args){
        const port = parseInt(args.PORT);
        let pin = parseInt(args.PIN);
        if (port) {
          pin = board.pin2firmata(board._port[port-1][pin]);
        } else {
          pin = board.pin2firmata(board._port[pin-1][2]);
        }
        if (pin >= 14){
          return Promise.reject(`servo not allowed at ${args.PIN} for online mode`);
        };
        const max = parseInt(args.MAX, 10);
        //if (!board.servo[pin] || board.servo[pin].pin != pin){
        if (board.pins[pin].mode != board.MODES.SERVO){
          return Promise.reject(`need to set servo first`);
        } else {
          //return board.servo[pin].position;
          return board.pins[pin].value*max/180;
        }
    }

    getServoDegGen (gen, block){
        gen.includes_['servo'] = `#include <VarSpeedServo.h>\n`;
        const port = gen.valueToCode(block, 'PORT');
        let pin = gen.valueToCode(block,'PIN');
        if (port) {
          pin = board.pin2firmata(board._port[port-1][pin]);
        } else {
          pin = board.pin2firmata(board._port[pin-1][2]);
        }
        gen.definitions_['servo_'+pin] = `VarSpeedServo servo_${pin};`;
        gen.setupCodes_['servo_'+pin] = `servo_${pin}.attach(${pin},544,2500)`;
        const max = gen.valueToCode(block, 'MAX');

        return [`map(servo_${pin}.readMicroseconds(), 544, 2500, 0, ${max})`, gen.ORDER_ATOMIC];
        //return [`servo_${pin}.read() * ${max}/180`, gen.ORDER_ATOMIC];
    }

    continuousServo (args){
      const port = parseInt(args.PORT);
      let pin = parseInt(args.PIN);
      if (port) {
        pin = board.pin2firmata(board._port[port-1][pin]);
      } else {
        pin = board.pin2firmata(board._port[pin-1][1]);
      }
      // cBrainFirmata allows controlling servos from analog pins..
      // but actually only digital pins work
      if (pin >= 14){
          return Promise.reject(`servo not allowed at ${args.PIN} for online mode`);
      };
      /*
      console.log('before call new, board.servo=', board.servo);
      if (!board.servo[pin] || board.servo[pin].pin != pin){
        board.servo[pin] = new five.Servo.Continuous({
          pin: pin,
          //id: pin,
        });
        console.log(`Servo[${pin}] attached as`, board.servo[pin]);//for debug
      }
      console.log(`now servo status:`, board.servo);//for debug
      */
      if (board.pins[pin].mode != board.MODES.SERVO){
        board.servoConfig(pin, 544, 2500);
      }
      let speed = parseInt(args.SPEED,10);
      let sp2pulse;
      if (speed < 0) {
        if (speed < -255) speed = -255;
        //board.servo[pin].ccw(parseFloat(-speed/255).toFixed(2));
        sp2pulse = five.Fn.constrain(five.Fn.map(-speed,255,0,544,1500),544,1500);
      } else if (speed > 0) {
        if (speed > 255) speed = 255;
        //board.servo[pin].cw(parseFloat(speed/255).toFixed(2));
        sp2pulse = five.Fn.constrain(five.Fn.map(speed,255,0,2500,1500),1500,2500);
      } else if (speed == 0) {
        //board.servo[pin].stop();
        sp2pulse = 1500;
      }
      //console.log('speed:',speed);
      //console.log('sp2pulse=',sp2pulse);
      board.servoWrite(pin, sp2pulse);
    }

    continuousServoGen (gen, block){
        gen.includes_['servo'] = `#include <VarSpeedServo.h>\n`;
        const port = gen.valueToCode(block, 'PORT');
        let pin = gen.valueToCode(block,'PIN');
        if (port) {
          pin = board.pin2firmata(board._port[port-1][pin]);
        } else {
          pin = board.pin2firmata(board._port[pin-1][1]);
        }
        gen.definitions_['servo_'+pin] = `VarSpeedServo servo_${pin};`;
        gen.definitions_['servo360'] = `
uint16_t sp2pulse(int16_t speed){
  if (speed < 0) {
    return constrain(map(speed,-255,0,544,1500),544,1500);
  } else if (speed > 0) {
    return constrain(map(speed,255,0,2500,1500),1500,2500);
  } else if (speed == 0) {
    return 1500;
  }
}`;
        gen.setupCodes_['servo_'+pin] = `servo_${pin}.attach(${pin},544,2500)`;
        //const dir = gen.valueToCode(block, 'DIR');
        const sp = gen.valueToCode(block, 'SPEED');
        /*
        switch (dir) {
          case '0':
            let deg = 90;
            break;
          case '+':
            let deg = parseFloat(((sp - 0) * (0 - 90) / (255 - 0) + 90)).toFixed(2);
            break;
          case '-':
            let deg = parseFloat(((sp - 0) * (180 - 90) / (255 - 0) + 90)).toFixed(2);
            break;
          default:

        }
        if (speed < 0) {
          let deg = parseInt(((speed - 0) * (180 - 90) / (255 - 0) + 90));
        } else if (speed > 0) {
          let deg = parseInt(((speed - 0) * (0 - 90) / (255 - 0) + 90));
        } else if (speed == 0) {
          let deg = 90;
        }*/

        return `servo_${pin}.writeMicroseconds(sp2pulse(${sp}))`;
    }
    /*
    relay(args){
        const pin = board.pin2firmata(args.PIN);
        board.pinMode(pin, board.MODES.OUTPUT);
        //in Firmata.js, all analog pins are set to board.MODES.ANALOG (analog input) by default.
        const value = args.ONOFF === 'HIGH' ? 1:0;
        board.digitalWrite(pin, value ? 1 : 0);
    }

    relayGen (gen, block){
        const pin = gen.valueToCode(block, 'PIN');
        gen.setupCodes_['relay_'+pin] = `pinMode(${pin}, OUTPUT)`;
        return gen.template2code(block, 'digitalWrite');
    }
*/

    motorH(args){
      const pin = parseInt(args.PIN);
      const in1 = board.pin2firmata(board._port[pin-1][1]);
      const in2 = board.pin2firmata(board._port[pin-1][2]);
      const sp = parseInt(args.SPEED,10);
      if (sp>0){
          if(sp>255) sp=255;
          board.pinMode(in2, board.MODES.OUTPUT);
          board.pinMode(in1, board.MODES.PWM);
          board.analogWrite(in1, sp);
          board.digitalWrite(in2, board.LOW);
      } else if (sp<0){
          if(sp<-255) sp=-255;
          board.pinMode(in1, board.MODES.OUTPUT);
          board.pinMode(in2, board.MODES.PWM);
          board.digitalWrite(in1, board.LOW);
          board.analogWrite(in2, -sp);
      } else {
          board.pinMode(in1, board.MODES.OUTPUT);
          board.pinMode(in2, board.MODES.OUTPUT);
          board.digitalWrite(in1, board.LOW);
          board.digitalWrite(in2, board.LOW);
      }
    }
    
    motorHGen (gen, block){
        gen.definitions_['motorBridge'] = `void motorBridge(int in1, int in2, int speed){
    pinMode(in1, OUTPUT);
    pinMode(in2, OUTPUT);
    if (speed==0){
        digitalWrite(in1, LOW);
        digitalWrite(in2, LOW);
    } else if (speed>0){
        if(speed>255) speed=255;
        analogWrite(in1, abs(speed));
        analogWrite(in2, 0);
    } else if (speed<0){
        if(speed<-255) speed=-255;
        analogWrite(in1, 0);
        analogWrite(in2, abs(speed));
    }
}`;
        const pin = gen.valueToCode(block,'PIN');
        const p1 = board.pin2firmata(board._port[pin-1][1]);
        const p2 = board.pin2firmata(board._port[pin-1][2]);
        const speed = gen.valueToCode(block, 'SPEED');
        gen.includes_['mx1508'] = `#include "MX1508.h"\n`;
        gen.definitions_['mx1508_'+pin] = `MX1508 motor${pin}(${p1},${p2});`;
        return `motor${pin}.motorGo(${speed})`;
        //return `motorBridge(${p1}, ${p2}, ${speed})`;
    }

    motorHstop(args){
      const pin = parseInt(args.PIN);
      const in1 = board.pin2firmata(board._port[pin-1][1]);
      const in2 = board.pin2firmata(board._port[pin-1][2]);

      board.pinMode(in1, board.MODES.OUTPUT);
      board.pinMode(in2, board.MODES.OUTPUT);
      board.digitalWrite(in1, board.LOW);
      board.digitalWrite(in2, board.LOW);
    }

    motorHstopGen (gen, block){
      gen.definitions_['motorBridge'] = `void motorBridge(int in1, int in2, int speed){
  pinMode(in1, OUTPUT);
  pinMode(in2, OUTPUT);
  if (speed==0){
      digitalWrite(in1, LOW);
      digitalWrite(in2, LOW);
  } else if (speed>0){
      if(speed>255) speed=255;
      analogWrite(in1, abs(speed));
      analogWrite(in2, 0);
  } else if (speed<0){
      if(speed<-255) speed=-255;
      analogWrite(in1, 0);
      analogWrite(in2, abs(speed));
  }
}`;
      const pin = gen.valueToCode(block,'PIN');
      const p1 = board.pin2firmata(board._port[pin-1][1]);
      const p2 = board.pin2firmata(board._port[pin-1][2]);

      gen.includes_['mx1508'] = `#include "MX1508.h"\n`;
      gen.definitions_['mx1508_'+pin] = `MX1508 motor${pin}(${p1},${p2});`;
      return `motor${pin}.stopMotor()`;
      //return `motorBridge(${p1}, ${p2}, 0)`;
  }

}

module.exports = cActuatorsExtension;
