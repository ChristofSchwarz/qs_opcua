const debuggingInfoConsole = true; // set to true/false for more/less console logging
const q = require('qlik-sse');
const depromisify = require('depromisify').depromisify;
const XML_stringify = require('jsontoxml');

// with node-opcua@0.4.1
var node_opcua_1 = require("node-opcua");
var connectionStrategy = {
    initialDelay: 1000,
    maxRetry: 1
};
var opcOptions = {
    applicationName: "MyClient",
    connectionStrategy: connectionStrategy,
    securityMode: node_opcua_1.MessageSecurityMode.None,
    securityPolicy: node_opcua_1.SecurityPolicy.None,
    endpoint_must_exist: false
};

const functionConfig = {
  name: 'OPCUA_Read',
  functionType: q.sse.FunctionType.SCALAR,
  returnType: q.sse.DataType.STRING,
  params: [
    {
      name: 'str1',
      dataType: q.sse.DataType.STRING,
    }
  ]
}

function console_log (arg) {
  if (debuggingInfoConsole) console.log(arg);
}

/**
 * Reverses the characters in a string.
 * @function OPCUA_Read
 * @param {string} str1
 * @returns {string}   
 * @example
 * Reverse('Hello World')  // returns 'dlroW olleH'
 */
  const functionDefinition = function OPCUA_Read(request) {
    request.on('data', function(bundle) {
      try {
        // bundle.rows[] ... is the array sent by Qlik via the Server-side Extension
        // rows[] ... is the response array into which we will push data below
        var rows = [];
        var client;
        var session;
        var result;
        var opcServer;
        bundle.rows.forEach(function(row) {
          if (row.duals[0].strData.indexOf('://') > 0) {
            // this row has a server urn, like opc.tcp://opcuaserver.com:48010
            if (opcServer) {
              // previous client and session is still open. Close it now
              console_log('Closing connection to ' + opcServer);
              depromisify(session.close());
              depromisify(client.disconnect());                    
            }
            opcServer = row.duals[0].strData;
            console_log('Opening connection to ' + opcServer);
            client = node_opcua_1.OPCUAClient.create(opcOptions);
            depromisify(client.connect(opcServer));
            session = depromisify(client.createSession()); // wait for session to be created
            result = {server: opcServer}; // set the server as response key
            if (client.endpoint) { // if more info is found in client.endpoint.server, add it
              if (client.endpoint.server) {
                result = {...JSON.parse(JSON.stringify(client.endpoint.server)), ...result}
              }
            }
          } else {
            // this row has a NodeID
            var nodeId = row.duals[0].strData;
            result = depromisify(session.readVariableValue(nodeId));
            // stringifying and parsing the result removes schema entries and returns a simpler result
            result = JSON.parse(JSON.stringify(result)); 
            //result.server = opcServer;
            //result.nodeid = nodeId;
            console_log(result);
          }
		  // send back 3 columns, the response object stringified as XML, the opcServer and nodeId
          rows.push({
             //duals: [{ strData: JSON.stringify(result) }]
             duals: [{ strData: XML_stringify(result) }, { strData: opcServer}, {strData: nodeId}]
           });
        });
        console_log('Closing connection to ' + opcServer);
        depromisify(session.close());
        depromisify(client.disconnect());
        request.write({
          rows
        });
       }
       catch (error) {
         console.log(error)
       }      
    });
  }

module.exports = {
  functionDefinition,
  functionConfig
};
