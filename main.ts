let humidity2 = 0
let temperature2 = 0
KSRobot_IOT.Wifi_setup(
SerialPin.P15,
SerialPin.P8,
"ASUS_chickenhouse",
"0937675615",
KSRobot_IOT.IOT_Config.STATION
)
I2C_LCD1602.LcdInit(32)
let sanding = false
basic.pause(2000)
I2C_LCD1602.ShowString("Temp", 0, 0)
I2C_LCD1602.ShowString("Humi", 0, 1)
basic.forever(function () {
    dht11_dht22.queryData(
    DHTtype.DHT11,
    DigitalPin.P1,
    true,
    false,
    true
    )
    temperature2 = Math.round(dht11_dht22.readData(dataType.temperature))
    humidity2 = Math.round(dht11_dht22.readData(dataType.humidity))
    I2C_LCD1602.ShowNumber(temperature2, 5, 0)
    I2C_LCD1602.ShowNumber(humidity2, 5, 1)
})
basic.forever(function () {
    if (KSRobot_IOT.Wifi_Connection()) {
        if (temperature2 >= 32) {
            if (!(sanding)) {
                sanding = true
                KSRobot_IOT.IFTTT_set(
                "high_temperature",
                "bSwSN95G-LckAmVAGeWx9i",
                convertToText(temperature2),
                convertToText(humidity2)
                )
                sanding = false
                basic.pause(10000)
            }
        }
    }
})
basic.forever(function () {
    if (KSRobot_IOT.Wifi_Connection()) {
        basic.clearScreen()
        basic.pause(3000)
        if (!(sanding)) {
            basic.showIcon(IconNames.Happy)
            sanding = true
            KSRobot_IOT.ThingSpeak_set(
            "XRDUW34V4439F80V",
            temperature2,
            humidity2
            )
            sanding = false
            basic.pause(13000)
        }
    }
})
