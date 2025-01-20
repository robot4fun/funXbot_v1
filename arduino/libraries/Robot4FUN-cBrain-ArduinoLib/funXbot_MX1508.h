#ifndef funXbot_MX1508_h
#define funXbot_MX1508_h

#include "Arduino.h"

typedef enum
{
  FAST_DECAY  = 0,  // set non-PWM pin low
  SLOW_DECAY = 1    // set non-PWM pin high
} DecayMode;

typedef enum
{
  PWM_1PIN  = 1,
  PWM_2PIN  = 2
} NumOfPwmPins;

class funXbotMX1508 {
  public:
    funXbotMX1508(uint8_t pinIN1, uint8_t pinIN2); // default fast decay, 2 pwm pins
    funXbotMX1508(uint8_t pinIN1, uint8_t pinIN2, DecayMode decayMode, NumOfPwmPins numPWM);
    void motorGo(int16_t pwmVal); //
    void setResolution(uint16_t resolution); // pwm resolotion < 32768 will be fine
    int16_t getPWM();
    void stopMotor();
    void analogWrite16(uint8_t pin, uint16_t val);
    void setPWM16(uint8_t prescaler, uint16_t resolution);
  private:
    uint8_t _pinIN1;
    uint8_t _pinIN2;
    bool _useAnalogWrite16 = false;
    int16_t _pwmVal;
    uint16_t _pwmResolution = 255;   //max resolution of pwm, default is 255.
    DecayMode _whichMode;
    NumOfPwmPins _numPwmPins;
};

#endif
