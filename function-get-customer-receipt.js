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

exports.functionGetCustomerReceipt = (req, res) => {
  console.log('functionGetCustomerReceipt v2.0');
  
  var query = url.parse(req.url,true).query;
  var company = query['co'];
  var store =  query['st'];
  var table =  query['ta'];
  var collection = 'collection-'+company+'-'+store;
  console.log(query);
  //console.log(collection); 
  //var data;
  var item, price;
  
  // READ
  co(function*() {
    console.log('start read');
    const client = yield mongodb.MongoClient.connect(uri);
    const docs = yield client.db('testdb').collection(collection).findOne({ "table": table });
    //data = docs;
    console.log(docs);
    var id = docs['_id'];
    console.log(id);
    var date = docs['dateTime'];
    console.log(date);
    var subtotal = docs['subtotal'];
    var tax = docs['tax'];
    var total = docs['total'];
//    console.log(docs['items'][0]);
//    console.log(docs['items'][0]['item']);
//	console.log(docs['items'][0]['price']);
    var items = docs['items'];
    //item = docs['items'][0]['item'];
	//price = docs['items'][0]['price'];    
    console.log(items);
	//console.log(price);
    
    //console.log(docs.items[0]);
    //res.send(JSON.stringify(docs));
    //console.log('end read');

  
  //console.log('after read');
  //console.log(data.items[0]);
  //console.log(item);
  //console.log(price);  

  //htmlText = "&lt;head&gt;HEY THERE!&lt;/head&gt;&lt;body&gt;JASON&lt;/body&gt;";	
  htmlText = '<!DOCTYPE html><html lang="en" class=""><head><link href="//netdna.bootstrapcdn.com/bootstrap/3.0.0/css/bootstrap.min.css" rel="stylesheet" id="bootstrap-css"><script src="//netdna.bootstrapcdn.com/bootstrap/3.0.0/js/bootstrap.min.js"></script><script src="//code.jquery.com/jquery-1.11.1.min.js"></script></head>';
  //htmlText += '<body><h1>header</h1><br>';
  
  htmlText += '<div class="container overflow-auto" style="min-width: 800px">';//<div class="row">';
  htmlText += '<div class="well col-xs-10 col-sm-10 col-md-6 col-xs-offset-1 col-sm-offset-1 col-md-offset-3"><div class="row">';
  
  htmlText += '<div class="col-xs-6 col-sm-6 col-md-6"><address><strong>NCR Cafe</strong><br>2135 Sunset Blvd<br>Los Angeles, CA 90026<br>Phone: (213) 484-6829</address></div>';
  htmlText += '<div class="col-xs-6 col-sm-6 col-md-6 text-right"><p><em>Date: '+date+'</em></p><p><em>Receipt #: '+id+'</em></p><p><em>Table: '+table+'</em></p></div></div>';
  
  htmlText += '<div class="row"><div class="text-center"><h1>Receipt</h1></div></span>';
  htmlText += '<table class="table table-hover"><thead><tr><th>Item</th>';
  htmlText += '<th class="text-right">Price</th>';
  htmlText += '</tr></thead>';
  htmlText += '<tbody>';
  
  items.forEach(function(entry) {
    //console.log(entry);
    htmlText += '<tr><td class="col-md-4"><em>'+entry['item']+'</em></td>';
    htmlText += '<td class="col-md-1 text-right">$'+entry['price']+'</td></tr>';
  });
  
  htmlText += '<tr><td class="text-right"><p><strong>Subtotal: </strong></p><p><strong>Tax: </strong></p></td><td class="text-center"><p><strong>$'+subtotal+'</strong></p><p><strong>$'+tax+'</strong></p></td>';
  htmlText += '</tr><tr><td class="text-right"><h4><strong>Total: </strong></h4></td><td class="text-center text-danger"><h4><strong>$'+total+'</strong></h4></td></tr></tbody></table>';
  htmlText += '<a href="http://www.ncr.com">';
  htmlText += '<button type="button" class="btn btn-success btn-lg btn-block">Pay Now<span class="glyphicon glyphicon-chevron-right"></span></button>';
  htmlText += '</a></td></div></div></div></div>';
  
  htmlText += '</body>';
  
  res.send(htmlText);
  }).catch(error => {
    console.log('Error: ' + error.toString());
    //res.send('Error: ' + error.toString());
  });
  console.log('after read');
};