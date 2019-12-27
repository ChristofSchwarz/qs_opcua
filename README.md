# Reading data from OPC-UA server into Qlik Sense/QlikView

A Server-side Extension (analytical connection) and the respective Load Script to connect to OPC-UA servers and get replys for different NodeIDs.

https://www.linkedin.com/pulse/how-qlik-speaks-iot-standard-opc-ua-christof-schwarz/

This package uses Miralem Drek's <a href="https://github.com/miralemd/qlik-sse">SSE for NodeJS</a> and <a href="https://github.com/RobWunderlich/qcb-qlik-sse">Rob Wunderlich's interpretation</a> of it as a starting point. Rob implemented a "require-all" for multiple functions form the folder "functions", where I am putting just one .js there. You can add many more functions that way. 
To communicate with OPC-UA servers, I reused this git https://github.com/node-opcua/node-opcua where I learned how to write a OPC-UA client within a few lines.

## How to install

### Qlik Sense Server for Windows

 * Make sure you have NodeJS and npm (which part of NodeJS). Check with "npm version" and "node --version"
 * unzip this git project in a new folder 
 * start a Powershell or Command Prompt and navigate to this new folder. run
```
npm install --save
```
 * this will download lots of depending modules into a subfolder node_modules
 * go to QMC and into section "Analytical connections" and enter the following: 
 !["screenshot"](https://github.com/ChristofSchwarz/pics/raw/master/2019-12-27%2012_22_03-qmi-qs-sn%20%5BRunning%5D%20-%20Oracle%20VM%20VirtualBox.png)
 * you can run the NodeJS app once with command 
```
node index.js
```
 * or you can install the index.js as a Windows service, which will start automatically ... to do so, run
```
node install_as_service.js
```
 * run "node uninstall_as_service.js" to remove the service again. 
 
## How to load data from an app

 * copy/paste <a href="loadscript.txt">this code snippet</a> into your app's load script
 * Create a temp folder connection in your load script and adjust the 1st line, where variable vLocalCacheFile is defined. This should point to your temp folder connection, for example LET vLocalCacheFile = 'lib://tmp (qmi-qs-sn_vagrant)/opcua-data.txt';
 * Adjust the "INLINE" table ... LOAD * INLINE \[%QueryOPC | %Param ... with the OPC-UA server addresses and Nodes to pick data from. All other columns are optional and help structure the results, add meaningful dimensions for the later App GUI
 
