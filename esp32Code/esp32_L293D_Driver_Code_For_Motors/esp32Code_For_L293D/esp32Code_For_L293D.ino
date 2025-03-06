// Define motor control pins
const int motorPin1 = 5;  // L293D Pin 2 (IN1)
const int motorPin2 = 18; // L293D Pin 7 (IN2)

void setup() {
  Serial.begin(115200);
  // Initialize motor control pins as outputs
  pinMode(motorPin1, OUTPUT);
  pinMode(motorPin2, OUTPUT);

  // Start the motor in the STOP state
  stopMotor();
}

void loop() {
  // Move motor forward
  forward();
  delay(2000); // Run forward for 2 seconds

  // Move motor backward
  backward();
  delay(2000); // Run backward for 2 seconds

  // Stop the motor
  stopMotor();
  delay(2000); // Stop for 2 seconds
}

void forward() {
  digitalWrite(motorPin1, HIGH); // IN1 HIGH
  digitalWrite(motorPin2, LOW);  // IN2 LOW
}

void backward() {
  digitalWrite(motorPin1, LOW);  // IN1 LOW
  digitalWrite(motorPin2, HIGH); // IN2 HIGH
}

void stopMotor() {
  digitalWrite(motorPin1, LOW); // IN1 LOW
  digitalWrite(motorPin2, LOW); // IN2 LOW
}
