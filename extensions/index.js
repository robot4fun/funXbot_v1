let express = require("express");
let app = express();

var port = process.env.PORT || 3000;

console.log('dir ', __dirname);
app.use('/IoT', express.static(__dirname + '/s3ext-iot-general/index.js'));

var server = app.listen(port);
server.setTimeout(1000);
console.log('Kittenbot Backend start on ' + port);


