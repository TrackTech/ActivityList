var helper = require('./helper');
var jwt = require('./jwt');
var dal = require('./dal');

var pageHandler = function(request,response,dburl,httpverb,module,postData){

		var errorHandler=function(){
			response.writeHead(403,{'Set-Cookie':'error=loginRequired;Path=/login.html;max-age=5'});	
			response.end();				
		}		

		var callBack=function(httpverb,module){
			console.log('callback forming with ' + module);
			function GetImplementation(verifiedJwt,module,verb){
				if(module=="ActivityList"){
					switch (verb) {
						case "GET":							
							var searchQuery = {};					
							searchQuery["userid"] = verifiedJwt.body["sub"];						
							var retVal = dal.findDocs(dburl,function(retVal){
									if(retVal.error){ //a user can have no records vs db throwns and error
										response.writeHead(retVal.responseCode);	//response.setHeader('Retry-After',5); there is not much support for this header , except with googlebot					
										response.end();
									}
									else{				
										response.writeHead(retVal.responseCode,{'Content-Type':'application/json'});
										response.write(JSON.stringify(retVal.data));			
										response.end();
									}
								},'T_ACTIVITY_LIST',searchQuery
							);						
						break;
						case "POST":
								postData = JSON.parse(postData);	
								postData.push(helper.KeyValPair("userid",verifiedJwt.body["sub"]));					
								console.log(postData);
								dal.insertDoc(dburl,'T_ACTIVITY_LIST',postData,function(retVal){
									response.writeHead(retVal.responseCode);	//cannot simply include content type.					
									response.end();				
								});	
						break;
					}
				} //ActivityList
				if(module=="lookup"){
					console.log('in lookup get GetImplementation');
					switch (verb) {
						case "GET":							
							var lookupToken = request.url.split('/')[2];
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
						break;						
					}
				}
			}
			return function(err,verifiedJwt){	//nJwt library requires a callback with this definition					
						if(err){
							errorHandler();
						}
						else
						{						
							GetImplementation(verifiedJwt,module,httpverb);
						}
					}
			}(httpverb,module); //callback definition		

		this.handlePage=function(){	//public method that handles the page		
			if(!this.validateJWTCookie(request.headers.cookie))
			{				
				errorHandler();
			}
			else{			
			this.validateJWT(request.headers.cookie,callBack);	
			}
		}								
	};
pageHandler.prototype.validateJWTCookie=function(cookies){		
		return helper.getCookieValue(cookies,'jwt');				
}
pageHandler.prototype.validateJWT=function(cookies,cback){	
	jwt.ValidateToken(helper.getCookieValue(cookies,'jwt'),cback);				
}
exports.handler=function(request,response,dburl,httpverb,module,postdata){		
	return new pageHandler(request,response,dburl,httpverb,module,postdata);
}

