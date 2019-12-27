# Reading data from OPC-UA server into Qlik Sense/QlikView

A Server-side Extension (analytical connection) and the respective Load Script to connect to OPC-UA servers and get replys for different NodeIDs.

https://www.linkedin.com/pulse/how-qlik-speaks-iot-standard-opc-ua-christof-schwarz/

This package uses Miralem Drek's <a href="https://github.com/miralemd/qlik-sse">SSE for NodeJS</a> and <a href="https://github.com/RobWunderlich/qcb-qlik-sse">Rob Wunderlich's interpretation</a> of it as a starting point. Rob implemented a "require-all" for multiple functions form the folder "functions", where I am putting just one .js there. You can add many more functions that way. 
To communicate with OPC-UA servers, I reused this git https://github.com/node-opcua/node-opcua where I learned how to write a OPC-UA client within a few lines.

## How to install

Qlik Sense Server for Windows

 * unzip this git project in a new folder 
 * go to 


