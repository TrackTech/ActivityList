var http = require('http');
var HttpDispatcher = require('httpdispatcher');
var MongoClient = require('mongodb').MongoClient;
var allowedDomain = 'http://my.activity.com'; 

function handleRequest(request,response){
	if(request.url.startsWith('/data')){
	console.log('i handled request');
	console.log(request.method);
	var responseCode='500';
	var url = 'mongodb://localhost:27017/Activity';
	response.setHeader('Access-Control-Allow-Origin',allowedDomain); //as it is on a different port
	//response.writeHead(200,{'Content-Type':'application/json'});
	if(request.url=='/data/activitylist'){
		MongoClient.connect(url,function(err,db){
				console.log('fetching list of activity');
				responseCode='200';
				response.writeHead(200,{'Content-Type':'application/json'});
			//	response.writeHeader('Access-Control-Allow-Origin','*');
				findDocuments(db,function(data){
					console.log('call back has been executed, list sent');
					response.write(data);
					console.log(data);
					db.close();
					response.end();
				});			
		}); 
	}
	if(request.url=='/data/activity'){
		var method = request.method;
		/*swith(method)
		{
			case 'GET':
					console.log('GET an activity');

				break; 
			case 'POST':
				console.log('POST an activity');
					MongoClient.connect(url,function(err,db){
						responseCode='200';
						findDocuments(db,function(data){
						console.log('call back has been executed, activity posted');
						response.write(data);
						db.close();					
					});	
				});

				break;				
		}*/
		if(method=='POST'){
			console.log('POST an activity');
			MongoClient.connect(url,function(err,db){
					
					response.writeHead(200,{'Content-Type':'application/json'});
					insertDocument(db,function(data){
					console.log('call back has been executed, activity posted');
					//response.redirect('/');
					response.end();
					db.close();					
				});	
			});
		}
	}
}
else{
		console.log(request.url);
		//responseCode = '404';
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

var insertDocument = function(db,cback){
	var collection = db.collection('T_ACTIVITY_LIST');	
	collection.insert({activity:"running 2",location:"gym",notes:"test run",targetdate:"02/01/2017",status:"on going"});	
	cback(true);
}

console.log('server is running with MongoClient');
