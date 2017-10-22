var http = require('http');
var HttpDispatcher = require('httpdispatcher');
var MongoClient = require('mongodb').MongoClient;
var StringDecoder = require('string_decoder').StringDecoder;

var allowedDomain = 'http://my.activity.com'; 

function handleRequest(request,response){
	var postData=[];
	request.on('data',(chunk)=>{
		console.log('in data event');
		postData.push(chunk); 		
	}).on('end',function(){			
	});
	if(request.url.startsWith('/data')){
	var responseCode='500';
	var url = 'mongodb://localhost:27017/Activity';
	response.setHeader('Access-Control-Allow-Origin',allowedDomain); //as it is on a different port
	if(request.url=='/data/activitylist'){
		MongoClient.connect(url,function(err,db){
				console.log('fetching list of activity');
				if(err){
						//response.setHeader('Retry-After',5);
						response.writeHead(503);						
						response.end();	
						return;
					}
				responseCode='200';
				response.writeHead(200,{'Content-Type':'application/json'});
				findDocuments(db,function(data){
					console.log('call back has been executed, list sent');
					response.write(data);
					db.close();
					response.end();
				});			
		}); 
	}
	if(request.url=='/data/activity'){
		var method = request.method;	
		if(method=='POST'){
			console.log('POST an activity');			
			MongoClient.connect(url,function(err,db){
					if(err){
						//response.setHeader('Retry-After',5);
						response.writeHead(503);			
						response.end();
						return;	
					}
					response.writeHead(200); //cannot simply include content type.			
					insertDocument(db,postData,function(data){
					console.log('call back has been executed, activity posted');					
					response.end();
					db.close();					
				});	
			});
		}
	}
}
else{		
		response.writeHead('404',{'Content-Type':'application/json'});	
		response.end();
	}
}

http.createServer(handleRequest).listen(1237,'127.0.0.1');

var findDocuments = function(db,cback){
	var collection = db.collection('T_ACTIVITY_LIST');	
	collection.find({}).toArray(function(err,docs){		
		cback(JSON.stringify(docs));
		});
} 

var insertDocument = function(db,postData,cback){
	var collection = db.collection('T_ACTIVITY_LIST');	
	var jsonData;
	var dataToUpload={};
	
	jsonData = JSON.parse(postData);

	jsonData.forEach(function(element){
		dataToUpload[element.name] = element.value;
		//console.log(element);
	});
	collection.insert(dataToUpload);
	cback(true);
}

console.log('server is running with MongoClient');
