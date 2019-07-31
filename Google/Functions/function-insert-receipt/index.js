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

const uri = 'mongodb+srv://user1:user123@cluster0-1gzqx.gcp.mongodb.net';

exports.functionInsertReceipt = (req, res) => {
  console.log('++++++++++++++++++++++functionInsertReceipt v2.0');
  
  var query = url.parse(req.url,true).query;
  var company = query['co'];
  var store =  query['st'];
  //var dateTime =  query['dateTime']; // this should go in rcpt
  var receipt =  query['rcpt'];
  //var table =  query['ta'];
  var receiptObj = JSON.parse(receipt);
  var table = receiptObj.table;
  //var table = receipt['table'];
  var collection = 'collection-'+company+'-'+store;
  console.log(table);
  console.log(query);
  console.log(collection);
  console.log(receipt);
  
  // WRITE
  co(function*() {
    const client = yield mongodb.MongoClient.connect(uri);
    // first remove existing receipt for this table
    const docDelete = yield client.db('testdb').collection(collection).remove({ "table": table });
    
	//var receiptObj = JSON.parse(receipt);
    const docs = yield client.db('testdb').collection(collection).insert(receiptObj);
    res.send(JSON.stringify(docs));
  }).catch(error => {
    res.send('Error: ' + error.toString());
  });

};
