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
  ['','A0','A1','V','G',''],  //port1
  ['','A2','A3','V','G',''],  //port2
  ['','A4','A5','V','G',''],  //port3: A4=SDA, A5=SCL for I2C
  ['','A6','A7','V','G',''],  //port4: not connected
  ['4','2','3','V','G',''],   //port5
  ['7','5','6','V','G',''],   //port6
  ['8','9','10','V','G',''],  //port7
  ['13','11','12','V','G',''],//port8
];
// pwm: D3、D5、D6、D9、D10、D11
const Sensors = {
    TXpin: 1,
    RXpin: 0,
    button: 4,
    sound: 'A2',
    slider: 'A0',
    light: 'A1',
    rled: 10,
    gled: 11,
    bled: 13,
    buzzer: 9
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
};
*/
const pin2firmata = (pin, aidx) => {
    if (pin.startsWith('A')){
        // A0 starts with 14
        pin = parseInt(pin[1], 10)+14;
        if (aidx) pin-=14; // in firmata.js, analogPin with no "A"
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
    constructor (runtime){
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

        board.once('ready', ()=>{ // when cBrainFirmata firmware loaded
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
            vm.emit('showAlert', {msg: 'online', type: 'info'});
        });
     /*
     const viewedTutorial = localStorage.getItem("showed-arduino-tutorial")
     if (!viewedTutorial){
         runtime.showDeck('arduino-tutorial');
         localStorage.setItem("showed-arduino-tutorial", 1);
     }*/
    }

    onmessage (data){
        board.transport.emit('data', data);
        //this.board.transport.emit('data', data);
        //console.log("message from cBrainFirmata..", data);//for debug
        //console.log("Firmata status..", board);//for debug
    }

    onclose (){
        this.session = null;
        console.log("cBrain closed");//for debug
        console.log('window.board:',board);
        console.log('window.j5board:',j5board);
    }

    // method required by vm runtime
    /**
     * Called by the runtime when user wants to scan for an cBrain peripheral.
     */
    scan (){
        this.comm.getDeviceList().then(result => {
            this.runtime.emit(this.runtime.constructor.PERIPHERAL_LIST_UPDATE, result);
        });
    }

    stopAll () {
        this.arduinoStarted = false;
    }
    /**
     * Called by the runtime when user wants to connect to a certain cBrain peripheral.
     * id - the id of the peripheral to connect to.
     */
    connect (id){
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

    disconnect (){
        this.session.close();
        console.log("cBrain disconnected");//for debug
    }

    isConnected (){
        return Boolean(this.session);
    }

    getInfo (){
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
                    //   BlockType.EVENT - starts a stack in response to an event (full spec TBD)
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
                    text: ['hBrain Setup', 'loop'],
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
                            menu: 'serialtype',
                            defaultValue: 'Serial'
                        }
                    },
                    func: 'noop'
                },
                {
                    opcode: 'serialavailable',
                    blockType: BlockType.BOOLEAN,
                    text: formatMessage({
                        id: 'arduino.serialavailable',
                        default: '[SERIAL] Available'
                    }),
                    arguments: {
                        SERIAL: {
                            type: ArgumentType.STRING,
                            menu: 'serialtype',
                            defaultValue: 'Serial'
                        }
                    },
                    func: 'noop',
                    gen: {
                        arduino: this.serAvailable
                    }
                },
                {
                    opcode: 'serialread',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'arduino.serialread',
                        default: '[SERIAL] Read'
                    }),
                    arguments: {
                        SERIAL: {
                            type: ArgumentType.STRING,
                            menu: 'serialtype',
                            defaultValue: 'Serial'
                        }
                    },
                    func: 'noop'
                },
                {
                    opcode: 'serialbegin',
                    blockType: BlockType.COMMAND,

                    text: formatMessage({
                        id: 'arduino.serialbegin',
                        default: 'Serial Begin [BAUD]'
                    }),
                    arguments: {
                        BAUD: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 115200
                        }
                    },
                    func: 'noop',
                    sepafter: 36
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
                /*
                {
                    opcode: 'whenButtonPressed',
                    text: formatMessage({
                        id: 'ev3.whenButtonPressed',
                        default: 'when button [PORT] pressed',
                        description: 'when a button connected to a port is pressed'
                    }),
                    blockType: BlockType.HAT,
                    arguments: {
                      PORT: {
                        type: ArgumentType.STRING,
                        menu: 'buttonPort',
                        defaultValue: this.sensors.button
                      }
                    },
                    func: 'whenButtonPressed',
                    gen: {
                      arduino: this.whenButtonPressedGen
                    }
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
                  text: 'more..'
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
              {
                  opcode: 'println',
                  blockType: BlockType.COMMAND,
                  text: formatMessage({
                      id: 'arduino.println',
                      default: 'Serial Print [TEXT]'
                  }),
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
                  text: formatMessage({
                      id: 'arduino.printvalue',
                      default: 'Serial Print [TEXT] = [VALUE]'
                  }),
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
                    opcode: 'stringtypo',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'arduino.stringtypo',
                        default: 'String[TEXT],[TYPO]'
                    }),
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
                        arduino: this.stringtypo
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
                            defaultValue: 'char',
                            menu: 'Typo'
                        }
                    },
                    func: 'noop',
                    gen: {
                        arduino: this.typecast
                    }
                },
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
                onoff: ['ON','OFF'],
                ledpin: ['Red', 'Green', 'Blue'],
                Scale: [
                    {text: 'C4', value: '262'},
                    {text: 'D4', value: '294'},
                    {text: 'E4', value: '330'},
                    {text: 'F4', value: '349'},
                    {text: 'G4', value: '392'},
                    {text: 'A4', value: '440'},
                    {text: 'B4', value: '494'},

                    {text: 'C5', value: '523'},
                    {text: 'D5', value: '587'},
                    {text: 'E5', value: '659'},
                    {text: 'F5', value: '698'},
                    {text: 'G5', value: '784'},
                    {text: 'A5', value: '880'},
                    {text: 'B5', value: '988'},

                    {text: 'C6', value: '1047'},
                    {text: 'D6', value: '1175'},
                    {text: 'E6', value: '1319'},
                    {text: 'F6', value: '1397'},
                    {text: 'G6', value: '1568'},
                    {text: 'A6', value: '1760'},
                    {text: 'B6', value: '1976'}
                ],
                Beats: [
                    {text: '1/2', value: '500'},
                    {text: '1/4', value: '250'},
                    {text: '1/8', value: '125'},
                    {text: '1/1', value: '1000'},
                    {text: '2/1', value: '2000'}
                ],
                Sounds: this._buildMenu(this.SOUNDS_INFO),
                //Sounds: [],
                StrTypo: [
                    {text: '十六', value: 'HEX'},
                    {text: '二', value: 'BIN'},
                    {text: '十', value: 'DEC'}
                ],
                Typo: ['byte', 'char', 'int', 'long', 'word', 'float']
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
                    'ledpin': {'Red':'紅色', 'Green':'綠色', 'Blue':'藍色'},
                    'onoff': {'ON':'打開', 'OFF':'關閉'},
                    'v': '電源電壓 (mV)',
                    'stringtypo': '將[TEXT]以[TYPO]進制展示',
                    'typecast': '轉換[VALUE]的資料型態為[TYPO]',
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
                    'ledpin': {'Red':'红色', 'Green':'绿色', 'Blue':'蓝色'},
                    'onoff': {'ON':'打开', 'OFF':'关闭'},
                    'v': '电源电压 (mV)',
                    'stringtypo': '将[TEXT]以[TYPO]进制展示',
                    'typecast': '转换[VALUE]的资料型态为[TYPO]',
                },
            }

        };
    }

    _buildMenu (info) {
        return info.map((entry, index) => {
            const obj = {};
            obj.text = entry.name;
            obj.value = String(index + 1);
            return obj;
        });
    }

    get SOUNDS_INFO (){
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

    noop (){
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
    buttonPressed (args){
        const pin = Sensors.button;
        if (board.pins[pin].mode != board.MODES.INPUT ){
            board.pinMode(pin, board.MODES.INPUT);
            //in firmata.js, All digital pins are set to board.MODES.OUTPUT by default
        }

        if (board.eventNames().indexOf(`digital-read-${pin}`) === -1){ // just call digitalRead() once
            board.digitalRead(pin, value => {   //because只要call一次,即使沒執行此block仍會一直回報..
              //console.log('pin value=', value); // let the data being fresh
            });
        }
        //console.log('stored pin value=', board.pins[pin].value); // for debug
        return board.pins[pin].value;//stored value at any other time 有誤差
    }

    buttonPressedGen (gen, block){
        const pin = Sensors.button;
        gen.setupCodes_['button'+pin] = `pinMode(${pin},INPUT)`;
        return [`digitalRead(${pin})`, gen.ORDER_ATOMIC];
    }

    getSound (args){
        const pin = board.pin2firmata(Sensors.sound,1);// 1: in firmata.js, analogPin with no "A"
        // in Firmata.js, all analog pins are set to board.MODES.ANALOG (analog input) by default.
        return new Promise(resolve => {
            board.analogRead(pin, ret => {
                board.reportAnalogPin(pin, 0);
                resolve(ret);
            })
        });
    }

    getSoundGen (gen, block){
        const pin = Sensors.sound;
        gen.setupCodes_['sound'+pin] = `pinMode(${pin},INPUT)`;
        return [`analogRead(${pin})`, gen.ORDER_ATOMIC];
    }

    getBrightness (args){
        const pin = board.pin2firmata(Sensors.light,1);
        return new Promise(resolve => {
            board.analogRead(pin, ret => {
                board.reportAnalogPin(pin, 0);
                resolve(ret);
            })
        });
    }

    getBrightnessGen (gen, block){
        const pin = Sensors.light;
        gen.setupCodes_['light'+pin] = `pinMode(${pin},INPUT)`;
        return [`analogRead(${pin})`, gen.ORDER_ATOMIC];
    }

    getSlider (args){
        const pin = board.pin2firmata(Sensors.slider,1);
        return new Promise(resolve => {
            board.analogRead(pin, ret => {
                board.reportAnalogPin(pin, 0);
                resolve(ret);
            })
        });
    }

    getSliderGen (gen, block){
        const pin = Sensors.slider;
        gen.setupCodes_['slider'+pin] = `pinMode(${pin},INPUT)`;
        return [`analogRead(${pin})`, gen.ORDER_ATOMIC];
    }

    led (args){
        let pin = null;
        if (args.PIN == 'Red'){
          pin = Sensors.rled;
        } else if (args.PIN == 'Green') {
          pin = Sensors.gled;
        } else if (args.PIN == 'Blue') {
          pin = Sensors.bled;
        } else {
          vm.emit('showAlert', {msg: 'Input value out of range'});
        }

        let onoff = null;
        if (args.VALUE == 'ON') {
          onoff = board.HIGH;
        } else if (args.VALUE == 'OFF') {
          onoff = board.LOW;
        } else {
          vm.emit('showAlert', {msg: 'Input value out of range'});
        }

        if (board.pins[pin].mode != board.MODES.OUTPUT) {
          //vm.emit('showAlert', {msg: 'Wrong PinMode defined'});
          board.pinMode(pin, board.MODES.OUTPUT);
          //in Firmata.js, All digital pins are set to board.MODES.OUTPUT by default
        }
        board.digitalWrite(pin, onoff);
    }

    ledGen (gen, block){
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
        gen.setupCodes_['led'+pin] = `pinMode(${pin},OUTPUT)`;
        return gen.line(`digitalWrite(${pin},${onoff})`);
    }

    tone(pin, freq, delay){
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

    scale (args){
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

    buzzer (args){
        const pin = Sensors.buzzer;
        //console.log('FREQ=', typeof args.FREQ,args.FREQ); // for debug
        if (board.pins[pin].mode != board.MODES.OUTPUT) {
          board.pinMode(pin, board.MODES.OUTPUT);
          //in Firmata.js, All digital pins are set to board.MODES.OUTPUT by default
        }
        this.tone(pin, parseInt(args.FREQ), parseInt(args.DELAY));
    }

    buzzerGen (gen, block){
      const pin = Sensors.buzzer;
      const freq = gen.valueToCode(block, 'FREQ'); // can not transfer ArgumentType.NOTE
      //console.log('FREQ=', typeof freq, freq); // string but nothing
      const delay = gen.valueToCode(block, 'DELAY');
      gen.setupCodes_['buzzer'+pin] = `pinMode(${pin},OUTPUT)`;
      return gen.line(`tone(${pin}, ${freq}, ${delay})`);
    }

    async music (args){
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
        for (let i=0;i<notes.length;i++){
            if(notes[i]>='a' && notes[i]<='g'){
                note = notes[i];
            }else if(notes[i]=='r'){
                note = null;
            }else if(notes[i]>='2' && notes[i]<='6'){
                octave = notes[i] - '0';
            }else if(notes[i]==':'){
                i++;
                //clap = parseInt(notes[i])*0.125;
                clap = parseInt(notes[i])*250;
            }else if(notes[i]==' '){ // play until we meet a space
                this.tone(pin, five.Piezo.Notes[note+octave], clap);
                await timeout(clap);
                //console.log('freq=', typeof five.Piezo.Notes[note+octave], five.Piezo.Notes[note+octave]);
                //console.log('delay=', typeof clap, clap);
            }
        }
    }

    musicGen (gen, block){
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
        gen.setupCodes_['buzzer'+pin] = `pinMode(${pin},OUTPUT)`;
        return gen.line(`buzzMusic(${pin}, ${notes})`);
    }

    async soundeffect (args){
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
            for (let i=880; i<2000; i=i*1.04) {
              this.tone(pin, i, 8);
              await timeout(3);
            }
            await timeout(200);
            for (let i=880; i<2000; i=i*1.04) {
               this.tone(pin, 988, 5);
               await timeout(10);
            }
            break;
          case 4: //OhOoh2
            for (let i=1880; i<3000; i=i*1.03) {
              this.tone(pin, i, 8);
              await timeout(3);
            }
            await timeout(200);
            for (let i=1880; i<3000; i=i*1.03) {
              this.tone(pin, 1047, 10);
              await timeout(10);
            }
            break;
          case 5: //cuddly
            for (let i=700; i<900; i=i*1.03) {
              this.tone(pin, i, 16);
              await timeout(4);
            }
            for (let i=899; i>650; i=i/1.01) {
              this.tone(pin, i, 18);
              await timeout(7);
            }
            break;
          case 6: //sleeping
            for (let i=100; i<500; i=i*1.04) {
              this.tone(pin, i, 10);
              await timeout(10);
            }
            await timeout(500);
            for (let i=400; i>100; i=i/1.04) {
              this.tone(pin, i, 10);
              await timeout(1);
            }
            break;
          case 7: //happy
            for (let i=1500; i<2500; i=i*1.05) {
              this.tone(pin, i, 20);
              await timeout(8);
            }
            for (let i=2499; i>1550; i=i/1.05) {
              this.tone(pin, i, 25);
              await timeout(8);
            }
            break;
          case 8: //superHappy
            for (let i=2000; i<6000; i=i*1.05) {
              this.tone(pin, i, 8);
              await timeout(3);
            }
            await timeout(50);
            for (let i=5999; i>2000; i=i/1.05) {
              this.tone(pin, i, 13);
              await timeout(2);
            }
            break;
          case 9: //happy_short
            for (let i=1500; i<2000; i=i*1.05) {
              this.tone(pin, i, 15);
              await timeout(8);
            }
            await timeout(100);
            for (let i=1900; i<2500; i=i*1.05) {
              this.tone(pin, i, 10);
              await timeout(8);
            }
            break;
          case 10: //sad
            for (let i=880; i>669; i=i/1.02) {
              this.tone(pin, i, 20);
              await timeout(200);
            }
            break;
          case 11: //confused
            for (let i=1000; i<1700; i=i*1.03) {
              this.tone(pin, i, 8);
              await timeout(2);
            }
            for (let i=1699; i>500; i=i/1.04) {
              this.tone(pin, i, 8);
              await timeout(3);
            }
            for (let i=1000; i<1700; i=i*1.05) {
              this.tone(pin, i, 9);
              await timeout(10);
            }
            break;
          case 12: //fart1
            for (let i=1600; i<3000; i=i*1.02) {
              this.tone(pin, i, 2);
              await timeout(15);
            }
            break;
          case 13: //fart2
            for (let i=2000; i<6000; i=i*1.02) {
              this.tone(pin, i, 2);
              await timeout(20);
            }
            break;
          case 14: //fart3
            for (let i=1600; i<4000; i=i*1.02) {
              this.tone(pin, i, 2);
              await timeout(20);
            }
            for (let i=4000; i>3000; i=i/1.02) {
              this.tone(pin, i, 2);
              await timeout(20);
            }
            break;
          case 15: //surprise
            for (let i=800; i<2150; i=i*1.02) {
              this.tone(pin, i, 10);
              await timeout(1);
            }
            for (let i=2149; i>800; i=i/1.03) {
              this.tone(pin, i, 7);
              await timeout(1);
            }
            break;
          case 16: //mode1
            for (let i=1319; i<1760; i=i*1.02) {
              this.tone(pin, i, 30);
              await timeout(10);
            }
            break;
          case 17: //mode2
            for (let i=1568; i<2350; i=i*1.03) {
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
            for (let i=1319; i<1568; i=i*1.03) {
              this.tone(pin, i, 20);
              await timeout(2);
            }
            await timeout(30);
            for (let i=1319; i<2350; i=i*1.04) {
              this.tone(pin, i, 10);
              await timeout(2);
            }
            break;
          default:
            vm.emit('showAlert', {msg: 'wrong arguments'});
        }
    }

    soundeffectGen (gen, block){
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
        gen.setupCodes_['buzzer'+pin] = `pinMode(${pin},OUTPUT)`;
        return gen.line(`receiveSing(${pin}, ${sound})`);
    }

    printlnGen (gen, block){
        gen.setupCodes_['println'] = `Serial.begin(115200)`;
        const s = gen.valueToCode(block, 'TEXT');
        return gen.line(`Serial.println(${s})`);
    }

    printvalueGen (gen, block){
        gen.setupCodes_['println'] = `Serial.begin(115200)`;
        const s = gen.valueToCode(block, 'TEXT');
        const v = gen.valueToCode(block, 'VALUE');
        return gen.line(`Serial.println(String(${s}) + String("=") + String(${v}))`);
    }

    mapping (args){
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

    mappingGen (gen, block){
        const v = gen.valueToCode(block, 'VAL');
        const fl = gen.valueToCode(block, 'FROMLOW');
        const fh = gen.valueToCode(block, 'FROMHIGH');
        const tl = gen.valueToCode(block, 'TOLOW');
        const th = gen.valueToCode(block, 'TOHIGH');
        return [`map(${v},${fl},${fh},${tl},${th})`,0];
    }

    millisGen (gen, block){
        return ['millis()',0];
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

    stringtypo (gen, block){
        const text = gen.valueToCode(block, 'TEXT');
        const typo = gen.valueToCode(block, 'TYPO');
        const code = `String(${text}, ${typo})`;
        return [code, 0];
    }

    typecast (gen, block){
        const value = gen.valueToCode(block, 'VALUE');
        const typo = gen.valueToCode(block, 'TYPO');
        const code = `${typo}(${value})`;
        return [code, 0];
    }
    /*
    serAvailable (gen, block){
        const sertype = gen.valueToCode(block, 'SERIAL');
        const code = `${sertype}.available()`;
        return [code, 0];
    }
    */
    async reset() { // todo: how to reset j5?
      //console.log('isConnected?',this.isConnected());
      if(this.isConnected()) {
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

    resetGen(gen, block){
      gen.definitions_['reset'] = `
void(* resetFunc) (void) = 0;//declare reset function at address 0`;
      return gen.line(`resetFunc()`);
    }

    vGen(gen, block){
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
