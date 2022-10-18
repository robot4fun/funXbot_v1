
#include <Arduino.h>
#include <QTRSensors.h>

#include "MX1508.h"

int bu;
int D;
int baseSp;
int motorOffset;
int preErr;
int crossCnt;
int P;
int I;
int Kp;
int Ki;
int Kd;
int PID;
int mSpeedL;
int mSpeedR;
int isCross;
int rawL;
int rawR;
int dTime;
int preTime;
int j;
int Lmax;
int Lmin;
int Rmax;
int Rmin;

QTRSensors qtr;

#define qtrCount 2
uint16_t qtrValues[qtrCount];


void motorBridge(int in1, int in2, int speed){
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
}
MX1508 motor7(9,10);
MX1508 motor6(5,6);
void cal_QTR(){
  qtr.resetCalibration();
  j = 0;
  while(!(j>1000)){;
    qtr.calibrate();
    j += 1;
  }
  Serial.println(String("Lmax_qtr") + String("=") + String(qtr.calibrationOn.maximum[0]));
  Serial.println(String("Lmin_qtr") + String("=") + String(qtr.calibrationOn.minimum[0]));
  Serial.println(String("Rmax_qtr") + String("=") + String(qtr.calibrationOn.maximum[1]));
  Serial.println(String("Rmin_qtr") + String("=") + String(qtr.calibrationOn.minimum[1]));

}


void read_ir(){
  Lmax = 0;
  Lmin = 1023;
  Rmax = 0;
  Rmin = 1023;
  j = 0;
  while(!(j>10000)){;
    qtr.read(qtrValues);
    rawL = qtrValues[0];
    rawR = qtrValues[1];
    Serial.println(String("L") + String("=") + String(rawL));
    Serial.println(String("R") + String("=") + String(rawR));
    if(rawL>Lmax){;
      Lmax = rawL;
    }
    if(rawR>Rmax){;
      Rmax = rawR;
    }
    if(rawL<Lmin){;
      Lmin = rawL;
    }
    if(rawR<Rmin){;
      Rmin = rawR;
    }
    j += 1;
  }
  Serial.println(String("Lmax") + String("=") + String(Lmax));
  Serial.println(String("Lmin") + String("=") + String(Lmin));
  Serial.println(String("Rmax") + String("=") + String(Rmax));
  Serial.println(String("Rmin") + String("=") + String(Rmin));

}


void resetBot(){
  baseSp = 255;
  motorOffset = -10;
  //when  baseSp=255,  motorOffset=-10, Kp=43.
  Kp = map(analogRead(A0),0,1023,0,100);
  Ki = 0;
  //when baseSp=255, mOffset=-10, Kp=43 -> Kd=23
  Kd = 0;
  preErr = 0;
  preTime = millis();

}


void move(int mL, int mR){
  motor7.motorGo((1*mL));
  motor6.motorGo((-1*mR));

}


void motor_control(){
  mSpeedL = (((baseSp+motorOffset)-(abs(PID)))+PID);
  mSpeedR = ((baseSp-(abs(PID)))-PID);
  if(mSpeedL<0){;
    mSpeedL = 0;
  }
  if(mSpeedR<0){;
    mSpeedR = 0;
  }

}


void pid_cal(){
  P = (rawL-rawR);
  dTime = (millis()-preTime);
  I = ((0.666*I)+(P*dTime));
  D = ((P-preErr)/(dTime/1000));
  PID = ((Kp*P)+((Ki*I)+(Kd*D)));
  preErr = P;
  preTime = (preTime+dTime);

}


void setup(){
  qtr.setTypeAnalog();
  qtr.setSensorPins((const uint8_t[]){A4,A5,2,3,11,12,A2,A3}, qtrCount);
  pinMode(A1,INPUT);
  Serial.begin(115200);
  pinMode(A0,INPUT);
  bu = 2;

}

void loop(){
  if(analogRead(A1)<250){;
    delay(0.5*1000);
    bu += 1;
    resetBot();
    cal_QTR();
  }

}
