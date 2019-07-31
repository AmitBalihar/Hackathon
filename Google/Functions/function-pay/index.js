/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */

const co = require('co');
const mongodb = require('mongodb');
var ObjectId = require('mongodb').ObjectID;
var http = require('http');
var url = require('url');
var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
var btoa = require('btoa');
var atob = require('atob');

const uri = 'mongodb+srv://user1:user123@cluster0-1gzqx.gcp.mongodb.net';

  var query;
  var company;
  var store;
  var table;
  var totalAmt;
  var tipAmt;
  var collection;

exports.functionPay = (req, res) => {
  console.log('+++++++++++++++++++++++++++++++++++++functionPay v3.0');
  //let message = req.query.message || req.body.message || 'Processing...';
  //res.status(200).send(message);
  //res.send('Processing...');
    console.log('start pay function');

  
  query = url.parse(req.url,true).query;
  company = query['co'];
  store =  query['st'];
  table =  query['ta'];
  totalAmt =  query['totalAmt'];
  tipAmt =  query['tipAmt'];
  collection = 'collection-'+company+'-'+store;
  console.log(table);
  console.log(query);
  console.log(collection);
  console.log(totalAmt);
  
  //var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
	var xhttp = new XMLHttpRequest();
	xhttp.open("POST", "http://glenncuevas-eval-test.apigee.net/processor", true);
	xhttp.setRequestHeader("Content-Type", "text/xml");
	xhttp.setRequestHeader("SOAPAction", "http://servereps.mtxeps.com/TransactionService/SendTransaction");
	//xhttp.setRequestHeader("Content-Length", "588");
	//xhttp.setRequestHeader("Connection", "keep-alive");
	//xhttp.setRequestHeader("Accept-Encoding", "gzip, deflate");
	//console.log(XMLHttpRequest.DONE);
	xhttp.onreadystatechange = function() { // Call a function when the state changes.
		//console.log('onreadystatechange');
		//console.log(this.status);
		//console.log(this.readyState);
		if (this.readyState === 4 && this.status === 200) {
			// Request finished. Do processing here.
			console.log('request finished');
			console.log(this.status);
			console.log(this.responseText);
		
          // TODO: verify from seps response	
          var status = "paid";
          //var totalAmt = "99.99"; 
  
  // update db        

  
  // WRITE
  co(function*() {
    console.log('PAY write function');
    const client = yield mongodb.MongoClient.connect(uri);
	var myQuery = { table: table };
    var newValue = { $set: {status: 'paid', total: totalAmt, tip: tipAmt}}; //TODO: don't hardcode paid
//    var newValue = { $set: {status: "paid"}};
    const docs = yield client.db('testdb').collection(collection).updateOne(myQuery, newValue);
    // TODO: reload receipt page
    //res.send(JSON.stringify(docs));
    //res.status(200).send(message);
    //res.send('Processing...');
    return res.redirect('http://glenncuevas-eval-test.apigee.net/receipt?co='+company+'&st='+store+'&ta='+table+'&totalAmt='+totalAmt+'&tipAmt='+tipAmt+'&status=paid');
  }).catch(error => {
    res.send('Error: ' + error.toString());
  });
          
     }
  }           
 
  // TODO: use totalAmt & tipAmt in message
  console.log('before send');	
    var bodyText = '<?xml version="1.0"?>';
	bodyText += '<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><SOAP-ENV:Body><SendTransaction xmlns="http://servereps.mtxeps.com/"><request>';

    var newAmt = totalAmt.replace('.', ''); 
    newAmt = ("0000" + newAmt).slice(-4); // ensure amount length is 4 so I don't have to deal with setting MTX msg length byte
    //var myDate = new Date();
    //var myTime = d.getTime();
    //console.log(myTime);
  
  var time = new Date();
  var hour = time.getHours();
  var minute = time.getMinutes();
  var second = time.getSeconds();
  var date =  time.getFullYear() + ((time.getMonth().toString().length > 1) ? (time.getMonth() + 1) : ('0' + (time.getMonth() + 1))) + ((time.getDate().toString().length > 1) ? time.getDate() : ('0' + time.getDate()));
  var myTime = date;
  myTime += ((hour < 10) ? '0' : '') + hour;
  myTime += ((minute < 10) ? '0' : '') + minute;
  myTime += ((second < 10) ? '0' : '') + second;
  console.log(myTime);
  
  var stan = Math.round(time.getTime() / 1000).toString().slice(-6);
  console.log(stan);
  
    var B64E; // = 'TVRYYAAyVEFhMTIzMTIzHEFiMRxBYzAwMDIwMRxBZDIwMTkwNjI0MTQyOTE2HEFlMTAwMDAwHEJkNTEwNTEwNTEwNTEwNTEwMBxCZTIyMDMcQmZNHERhMTk5NRxHYTEcR2ZIHE5jNw==';
  	var B64D = 'MTX`\u00002TAa123123Ab1Ac000201Ad'+myTime+'Ae'+stan+'Bd5105105105105100Be2203BfMDa'+newAmt+'Ga1GfHNc7'; //atob(B64E);  //for now ensure amount is 4 digits long
    console.log(B64D);
  
// replace old amount with new amount
//var newAmt = +totalAmt * 100; // get rid of decimal point
/*
var s = B64D; //'MTX` 2TAa123123Ab1Ac000201Ad'+myDate+'Ae100000Bd5105105105105100Be2203BfMDa1995Ga1GfHNc7';
//console.log(s);
var n = s.indexOf('\x1CDa');
console.log(n);
var s2 = s.substring(n+3, n+10);
n = s2.indexOf('\x1C');
var oldAmt = s2.substring(0, n);
  console.log(oldAmt);
  console.log(newAmt);
s = s.replace('\x1CDa'+oldAmt, '\x1CDa'+newAmt);
console.log(s);  
*/   
  B64E = btoa(B64D);
  
   console.log(B64E);
  
    bodyText += B64E;
    bodyText += '</request><timeout>40</timeout><clientActivationKey>{47D1A2D3-CCD1-4835-A7C5-C69C905F4143}</clientActivationKey></SendTransaction></SOAP-ENV:Body></SOAP-ENV:Envelope>';
	xhttp.send(bodyText); 
    console.log('after send');	  
  
  
  //res.status(200).send(message);
          

};
