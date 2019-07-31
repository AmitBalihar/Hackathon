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

exports.functionGetReceipt = (req, res) => {
  console.log('functionGetReceipt v2.0');
  
  res.set('Access-Control-Allow-Origin', '*');
  
  var query = url.parse(req.url,true).query;
  var company = query['co'];
  var store =  query['st'];
  var table =  query['ta'];
  var collection = 'collection-'+company+'-'+store;
  console.log(query);
  console.log(collection);  

  // READ
  co(function*() {
    const client = yield mongodb.MongoClient.connect(uri);
    const docs = yield client.db('testdb').collection(collection).findOne({ "table": table });
    res.send(JSON.stringify(docs));
  }).catch(error => {
    res.send('Error: ' + error.toString());
    //mongodb.MongoClient.close();
  });
  //client.db('testdb').close();
  
};

