/**
 * Created by tony on 2019/8/31
 */
const DHT_MESSAGE = 0x74;

/* @class Dht
* @constructor
* @param {firmata.Board} board The board that the DHT is attached to.
* @param {Integer} pin The pin that the DHT is connected to.
*/
class dHT {
  constructor(opts) {
    this._type = 'DHT11';
    this._board = opts.board;
    //this._pin = opts.pin;
    this._humidity = null;
    this._temperature = null;
    this._messageHandler = this.onMessage.bind(this);
    this._board.on('error', this.stopRead.bind(this));
  };

  /** Return the humidity , temperature.
    * @type {Number}: dHT.humidity; dHT.temperature
    * @readOnly
    */
  get humidity() {
      if (this._humidity != null) {
        return this._humidity;
      }
  };

  get temperature() {
      if (this._temperature != null) {
        return this._temperature;
      }
  };

  /**
   * Start reading data from sensor.
   * @method: dHT.read()
   */
  read(pin){
    this.stopRead();
    this._pin = pin;
    let data   = [];
    data.push(DHT_MESSAGE);
    data.push(this._pin);
    //console.log("DHT Command -> firmata..", data); //for debug
    this._board.sysexCommand(data); //send command to MCU

    this._board.sysexResponse(DHT_MESSAGE, this._messageHandler); //receive data from board
  };

  stopRead() {
    this._board.clearSysexResponse(DHT_MESSAGE);
  };

  // decode message from MCU
  onMessage(message) {

    function decode(data) {
      const decoded = [];

      if (data.length % 2 !== 0) {
        throw new Error("Firmata.decode(data) called with odd number of data bytes");
      }

      while (data.length) {
        const lsb = data.shift();
        const msb = data.shift();
        decoded.push(lsb | (msb << 7));
      }

      return decoded;
    }

      //console.log('dHT message=', message); //for debug
      let data = decode(message);
      //console.log('decoded data=', data); //for debug
      // data[0]=pin; data[1]=humidity; data[2]=temperature;
      if (data[0] === this._pin) {
        this._humidity = data[1];
        this._temperature = data[2];
        //console.log('_humidity=', this._humidity); //for debug
        //console.log('_temperature=', this._temperature); //for debug
      }
  };

};

module.exports = dHT;
