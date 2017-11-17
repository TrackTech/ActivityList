var http = require('http');
var HttpDispatcher = require('httpdispatcher');
var MongoClient = require('mongodb').MongoClient;
var StringDecoder = require('string_decoder').StringDecoder;
var dal = require('./dal'); //.js not required here
var allowedDomain = 'http://my.activity.com'; 

function handleRequest(request,response){
	var dburl = 'mongodb://localhost:27017/Activity';
	var postData=[];
	request.on('data',(chunk)=>{
		console.log('in data event');
		postData.push(chunk); 		
	}).on('end',function(){			
	});
	var requestServed=false;
	if(request.url.startsWith('/data')){		
		requestServed = true;
	var responseCode='500';
	
	response.setHeader('Access-Control-Allow-Origin',allowedDomain); //as it is on a different port
		if(request.url=='/data/activitylist'){
			var retVal = dal.findDocs(dburl,function(retVal){
			if(retVal.error){
				response.writeHead(retVal.responseCode);	//response.setHeader('Retry-After',5); there is not much support for this header , except with googlebot					
				response.end();
			}
			else{
				console.log('consuming data');
				response.writeHead(retVal.responseCode,{'Content-Type':'application/json'});
				response.write(retVal.data);			
				response.end();
			}},'T_ACTIVITY_LIST',{}
			);		
		}
		if(request.url=='/data/activity'){
			var method = request.method;	
			if(method=='POST'){
				console.log('POST an activity');	
				dal.insertDoc(dburl,postData,function(retVal){
					response.writeHead(retVal.responseCode);	//cannot simply include content type.					
					response.end();				
				});					
			}
		}
	}

	if(request.url.startsWith('/lookup')){
		requestServed=true;
		var tok = request.url.split('/');
		var lookupToken = tok[2];		
		console.log('fetching lookup data');
		//var searchQuery = {activitystatus:{$exists:true}};
		var searchQuery = {};
		searchQuery[lookupToken]= {$exists:true};
		var retVal = dal.findDocs(dburl,function(retVal){
		if(retVal.error){
			response.writeHead(retVal.responseCode);	//response.setHeader('Retry-After',5); there is not much support for this header , except with googlebot					
			response.end();
		}
		else{				
			response.writeHead(retVal.responseCode,{'Content-Type':'application/json'});
			response.write(retVal.data);			
			response.end();
			}
		},'T_LOOKUP',searchQuery);
		
	}
	if(!requestServed)
	{

			response.writeHead('404',{'Content-Type':'application/json'});	
			response.end();
	}
}

http.createServer(handleRequest).listen(1237,'127.0.0.1');

console.log('server is running with MongoClient');
