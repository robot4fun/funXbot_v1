/**
 * Created by tony on 2019/8/8
 */

const ArgumentType = Scratch.ArgumentType;
const BlockType = Scratch.BlockType;
const formatMessage = Scratch.formatMessage;
const log = Scratch.log;
//const menuIconURI = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAAA0CAYAAADFeBvrAAAAAXNSR0IArs4c6QAAA1JJREFUaEPtmEtoE1EUhr8zia2VPqatulBpEcGFWBVF0UqxIgoFwUVVXAjuFCRtFQq6EbpwWx9NC4JLEdT6WLgQxI1acaEuVArW+iiithZtom3BRzNXJppM0ibiOMmYhMlycu+c+53/v+fMvUKB/aTAePCAcl1RTyFPIZcz4FnO5YTbDucpZDtlLk/wFJqR8ECoDaEZNJ8rYigZprt8Z7pYzhRq/bIPZQSBMldgYkGEO3Tpm1LFdAYUCB1G5MTBLVOUl6iMMQ0Ma1x75AMxGuiq6kt6cUt4CKSIYMWCAgKiEqU64kBB/RQi0YzmqULUJqkzUuGnVyL5DFSCGGvjUF1Vb6zt5cT5CXuobLZi4pszwWNLeTUq3Hjyn/eQCPTc8jtJz8y5rhSFQKgFkZiH1wCNZpWzgNR14LYjMqXVIWpf+iqn5oKcicZQ9NCtv062XOv4ZpRxPO0ighUb4/+1fL4Hqj5x7DSgdoKVnY6AAuFmhMvpgRKKwjQVf5k+EN6FcCk9kG5tjhhQdYWPsfAhlHS6DVRaTO3W5ZGUvSoJqGlFhHnlVoO888zH0EcBQ9bHYTXjLEgdQV1IKAoJlsu6QibQtroIVx/6wOAAyGOKtAlOlvX/nUKppMsVIGttDwjq66YByTGUGoyPEWkDtWHH6mjPiv7uDmiMTQq5olDD0gh9gz6UIgWQEamnp/q+VQDCF4HdR7f/iD86d8/Pu1DuAO2tn+L8fX8aIDulKR8sV1OtKCmyisL7kDD+VcwvvitxVkUjUJ0rlgN1G5GPGLykWz+StIeWLTQoLbZkejEqjE38tlfscaxs54pCGetDiNlgzTPJYrf7kE+jVp+j+GQmOyUQSuj4w1GiQ4z8+lKwUwwSx6ZsrP/6shTzXPk4TQNU7FfcfZ6Ze5LQpPBydKadoqEL8wheeHcKi4C3cbOM3FxC7+58PoKLCfTBAiqvyfM7hWxZriV8ADi9qsYoLsrg6Ts0CYMfNPM0egEtwVqmJIr9wBBBfWWqeursVqN9fD7fjU6U2gNkEOkPpV/UO4xZTXSXPs08kPnGDqXR7/B+z1br6iVWALIDZGsx2R/szHLZX5/tCB6Q7ZS5PMFTyOWE2w7nKWQ7ZS5P8BRyOeG2wxWcQj8BdlI5U27H4bMAAAAASUVORK5CYII=";
const menuIconURI = "data:image/png;base64,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";
const blockIconURI = menuIconURI;

class cActuatorsExtension {
  constructor(runtime) {
    this.runtime = runtime;
  }

  getInfo() {
    return {
      id: 'cActuators',
      name: formatMessage({
        id: 'Actuator.categoryName',
        default: 'Actuator'
      }),
      color1: '#8d0ca8',
      color2: '#bd10e0',
      color3: '#bd10e0',
      menuIconURI: menuIconURI,
      blockIconURI: blockIconURI,

      blocks: [
        {
          opcode: 'motorH',
          blockType: BlockType.COMMAND,
          text: 'Set the big motor power at port [PIN] to [SPEED](-255~255)',
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
          text: 'Set the small motor power at port [PIN] to [SPEED](-255~255)',
          arguments: {
            PIN: {
              type: ArgumentType.STRING,
              defaultValue: '5',
              menu: 'pwmPort'
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
              defaultValue: '2',
              menu: 'sPort'
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
          opcode: 'servoWait',
          blockType: BlockType.COMMAND,
          text: 'Waitting for servo motor at port [PIN] to stop',
          arguments: {
            PIN: {
              type: ArgumentType.STRING,
              defaultValue: '2',
              menu: 'sPort'
            },
          },
          func: 'noop',//'servoWait',
          gen: {
            arduino: this.servoWaitGen
          }  
        },
        {
          opcode: 'servoStop',
          blockType: BlockType.COMMAND,
          text: 'Stop servo motor at port [PIN]',
          arguments: {
            PIN: {
              type: ArgumentType.STRING,
              defaultValue: '2',
              menu: 'sPort'
            },
          },
          func: 'noop',//'servoStop',
          gen: {
            arduino: this.servoStopGen
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
              defaultValue: '2',
              menu: 'sPort'
            }
          },
          func: 'getServoDeg',
          gen: {
            arduino: this.getServoDegGen
          }
        },
        {
          opcode: 'isMoving',
          blockType: BlockType.BOOLEAN,
          text: 'servo motor at port [PIN] is moving?',
          arguments: {
            PIN: {
              type: ArgumentType.STRING,
              defaultValue: '2',
              menu: 'sPort'
            },
          },
          func: 'noop',//'isMoving',
          gen: {
            arduino: this.isMovingGen
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
          text: 'Set the small motor power at port [PORT][PIN] to [SPEED](-255~255)',
          arguments: {
            PORT: {
              type: ArgumentType.STRING,
              defaultValue: '6',
              menu: 'dPort'
            },
            PIN: {
              type: ArgumentType.STRING,
              defaultValue: 2,
              menu: 'dPin'
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
              menu: 'dPort'
            },
            PIN: {
              type: ArgumentType.STRING,
              defaultValue: 2,
              menu: 'dPin'
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
          opcode: 'MservoWait',
          blockType: BlockType.COMMAND,
          text: 'Waitting for servo motor at port [PORT][PIN] to stop',
          arguments: {
            PORT: {
              type: ArgumentType.STRING,
              defaultValue: '6',
              menu: 'dPort'
            },
            PIN: {
              type: ArgumentType.STRING,
              defaultValue: 2,
              menu: 'dPin'
            },
          },
          func: 'noop',//'servoWait',
          gen: {
            arduino: this.servoWaitGen
          }  
        },
        {
          opcode: 'MservoStop',
          blockType: BlockType.COMMAND,
          text: 'Stop servo motor at port [PORT][PIN]',
          arguments: {
            PORT: {
              type: ArgumentType.STRING,
              defaultValue: '6',
              menu: 'dPort'
            },
            PIN: {
              type: ArgumentType.STRING,
              defaultValue: 2,
              menu: 'dPin'
            },
          },
          func: 'noop',//'servoStop',
          gen: {
            arduino: this.servoStopGen
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
              menu: 'dPort'
            },
            PIN: {
              type: ArgumentType.STRING,
              defaultValue: 2,
              menu: 'dPin'
            },
          },
          func: 'getServoDeg',
          gen: {
            arduino: this.getServoDegGen
          }
        },
        {
          opcode: 'MisMoving',
          blockType: BlockType.BOOLEAN,
          text: 'servo motor at port [PORT][PIN] is moving?',
          arguments: {
            PORT: {
              type: ArgumentType.STRING,
              defaultValue: '6',
              menu: 'dPort'
            },
            PIN: {
              type: ArgumentType.STRING,
              defaultValue: 2,
              menu: 'dPin'
            },
          },
          func: 'noop',//'isMoving',
          gen: {
            arduino: this.isMovingGen
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
        dPort: ['1', '2', '5', '6', '7', '8'],
        dPort3: ['5', '6', '7', '8'],
        sPort: ['2', '5', '6', '8'],
        pwmPort: ['5', '6', '7'],
        pwmPort2: ['6', '7'],
        aPin: [
          { text: 'A', value: 2 },
          { text: 'B', value: 1 },
        ],
        dPin: [
          { text: 'A', value: 2 },
          { text: 'B', value: 1 },
          { text: 'C', value: 0 },
        ],
        //motorDir: ['0','+','-'],
      },

      translation_map: {
        'zh-tw': {
          'servoGo': '接口[PIN]的伺服馬達( 角度範圍共[MAX]° )轉動到[DEG]°，速度為[SPEED](1~255)',
          'MservoGo': '接口[PORT][PIN]的伺服馬達( 角度範圍共[MAX]° )轉動到[DEG]°，速度為[SPEED](1~255)',
          'getServoDeg': '接口[PIN]的伺服馬達角度讀值（角度範圍共[MAX]°）',
          'MgetServoDeg': '接口[PORT][PIN]的伺服馬達角度讀值（角度範圍共[MAX]°）',
          'continuousServo': '接口[PIN]的小馬達電門設為[SPEED](-255~255)',
          'McontinuousServo': '接口[PORT][PIN]的小馬達電門設為[SPEED](-255~255)',
          'motorH': '接口[PIN]的大馬達電門設為[SPEED](-255~255)',
          'motorHstop': '停止接口[PIN]的大馬達',
          'servoWait': '等待接口[PIN]的伺服馬達停止',
          'servoStop': '立即停止接口[PIN]的伺服馬達',
          'isMoving': '接口[PIN]的伺服馬達正在轉動?',
          'MservoWait': '等待接口[PORT][PIN]的伺服馬達停止',
          'MservoStop': '立即停止接口[PORT][PIN]的伺服馬達',
          'MisMoving': '接口[PORT][PIN]的伺服馬達正在轉動?',
        },
        'zh-cn': {
          'servoGo': '端口[PIN]的舵机( 角度范围[MAX]° )转动到[DEG]°，速度为[SPEED](1~255)',
          'MservoGo': '端口[PORT][PIN]的舵机( 角度范围[MAX]° )转动到[DEG]°，速度为[SPEED](1~255)',
          'getServoDeg': '端口[PIN]的舵机角度读数（角度范围[MAX]°）',
          'MgetServoDeg': '端口[PORT][PIN]的舵机角度读数（角度范围[MAX]°）',
          'continuousServo': '端口[PIN]的小电机电门设为[SPEED](-255~255)',
          'McontinuousServo': '端口[PORT][PIN]的小电机电门设为[SPEED](-255~255)',
          'motorH': '端口[PIN]的大电机电门设为[SPEED](-255~255)',
          'motorHstop': '停止端口[PIN]的大电机',
          'servoWait': '等待端口[PIN]的舵机停止',
          'servoStop': '立即停止端口[PIN]的舵机',
          'isMoving': '端口[PIN]的舵机正在转动吗?',
          'servoWait': '等待端口[PORT][PIN]的舵机停止',
          'servoStop': '立即停止端口[PORT][PIN]的舵机',
          'isMoving': '端口[PORT][PIN]的舵机正在转动?',
        },
      }
    };
  }

  noop() {
    return Promise.reject(formatMessage({
      id: 'kblock.notify.nosupportonlinemode',
      defaultMessage: 'Not support in online mode'
    }));
  }

  servoGo(args) {
    const port = parseInt(args.PORT);
    //console.log('port=',typeof port,port);
    let pin = parseInt(args.PIN);
    //console.log('pin=',typeof pin,pin);
    if (port) {
      pin = board.pin2firmata(board._port[port - 1][pin]);
      //pin = board._port[port-1][pin]; // in j5, can just use 'Ax' as pin
    } else {
      pin = board.pin2firmata(board._port[pin - 1][2]);
      //pin = board._port[pin-1][2]; // in j5, can just use 'Ax' as pin
    }
    //console.log('pin=',typeof pin,pin);
    // cBrainFirmata allows controlling servos from analog pins..
    // but actually only pwm pins work. why?  --> already solved !!
    /*if (pin >= 14) {
      return Promise.reject(`servo not allowed at port ${args.PIN} for online mode`);
    };*/
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
    if (board.pins[pin].mode != board.MODES.SERVO) {
      board.servoConfig(pin, 544, 2500);
    }
    //const deg = parseInt(args.DEG, 10);
    const deg = parseInt(args.DEG, 10) * 180 / max; // degree mapping
    const sp = five.Fn.constrain(parseInt(args.SPEED, 10), 1, 255);
    // also can use j5board.constrain()
    //if (sp<=0) sp= 1;
    //if (sp>255) sp=255;

    //board.servo[pin].to(deg, 255*(max/18)/sp); // *max/18 : for matching to off-line speed
    board.VservoWrite(pin, deg, sp);
    //board.servo[pin].position = parseInt(args.DEG, 10);
  }

  servoGoGen(gen, block) {
    gen.includes_['servo'] = `#include <VarSpeedServo.h>\n`;
    const port = gen.valueToCode(block, 'PORT');
    //console.log('port=',typeof port,port);
    let pin = gen.valueToCode(block, 'PIN');
    //console.log('PIN=',typeof pin,pin);
    if (port) {
      pin = board.pin2firmata(board._port[port - 1][pin]);
    } else {
      pin = board.pin2firmata(board._port[pin - 1][2]);
    }
    //console.log('pin=',typeof pin,pin);
    gen.definitions_['servo_' + pin] = `VarSpeedServo servo_${pin};`;
    gen.setupCodes_['servo_' + pin] = `servo_${pin}.attach(${pin},544,2500)`;
    const max = gen.valueToCode(block, 'MAX');
    const deg = gen.valueToCode(block, 'DEG');//*180/max;
    const sp = gen.valueToCode(block, 'SPEED');

    return `servo_${pin}.write(map(${deg},0,${max},544,2500),constrain(${sp},1,255))`;
  }

  servoWaitGen(gen, block) {
    gen.includes_['servo'] = `#include <VarSpeedServo.h>\n`;
    const port = gen.valueToCode(block, 'PORT');
    let pin = gen.valueToCode(block, 'PIN');
    if (port) {
      pin = board.pin2firmata(board._port[port - 1][pin]);
    } else {
      pin = board.pin2firmata(board._port[pin - 1][2]);
    }
    gen.definitions_['servo_' + pin] = `VarSpeedServo servo_${pin};`;
    gen.setupCodes_['servo_' + pin] = `servo_${pin}.attach(${pin},544,2500)`;
    
    return gen.line(`servo_${pin}.wait()`);
  }

  servoStopGen(gen, block) {
    gen.includes_['servo'] = `#include <VarSpeedServo.h>\n`;
    const port = gen.valueToCode(block, 'PORT');
    let pin = gen.valueToCode(block, 'PIN');
    if (port) {
      pin = board.pin2firmata(board._port[port - 1][pin]);
    } else {
      pin = board.pin2firmata(board._port[pin - 1][2]);
    }
    gen.definitions_['servo_' + pin] = `VarSpeedServo servo_${pin};`;
    gen.setupCodes_['servo_' + pin] = `servo_${pin}.attach(${pin},544,2500)`;
    
    return gen.line(`servo_${pin}.stop()`);
  }

  getServoDeg(args) {
    const port = parseInt(args.PORT);
    let pin = parseInt(args.PIN);
    if (port) {
      pin = board.pin2firmata(board._port[port - 1][pin]);
    } else {
      pin = board.pin2firmata(board._port[pin - 1][2]);
    }
    /*if (pin >= 14) {
      return Promise.reject(`servo not allowed at ${args.PIN} for online mode`);
    };*/
    const max = parseInt(args.MAX, 10);
    //if (!board.servo[pin] || board.servo[pin].pin != pin){
    if (board.pins[pin].mode != board.MODES.SERVO) {
      return Promise.reject(`need to set servo first`);
    } else {
      //return board.servo[pin].position;
      return board.pins[pin].value * max / 180;
    }
  }

  getServoDegGen(gen, block) {
    gen.includes_['servo'] = `#include <VarSpeedServo.h>\n`;
    const port = gen.valueToCode(block, 'PORT');
    let pin = gen.valueToCode(block, 'PIN');
    if (port) {
      pin = board.pin2firmata(board._port[port - 1][pin]);
    } else {
      pin = board.pin2firmata(board._port[pin - 1][2]);
    }
    gen.definitions_['servo_' + pin] = `VarSpeedServo servo_${pin};`;
    gen.setupCodes_['servo_' + pin] = `servo_${pin}.attach(${pin},544,2500)`;
    const max = gen.valueToCode(block, 'MAX');

    return [`map(servo_${pin}.readMicroseconds(), 544, 2500, 0, ${max})`, gen.ORDER_ATOMIC];
    //return [`servo_${pin}.read() * ${max}/180`, gen.ORDER_ATOMIC];
  }

  isMovingGen(gen, block) {
    gen.includes_['servo'] = `#include <VarSpeedServo.h>\n`;
    const port = gen.valueToCode(block, 'PORT');
    let pin = gen.valueToCode(block, 'PIN');
    if (port) {
      pin = board.pin2firmata(board._port[port - 1][pin]);
    } else {
      pin = board.pin2firmata(board._port[pin - 1][2]);
    }
    gen.definitions_['servo_' + pin] = `VarSpeedServo servo_${pin};`;
    gen.setupCodes_['servo_' + pin] = `servo_${pin}.attach(${pin},544,2500)`;
    
    return [`servo_${pin}.isMoving()`, gen.ORDER_ATOMIC];
  }

  continuousServo(args) {
    const port = parseInt(args.PORT);
    let pin = parseInt(args.PIN);
    if (port) {
      pin = board.pin2firmata(board._port[port - 1][pin]);
    } else {
      pin = board.pin2firmata(board._port[pin - 1][1]);
    }
    // cBrainFirmata allows controlling servos from analog pins..
    // but actually only digital pins work --> already solved !!
    /*if (pin >= 14) {
      return Promise.reject(`servo not allowed at ${args.PIN} for online mode`);
    };*/
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
    if (board.pins[pin].mode != board.MODES.SERVO) {
      //board.servoConfig(pin, 544, 2500);
      board.servoConfig(pin, 500, 2500);
    }
    let speed = parseInt(args.SPEED, 10);
    let sp2pulse;
    if (speed < 0) {
      if (speed < -255) speed = -255;
      //board.servo[pin].ccw(parseFloat(-speed/255).toFixed(2));
      //sp2pulse = five.Fn.constrain(five.Fn.map(-speed,255,0,544,1500),544,1500);
      sp2pulse = five.Fn.constrain(five.Fn.map(-speed, 255, 0, 500, 1500), 500, 1500);
    } else if (speed > 0) {
      if (speed > 255) speed = 255;
      //board.servo[pin].cw(parseFloat(speed/255).toFixed(2));
      sp2pulse = five.Fn.constrain(five.Fn.map(speed, 255, 0, 2500, 1500), 1500, 2500);
    } else if (speed == 0) {
      //board.servo[pin].stop();
      sp2pulse = 1500;
    }
    //console.log('speed:',speed);
    //console.log('sp2pulse=',sp2pulse);
    board.servoWrite(pin, sp2pulse);
  }

  continuousServoGen(gen, block) {
    gen.includes_['servo'] = `#include <VarSpeedServo.h>\n`;
    const port = gen.valueToCode(block, 'PORT');
    let pin = gen.valueToCode(block, 'PIN');
    if (port) {
      pin = board.pin2firmata(board._port[port - 1][pin]);
    } else {
      pin = board.pin2firmata(board._port[pin - 1][1]);
    }
    gen.definitions_['servo_' + pin] = `VarSpeedServo servo_${pin};`;
    gen.definitions_['servo360'] = `
uint16_t sp2pulse(int16_t speed){
  if (speed < 0) {
    return constrain(map(speed,-255,0,500,1500),500,1500);
  } else if (speed > 0) {
    return constrain(map(speed,255,0,2500,1500),1500,2500);
  } else if (speed == 0) {
    return 1500;
  }
}`;
    gen.setupCodes_['servo_' + pin] = `servo_${pin}.attach(${pin},500,2500)`;
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

  motorH(args) {
    const pin = parseInt(args.PIN);
    const in1 = board.pin2firmata(board._port[pin - 1][1]);
    const in2 = board.pin2firmata(board._port[pin - 1][2]);
    let sp = parseInt(args.SPEED, 10);
    /*
    if (sp>0){
        if(sp>255) sp=255;
        sp=five.Fn.map(speed,0,255,255,0);
        board.pinMode(in1, board.MODES.PWM);
        board.pinMode(in2, board.MODES.OUTPUT);
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
    */
    //mx1508 slow decay mode 
    board.pinMode(in1, board.MODES.PWM);
    board.pinMode(in2, board.MODES.PWM);

    if (sp >= 0) {
      if (sp > 255) sp = 255;
      sp = five.Fn.map(sp, 0, 255, 255, 0);
      board.analogWrite(in1, 255);
      board.analogWrite(in2, sp);
    } else if (sp < 0) {
      sp = -1 * sp;
      if (sp > 255) sp = 255;
      sp = five.Fn.map(sp, 0, 255, 255, 0);
      board.analogWrite(in1, sp);
      board.analogWrite(in2, 255);
    }
  }

  motorHGen(gen, block) {
    /*        gen.definitions_['motorBridge'] = `void motorBridge(int in1, int in2, int speed){
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
    }`;*/
    const pin = gen.valueToCode(block, 'PIN');
    const p1 = board.pin2firmata(board._port[pin - 1][1]);
    const p2 = board.pin2firmata(board._port[pin - 1][2]);
    const speed = gen.valueToCode(block, 'SPEED');
    gen.includes_['mx1508'] = `#include "MX1508.h"\n`;
    //gen.definitions_['mx1508_'+pin] = `MX1508 motor${pin}(${p1},${p2});`;//default: FAST_DECAY
    gen.definitions_['mx1508_' + pin] = `MX1508 motor${pin}(${p1},${p2},SLOW_DECAY,2);`;
    return `motor${pin}.motorGo(${speed})`;
    //return `motorBridge(${p1}, ${p2}, ${speed})`;
  }

  motorHstop(args) {
    const pin = parseInt(args.PIN);
    const in1 = board.pin2firmata(board._port[pin - 1][1]);
    const in2 = board.pin2firmata(board._port[pin - 1][2]);

    board.pinMode(in1, board.MODES.OUTPUT);
    board.pinMode(in2, board.MODES.OUTPUT);
    board.digitalWrite(in1, board.LOW);
    board.digitalWrite(in2, board.LOW);
  }

  motorHstopGen(gen, block) {
    /*      gen.definitions_['motorBridge'] = `void motorBridge(int in1, int in2, int speed){
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
    }`;*/
    const pin = gen.valueToCode(block, 'PIN');
    const p1 = board.pin2firmata(board._port[pin - 1][1]);
    const p2 = board.pin2firmata(board._port[pin - 1][2]);

    gen.includes_['mx1508'] = `#include "MX1508.h"\n`;
    //gen.definitions_['mx1508_'+pin] = `MX1508 motor${pin}(${p1},${p2});`;
    gen.definitions_['mx1508_' + pin] = `MX1508 motor${pin}(${p1},${p2},SLOW_DECAY,2);`;
    return `motor${pin}.stopMotor()`;
    //return `motorBridge(${p1}, ${p2}, 0)`;
  }

}

module.exports = cActuatorsExtension;
