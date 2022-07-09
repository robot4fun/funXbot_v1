/**
 * Created by tony on 2019/8/31
 */
const TCS34725_ADDRESS = 0x29;     /**< I2C address **/
const TCS34725_COMMAND_BIT = 0x80; /**< Command bit **/
const TCS34725_ID = 0x12; /**< 0x44 = TCS34721/TCS34725, 0x4D = TCS34723/TCS34727 */
const TCS34725_CMD_Clear_INT = 0x66; /* RGBC Interrupt flag clear */
const TCS34725_ENABLE = 0x00,      /**< Interrupt Enable register */
      TCS34725_ENABLE_AIEN = 0x10, /**< RGBC Interrupt Enable */
      TCS34725_ENABLE_WEN = 0x08, /**< Wait Enable - Writing 1 activates the wait timer */
      TCS34725_ENABLE_AEN = 0x02, /**< RGBC Enable - Writing 1 actives the ADC, 0 disables it */
      TCS34725_ENABLE_PON = 0x01; /**< Power on - Writing 1 activates the internal oscillator, 0 disables it */
const TCS34725_ATIME = 0x01, /**< Integration time */
      TCS34725_CONTROL = 0x0F; /**< Set the gain level for the sensor */
const TCS34725_INTEGRATIONTIME_2_4MS = 0xFF, /**<  2.4ms - 1 cycle    - Max Count: 1024  */
      TCS34725_INTEGRATIONTIME_24MS =  0xF6, /**<  24ms  - 10 cycles  - Max Count: 10240 */
      TCS34725_INTEGRATIONTIME_50MS =  0xEB, /**<  50ms  - 20 cycles  - Max Count: 20480 */
      TCS34725_INTEGRATIONTIME_101MS = 0xD5, /**<  101ms - 42 cycles  - Max Count: 43008 */
      TCS34725_INTEGRATIONTIME_154MS = 0xC0, /**<  154ms - 64 cycles  - Max Count: 65535 */
      TCS34725_INTEGRATIONTIME_700MS = 0x00; /**<  700ms - 256 cycles - Max Count: 65535 */
const TCS34725_GAIN_1X = 0x00,  /**<  No gain  */
      TCS34725_GAIN_4X = 0x01,  /**<  4x gain  */
      TCS34725_GAIN_16X = 0x02, /**<  16x gain */
      TCS34725_GAIN_60X = 0x03;  /**<  60x gain */
const TCS34725_CDATAL = 0x14, /**< Clear channel data low byte */
      TCS34725_CDATAH = 0x15, /**< Clear channel data high byte */
      TCS34725_RDATAL = 0x16, /**< Red channel data low byte */
      TCS34725_RDATAH = 0x17, /**< Red channel data high byte */
      TCS34725_GDATAL = 0x18, /**< Green channel data low byte */
      TCS34725_GDATAH = 0x19, /**< Green channel data high byte */
      TCS34725_BDATAL = 0x1A, /**< Blue channel data low byte */
      TCS34725_BDATAH = 0x1B; /**< Blue channel data high byte */
// Offset and Compensated coefficients for lux calibration
const TCS34725_R_Coef = 0.136,
      TCS34725_G_Coef = 1.000,
      TCS34725_B_Coef = -0.444,
      TCS34725_GA = 1.0,
      TCS34725_DF = 310.0,
      TCS34725_CT_Coef = 3810.0,
      TCS34725_CT_Offset = 1391.0;

async function timeout(ms) {
  await new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

/* @class TCS34725
* @constructor
* @param {firmata.Board} board The board that the TCS is attached to.
*/
class TCS34725 {
    constructor({board, i2cAddr, it, gain}) {
      this._board = board;
      this._i2cAddr = i2cAddr || TCS34725_ADDRESS;
      this._tcs34725IntegrationTime = it || TCS34725_INTEGRATIONTIME_154MS;
      this._tcs34725Gain = gain || TCS34725_GAIN_60X;
      this._tcs34725Initialised = false;
      this.dark = [0,0,0,0];
      this.bright = [65535,65535,65535,65535];
    };

    /*!
     *  @brief  Writes a register and an 8 bit value over I2C
     *  @param  reg
     *  @param  value
     */
    write8(reg, value) {
      this._board.i2cWrite(this._i2cAddr, TCS34725_COMMAND_BIT | reg , value & 0xFF );
    };

    /*!
     *  @brief  Reads an 8 bit value over I2C
     *  @param  reg
     *  @return value
     */
    async read8(reg) {
      /*this._board.i2cReadOnce(this._i2cAddr, TCS34725_COMMAND_BIT | reg, 1, reply => { // receive feedback
            console.log('message from board:', reply);
            return(reply); // 這會回傳回i2cReadOnce, 而不是回傳call read8()的
      });*/

      return new Promise(resolve => {
          this._board.i2cReadOnce(this._i2cAddr, TCS34725_COMMAND_BIT | reg, 1, ret => {
              //console.log('message from board:', ret);
              resolve(ret);
          });
      });
    };

    /*!
     *  @brief  Reads a 16 bit values over I2C
     *  @param  reg
     *  @return value
     */
    async read16(reg) {
      return new Promise(resolve => {
          this._board.i2cReadOnce(this._i2cAddr, TCS34725_COMMAND_BIT | reg, 2, reply => {
              //console.log('data from tcs34725:', reply);
              const d16bits = (reply[1] << 8) | reply[0];
              //console.log('d16bits=', d16bits.toString(2), ', ', d16bits);
              resolve(d16bits);
          });
      });
    };

    /*!
     *  @brief  Enables the device
     */
    async enable() {
      this.write8(TCS34725_ENABLE, TCS34725_ENABLE_PON); // power on
      await timeout(3);
      this.write8(TCS34725_ENABLE, TCS34725_ENABLE_PON | TCS34725_ENABLE_AEN); // start to read cycle
      // Set a delay for the integration time.
      // This is only necessary in the case where enabling and then
      //  immediately trying to read values back. This is because setting
      //  AEN triggers an automatic integration, so if a read RGBC is
      //  performed too quickly, the data is not yet valid and all 0's are
      //  returned
      switch (this._tcs34725IntegrationTime) {
        case TCS34725_INTEGRATIONTIME_2_4MS:
          await timeout(3);
          break;
        case TCS34725_INTEGRATIONTIME_24MS:
          await timeout(24);
          break;
        case TCS34725_INTEGRATIONTIME_50MS:
          await timeout(50);
          break;
        case TCS34725_INTEGRATIONTIME_101MS:
          await timeout(101);
          break;
        case TCS34725_INTEGRATIONTIME_154MS:
          await timeout(154);
          break;
        case TCS34725_INTEGRATIONTIME_700MS:
          await timeout(700);
          break;
      }
    };

    /*!
     *  @brief  Disables the device (putting it in lower power sleep mode)
     */
    disable() {
      // Turn the device off to save power
      const reg = this.read8(TCS34725_ENABLE);
      this.write8(TCS34725_ENABLE, reg & ~(TCS34725_ENABLE_PON | TCS34725_ENABLE_AEN));
    };

    /*!
     *  @brief  Initializes I2C and configures the sensor
     *  @return True if initialization was successful, otherwise false.
     */
    async init() {
      if (!this._tcs34725Initialised) {
        this._board.i2cConfig();
        // Make sure we're actually connected
        const id = await this.read8(TCS34725_ID); // check tcs id
        //console.log('reply for init check..',typeof id, id);
        if ((id == 0x44) || (id == 0x4D)) {
          this._tcs34725Initialised = true;

          // Set default integration time and gain
          this.setIntegrationTime(this._tcs34725IntegrationTime);
          this.setGain(this._tcs34725Gain);

          // Note: by default, the device is in power down mode on bootup
          await this.enable();
          //console.log('initialization done');
        } else {
          vm.emit('showAlert', {msg: 'No TCS34725 found'});
          this._tcs34725Initialised = false;
        }
      }
      return this._tcs34725Initialised;
    };

    /*!
     *  @brief  Sets the integration time for the TC34725
     *  @param  it
     *          Integration Time
     */
    setIntegrationTime(it) {
      if (!this._tcs34725Initialised) this.init();

      // Update the timing register
      this.write8(TCS34725_ATIME, it);

      // Update value placeholders
      this._tcs34725IntegrationTime = it;
    };

    /*!
     *  @brief  Adjusts the gain on the TCS34725
     *  @param  gain
     *          Gain (sensitivity to light)
     */
    setGain(gain) {
      if (!this._tcs34725Initialised) this.init();

      // Update the timing register
      this.write8(TCS34725_CONTROL, gain);

      // Update value placeholders
      this._tcs34725Gain = gain;
    };

    /*!
     *  @brief  Reads the raw red, green, blue and clear channel values
     *  @type {Number}
     *  return an array with [red, green, blue, clear] channel value
     */
    async getRawData() {
      if (!this._tcs34725Initialised) this.init();

      // Set a delay for the integration time. why after not befor?
      switch (this._tcs34725IntegrationTime) {
        case TCS34725_INTEGRATIONTIME_2_4MS:
          await timeout(3);
          break;
        case TCS34725_INTEGRATIONTIME_24MS:
          await timeout(24);
          break;
        case TCS34725_INTEGRATIONTIME_50MS:
          await timeout(50);
          break;
        case TCS34725_INTEGRATIONTIME_101MS:
          await timeout(101);
          break;
        case TCS34725_INTEGRATIONTIME_154MS:
          await timeout(154);
          break;
        case TCS34725_INTEGRATIONTIME_700MS:
          await timeout(700);
          break;
      }

      let rgbc = [];
      rgbc[0] = await this.read16(TCS34725_RDATAL); // red
      rgbc[1] = await this.read16(TCS34725_GDATAL); // green
      rgbc[2] = await this.read16(TCS34725_BDATAL); // blue
      rgbc[3] = await this.read16(TCS34725_CDATAL); // clear
      console.log('rgbc=',rgbc);

      return rgbc;
    };

    /*!
     *  @brief  Read the RGB color detected by the sensor.
     *  @type {Number}
     *  return an array with [red, green, blue] value normalized to 0-255
     */
    async getRGB() {
      let rgb = {};
      const rgbc = await this.getRawData();
      const cf = 1;//(rgbc[3] - this.dark[3]) / (this.bright[3] - this.dark[3]);
      //console.log('cf=',cf);
      // Avoid divide by zero errors ... if clear = 0 return black
      if (rgbc[3] == 0) {
        rgb = {R:0,G:0,B:0};
      } else {
        rgb.R = five.Fn.constrain(Math.round(rgbc[0] / rgbc[3] * 255.0 * cf),0,255);
        rgb.G = five.Fn.constrain(Math.round(rgbc[1] / rgbc[3] * 255.0 * cf),0,255);
        rgb.B = five.Fn.constrain(Math.round(rgbc[2] / rgbc[3] * 255.0 * cf),0,255);
      }

      return rgb;
    };

    async getRGB2() {
      let rgb = {};
      let i,cf = 1;
      const rgbc = await this.getRawData();
      rgb.R = rgbc[0];
      rgb.G = rgbc[1];
      rgb.B = rgbc[2];

      //Limit data range
      if(rgb.R >= rgb.G && rgb.R >= rgb.B){
        i = rgb.R / 255 + 1;
      } else if(rgb.G >= rgb.R && rgb.G >= rgb.B){
        i = rgb.G / 255 + 1;
      } else if(rgb.B >=  rgb.G && rgb.B >= rgb.R){
        i = rgb.B / 255 + 1;
      }
      if(i!=0) {
          rgb.R = (rgb.R) / i;
          rgb.G = (rgb.G) / i;
          rgb.B = (rgb.B) / i;
      }
      console.log('i=',i);
      cf = (rgbc[3] - this.dark[3]) / (this.bright[3] - this.dark[3]);
      console.log('cf=',cf);
      //Amplify data differences
      /*Please don't try to make the data negative,
          unless you don't change the data type*/
      if(rgb.R > 30) rgb.R = rgb.R - 30;
      if(rgb.G > 30) rgb.G = rgb.G - 30;
      if(rgb.B > 30) rgb.B = rgb.B - 30;
      rgb.R = five.Fn.constrain(Math.round(rgb.R * 255 / 225 * cf), 0,255);
      rgb.G = five.Fn.constrain(Math.round(rgb.G * 255 / 225 * cf), 0,255);
      rgb.B = five.Fn.constrain(Math.round(rgb.B * 255 / 225 * cf), 0,255);

      return rgb;
    }

    async getRGB3() {
      let rgb = {};
      const rgbc = await this.getRawData();
      rgb.R = five.Fn.constrain( Math.round(
        (rgbc[0] - this.dark[0]) / (this.bright[0] - this.dark[0]) *255),0,255);
      rgb.G = five.Fn.constrain( Math.round(
        (rgbc[1] - this.dark[1]) / (this.bright[1] - this.dark[1]) *255),0,255);
      rgb.B = five.Fn.constrain( Math.round(
        (rgbc[2] - this.dark[2]) / (this.bright[2] - this.dark[2]) *255),0,255);

      return  rgb;
    }

    /*!
     *  @brief  Converts the raw R/G/B values to lux
     *  @return Lux value
     */
    async getLux(){
      let rgb = {};
      const rgbc = await this.getRawData();
      rgb.R = rgbc[0];
      rgb.G = rgbc[1];
      rgb.B = rgbc[2];
      rgb.C = rgbc[3];
      const lux = (-0.32466 * rgb.R) + (1.57837 * rgb.G) + (-0.73191 * rgb.B);

      return Math.round(lux);
    }

    async getLux2(){
      let rgb = {};
      const rgbc = await this.getRawData();
      rgb.R = rgbc[0];
      rgb.G = rgbc[1];
      rgb.B = rgbc[2];
      rgb.C = rgbc[3];

      const atime_ms = ((256 - this._tcs34725IntegrationTime) * 2.4);
      const ir = ((rgb.R + rgb.G + rgb.B) > rgb.C) ? (rgb.R + rgb.G + rgb.B - rgb.C) / 2 : 0;
      const r_comp = rgb.R - ir;
      const g_comp = rgb.G - ir;
      const b_comp = rgb.B - ir;

      let Gain_temp=1;
      switch (this._tcs34725Gain) {
          case TCS34725_GAIN_1X:
                Gain_temp = 1;
                break;
          case TCS34725_GAIN_4X:
                Gain_temp = 4;
                break;
          case TCS34725_GAIN_16X:
                Gain_temp = 16;
                break;
          case TCS34725_GAIN_60X:
                Gain_temp = 60;
                break;
      }
      const cpl = (atime_ms * Gain_temp) / (TCS34725_GA * TCS34725_DF);

      const lux = (TCS34725_R_Coef * r_comp + TCS34725_G_Coef * g_comp + TCS34725_B_Coef * b_comp) / cpl;

      return Math.round(lux);
    }

    /*!
     *  @brief  Sets inerrupt for TCS34725
     *  @param  i
     *          Interrupt (True/False)
     */
    async setInterrupt(i) {
      let r = await this.read8(TCS34725_ENABLE);
      if (i) {
        r = r | TCS34725_ENABLE_AIEN;
      } else {
        r = r & ~TCS34725_ENABLE_AIEN;
      }
      this.write8(TCS34725_ENABLE, r);
    };

    /*!
     *  @brief  Clears inerrupt for TCS34725
     */
    clearInterrupt() {
      this.write8(TCS34725_CMD_Clear_INT, 0x00);
    };

    /*!
     *  @brief  Sets inerrupt limits
     *  @param  low
     *          Low limit
     *  @param  high
     *          High limit
     */
    setIntLimits(low, high) {
      this.write8(0x04, low & 0xFF);
      this.write8(0x05, low >> 8);
      this.write8(0x06, high & 0xFF);
      this.write8(0x07, high >> 8);
    };

};
module.exports = TCS34725;
