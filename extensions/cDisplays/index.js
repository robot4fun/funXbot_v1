/**
 * Created by tony on 2019/8/9.
 */
const tm1637 = require('./tm1637.js');
const ws2812 = require('./pixel.js');

const ArgumentType = Scratch.ArgumentType;
const BlockType = Scratch.BlockType;
const formatMessage = Scratch.formatMessage;
const log = Scratch.log;
const PIXEL_COMMAND = 0x51;
const PIXEL_RESET = 0x06;

async function timeout(ms) {
  await new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

function cutHex(h) {return (h.charAt(0)=="#") ? h.substring(1,7):h};
function hexToR(h) {return parseInt((cutHex(h)).substring(0,2),16)};
function hexToG(h) {return parseInt((cutHex(h)).substring(2,4),16)};
function hexToB(h) {return parseInt((cutHex(h)).substring(4,6),16)};

class cDisplaysExtension{
    constructor(runtime){
        this.runtime = runtime;
        this.strips = {};
        this.digitube = {};
        this.matrix = {};
    }

    getInfo (){
        return {
            id: 'cDisplays',
            name: formatMessage({
                id: 'Display.categoryName',
                default: 'Display'
            }),
            color1: '#F7C540',
            color2: '#C19932',
            color3: '#C19932',
            //menuIconURI: board.menuIconURI,
            blockIconURI: board.blockIconURI,

            blocks: [
                {
                    opcode: 'digitubenumber',
                    blockType: BlockType.COMMAND,
                    text: '4 digits tube  port[PIN]  display[NUM]',
                    arguments: {
                      PIN: {
                          type: ArgumentType.STRING,
                          menu: 'dPort',
                          defaultValue: '5'
                      },
                      NUM: {
                          type: ArgumentType.NUMBER,
                          defaultValue: 1234
                      }
                    },
                    func: 'tm1637num',
                    gen: {
                        arduino: this.tm1637numGen
                    }
                },
                {
                    opcode: 'digitubeoff',
                    blockType: BlockType.COMMAND,
                    text: '4 digits tube off  port[PIN]',
                    arguments: {
                      PIN: {
                          type: ArgumentType.STRING,
                          menu: 'dPort',
                          defaultValue: '5'
                      },
                    },
                    func: 'tm1637off',
                    gen: {
                        arduino: this.tm1637offGen
                    }
                },
                /*{
                    opcode: '8digitubesetup',
                    blockType: BlockType.COMMAND,

                    // text: formatMessage({
                        // id: 'display.digitubesetup',
                        // default: 'Digital Tube Port [PORT]'
                    // }),
                    text: '8 digits Tube Port [PORT]',
                    arguments: {
                        PORT: {
                            type: ArgumentType.STRING,
                            menu: 'Port5pin',
                            defaultValue: '8 9 10'
                        }
                    },
                    func: 'noop',
                     gen: {
                         arduino: this.8digitubesetupGen
                     }
                },
                {
                    opcode: '8digitubenumber',
                    blockType: BlockType.COMMAND,

                    text: '8 digis Tube display [NUM]'
                    }),
                    arguments: {
                        NUM: {
                            type: ArgumentType.STRING,
                            defaultValue: '12345678'
                        }
                    },
                    func: 'noop',
                    gen: {
                        arduino: this.8digitubenumberGen
                    }
                },*/
                '---',
                {
                    opcode: 'matrixPattern',
                    blockType: BlockType.COMMAND,
                    text: 'led matrix at port [PIN] to display pattern [MAT]',
                    arguments: {
                      PIN: {
                          type: ArgumentType.STRING,
                          menu: 'dPort3',
                          defaultValue: '5'
                      },
                      MAT: {
                          type: ArgumentType.LEDMATRIX,
                          defaultValue: '7c3e8241824183c18241824182417c3e'
                      },
                    },
                    func: 'max72xxPatt',
                    gen: {
                           arduino: this.max72xxPattGen
                    }
                },
                {
                    opcode: 'matrixFace',
                    blockType: BlockType.COMMAND,
                    text: 'led matrix at port [PIN] to display mood [MAT]',
                    arguments: {
                      PIN: {
                          type: ArgumentType.STRING,
                          menu: 'dPort3',
                          defaultValue: '5'
                      },
                      MAT: {
                          type: ArgumentType.STRING,
                          menu: '#face8x16list',
                          defaultValue: '0'
                      },
                    },
                    func: 'max72xxPatt',
                    gen: {
                         arduino: this.max72xxPattGen
                    }
                },
                {
                    opcode: 'matrixIcon',
                    blockType: BlockType.COMMAND,
                    text: 'led matrix at port [PIN] to display icon [MAT] on [LR] side',
                    arguments: {
                      PIN: {
                          type: ArgumentType.STRING,
                          menu: 'dPort3',
                          defaultValue: '5'
                      },
                      MAT: {
                          type: ArgumentType.STRING,
                          menu: '#icon8list',
                          defaultValue: '0'
                      },
                      LR: {
                          type: ArgumentType.STRING,
                          menu: 'lr',
                          defaultValue: 'left'
                      },
                    },
                    func: 'max72xxIcon',
                    gen: {
                         arduino: this.max72xxIconGen
                    }
                },
                {
                    opcode: 'matrixText',
                    blockType: BlockType.COMMAND,
                    text: 'led matrix at port [PIN] to display text [TEXT]',
                    arguments: {
                      PIN: {
                          type: ArgumentType.STRING,
                          menu: 'dPort3',
                          defaultValue: '5'
                      },
                      TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'Hello!  '
                      }
                    },
                    func: 'max72xxText',
                    gen: {
                        arduino: this.max72xxTextGen
                    }
                },
                {
                    opcode: 'matrixClear',
                    blockType: BlockType.COMMAND,
                    text: 'clear led matrix at port [PIN]',
                    arguments: {
                      PIN: {
                          type: ArgumentType.STRING,
                          menu: 'dPort3',
                          defaultValue: '5'
                      }
                    },
                    func: 'max72xxClear',
                    gen: {
                         arduino: this.max72xxClearGen
                    }
                },
                '---',
/*
                {
                    opcode: 'i2cledmatrix',
                    blockType: BlockType.COMMAND,

                    text: "Matrix [MAT]",
                    arguments: {
                        MAT: {
                            type: ArgumentType.LEDMATRIX,
                            defaultValue: '00000000024000000000042003c00000'
                        }
                    },
                    func: 'i2cledmatrix'
                },
                '---',
*/
/*
                {
                    opcode: 'lcdsetup',
                    blockType: BlockType.COMMAND,

                    text: formatMessage({
                        id: 'display.lcdsetup',
                        default: 'LCD Setup Addr [ADDR]'
                    }),
                    arguments: {
                        ADDR: {
                            type: ArgumentType.STRING,
                            defaultValue: '0x3F'
                        }
                    },
                    func: 'lcdsetup',
                    gen: {
                        arduino: this.lcdSetupGen
                    }
                },

                {
                    opcode: 'lcdprint',
                    blockType: BlockType.COMMAND,

                    text: formatMessage({
                        id: 'display.lcdprint',
                        default: 'LCD Print [LINE]'
                    }),
                    arguments: {
                        LINE: {
                            type: ArgumentType.STRING,
                            defaultValue: 'Hello World'
                        }
                    },
                    func: 'lcdprint',
                    gen: {
                        arduino: this.lcdprintGen
                    }
                },
                {
                    opcode: 'lcdbl',
                    blockType: BlockType.COMMAND,

                    text: formatMessage({
                        id: 'display.lcdbl',
                        default: 'LCD Backlight [BL]'
                    }),
                    arguments: {
                        BL: {
                            type: ArgumentType.STRING,
                            defaultValue: 'HIGH',
                            menu: 'onoff'
                        }
                    },
                    func: 'lcdbl',
                    gen: {
                        arduino: this.lcdblGen
                    }
                },
                {
                    opcode: 'lcdcursor',
                    blockType: BlockType.COMMAND,

                    text: formatMessage({
                        id: 'display.lcdcursor',
                        default: 'LCD Cursor Col[COL] Row[ROW]'
                    }),
                    arguments: {
                        COL: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        ROW: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1
                        }
                    },
                    func: 'lcdcursor',
                    gen: {
                        arduino: this.lcdcursorGen
                    }
                },
                {
                    opcode: 'lcdclear',
                    blockType: BlockType.COMMAND,

                    text: formatMessage({
                        id: 'display.lcdclear',
                        default: 'LCD Clear'
                    }),
                    func: 'lcdclear',
                    gen: {
                        arduino: this.lcdclearGen
                    }
                },
                '---',
*/
                {
                    opcode: 'rgbshow',
                    blockType: BlockType.COMMAND,
                    text: 'RGB strip at port [PIN] has [NUMPIXELS] pixels. show-time!',
                    arguments: {
                        PIN: {
                            type: ArgumentType.STRING,
                            menu: 'dPort',
                            defaultValue: '5'
                        },
                        NUMPIXELS: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 8
                        },
                    },
                    func: 'ws2812show',
                    gen: {
                        arduino: this.ws2812showGen
                    }
                },
                {
                    opcode: 'rgbset',
                    blockType: BlockType.COMMAND,
                    text: 'RGB strip at port [PIN] has [NUMPIXELS] pixels. color of pixel [PIX] is [COLOR]',
                        //'RGB strip at port [PIN] has [NUMPIXELS] pixels. brightness: [BRIGHT]. color of pixel [PIX] is [COLOR]'
                    arguments: {
                        PIN: {
                            type: ArgumentType.STRING,
                            menu: 'dPort',
                            defaultValue: '5'
                        },
                        NUMPIXELS: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 8
                        },
                        /*BRIGHT: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 50
                        },*/
                        PIX: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1
                        },
                        COLOR: {
                            type: ArgumentType.COLORRGB
                        }
                    },
                    func: 'ws2812set',
                    gen: {
                        arduino: this.ws2812setGen
                    }
                },
                {
                    opcode: 'rgbrefresh',
                    blockType: BlockType.COMMAND,
                    text: 'RGB strip at port [PIN] refresh',
                    arguments: {
                        PIN: {
                            type: ArgumentType.STRING,
                            menu: 'dPort',
                            defaultValue: '5'
                        }
                    },
                    func: 'ws2812refresh',
                    gen: {
                        arduino: this.ws2812refreshGen
                    }
                },
                {
                    opcode: 'rgboff',
                    blockType: BlockType.COMMAND,
                    text: 'turn off RGB strip at port [PIN]',
                    arguments: {
                        PIN: {
                            type: ArgumentType.STRING,
                            menu: 'dPort',
                            defaultValue: '5'
                        }
                    },
                    func: 'ws2812off',
                    gen: {
                        arduino: this.ws2812clearGen
                    }
                },
                '---',
                {
                    func: 'noop',
                    blockType: BlockType.DIVLABEL,
                    text: 'more..'
                },
                {
                    opcode: 'rgb2hex',
                    text: 'red:[R], green:[G], blue:[B](0~255) to hex',
                    blockType: BlockType.REPORTER,
                    arguments: {
                      R: {type: ArgumentType.SLIDERANALOGWR},
                      G: {type: ArgumentType.SLIDERANALOGWR},
                      B: {type: ArgumentType.SLIDERANALOGWR},
                    },
                    func: 'rgb2hex',
                    gen: {
                      arduino: this.rgb2hexGen
                    }
                },
                {
                    opcode: 'rgbreset',
                    blockType: BlockType.COMMAND,
                    text: 'reset all RGB strips configurations',
                    func: 'ws2812reset',
                    gen: {
                        //arduino: this.Gen
                    }
                },
                '---',
                /*{
                    opcode: 'cMatrixShow',
                    blockType: BlockType.COMMAND,

                    text: formatMessage({
                      id: 'cDisplay.cMaxShow',
                      default: 'RGB matrix at port [PIN] show-time!'
                    }),
                    arguments: {
                      PIN: {
                        type: ArgumentType.STRING,
                        menu: 'dPort',
                        defaultValue: board._port.p5[2],
                      },
                    },
                    func: 'noop',//'ws2812maxShow',
                    gen: {
                         arduino: this.ws2812maxShowGen
                    }
                },
                {
                    opcode: 'cMatrixPattern',
                    blockType: BlockType.COMMAND,

                    text: formatMessage({
                        id: 'cDisplay.cMaxPattern',
                        default: 'RGB matrix at port [PIN] display [MAT] with color [COLOR]'
                    }),
                    arguments: {
                      PIN: {
                          type: ArgumentType.STRING,
                          menu: 'dPort',
                          defaultValue: board._port.p5[2],
                      },
                      MAT: {
                          type: ArgumentType.MATRIX,
                      },
                      COLOR: {
                          type: ArgumentType.COLOR
                      },
                    },
                    func: 'ws2812maxPattern',
                    gen: {
                         arduino: this.ws2812maxPatternGen
                    }
                },
                {
                    opcode: 'cMatrixIcon',
                    blockType: BlockType.COMMAND,

                    text: formatMessage({
                        id: 'cDisplay.cMaxIcon',
                        default: 'RGB matrix at port [PIN] display icon [MAT] with color [COLOR]'
                    }),
                    arguments: {
                      PIN: {
                          type: ArgumentType.STRING,
                          menu: 'dPort',
                          defaultValue: board._port.p5[2],
                      },
                      MAT: {
                          type: ArgumentType.STRING,
                          menu: '#icon5list',
                          defaultValue: '1'
                      },
                      COLOR: {
                          type: ArgumentType.COLOR
                      },
                    },
                    func: 'ws2812maxIcon',
                    gen: {
                         arduino: this.ws2812maxIconGen
                    }
                },
                {
                    opcode: 'cMatrixText',
                    blockType: BlockType.COMMAND,

                    text: formatMessage({
                        id: 'cDisplay.cMaxText',
                        default: 'RGB matrix at port [PIN] display text [TEXT] with color [COLOR]'
                    }),
                    arguments: {
                      PIN: {
                          type: ArgumentType.STRING,
                          menu: 'dPort',
                          defaultValue: board._port.p5[2],
                      },
                      TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'Hello!  '
                      },
                      COLOR: {
                          type: ArgumentType.COLOR
                      },
                    },
                    func: 'noop',//'ws2812maxText',
                    gen: {
                        arduino: this.ws2812maxTextGen
                    }
                },
                {
                    opcode: 'cMatrixClear',
                    blockType: BlockType.COMMAND,

                    text: formatMessage({
                        id: 'cDisplay.maxClear',
                        default: 'clear led matrix at port [PIN]'
                    }),

                    arguments: {
                      PIN: {
                          type: ArgumentType.STRING,
                          menu: 'dPort',
                          defaultValue: board._port.p5[2],
                      }
                    },

                    func: 'ws2812off',
                    gen: {
                         arduino: this.ws2812clearGen
                    }
                },*/
                '---',
            ],
            menus: {
              dPort: ['1','2','3','5','6','7','8'],
              dPort3: ['5','6','7'/*,'8'*/],
              lr: ['left', 'right'],
              '#face8x16list': [
                {src: 'static/extension-assets/Robot4FUN-cBrain-assets/f0_8x16.png',
                value: '00', width: 73, height: 38,},
                {src: 'static/extension-assets/Robot4FUN-cBrain-assets/f1_8x16.png',
                value: '01', width: 73, height: 38,},
                {src: 'static/extension-assets/Robot4FUN-cBrain-assets/f2_8x16.png',
                value: '02', width: 73, height: 38,},
                {src: 'static/extension-assets/Robot4FUN-cBrain-assets/f3_8x16.png',
                value: '03', width: 73, height: 38,},
                {src: 'static/extension-assets/Robot4FUN-cBrain-assets/f4_8x16.png',
                value: '04', width: 73, height: 38,},
                {src: 'static/extension-assets/Robot4FUN-cBrain-assets/f5_8x16.png',
                value: '05', width: 73, height: 38,},
                {src: 'static/extension-assets/Robot4FUN-cBrain-assets/f6_8x16.png',
                value: '06', width: 73, height: 38,},
                {src: 'static/extension-assets/Robot4FUN-cBrain-assets/f7_8x16.png',
                value: '07', width: 73, height: 38,},
                {src: 'static/extension-assets/Robot4FUN-cBrain-assets/f8_8x16.png',
                value: '08', width: 73, height: 38,},
                {src: 'static/extension-assets/Robot4FUN-cBrain-assets/f9_8x16.png',
                value: '09', width: 73, height: 38,},
                {src: 'static/extension-assets/Robot4FUN-cBrain-assets/f10_8x16.png',
                value: '10', width: 73, height: 38,},
                {src: 'static/extension-assets/Robot4FUN-cBrain-assets/f11_8x16.png',
                value: '11', width: 73, height: 38,},
                {src: 'static/extension-assets/Robot4FUN-cBrain-assets/f12_8x16.png',
                value: '12', width: 73, height: 38,},
                {src: 'static/extension-assets/Robot4FUN-cBrain-assets/f13_8x16.png',
                value: '13', width: 73, height: 38,},
                {src: 'static/extension-assets/Robot4FUN-cBrain-assets/f14_8x16.png',
                value: '14', width: 73, height: 38,},
                {src: 'static/extension-assets/Robot4FUN-cBrain-assets/f15_8x16.png',
                value: '15', width: 73, height: 38,},
                {src: 'static/extension-assets/Robot4FUN-cBrain-assets/f16_8x16.png',
                value: '16', width: 73, height: 38,},
                {src: 'static/extension-assets/Robot4FUN-cBrain-assets/f17_8x16.png',
                value: '17', width: 73, height: 38,},
                {src: 'static/extension-assets/Robot4FUN-cBrain-assets/f18_8x16.png',
                value: '18', width: 73, height: 38,},
                {src: 'static/extension-assets/Robot4FUN-cBrain-assets/f19_8x16.png',
                value: '19', width: 73, height: 38,},
              ],
              '#icon8list': [
                {src: 'static/extension-assets/Robot4FUN-cBrain-assets/heart8.png',
                    value: '00', width: 93, height: 93,},
                {src: 'static/extension-assets/Robot4FUN-cBrain-assets/smile8.png',
                    value: '01', width: 93, height: 93,},
                {src: 'static/extension-assets/Robot4FUN-cBrain-assets/face8.png',
                    value: '02', width: 93, height: 93,},
                {src: 'static/extension-assets/Robot4FUN-cBrain-assets/sad8.png',
                    value: '03', width: 93, height: 93,},
                {src: 'static/extension-assets/Robot4FUN-cBrain-assets/up8.png',
                    value: '04', width: 93, height: 93,},
                {src: 'static/extension-assets/Robot4FUN-cBrain-assets/down8.png',
                    value: '05', width: 93, height: 93,},
                {src: 'static/extension-assets/Robot4FUN-cBrain-assets/left8.png',
                    value: '06', width: 93, height: 93,},
                {src: 'static/extension-assets/Robot4FUN-cBrain-assets/right8.png',
                    value: '07', width: 93, height: 93,},
                {src: 'static/extension-assets/Robot4FUN-cBrain-assets/o8.png',
                    value: '08', width: 93, height: 93,},
                {src: 'static/extension-assets/Robot4FUN-cBrain-assets/x8.png',
                    value: '09', width: 93, height: 93,},
                {src: 'static/extension-assets/Robot4FUN-cBrain-assets/flower8.png',
                    value: '10', width: 93, height: 93,},
                {src: 'static/extension-assets/Robot4FUN-cBrain-assets/jan8.png',
                    value: '11', width: 93, height: 93,},
                {src: 'static/extension-assets/Robot4FUN-cBrain-assets/jun8.png',
                    value: '12', width: 93, height: 93,},
                {src: 'static/extension-assets/Robot4FUN-cBrain-assets/ji8.png',
                    value: '13', width: 93, height: 93,},
                {src: 'static/extension-assets/Robot4FUN-cBrain-assets/big8.png',
                    value: '14', width: 93, height: 93,},
                {src: 'static/extension-assets/Robot4FUN-cBrain-assets/small8.png',
                    value: '15', width: 93, height: 93,},
              ],
              '#icon5list': [
                      {src: 'static/extension-assets/microbit/happy.png',
                          value: '1', width: 93, height: 93,},
                      {src: 'static/extension-assets/microbit/sad.png',
                          value: '2', width: 93, height: 93,},
                      {src: 'static/extension-assets/microbit/angry.png',
                          value: '3', width: 93, height: 93,},
                      {src: 'static/extension-assets/microbit/surprised.png',
                          value: '4', width: 93, height: 93,},
                      {src: 'static/extension-assets/microbit/confused.png',
                          value: '5', width: 93, height: 93,},
                      {src: 'static/extension-assets/microbit/asleep.png',
                          value: '6', width: 93, height: 93,},
                      {src: 'static/extension-assets/microbit/ghost.png',
                          value: '7', width: 93, height: 93,},
                      {src: 'static/extension-assets/microbit/butterfly.png',
                          value: '8', width: 93, height: 93,},
                      {src: 'static/extension-assets/microbit/cow.png',
                          value: '9', width: 93, height: 93,},
                      {src: 'static/extension-assets/microbit/rabbit.png',
                          value: '10', width: 93, height: 93,},
                      {src: 'static/extension-assets/microbit/duck.png',
                          value: '11', width: 93, height: 93,},
                      {src: 'static/extension-assets/microbit/giraffe.png',
                          value: '12', width: 93, height: 93,},
                      {src: 'static/extension-assets/microbit/chessboard.png',
                          value: '13', width: 93, height: 93,},
                      {src: 'static/extension-assets/microbit/heart.png',
                          value: '14', width: 93, height: 93,},
                      {src: 'static/extension-assets/microbit/diamond.png',
                          value: '15', width: 93, height: 93,},
                      {src: 'static/extension-assets/microbit/quarternote.png',
                          value: '16', width: 93, height: 93,},
                      {src: 'static/extension-assets/microbit/eigthnote.png',
                          value: '17', width: 93, height: 93,},
                      {src: 'static/extension-assets/microbit/pitchfork.png',
                          value: '18', width: 93, height: 93,},
                      {src: 'static/extension-assets/microbit/fabulous.png',
                          value: '19', width: 93, height: 93,},
                      {src: 'static/extension-assets/microbit/house.png',
                          value: '20', width: 93, height: 93,},
                      {src: 'static/extension-assets/microbit/square.png',
                          value: '21', width: 93, height: 93,},
                      {src: 'static/extension-assets/microbit/triangle.png',
                          value: '22', width: 93, height: 93,},
                      {src: 'static/extension-assets/microbit/lefttriangle.png',
                          value: '23', width: 93, height: 93,},
                      {src: 'static/extension-assets/microbit/meh.png',
                          value: '24', width: 93, height: 93,},
                      {src: 'static/extension-assets/microbit/yes.png',
                          value: '25', width: 93, height: 93,},
                      {src: 'static/extension-assets/microbit/no.png',
                          value: '26', width: 93, height: 93,},
                      {src: 'static/extension-assets/microbit/tshirt.png',
                          value: '27', width: 93, height: 93,},
                      {src: 'static/extension-assets/microbit/umbrella.png',
                          value: '28', width: 93, height: 93,},
                      {src: 'static/extension-assets/microbit/rollerskate.png',
                          value: '29', width: 93, height: 93,},
                      {src: 'static/extension-assets/microbit/scissors.png',
                          value: '30', width: 93, height: 93,},
                      {src: 'static/extension-assets/microbit/silly.png',
                          value: '31', width: 93, height: 93,},
                      {src: 'static/extension-assets/microbit/skull.png',
                          value: '32', width: 93, height: 93,},
                      {src: 'static/extension-assets/microbit/smalldiamond.png',
                          value: '33', width: 93, height: 93,},
                      {src: 'static/extension-assets/microbit/smallheart.png',
                          value: '34', width: 93, height: 93,},
                      {src: 'static/extension-assets/microbit/smallsquare.png',
                          value: '35', width: 93, height: 93,},
                      {src: 'static/extension-assets/microbit/snake.png',
                          value: '36', width: 93, height: 93,},
                      {src: 'static/extension-assets/microbit/stickfigure.png',
                          value: '37', width: 93, height: 93,},
                      {src: 'static/extension-assets/microbit/sword.png',
                          value: '38', width: 93, height: 93,},
                      {src: 'static/extension-assets/microbit/target.png',
                          value: '39', width: 93, height: 93,},
                      {src: 'static/extension-assets/microbit/tortoise.png',
                          value: '40', width: 93, height: 93,},
                  ],
            },

            translation_map: {
                'zh-tw': {
                  'lr': {'left':'左邊', 'right':'右邊'},
                  'digitubenumber': '接口[PIN]的數字顯示板顯示[NUM](0~9999)',
                  'digitubeoff': '關閉接口[PIN]的數字顯示板',
                  'matrixPattern': '接口[PIN]的LED面板顯示[MAT]',
                  'matrixFace': '接口[PIN]的LED面板顯示表情[MAT]',
                  'matrixIcon': '接口[PIN]的LED面板[LR]顯示圖示[MAT]',
                  'matrixText': '接口[PIN]的LED面板顯示英數[TEXT]',
                  'matrixClear': '清除接口[PIN]的LED面板',
                  'cMatrixShow': '接口[PIN]的彩色面板開始燈光秀!',
                  'cMatrixPattern': '接口[PIN]的彩色面板以[COLOR]色顯示[MAT]',
                  'cMatrixIcon': '接口[PIN]的彩色面板以[COLOR]色顯示圖示[MAT]',
                  'cMatrixText': '接口[PIN]的彩色面板以[COLOR]色顯示英數[TEXT]',
                  'cMatrixClear': '清除接口[PIN]的彩色面板',
                  'rgbset': '接口[PIN]的彩色燈環共[NUMPIXELS]燈. 第[PIX]燈的顏色設為[COLOR]',
                  //'rgbset': '接口[PIN]的彩色燈條共[NUMPIXELS]燈. 亮度設為[BRIGHT]. 第[PIX]燈的顏色設為[COLOR]',
                  'rgbrefresh': '接口[PIN]的彩燈顯示更新',
                  'rgbclear': '清除接口[PIN]的彩燈設定',
                  'rgboff': '關閉接口[PIN]的所有彩燈',
                  'rgbshow': '接口[PIN]的彩色燈環共[NUMPIXELS]燈. 開始燈光秀!',
                  'rgb2hex': '紅色量:[R], 綠色量:[G], 藍色量:[B](0~255) 轉換至hex值',
                  'rgbreset': '重置所有彩燈設定',
                },
                'zh-cn': {
                  'lr': {'left':'左边', 'right':'右边'},
                  'digitubenumber': '端口[PIN]的数码管显示[NUM](0~9999)',
                  'digitubeoff': '端口[PIN]的数码管关闭',
                  'matrixPattern': '端口[PIN]的LED显示板显示[MAT]',
                  'matrixFace': '端口[PIN]的LED显示板显示表情[MAT]',
                  'matrixIcon': '端口[PIN]的LED显示板[LR]显示图示[MAT]',
                  'matrixText': '端口[PIN]的LED显示板显示英数[TEXT]',
                  'matrixClear': '清除端口[PIN]的LED显示板',
                  //'rgbset': '端口[PIN]的彩色灯条共[NUMPIXELS]灯. 亮度设为[BRIGHT]. 第[PIX]灯的颜色设为[COLOR]',
                  'rgbset': '端口[PIN]的彩色灯环共[NUMPIXELS]灯. 第[PIX]灯的颜色设为[COLOR]',
                  'rgbrefresh': '端口[PIN]的彩灯显示刷新',
                  'rgbclear': '清除端口[PIN]的彩灯设定',
                  'rgboff': '熄灭端口[PIN]的所有彩灯',
                  'rgbshow': '端口[PIN]的彩色灯环共[NUMPIXELS]灯. 开始灯光秀!',
                  'rgb2hex': '红色量:[R], 绿色量:[G], 蓝色量:[B](0~255) 转换至hex值',
                  'rgbreset': '重置所有灯条设定',
                }
            }
        };
    }

    noop (){
        return Promise.reject(formatMessage({
            id: 'kblock.notify.nosupportonlinemode',
            defaultMessage: 'Not support in online mode'
        }));
    }
    /*
    led (args){
        const pin = args.PIN;
        // const onoff = args.VALUE;
        const value = parseInt(args.VALUE, 10);
        board.digitalWrite(pin2firmata(pin), value ? 1 : 0); // inversed due to bug of kblock lib
        // board.digitalWrite(pin2firmata(pin), onoff);
    }

    ledGen (gen, block){
        const pin = gen.valueToCode(block, 'PIN');
        const onoff = gen.valueToCode(block, 'VALUE');
        // return [`digitalWrite(${pin},${onoff});`, gen.ORDER_ATOMIC];
        return gen.line(`digitalWrite(${pin},${onoff})`);
    }

    ledrgbon(args){
        const rpin = 11;
        const gpin = 9;
        const bpin = 10;
        board.analogWrite(board.pin2firmata(rpin), hexToR(args.COLOR));
        board.analogWrite(board.pin2firmata(gpin), hexToG(args.COLOR));
        board.analogWrite(board.pin2firmata(bpin), hexToB(args.COLOR));
    }

    ledrgbonGen (gen, block){
        const rpin = 11;
        const gpin = 9;
        const bpin = 10;
        const rv = hexToR(gen.valueToCode(block, 'COLOR'));
        const gv = hexToG(gen.valueToCode(block, 'COLOR'));
        const bv = hexToB(gen.valueToCode(block, 'COLOR'));
        let code = `   analogWrite(${rpin}, ${rv});
   analogWrite(${gpin}, ${gv});
   analogWrite(${bpin}, ${bv});\n`;
        return code
    }

    ledrgbshow (args){
        const rpin = 11;
        const gpin = 9;
        const bpin = 10;
        board.analogWrite(board.pin2firmata(rpin), random(0, 255));
        board.analogWrite(board.pin2firmata(gpin), random(0, 255));
        board.analogWrite(board.pin2firmata(bpin), random(0, 255));
    }

    ledrgbshow (args){
         // board.on("ready", function() {
        // Create an Led on pin 13
        var led = new five.Led(pin2firmata(args.PIN));
       // Blink every half second
       led.blink(500);
       // });
    }

    ledrgbshowGen (gen, block){
        const rpin = 11;
        const gpin = 9;
        const bpin = 10;
        let code = `   analogWrite(${rpin}, random(0, 255));
   analogWrite(${gpin}, random(0, 255));
   analogWrite(${bpin}, random(0, 255));\n`;
        return code
    }

    ledrgboff(args){
        const rpin = 11;
        const gpin = 9;
        const bpin = 10;
        board.digitalWrite(board.pin2firmata(rpin), 0);
        board.digitalWrite(board.pin2firmata(gpin), 0);
        board.digitalWrite(board.pin2firmata(bpin), 0);
    }

    ledrgboffGen (gen, block){
        const rpin = 11;
        const gpin = 9;
        const bpin = 10;
        let code = `   digitalWrite(${rpin}, 0);
   digitalWrite(${gpin}, 0);
   digitalWrite(${bpin}, 0);\n`;
        return code
    }
    */
    /*
    lcdsetup (args){
        const addr = parseInt(args.ADDR, 16);
        this.lcd = new five.LCD({
            controller: "PCF8574",
            addr: addr
        });
    }

    lcdSetupGen (gen, block){
        gen.includes_['wire'] = '#include <Wire.h>\n';
        gen.includes_['lcd'] = '#include <LiquidCrystal_I2C.h>\n';
        const addr = gen.valueToCode(block, 'ADDR');
        gen.definitions_['lcd'] = `LiquidCrystal_I2C lcd(${addr}, 16, 2);`;
        return `lcd.begin()`;
    }

    lcdprint (args){
        const line = args.LINE;
        this.lcd && this.lcd.print(line)
    }

    lcdprintGen (gen, block){
        return gen.template2code(block, 'lcd.print');
    }

    lcdbl (args){
        const bl = args.BL === 'HIGH' ? 255 : 0;
        this.lcd && this.lcd.backlight(bl);
    }

    lcdblGen (gen, block){
        return gen.template2code(block, 'lcd.setBacklight');
    }

    lcdcursor (args){
        const col = args.COL;
        const row = args.ROW;
        this.lcd && this.lcd.cursor(row, col);
    }

    lcdcursorGen (gen, block){
        return gen.template2code(block, 'lcd.setCursor');
    }

    lcdclear (args){
        this.lcd && this.lcd.clear();
    }

    lcdclearGen (gen, block){
        return gen.template2code(block, 'lcd.clear');
    }*/
    /*
    rgbsetupGen (gen, block){
        gen.includes_['rgb'] = '#include "Adafruit_NeoPixel.h"';
        const pin = gen.valueToCode(block, 'PIN');
        const num = gen.valueToCode(block, 'NUMPIXELS');

        gen.definitions_['rgb_'+pin] = `Adafruit_NeoPixel neopix_${pin}(${num}, ${pin});`;
        return `neopix_${pin}.begin();`;
    }*/
    ws2812maxPattern(args){
      const pin = board.pin2firmata(args.PIN);
      //const pat = args.MAX;

      console.log("MATRIX data is",args.MAT);
      console.log("COLOR data is",args.COLOR);
    }

    ws2812maxPatternGen (gen, block){
      const pin = board.pin2firmata(gen.valueToCode(block, 'PIN'));
      const pat = gen.valueToCode(block, 'MAT');
      console.log("pat is",pat);//竟然是空的??
      const color = cutHex(gen.valueToCode(block, 'COLOR'));
      console.log("COLOR data is",color);
      //const color = gen.hexToRgb(gen.valueToCode(block, 'COLOR'));
      gen.includes_['rgbmatrix'] = `#include "Adafruit_NeoMatrix.h"`;
      gen.definitions_['rgbmatrix_'+pin] = `
Adafruit_NeoMatrix RGBmatrix${pin} = Adafruit_NeoMatrix(5, 5, ${pin},
  NEO_MATRIX_TOP     + NEO_MATRIX_LEFT +
  NEO_MATRIX_COLUMNS + NEO_MATRIX_ZIGZAG,
  NEO_GRB            + NEO_KHZ800);
`;
      gen.setupCodes_['begin_'+pin] = `RGBmatrix${pin}.begin();
//RGBmatrix${pin}.setFont(&Arimo_Bold5pt7b);
//RGBmatrix${pin}.setTextWrap(false);
//RGBmatrix${pin}.setTextSize(1);
//RGBmatrix${pin}.setRotation(0);
RGBmatrix${pin}.setBrightness(40);
//RGBmatrix${pin}.setTextColor(colors[0]);
`;

      return gen.line(`RGBmatrix${pin}.drawBitmap(0,0,${pat},5,5,${color})`) +
        gen.line(`RGBmatrix${pin}.show()`);
    }

    ws2812maxIcon(args){
      const pin = board.pin2firmata(args.PIN);
      //const pat = args.MAX;

      console.log("MATRIX data is",args.MAT);
      console.log("COLOR data is",args.COLOR);
    }

    ws2812maxTextGen(gen,block){
      const pin = board.pin2firmata(gen.valueToCode(block, 'PIN'));
      const text = gen.valueToCode(block, 'TEXT');
      const color = gen.hexToRgb(gen.valueToCode(block, 'COLOR'));
      gen.includes_['rgbmatrix'] = `#include <Adafruit_NeoPixel.h>
#include <Adafruit_GFX.h>
#include "Adafruit_NeoMatrix.h"
#include "arimo-bold5pt7b.h"`;
      gen.definitions_['rgbmatrix_'+pin] = `
Adafruit_NeoMatrix RGBmatrix${pin} = Adafruit_NeoMatrix(5, 5, ${pin},
  NEO_MATRIX_TOP     + NEO_MATRIX_LEFT +
  NEO_MATRIX_COLUMNS + NEO_MATRIX_ZIGZAG,
  NEO_GRB            + NEO_KHZ800);

const uint16_t colors[] = {
  RGBmatrix${pin}.Color(255, 0, 0), RGBmatrix${pin}.Color(0, 255, 0), RGBmatrix${pin}.Color(0, 0, 255)
};

void display_scrollText_${pin}(char *s, uint16_t ms){
  static uint8_t c_index = 0;

  for (int8_t x=7; x>=-42; x--) {
      if (c_index > 2) c_index = 0;
      RGBmatrix${pin}.clear();
  	  RGBmatrix${pin}.setCursor(x,0);
	    RGBmatrix${pin}.setTextColor(colors[c_index]);
	    RGBmatrix${pin}.print(s);
  	  RGBmatrix${pin}.show();
      c_index++;
      delay(ms);
  }
}`;
      gen.setupCodes_['begin_'+pin] = `RGBmatrix${pin}.begin();
  //RGBmatrix${pin}.setFont(&Arimo_Bold5pt7b);
  RGBmatrix${pin}.setTextWrap(false);
  RGBmatrix${pin}.setTextSize(1);
  RGBmatrix${pin}.setRotation(0);
  RGBmatrix${pin}.setBrightness(40);
  //RGBmatrix${pin}.setTextColor(RGBmatrix${pin}.Color(${color.r}, ${color.g}, ${color.b}));
  //RGBmatrix${pin}.setTextColor(colors[0]);
`;

      return gen.line(`display_scrollText_${pin}(${text},150)`);
    }

    async ws2812show(args){
      //const pin = board.pin2firmata(args.PIN);
      const pin = board.pin2firmata(board._port[parseInt(args.PIN)-1][2]);
      const num = parseInt(args.NUMPIXELS, 10);
      if (num <= 0) {
        vm.emit('showAlert', {msg: 'Wrong pixel number defined'});
        return;
      }
      //if (this.strips[pin]) console.log("befor call new,  this.strip=", this.strips[pin]);
      if (!this.strips[pin] || this.strips[pin].pin != pin){
        this.strips[pin] = new ws2812.Strip({
          pin: pin,
          length: num,
          //board: j5board,
          firmata: board,
          controller: "FIRMATA",
          skip_firmware_check: true,
          gamma: 2.8, // set to a gamma that works nicely for WS2812
        });
        //console.log("after call new Strip, this.strip=", this.strips[pin]);
      }

      //console.log("Strip ready, it's SHOW-TIME!!");
      this.strips[pin].off();
      let showColor = '';
      for (let j = 0; j < this.strips[pin].length; j++) {
        showColor = colorWheel( ( (j+10)*256 / this.strips[pin].length ) & 255 );
        for (let i = 0; i < this.strips[pin].length; i++) {
          this.strips[pin].pixel(i).color(showColor);
          this.strips[pin].show();
          await timeout(100);
        }
      }

      for (let i = 0; i < this.strips[pin].length; i++) {
        showColor = colorWheel( ( (i+10)*256 / this.strips[pin].length ) & 255 );
        this.strips[pin].color(showColor);
        this.strips[pin].show();
        await timeout(500);
      }

      for(let i = 0; i < this.strips[pin].length; i++) {
        showColor = colorWheel( ( (i+10)*256 / this.strips[pin].length ) & 255 );
        this.strips[pin].pixel(i).color(showColor);
      }
      this.strips[pin].show();
      await timeout(1000);
      for (let i = 0; i < this.strips[pin].length*10; i++) {
        this.strips[pin].shift(1, ws2812.FORWARD, true);
        this.strips[pin].show();
        await timeout(100);
      }

      //console.log( 'dynamicRainbow' );
      this.strips[pin].off();
      let cwi = 0; // colour wheel index (current position on colour wheel)
      for (let j=0; j<256*2; j++) {
          if (++cwi > 255) cwi = 0;
          for(let i = 0; i < this.strips[pin].length; i++) {
              showColor = colorWheel( ( cwi+i ) & 255 );
              this.strips[pin].pixel(i).color(showColor);
          }
          this.strips[pin].show();
          await timeout(10);
      }
      this.strips[pin].off();

      // Input a value 0 to 255 to get a color value.
      // The colors are a transition r - g - b - back to r.
      function colorWheel( WheelPos ){
        let r=0,g=0,b=0;
        WheelPos = 255 - WheelPos;

        if ( WheelPos < 85 ) {
            r = 255 - WheelPos * 3;
            g = 0;
            b = WheelPos * 3;
        } else if (WheelPos < 170) {
            WheelPos -= 85;
            r = 0;
            g = WheelPos * 3;
            b = 255 - WheelPos * 3;
        } else {
            WheelPos -= 170;
            r = WheelPos * 3;
            g = 255 - WheelPos * 3;
            b = 0;
        }
        // returns a string with the rgb value to be used as the parameter
        return "rgb(" + r +"," + g + "," + b + ")";
      }

    }

    ws2812showGen (gen, block){
        gen.includes_['rgb'] = '#include <Adafruit_NeoPixel.h>';
        //const pin = board.pin2firmata(gen.valueToCode(block, 'PIN'));
        const pin = board.pin2firmata(board._port[gen.valueToCode(block,'PIN')-1][2]);
        const num = gen.valueToCode(block, 'NUMPIXELS');
        gen.definitions_['rgb_'+pin] = `Adafruit_NeoPixel neopix_${pin}(${num}, ${pin});`;
        gen.setupCodes_['begin_'+pin] = `neopix_${pin}.begin();
  neopix_${pin}.show();   // Initialize all pixels to 'off'`;
        gen.setupCodes_['brightness_'+pin] = `neopix_${pin}.setBrightness(50);`;

        gen.definitions_['show'+pin] = `
void colorWipe${pin}(uint32_t color, int wait) {
    for(int i=0; i<neopix_${pin}.numPixels(); i++) {    // For each pixel in strip...
        neopix_${pin}.setPixelColor(i, color);          //  Set pixel's color (in RAM)
        neopix_${pin}.show();                           //  Update strip to match
        delay(wait);                                    //  Pause for a moment
    }
}

void theaterChase${pin}(uint32_t color, int wait) {
  for(int a=0; a<10; a++) {  // Repeat 10 times...
    for(int b=0; b<3; b++) { //  'b' counts from 0 to 2...
      neopix_${pin}.clear(); //   Set all pixels in RAM to 0 (off)
      // 'c' counts up from 'b' to end of strip in steps of 3...
      for(int c=b; c<neopix_${pin}.numPixels(); c += 3) {
        neopix_${pin}.setPixelColor(c, color); // Set pixel 'c' to value 'color'
      }
      neopix_${pin}.show(); // Update strip with new contents
      delay(wait);  // Pause for a moment
    }
  }
}

void rainbow${pin}(int wait) {
  for(long firstPixelHue = 0; firstPixelHue < 5*65536; firstPixelHue += 256) {
    for(int i=0; i<neopix_${pin}.numPixels(); i++) { // For each pixel in strip...
      int pixelHue = firstPixelHue + (i * 65536L / neopix_${pin}.numPixels());
      neopix_${pin}.setPixelColor(i, neopix_${pin}.gamma32(neopix_${pin}.ColorHSV(pixelHue)));
    }
    neopix_${pin}.show(); // Update strip with new contents
    delay(wait);  // Pause for a moment
  }
}

void theaterChaseRainbow${pin}(int wait) {
  int firstPixelHue = 0;     // First pixel starts at red (hue 0)
  for(int a=0; a<30; a++) {  // Repeat 30 times...
    for(int b=0; b<3; b++) { //  'b' counts from 0 to 2...
      neopix_${pin}.clear();         //   Set all pixels in RAM to 0 (off)
      // 'c' counts up from 'b' to end of strip in increments of 3...
      for(int c=b; c<neopix_${pin}.numPixels(); c += 3) {
        int      hue   = firstPixelHue + c * 65536L / neopix_${pin}.numPixels();
        uint32_t color = neopix_${pin}.gamma32(neopix_${pin}.ColorHSV(hue)); // hue -> RGB
        neopix_${pin}.setPixelColor(c, color); // Set pixel 'c' to value 'color'
      }
      neopix_${pin}.show();        // Update strip with new contents
      delay(wait);                 // Pause for a moment
      firstPixelHue += 65536 / 90; // One cycle of color wheel over 90 frames
    }
  }
}`;

        let code = `
  // Fill along the length of the strip in various colors...
  colorWipe${pin}(neopix_${pin}.Color(255,   0,   0), 50); // Red
  colorWipe${pin}(neopix_${pin}.Color(  0, 255,   0), 50); // Green
  colorWipe${pin}(neopix_${pin}.Color(  0,   0, 255), 50); // Blue

  // Do a theater marquee effect in various colors...
  theaterChase${pin}(neopix_${pin}.Color(127, 127, 127), 50); // White, half brightness
  theaterChase${pin}(neopix_${pin}.Color(127,   0,   0), 50); // Red, half brightness
  theaterChase${pin}(neopix_${pin}.Color(  0,   0, 127), 50); // Blue, half brightness

  rainbow${pin}(10);             // Flowing rainbow cycle along the whole strip
  theaterChaseRainbow${pin}(50); // Rainbow-enhanced theaterChase variant
  `;

        return code;
    }

    ws2812set(args){
      //const pin = board.pin2firmata(args.PIN);
      const pin = board.pin2firmata(board._port[parseInt(args.PIN)-1][2]);
      const num = parseInt(args.NUMPIXELS, 10);
      if (num <= 0) {
        vm.emit('showAlert', {msg: 'Wrong pixel number defined'});
        return;
      }
      //if (this.strips[pin]) console.log("befor call new,  this.strip=", this.strips[pin]);
      if (!this.strips[pin] || this.strips[pin].pin != pin){
        this.strips[pin] = new ws2812.Strip({
          //strips: [ {pin: pin, length: num}, ],
          pin: pin,
          length: num,
          //board: j5board,
          firmata: board,
          controller: "FIRMATA",
          skip_firmware_check: true,
          gamma: 2.8, // set to a gamma that works nicely for WS2812
        });
        //console.log("after call new Strip, this.strip=", this.strips[pin]);
      }
      let pix = parseInt(args.PIX, 10);
      if ( pix > num ) pix = num;
      if ( pix <= 0 ) pix = 1;

      const c = args.COLOR;
      //console.log('c=', c);
      if (typeof c === 'number') { // hex number, without '#'
        this.strips[pin].pixel(parseInt(pix-1)).color('#'+ c.toString(16));
      } else if (typeof c === 'string' && c[0] === '#') { // with # hex string
        this.strips[pin].pixel(parseInt(pix-1)).color(c);
      } else {
        vm.emit('showAlert', {msg: 'wrong input type'});
        return;
      }
    }

    ws2812setGen (gen, block){
        //const pin = board.pin2firmata(gen.valueToCode(block, 'PIN'));
        const pin = board.pin2firmata(board._port[gen.valueToCode(block,'PIN')-1][2]);
        const num = gen.valueToCode(block, 'NUMPIXELS');
        if (num <= 0) {
          vm.emit('showAlert', {msg: 'Wrong pixel number defined'});
        }
        const pix = gen.valueToCode(block, 'PIX');
        const c = gen.valueToCode(block, 'COLOR');
        //console.log('c=', c);
        //const color = gen.hexToRgb(gen.valueToCode(block, 'COLOR')); // #hex String to RGB number array

        gen.includes_['rgb'] = '#include <Adafruit_NeoPixel.h>';
        gen.definitions_['rgb_'+pin] = `Adafruit_NeoPixel neopix_${pin}(${num}, ${pin});`;
        gen.setupCodes_['begin_'+pin] = `neopix_${pin}.begin();
  neopix_${pin}.show();   // Initialize all pixels to 'off'`;
        gen.setupCodes_['brightness_'+pin] = `neopix_${pin}.setBrightness(50);`;

        if (typeof c === 'string' && c[0] === '#'){ // with # hex string
          const color = gen.hexToRgb(gen.valueToCode(block, 'COLOR')); // #hex String to RGB number array
          //console.log('color=', color);
          return gen.line(`neopix_${pin}.setPixelColor(${pix}-1, ${color.r}, ${color.g}, ${color.b})`);
        } else {
          return gen.line(`neopix_${pin}.setPixelColor(${pix}-1, ${c})`);
        }
    }

    ws2812refresh(args){
      //const pin = board.pin2firmata(args.PIN);
      const pin = board.pin2firmata(board._port[parseInt(args.PIN)-1][2]);
      //if (this.strips[pin]) console.log("this.strip already configured as", this.strips[pin]);
      if (!this.strips[pin] || this.strips[pin].pin != pin){
        /*return Promise.reject(formatMessage({
            id: 'cDisplay.notify.rgbrefresh',
            defaultMessage: `Need to config the strip first`,
        }));*/
        return Promise.reject(`Need to config the strip first`);
      }
      //console.log("Start to refresh");
      this.strips[pin].show();
    }

    ws2812refreshGen (gen, block){
        //const pin = board.pin2firmata(gen.valueToCode(block, 'PIN'));
        const pin = board.pin2firmata(board._port[gen.valueToCode(block,'PIN')-1][2]);
        return gen.line(`neopix_${pin}.show()`);
    }

    ws2812off(args){
      //const pin = board.pin2firmata(args.PIN);
      const pin = board.pin2firmata(board._port[parseInt(args.PIN)-1][2]);
      //if (this.strips[pin]) console.log("this.strip already configured as", this.strips[pin]);
      if (!this.strips[pin] || this.strips[pin].pin != pin){
        return Promise.reject(`Need to config the strip first`);
      }
      //console.log("Strip off");
      this.strips[pin].off();
    }

    ws2812clearGen (gen, block){
      //const pin = board.pin2firmata(gen.valueToCode(block, 'PIN'));
      const pin = board.pin2firmata(board._port[gen.valueToCode(block,'PIN')-1][2]);
      return gen.line(`neopix_${pin}.clear()`) + gen.line(`neopix_${pin}.show()`);
    }

    rgb2hex(args){
      return five.Fn.uint24(args.R, args.G, args.B); // RGB2HEX. type:number; without '#'
    }

    rgb2hexGen(gen, block){
      const r = gen.valueToCode(block,'R');
      const g = gen.valueToCode(block,'G');
      const b = gen.valueToCode(block,'B');
      const hex = five.Fn.uint24(r, g, b); // RGB2HEX. type:number; without '#'
      return [`${hex}`, gen.ORDER_ATOMIC];
    }

    ws2812reset(args){
      //console.log("reset all Strips");
      let data = [];
      data.push(PIXEL_COMMAND);
      data.push(PIXEL_RESET);
      //console.log("PIXEL_RESET -> firmata", data); //for debug
      board.sysexCommand(data);

      this.strips = {};
      //console.log("strips{}=", this.strips); //for debug
    }

    /*_add0(num, length) {
        return (Array(length).join('0') + num).slice(-length);
    }*/

    tm1637num (args){
        /*const pin = args.PIN;
        let pinArray = pin.split(",");
        const clk = board.pin2firmata(pinArray[0]);
        const dio = board.pin2firmata(pinArray[1]);*/
        const clk = board.pin2firmata(board._port[parseInt(args.PIN)-1][1]);
        const dio = board.pin2firmata(board._port[parseInt(args.PIN)-1][2]);
        if (!this.digitube[dio] || this.digitube[dio].dio != dio){
          this.digitube[dio] = new tm1637({
            clk: clk,
            dio: dio,
            //board: j5board,
            board: board,
            brightness: 0.7,
          });
        };
        this.digitube[dio].show((Array(4).join('0') + args.NUM).slice(-4));
    }

    tm1637off (args){
        const clk = board.pin2firmata(board._port[parseInt(args.PIN)-1][1]);
        const dio = board.pin2firmata(board._port[parseInt(args.PIN)-1][2]);
        if (!this.digitube[dio] || this.digitube[dio].clk != dio){
          this.digitube[dio] = new tm1637({
            clk: clk,
            dio: dio,
            board: board,
            brightness: 0.7,
          });
        };

        this.digitube[dio].off();
    }

    tm1637numGen (gen, block){
        gen.includes_['digitube'] = '#include "TM1637Display.h"';
        const pin = gen.valueToCode(block, 'PIN');
        const clk = board.pin2firmata(board._port[pin-1][1]);
        const dio = board.pin2firmata(board._port[pin-1][2]);
        gen.definitions_['digitube'+dio] = `TM1637Display digiTube_${dio}(${clk}, ${dio});`;
        gen.setupCodes_['digitube_bright'+dio] = `digiTube_${dio}.setBrightness(5,true)`;
        const num = gen.valueToCode(block, 'NUM');

        return gen.line(`digiTube_${dio}.showNumberDec(${num})`);
    }

    tm1637offGen (gen, block){
        gen.includes_['digitube'] = '#include "TM1637Display.h"';
        const pin = gen.valueToCode(block, 'PIN');
        const clk = board.pin2firmata(board._port[pin-1][1]);
        const dio = board.pin2firmata(board._port[pin-1][2]);
        gen.definitions_['digitube'+dio] = `TM1637Display digiTube_${dio}(${clk}, ${dio});`;

        return gen.line(`digiTube_${dio}.clear()`);
    }

    /*tm16xxGen (gen, block){
        gen.includes_['digitube'] = '#include <TM1640.h>\n' +
               '#include <TM16xxDisplay.h>';

        const pin = gen.valueToCode(block, 'PIN');
        // gen.setupCodes_['digitube_port'] = `Serial.println(${pin})`; // for debug
        let pinArray = pin.split(",");
        const dio = pinArray[0];
        const clk = pinArray[1];

        gen.definitions_['digitube'] = `TM1640 module(${dio}, ${clk});\n` +
              `TM16xxDisplay digiTube(&module, 8);`;

    }

    digitubenumberGen (gen, block){
        return gen.template2code(block, 'digiTube.println');
    }*/

    max72xxPatt (args){
      /*const pin = args.PIN;
      let pinArray = pin.split(",");
      const din = board.pin2firmata(pinArray[2]);
      const cs = board.pin2firmata(pinArray[1]);
      const clk = board.pin2firmata(pinArray[0]);*/
      const din = board.pin2firmata(board._port[parseInt(args.PIN)-1][2]);
      const cs = board.pin2firmata(board._port[parseInt(args.PIN)-1][1]);
      const clk = board.pin2firmata(board._port[parseInt(args.PIN)-1][0]);
      const maxInUse = 2;
      if (!this.matrix[din] || this.matrix[din].data != din){
        this.matrix[din] = new five.Led.Matrix({
           pins: {
              data: din,
              clock: clk,
              cs: cs
           },
           devices: maxInUse // how many mx72xx modules be connected
        });
        this.matrix[din].brightness(10); // 0-100%
      };
      this.matrix[din].on();// need to turn on device first
      //console.log('LEDMATRIX=', typeof args.MAT, args.MAT);
      if (args.MAT.length > 2) {
        let matAryL = [],
            matAryR = [];
        for (let i = 0; i < 8; i++) {
          matAryL[i] = parseInt(args.MAT.substr(i*4,2),16);
          matAryR[i] = parseInt(args.MAT.substr(i*4+2,2),16);
        }
        //console.log('matAryL=',matAryL);
        //console.log('matAryR=',matAryR);
        this.matrix[din].draw(0,matAryR);
        this.matrix[din].draw(1,matAryL);
      } else {
        if (!this.face) {
          this.face = require('./face8x16.js');
        }
          this.matrix[din].draw(0, this.face.EYER[args.MAT]);// EYE are Objects, index is string
          this.matrix[din].draw(1, this.face.EYEL[args.MAT]);// so no need to parseInt(args.MAT)
      }
    }

    max72xxPattGen (gen, block){
        gen.includes_['max72xx'] = '#include "MaxMatrix.h"';
        //gen.includes_['max72xx'] = '#include <LedControl.h>';
        const pin = gen.valueToCode(block, 'PIN');
        const din = board._port[pin-1][2];
        const cs = board._port[pin-1][1];
        const clk = board._port[pin-1][0];
        const maxInUse = 2;
        gen.definitions_['max72xx'+din] = `MaxMatrix m_${din}(${din}, ${cs}, ${clk}, ${maxInUse});`;
        //gen.definitions_['max72xx'+din] = `LedControl m_${din}(${din},${clk},${cs},${maxInUse});`;
        gen.setupCodes_['max72xx'+din] = `m_${din}.init();
  m_${din}.setIntensity(1); //ranges from 0 to 15
  `;
        /*gen.setupCodes_['max72xx'+din] = `m_${din}.shutdown(0,false);
  m_${din}.setIntensity(0,1);
  m_${din}.clearDisplay(0);
  `;*/
        let pat = gen.valueToCode(block, 'MAT');
        //console.log('pat=',typeof pat,pat);
        if (pat.length > 2){
          pat = pat.substr(1,32);
          //console.log('pat=',pat);
          let matAryL = [],
              matAryR = [];
          for (let i = 0; i < 8; i++) {
            matAryL[i] = parseInt(pat.substr(i*4,2),16);
            matAryR[i] = parseInt(pat.substr(i*4+2,2),16);
          }
          //console.log('matAryL=',matAryL);
          //console.log('matAryR=',matAryR);
          gen.definitions_['max72xxpatt'+din] = `uint8_t matAryL[8], matAryR[8];`;
          return `
  //EYEL = {${matAryL}}, // for database building
  //EYER = {${matAryR}},

    matAryL[0] = ${matAryL[0]};
    matAryL[1] = ${matAryL[1]};
    matAryL[2] = ${matAryL[2]};
    matAryL[3] = ${matAryL[3]};
    matAryL[4] = ${matAryL[4]};
    matAryL[5] = ${matAryL[5]};
    matAryL[6] = ${matAryL[6]};
    matAryL[7] = ${matAryL[7]};
    matAryR[0] = ${matAryR[0]};
    matAryR[1] = ${matAryR[1]};
    matAryR[2] = ${matAryR[2]};
    matAryR[3] = ${matAryR[3]};
    matAryR[4] = ${matAryR[4]};
    matAryR[5] = ${matAryR[5]};
    matAryR[6] = ${matAryR[6]};
    matAryR[7] = ${matAryR[7]};

    for (uint8_t i=0; i<8; i++){
      m_${din}.setColumn(i,matAryL[i]);
      m_${din}.setColumn(i+8,matAryR[i]);
    };
`;
        } else {
          gen.includes_['face72xx'] = '#include "face8x16.h"';
          return `
    for (uint8_t i=0; i<8; i++) {
      m_${din}.setColumn(i,EYEL[${pat}][i]);
      m_${din}.setColumn(i+8,EYER[${pat}][i]);
    };
`;
        }
    }

    max72xxIcon (args){
        const din = board.pin2firmata(board._port[parseInt(args.PIN)-1][2]);
        const cs = board.pin2firmata(board._port[parseInt(args.PIN)-1][1]);
        const clk = board.pin2firmata(board._port[parseInt(args.PIN)-1][0]);
        const maxInUse = 2;
        if (!this.matrix[din] || this.matrix[din].data != din){
          this.matrix[din] = new five.Led.Matrix({
             pins: {
                data: din,
                clock: clk,
                cs: cs
             },
             devices: maxInUse
          });
          this.matrix[din].brightness(10); // 0-100%
        };

        if (!this.icon8) {
          this.icon8 = require('./icon8.js');
        }
        this.matrix[din].on();// need to turn on device first
        //console.log('LR=',typeof args.LR,args.LR);
        if (args.LR === 'left') {
          this.matrix[din].draw(1, this.icon8[args.MAT]);
        } else if (args.LR === 'right') {
          this.matrix[din].draw(0, this.icon8[args.MAT]);
        }
    }

    max72xxIconGen (gen, block){
        gen.includes_['max72xx'] = '#include "MaxMatrix.h"';
        //gen.includes_['max72xx'] = '#include <LedControl.h>';
        gen.includes_['icon72xx'] = '#include "icon8.h"';
        const pin = gen.valueToCode(block, 'PIN');
        const din = board._port[pin-1][2];
        const cs = board._port[pin-1][1];
        const clk = board._port[pin-1][0];
        const maxInUse = 2;
        gen.definitions_['max72xx'+din] = `MaxMatrix m_${din}(${din}, ${cs}, ${clk}, ${maxInUse});`;
        //gen.definitions_['max72xx'+din] = `LedControl m_${din}(${din},${clk},${cs},${maxInUse});`;
        gen.setupCodes_['max72xx'+din] = `m_${din}.init();
  m_${din}.setIntensity(1);
  `;
        /*gen.setupCodes_['max72xx'+din] = `m_${din}.shutdown(0,false);
  m_${din}.setIntensity(0,1);
  m_${din}.clearDisplay(0);
  `;*/
        const no = gen.valueToCode(block, 'MAT');
        const lr = gen.valueToCode(block, 'LR');
        //console.log('lr=',typeof lr,lr);
        if (lr === 'left') {
          return gen.line(`for (uint8_t i=0; i<8; i++) { m_${din}.setColumn(i,PAT[${no}][i]); }`);
        } else if (lr === 'right') {
          return gen.line(`for (uint8_t i=0; i<8; i++) { m_${din}.setColumn(i+8,PAT[${no}][i]); }`);
        }
        //return gen.line(`for (uint8_t i=0; i<8; i++) { m_${din}.setRow(0,i,PAT[${no}][i]); })`;
    }

    async max72xxText (args){
        const din = board.pin2firmata(board._port[parseInt(args.PIN)-1][2]);
        const cs = board.pin2firmata(board._port[parseInt(args.PIN)-1][1]);
        const clk = board.pin2firmata(board._port[parseInt(args.PIN)-1][0]);
        const maxInUse = 2;
        if (!this.matrix[din] || this.matrix[din].data != din){
          this.matrix[din] = new five.Led.Matrix({
              pins: {
                 data: din,
                 clock: clk,
                 cs: cs
              },
             devices: maxInUse  // how many mx72xx modules be connected
           });
           this.matrix[din].brightness(10); // 0-100%
        };
        this.matrix[din].on();// need to turn on device first
        //this.matrix[din].draw(0,five.Led.Matrix.CHARS.donut);
        //await timeout(3000);
        //let msg = args.TEXT.split('');
        //console.log('msg=',msg);
        for (let i = 0; i < args.TEXT.length; i++) {
          //let c=msg.shift();
          //console.log('c=',c);
          //this.matrix[din].draw(0,c);
          if (i<args.TEXT.length) {
            this.matrix[din].draw(0,args.TEXT[i]);
          } else this.matrix[din].clear(0);
          if (i>0) this.matrix[din].draw(1,args.TEXT[i-1]);
          await timeout(50);
        }
    }

    max72xxTextGen (gen, block){
        gen.includes_['max72xx'] = '#include "MaxMatrix.h"';
        //gen.includes_['char72xx'] = '#include "CharMatrix8.h"';
        gen.includes_['font72xx'] = '#include "font8.h"';
        const pin = gen.valueToCode(block, 'PIN');
        const din = board._port[pin-1][2];
        const cs = board._port[pin-1][1];
        const clk = board._port[pin-1][0];
        const maxInUse = 2;
        gen.definitions_['max72xx'+din] = `MaxMatrix m_${din}(${din}, ${cs}, ${clk}, ${maxInUse});`;
        //gen.definitions_['max72xxtext'+din] = `byte buffer[8];`;
        gen.definitions_['printStr'+din] = `
void printCharWithShift_${din}(char c, int shift_speed){
  if (c < 32) return;
  c -= 32;

  for (uint8_t i=0; i<8; i++) {m_${din}.setColumn(i+8, CH[c][i]);};
  for (int i=0; i<8; i++){
    delay(shift_speed);
    //m_${din}.shiftLeft(false, false);
    m_${din}.shiftDown(false);
  }
  for (uint8_t i=0; i<8; i++) {m_${din}.setColumn(i, CH[c][i]);};
  for (int i=0; i<8; i++){
    delay(shift_speed);
    m_${din}.shiftDown(false);
  }
}

void printStringWithShift_${din}(char* s, int shift_speed){
  while (*s != 0){
    printCharWithShift_${din}(*s, shift_speed);
    s++;
  }
}
`;

        gen.setupCodes_['max72xx'+din] = `m_${din}.init();
  m_${din}.setIntensity(1); // brightness: 0-15
`;
        const str = gen.valueToCode(block, 'TEXT');
        return gen.line(`printStringWithShift_${din}(${str}, 50)`);

    }

    max72xxClear (args){
      const din = board.pin2firmata(board._port[parseInt(args.PIN)-1][2]);
      const cs = board.pin2firmata(board._port[parseInt(args.PIN)-1][1]);
      const clk = board.pin2firmata(board._port[parseInt(args.PIN)-1][0]);
      const maxInUse = 2;
      if (!this.matrix[din] || this.matrix[din].data != din){
        this.matrix[din] = new five.Led.Matrix({
            pins: {
               data: din,
               clock: clk,
               cs: cs
            },
           devices: maxInUse
         });
      };
      // Clear the entire display for all devices
      // clear() does not shut off the device.
      this.matrix[din].clear();
    }

    max72xxClearGen (gen, block){
      gen.includes_['max72xx'] = '#include "MaxMatrix.h"';
      //gen.includes_['max72xx'] = '#include <LedControl.h>';
      const din = board._port[pin-1][2];
      const cs = board._port[pin-1][1];
      const clk = board._port[pin-1][0];
      const maxInUse = 2;
      gen.definitions_['max72xx'+din] = `MaxMatrix m_${din}(${din}, ${cs}, ${clk}, ${maxInUse});`;
      //gen.definitions_['max72xx'+din] = `LedControl m_${din}(${din},${clk},${cs},${maxInUse});`;

      return gen.line(`m_${din}.clear()`);
      //return gen.line(`m_${din}.clearDisplay(0)`);
    }

    /*i2cledmatrix (args){
        const mat = args.MAT.match(/.{1,16}/g);

        let matBinH = parseInt(mat[0], 16).toString(2);
        matBinH = '0'.repeat(64-matBinH.length) + matBinH;
        let matAry = matBinH.match(/.{1,16}/g); // map to 16x8
        let matBinL = parseInt(mat[1], 16).toString(2);
        matBinL = '0'.repeat(64-matBinL.length) + matBinL;
        matAry = matAry.concat(matBinL.match(/.{1,16}/g));

        if (!this.matrix[din]){
            this.matrix[din] = new five.Led.Matrix({
                addresses: [0x70],
                controller: "HT16K33",
                dims: "8x16",
                rotation: 0
            });
        }
        this.matrix[din].draw(matAry);
    }*/

}

module.exports = cDisplaysExtension;
