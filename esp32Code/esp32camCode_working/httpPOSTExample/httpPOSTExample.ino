#include <WiFi.h>
#include <WebServer.h>
#include <HTTPClient.h>


// WebServer instance on port 80
WebServer server(80);

// HTML form for Wi-Fi configuration
const char* configPage = R"rawliteral(
<!DOCTYPE html>
<html>
  <head>
    <title>Wi-Fi Setup</title>
  </head>
  <body>
    <h1>Wi-Fi Configuration</h1>
    <form action="/configure" method="post">
      <label for="ssid">SSID:</label><br>
      <input type="text" id="ssid" name="ssid"><br><br>
      <label for="password">Password:</label><br>
      <input type="password" id="password" name="password"><br><br>
      <input type="submit" value="Submit">
    </form>
  </body>
</html>
)rawliteral";

const char* domain = "http://192.168.1.141:8000";
const char* sendImagePath = "/send-image";
const char* fullURL = "http://192.168.1.141:8000/send-image";
unsigned long lastTime = 0;

void setup() {
  Serial.begin(115200);

  delay(1000);
  // Start the ESP32 in AP mode
  WiFi.softAP("ESP32_Config", "12345678");
  Serial.println("Access Point started:");
  Serial.println("SSID: ESP32_Config");
  Serial.println("Password: 12345678");

  // Print the IP of the AP
  Serial.print("AP IP address: ");
  Serial.println(WiFi.softAPIP());
  Serial.println(fullURL);
  // Define the route for serving the configuration page
  server.on("/", HTTP_GET, []() {
    server.send(200, "text/html", configPage);
  });

  // Define the route to handle form submissions
  server.on("/configure", HTTP_POST, []() {
    String ssid = server.arg("ssid");
    String password = server.arg("password");

    // checks if ssid and password were given
    if (!ssid.isEmpty() && !password.isEmpty()) {
      server.send(200, "text/plain", "Attempting to connect to Wi-Fi... Check the Serial Monitor for updates.");
      
      WiFi.begin(ssid.c_str(), password.c_str());

      Serial.print("Connecting to Wi-Fi: ");
      Serial.println(ssid);

      // trying to connect to wifi for 30 seconds
      int timeout = 30; // 30 seconds timeout
      while (WiFi.status() != WL_CONNECTED && timeout > 0) {
        delay(1000);
        Serial.print(".");
        timeout--;
      }

      // checks if successfully connected to wifi
      if (WiFi.status() == WL_CONNECTED) {
        Serial.println("\nConnected to Wi-Fi!");
        Serial.print("IP Address: ");
        Serial.println(WiFi.localIP());
        WiFi.softAPdisconnect(true); // Turn off the AP
      } else {
        Serial.println("\nFailed to connect to Wi-Fi.");
      }
    } else {
      server.send(400, "text/plain", "Invalid SSID or Password.");
    }
  });

  // Start the server
  server.begin();
  Serial.println("Web server started. Connect to 'ESP32_   Config' and visit http://192.168.4.1");
}

void loop() {
  server.handleClient(); // Handle incoming client requests

  // http requests
  if(WiFi.status() == WL_CONNECTED){
    
    if(millis()-lastTime > 1000)
    {
      lastTime = millis();
      Serial.println("trying post img req");

      HTTPClient http;
      http.begin(fullURL);

      // adds a header that says in what format the body will be sent in
      http.addHeader("Content-Type", "application/json");

      // the request body
      const char* jsonStr = R"rawliteral({
"imageId":1,
"data":2
})rawliteral";

      Serial.println(jsonStr);


      int resCode  = http.POST(jsonStr);

      if(resCode > 0)
      {
        Serial.println("http msg sent");
        Serial.println("res code:" + String(resCode));
        Serial.println(http.getString());
        delay(10000);
      }
      else{
        Serial.println("error in http req");
      }
      

      http.end();
    }
  }
}
