var http = require('http');
var HttpDispatcher = require('httpdispatcher');
var MongoClient = require('mongodb').MongoClient;
var StringDecoder = require('string_decoder').StringDecoder;

var allowedDomain = 'http://my.activity.com'; 

function handleRequest(request,response){
	//console.log(request.body);
	var postData=[];
	request.on('data',(chunk)=>{
		//console.log(chunk);
		console.log('in data event');
		postData.push(chunk); 
		console.log(typeof(chunk));
	}).on('end',function(){
		var decoder = new StringDecoder();
		//console.log('here is data ' + Buffer.concat(postData));
		//console.log('here is data ' + Buffer.concat(postData).toString());
		decoder.write( Buffer.concat(postData));
		// debugger;	does not break
		//console.log(decoder[activity]); error 
		console.log(' Utf8 (default) decoder -- ' + decoder); //[OBJECT OBJECT] result
		var decoder2 = new StringDecoder('base64');
		decoder2.write(Buffer.concat(postData));
		console.log('  decoder2 -- ' + decoder2); //[OBJECT OBJECT] RESULT
		console.log(' Utf8 (default) decoder.tostring -- ' + decoder.toString()); //[OBJECT OBJECT] result
		console.log('  decoder2.toString -- ' + decoder2.toString()); //[OBJECT OBJECT] result
		//console.log(' Utf8 (default) JSONS.tostringfy decoder -- ' + JSON.tostringfy(decoder)); //ERROR
		//console.log(' Utf8 (default) JSON.tostringfy decoder2.toString -- ' + JSON.tostringfy(decoder2)); //ERROR
		console.log(' Utf8 (default) decoder -- ' + Object.getOwnPropertyNames(decoder).sort()); //[OBJECT OBJECT] result
		console.log('  decoder2 -- ' + Object.getOwnPropertyNames(decoder2).sort()); //[OBJECT OBJECT] result

		console.log('  decoder2 -- ' + decoder2.encoding); //[OBJECT OBJECT] result

		decoder = new StringDecoder();
		console.log(decoder.write(postData));
		decoder2 = new StringDecoder('base64');
		console.log(decoder2.write(postData));

		
		if(this.method=="post"){
			response.end();
		}
	});
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
					//console.log(data);
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
					insertDocument(db,postData,function(data){
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

var insertDocument = function(db,postData,cback){
	var collection = db.collection('T_ACTIVITY_LIST');	
	collection.insert({activity:"running 2",location:"gym",notes:"test run",targetdate:"02/01/2017",status:"on going"});	
	cback(true);
}

console.log('server is running with MongoClient');
