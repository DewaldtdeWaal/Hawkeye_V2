var MongoClient = require('mongodb').MongoClient;
var num = 0


 //////////////////////////////////////////////////localhost Connection String
 var mbusIP;
 var standardConnectionString;
 var MongooseConnectionString;
 var ChattymbusIP;
if(num==0)
{
  mbusIP = '192.168.2'
  standardConnectionString = "mongodb://localhost:27017"
  MongooseConnectionString = "mongodb://localhost:27017/HawkEye"
  ChattymbusIP ="127.1.1";

}
 ///////////////////////////////////////////////////Cloud
else if(num ==1)
{
  standardConnectionString = "mongodb://admin:M%40CAutomation1@192.168.177.133/?authMechanism=DEFAULT"
  MongooseConnectionString = "mongodb://admin:M%40CAutomation1@192.168.177.133:27017/HawkEye?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false"
  mbusIP= "127.1.1"
  ChattymbusIP="127.1.1";

}

var globalMongoClient = new MongoClient(standardConnectionString, { useNewUrlParser: true, socketTimeoutMS: 1000 })
module.exports={mbusIP,standardConnectionString,MongooseConnectionString, globalMongoClient}
//Serves as a basic template for all future sites.




var runDriver