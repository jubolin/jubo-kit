## 设备接入
* IoT启动时加载所有的驱动程序，以设备的AboutData为唯一标识驱动程序
* 设备接入WiFi时，IoT接收设备通告的AboutData，通过AboutData查找并加载对应的驱动程序
* IoT export驱动提供的方法，方法名为location + service + property + method
* IoT定义vdev，并定义vdev的属性和方法，属性与方法是一一对应关系
* 设备驱动程序以vdev的方法名为key，具体功能实现为value，构建一个方法字典
