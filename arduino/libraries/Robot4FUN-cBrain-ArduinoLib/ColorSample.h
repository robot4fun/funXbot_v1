// Header file for the ColorMatch application
#include <stdint.h>
// Calibration data
//uint16_t dark[4] = { 0, 0, 0, 0 };
//uint16_t bright[4] = { 65535, 65535, 65535, 65535 };

// Color Table for matching
// it=154ms, gain=60x; 2019/9/24 pm1:30 indoor
uint8_t ct[10][3] =
{
  {62, 56, 48}, 	//BLACK
  {220, 254, 224},	//WHITE
  {203, 58, 58},	  //RED
  {95, 166, 107},	  //GREEN
  {70, 152, 227},	  //BLUE
  {254, 250, 100},	//YELLOW
  {255, 64, 0},	    //ORANGE
  {255, 0, 255},	  //PURPLE
  {0, 255, 255},	  //CYAN
  {88, 62, 47}	  //BROWN 
};
