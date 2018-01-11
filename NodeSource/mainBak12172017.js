var http = require('http');
var HttpDispatcher = require('httpdispatcher');
var MongoClient = require('mongodb').MongoClient;
var StringDecoder = require('string_decoder').StringDecoder;
var dal = require('./dal'); //.js not required here
var cryp = require('./crypto');
var allowedDomain = 'http://my.activity.com'; 

function handleRequest(request,response){
	var dburl = 'mongodb://localhost:27017/Activity';
	var postData=[];
	request.on('data',(chunk)=>{
		//console.log('in data event');
		postData.push(chunk); 		
	}).on('end',function(){
		postData = Buffer.concat(postData).toString();
		console.log("end event data --" + postData);			
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
				dal.insertDoc(dburl,'T_ACTIVITY_LIST',postData,function(retVal){
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
			response.writeHead(retVal.responseCode,{'Content-Type':'application/json','Cache-Control':'public,max-age=300'});			
			response.write(retVal.data);			
			response.end();
			}
		},'T_LOOKUP',searchQuery);
		
	}
	if(request.url=='/auth/token'){ //only post come here, get is blocked at nginx level
		requestServed=true;
		response.writeHead(302,{'Location':'index.html'}); //validate and send 302 
		response.end();
	}
	if(request.url=='/auth/register'){ //only post
		requestServed=true;
		var hashOutput = cryp.generateHash('rushikesh');
		hashOutput["username"]= 'rushikesh';
		hashOutput["type"]="JSON";
		var cryptoToStore = [];
		var obj = {}; obj.name="username";obj.value="rushikesh";
		cryptoToStore.push(obj);
		obj.name="passwordhash";obj.value=hashOutput["passwordhash"];
		cryptoToStore.push(obj);
		obj.name="passwordsalt";obj.value=hashOutput["passwordsalt"];
		cryptoToStore.push(obj);
		//convert to {name=, value=}
		dal.insertDoc(dburl,'T_USERS',cryptoToStore,function(retVal){
					response.writeHead(retVal.responseCode,{'Content-Type':'application/json'});	//cannot simply include content type.					
					response.end();				
				});					
			}
		//response.writeHead(200,{'Content-Type':'application/json'});

		//response.write(JSON.stringify(hashOutput));
		//response.end();		
	//}
	if(!requestServed)
	{
			response.writeHead('404',{'Content-Type':'application/json'});	
			response.end();
	}
}

http.createServer(handleRequest).listen(1237,'127.0.0.1');

console.log('server is running with MongoClient');
