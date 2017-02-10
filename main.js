var http = require('http');
var HttpDispatcher = require('httpdispatcher');
var MongoClient = require('mongodb').MongoClient;
function handleRequest(request,response){
	if(request.url=='/'){
	console.log('i handled request');
	//response.write('response has been received');
	var url = 'mongodb://localhost:27017/Activity';
	response.setHeader('Access-Control-Allow-Origin','http://my.site.com'); //as it is on a different port
	response.writeHead(200,{'Content-Type':'application/json'});
	
	MongoClient.connect(url,function(err,db){
			console.log('in mongo connect 2');
		//	response.writeHead(200,{'Content-Type':'application/json'});
		//	response.writeHeader('Access-Control-Allow-Origin','*');
			findDocuments(db,function(data){
				console.log('call back has been executed');
				response.write(data);
				db.close();
				response.end();
			});
			
	}); 
}
	console.log(request.url);	
}
http.createServer(handleRequest).listen(1237,'127.0.0.1');

var findDocuments = function(db,cback){
	var collection = db.collection('T_ACTIVITY_LIST');	;
	collection.find({}).toArray(function(err,docs){		
		cback(JSON.stringify(docs));
		});
} 

console.log('server is running with MongoClient');
