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
  console.log('+++++++++++++++++++++++++++++++++++++functionGetCustomerReceipt v2.1');
  
  res.set('Access-Control-Allow-Origin', '*');
  
  var query = url.parse(req.url,true).query;
  var company = query['co'];
  var store =  query['st'];
  var table =  query['ta'];
  var collection = 'collection-'+company+'-'+store;
  var showTip = true;
  var status = query['status'];
  var tipAmount = Number(query['tipAmt']);
  if (tipAmount != null)
    tipAmount = tipAmount.toFixed(2);
  console.log(query);
  //console.log(collection); 
  //var data;
  var item, price;
  payResult = 'not set';

  // READ
  co(function*() {
    console.log('start read');
    
    function payFunction() {
      this.payResult = 'APPR';
      this.status = 'APPR';
      console.log('APPROVED');
    };
    
    const client = yield mongodb.MongoClient.connect(uri);
    const docs = yield client.db('testdb').collection(collection).findOne({ "table": table });
    //data = docs;
    console.log(docs);
    var id = docs['_id'];
    console.log(id);
    var date = docs['datetime'];
    console.log(date);
    var subtotal = Number(docs['subtotal']).toFixed(2);
    var tax = Number(docs['tax']).toFixed(2);
    var total = Number(docs['total']).toFixed(2);
    var items = docs['items'];
    console.log(items);

htmlText = '	<div class="overflow-auto" style="min-width: 800px">';
htmlText += '		<div class="well col-xs-10 col-sm-10 col-md-6 col-xs-offset-1 col-sm-offset-1 col-md-offset-3" style="width:100%; margin:0; padding:25px;">';
htmlText += '			<div class="row">';
htmlText += '				<div class="col-xs-6 col-sm-6 col-md-6">';
htmlText += '					<address>';
htmlText += '						<p>';
htmlText += '							<strong>NCR Cafe</strong>';
htmlText += '							<br>2135 Sunset Blvd<br>Los Angeles, CA 90026<br>Phone: (213) 484-6829';
htmlText += '						</p>';
htmlText += '					</address>';
htmlText += '				</div>';
htmlText += '				<div class="col-xs-6 col-sm-6 col-md-6 text-right">';
htmlText += '					<p>';
htmlText += '						<em>Date: '+date+'</em>';
htmlText += '					</p>';
htmlText += '					<p>';
htmlText += '						<em>Receipt #: '+id+'</em>';
htmlText += '					</p>';
htmlText += '					<p>';
htmlText += '						<em>Table: '+table+'</em>';
htmlText += '					</p>';
htmlText += '				</div>';
htmlText += '			</div>';
htmlText += '			<div class="row">';
htmlText += '				<div class="text-center">';
htmlText += '					<h1>Receipt</h1>';
htmlText += '				</div>';
htmlText += '				<table class="table table-hover">';
htmlText += '					<thead>';
htmlText += '						<tr>';
htmlText += '							<th>Item</th>';
htmlText += '							<th class="text-right">Price</th>';
htmlText += '						</tr>';
htmlText += '					</thead>';
htmlText += '					<tbody>';
    
    items.forEach(function(entry) {
      //console.log(entry);
      htmlText += '<tr><td class="col-md-4"><em>'+entry['item']+'</em></td>';
      htmlText += '<td class="col-md-1 text-right">$'+entry['price']+'</td></tr>';
    });
  
htmlText += '						<tr>';
htmlText += '							<td class="text-right">';
htmlText += '								<p>';
htmlText += '									<strong>Subtotal: </strong>';
htmlText += '								</p>';
htmlText += '								<p>';
htmlText += '									<strong>Tax: </strong>';
htmlText += '								</p>';
htmlText += '							</td>';
htmlText += '							<td class="col-md-1 text-right">';
htmlText += '								<p>';
htmlText += '									<strong>$'+subtotal+'</strong>';
htmlText += '								</p>';
htmlText += '								<p>';
htmlText += '									<strong>$'+tax+'</strong>';
htmlText += '								</p>';
htmlText += '							</td>';
htmlText += '						</tr>';
   if (showTip == true)
   {
      htmlText += '						<tr>';
      htmlText += '							<td class="text-right">';
     
     if (status != 'paid')
     {
      htmlText += ' 							<input class="tipButton" type="submit" value="Tip 15%" id="tip15" onclick="tip(0.15);">';
      htmlText += '   							<input class="tipButton" type="submit" value="Tip 18%" id="tip18" onclick="tip(0.18);">';
      htmlText += '     						<input class="tipButton" type="submit" value="Tip 20%" id="tip20" onclick="tip(0.20);">';
     }
      htmlText += '								<label style="font-size:30px;"><h2>';
      htmlText += '									<strong>Tip: </strong>';
      htmlText += '								</h2></label>';
      htmlText += '							</td>';
      htmlText += '							<td class="col-md-1 text-right">';
      htmlText += '								<h2>';
     
     if (status != 'paid')
        htmlText += '									<input id="tip" type="number" style="width:100px; text-align: right;" />';
     else 
        htmlText += '									$' + tipAmount;
     
      htmlText += '								</h2>';
      htmlText += '							</td>';
      htmlText += '						</tr>';
   }
htmlText += '						<tr>';
htmlText += '							<td class="text-right">';
htmlText += '								<h2>';
htmlText += '									<strong>Total: </strong>';
htmlText += '								</h2>';
htmlText += '							</td>';
htmlText += '							<td class="col-md-1 text-right text-danger">';
htmlText += '								<h2>';
htmlText += '									<strong id="total">$'+total+'</strong>';
htmlText += '								</h2>';
htmlText += '							</td>';
htmlText += '						</tr>';
htmlText += '					</tbody>';
htmlText += '				</table>';
    if (status != 'paid')
    {
      htmlText += '					<button type="button" class="btn btn-success btn-lg btn-block" onclick="payFunction()">';
      htmlText += '						Pay Now<span class="glyphicon glyphicon-chevron-right">';
      htmlText += '						</span>';
      htmlText += '					</button>';
    }
htmlText += '			</div>';
htmlText += '		</div>';
htmlText += '	</div>';
   if (status == 'paid')
     htmlText += '<div id="overlay"></div>';
  
  res.send(htmlText);
  }).catch(error => {
    console.log('Error: ' + error.toString());
    //res.send('Error: ' + error.toString());
  });
  console.log('after read');
};