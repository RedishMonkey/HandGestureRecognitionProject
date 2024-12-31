#include <WiFi.h>
#include <HTTPClient.h>

// wifi credentials
const char* ssid = "hello";
const char* password = "12345678";

int lastTime = 0;
int currTime = 0; 

void setup() {
  // put your setup code here, to run once:
  Serial.begin(115200);

  // connect to wifi:
  Serial.println("connecting to wifi...");
  WiFi.begin(ssid, password);

  while(WiFi.status() != WL_CONNECTED)
  {
    delay(1000);
    Serial.print(".");
  }
  Serial.print("\nconnected to wifi!!!!");
  Serial.print("\nip-address: ");
  Serial.print(WiFi.localIP());
}

void loop() {
  // put your main code here, to run repeatedly:
  currTime= millis();
  int timePassed = currTime - lastTime;

  if(timePassed >= 1000)
  {
    Serial.println(1);
    lastTime = currTime;
    Serial.print(timePassed);
    Serial.print('\n');
  }
  

}
