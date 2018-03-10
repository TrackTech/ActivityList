var http = require('http');
var pageHandle = require('./pageHandler');
var authHandler = require('./authHandler');
var allowedDomain = 'http://offthegym.com'; 
var dburl = 'mongodb://activityProject:activityprojectpassword@localhost:27017/Activity';

function handleRequest(request,response){			
	var postData=[];		
	response.setHeader('Access-Control-Allow-Origin',allowedDomain); //as it is on a different port	
	request.on('data',(chunk)=>{		
		postData.push(chunk); 		
	}).on('end',function(){
		postData = Buffer.concat(postData).toString();		
		if(request.method=="POST")
		{
			postHandler(request,response,postData);
		}
	});	
	if(request.method=="GET"){
		console.log('get executed');
		getHandler(request,response);
	}		
}

function getHandler(request,response){
	var requestHandled = false;
	if(request.url=='/data/activitylist'){
			requestHandled = true;					
			pageHandle.handler(request,response,dburl,request.method,'ActivityList').handlePage();		
		}
		if(request.url.startsWith('/lookup')){
			requestHandled=true;									
			pageHandle.handler(request,response,dburl,request.method,'lookup').handlePage();
		}
		if(!requestHandled)
		{
			response.writeHead('404',{'Content-Type':'application/json'});				
			response.end();
		}
}

function postHandler(request,response,postData){
		var requestHandled = false;
		if(request.url=='/data/activity'){		
			requestHandled=true;						
			pageHandle.handler(request,response,dburl,request.method,'ActivityList',postData).handlePage();		
		}
		if(request.url=='/auth/register'){ //only post
			requestHandled=true;						
			authHandler.handler(request,request,'register',postData).handlePage();				
		}
		if(request.url=="/auth/token"){	
			requestHandled = true;
			authHandler.handler(request,response,dburl,'token',postData).handlePage();				
		}		
		if(!requestHandled)
		{
			response.writeHead('404',{'Content-Type':'application/json'});				
			response.end();
		}
	}

http.createServer(handleRequest).listen(1237,'127.0.0.1');

console.log('Node Server loaded');
