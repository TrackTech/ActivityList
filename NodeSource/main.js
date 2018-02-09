var http = require('http');
var HttpDispatcher = require('httpdispatcher');
var dal = require('./dal'); //.js not required here
var cryp = require('./crypto');
var helper = require('./helper');
var querystring = require('querystring');
var allowedDomain = 'http://my.activity.com'; 
var serversalt = 'salty';

function handleRequest(request,response){		
	var dburl = 'mongodb://activityProject:activityprojectpassword@localhost:27017/Activity';
	var postData=[];	

	response.setHeader('Access-Control-Allow-Origin',allowedDomain); //as it is on a different port	
	
	var requestHandled = false;
	var getHandler=function(){
		if(request.url=='/data/activitylist'){
			requestHandled = true;
			var retVal = dal.findDocs(dburl,function(retVal){
			if(retVal.error){
				response.writeHead(retVal.responseCode);	//response.setHeader('Retry-After',5); there is not much support for this header , except with googlebot					
				response.end();
			}
			else{
				console.log('consuming data');
				response.writeHead(retVal.responseCode,{'Content-Type':'application/json'});
				response.write(JSON.stringify(retVal.data));			
				response.end();
			}},'T_ACTIVITY_LIST',{}
			);		
		}
		if(request.url.startsWith('/lookup')){
			requestHandled=true;			
			var tok = request.url.split('/');
			var lookupToken = tok[2];		
			console.log('fetching lookup data');			
			var searchQuery = {};
			searchQuery[lookupToken]= {$exists:true};
			var retVal = dal.findDocs(dburl,function(retVal){
			if(retVal.error){
				response.writeHead(retVal.responseCode);	//response.setHeader('Retry-After',5); there is not much support for this header , except with googlebot													
			}
			else{						
				response.writeHead(retVal.responseCode,{'Content-Type':'application/json','Cache-Control':'public,max-age=300'});			
				response.write(JSON.stringify(retVal.data));									
				}
				response.end();
			},'T_LOOKUP',searchQuery);			
		}
		if(!requestHandled)
		{
			response.writeHead('404',{'Content-Type':'application/json'});				
			response.end();
		}		
	}
	var postHandler=function(){
		if(request.url=='/data/activity'){		
			requestHandled=true;			
			console.log('POST an activity');
			postData = JSON.parse(postData);	
			dal.insertDoc(dburl,'T_ACTIVITY_LIST',postData,function(retVal){
				response.writeHead(retVal.responseCode);	//cannot simply include content type.					
				response.end();				
			});								
		}
		if(request.url=='/auth/register'){ //only post
			requestHandled=true;			
			var queryObject = querystring.parse(postData);				
/******************need a validation class		****************/
			if(!queryObject["login"] || !queryObject["password"] || !queryObject["confirmpassword"]){
				response.writeHead(400); //bad request, do not repeat
				response.end();
				return;
			}			
			if(queryObject.login=="" || queryObject.password=="" || queryObject.confirmpassword==""){
				response.writeHead(400); //bad request, do not repeat
				response.end();
				return;
			}

			var hashOutput = cryp.generateHash(queryObject.password);			
			var hashOutput2 = cryp.generateHash(hashOutput["passwordhash"],serversalt,1);	
			var cryptoToStore = [];		
			cryptoToStore.push(KeyValPair("username",queryObject.login));
			cryptoToStore.push(KeyValPair("passwordhash",hashOutput2["passwordhash"]));
			cryptoToStore.push(KeyValPair("passwordsalt",hashOutput["passwordsalt"]));
				
			dal.insertDoc(dburl,'T_USERS',cryptoToStore,function(retVal){
						response.writeHead(retVal.responseCode,{'Content-Type':'application/json'});	//cannot simply include content type.					
						response.end();				
					});					
		}
		if(request.url=="/auth/token"){			
			var queryObject = querystring.parse(postData);
			requestHandled=true;						
			if(!(queryObject && queryObject.login && queryObject.password)){
				response.writeHead(400,{'Set-Cookie':'error=invalidRequest;'}); //bad request, do not repeat
				response.end();
				return;
			}
			if(!(queryObject.csrfToken && helper.getCookieValue(request.headers.cookie,'tkn'))){
				response.writeHead(400,{'Set-Cookie':'error=invalidCSRF;'});
				response.end();
				return;
			}						
			if(queryObject.csrfToken != helper.getCookieValue(request.headers.cookie,'tkn')){
				response.writeHead(400,{'Set-Cookie':'error=invalidCSRF;'});
				response.end();
				return;
			}
			var searchQuery = {};
			searchQuery["username"]=queryObject.login;
			var data = dal.findDocs(dburl,function(retVal){

						if(retVal.error){
							response.writeHead(retVal.responseCode);	//response.setHeader('Retry-After',5); there is not much support for this header , except with googlebot													
						}
						else{		
						/******************need a validation class		****************/	
							if(helper.isEmptyObject(retVal.data)){
									response.writeHead(400,{'Set-Cookie':'error=loginFailed;'});											
							}
							else{
									var hashOutput = cryp.generateHash(queryObject.password,retVal.data[0].passwordsalt);										
									hashOutput = cryp.generateHash(hashOutput["passwordhash"],serversalt,1);															
									
									if(hashOutput["passwordhash"]==retVal.data[0].passwordhash){ //not working
										response.writeHead(303,{'Location':'../index.html'});									
									}									
									else
									{
										response.writeHead(400,{'Set-Cookie':'error=loginFailed;'});
									}
								}
							}
							response.end();
						},"T_USERS",searchQuery);
		}		
		if(!requestHandled)
		{
			response.writeHead('404',{'Content-Type':'application/json'});				
			response.end();
		}
	}
	request.on('data',(chunk)=>{		
		postData.push(chunk); 		
	}).on('end',function(){
		postData = Buffer.concat(postData).toString();
		console.log("end event data --" + postData);
		if(request.method=="POST")
		{
			postHandler();
		}
	});	
	if(request.method=="GET"){
		console.log('get executed');
		getHandler();
	}	
}

http.createServer(handleRequest).listen(1237,'127.0.0.1');

console.log('Node Server loaded');

function KeyValPair(k,v){
	return {
		name:k,
		value:v
	}
}