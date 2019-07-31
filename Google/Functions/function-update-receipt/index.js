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

exports.functionUpdateReceipt = (req, res) => {
  console.log('functionUpdateReceipt');
  
  var query = url.parse(req.url,true).query;
  var company = query['co'];
  var store =  query['st'];
  var table =  query['ta'];
  var status =  query['status'];
  var collection = 'collection-'+company+'-'+store;
  console.log(table);
  console.log(query);
  console.log(collection);
  console.log(status);
  
  // WRITE
  co(function*() {
    const client = yield mongodb.MongoClient.connect(uri);
	var myQuery = { table: table };
    var newValue = { $set: {status: status}};
    const docs = yield client.db('testdb').collection(collection).updateOne(myQuery, newValue);
    res.send(JSON.stringify(docs));
  }).catch(error => {
    res.send('Error: ' + error.toString());
  });

};
