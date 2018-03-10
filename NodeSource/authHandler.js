var helper = require('./helper');
var jwt = require('./jwt');
var dal = require('./dal');
var cryp = require('./crypto');
var querystring = require('querystring');
var serversalt = 'salty';

var authHandler = function(request,response,dburl,module,postData){
		this.validateInput=function(queryObject){			
			switch (module){
				case "register":
					if(!queryObject["login"] || !queryObject["password"] || !queryObject["confirmpassword"]){
						response.writeHead(400); //bad request, do not repeat
						response.end();
						return false;
					}			
					if(queryObject.login=="" || queryObject.password=="" || queryObject.confirmpassword==""){
						response.writeHead(400); //bad request, do not repeat
						response.end();
						return false;
					}
					return true;
				break;
				case "token":
					//var queryObject = querystring.parse(postData);					
					if(!(queryObject && queryObject.login && queryObject.password)){						
						response.writeHead(400,{'Set-Cookie':'error=invalidRequest;'}); //bad request, do not repeat
						response.end();
						return false;
					}
					if(!(queryObject.csrfToken && helper.getCookieValue(request.headers.cookie,'tkn'))){						
						response.writeHead(400,{'Set-Cookie':'error=invalidCSRF;'});
						response.end();
						return false;
					}						
					if(queryObject.csrfToken != helper.getCookieValue(request.headers.cookie,'tkn')){
						response.writeHead(400,{'Set-Cookie':'error=invalidCSRF;'});
						response.end();
						return false;
					}
					return true;
				break;
				}
		}
		this.postData=function(queryObject){
			switch (module){
				case "register":
					var hashOutput = cryp.generateHash(queryObject.password); //fist hash with Unknown salt			
					var hashOutput2 = cryp.generateHash(hashOutput["passwordhash"],serversalt,1);	//second has with known salt
					var cryptoToStore = [];		
					cryptoToStore.push(helper.KeyValPair("username",queryObject.login));
					cryptoToStore.push(helper.KeyValPair("passwordhash",hashOutput2["passwordhash"]));
					cryptoToStore.push(helper.KeyValPair("passwordsalt",hashOutput["passwordsalt"]));
						
					dal.insertDoc(dburl,'T_USERS',cryptoToStore,function(retVal){
								response.writeHead(retVal.responseCode,{'Content-Type':'application/json'});	//cannot simply include content type.					
								response.end();				
							});
				break;
				case "token":
					var searchQuery = {};
					searchQuery["username"]=queryObject.login;
					console.log('inside token');
					var data = dal.findDocs(dburl,function(retVal){
						console.log('inside db call');
					if(retVal.error){
						response.writeHead(retVal.responseCode);	//response.setHeader('Retry-After',5); there is not much support for this header , except with googlebot													
					}
					else{		
					/******************need a validation class		****************/	
						if(helper.isEmptyObject(retVal.data)){
								response.writeHead(400,{'Set-Cookie':'error=loginFailed;'});											
						}
						else{									
								//console.log(retVal.data[0]._id);
								var hashOutput = cryp.generateHash(queryObject.password,retVal.data[0].passwordsalt);										
								hashOutput = cryp.generateHash(hashOutput["passwordhash"],serversalt,1);															
								
								if(hashOutput["passwordhash"]==retVal.data[0].passwordhash){ 
									var token = 'jwt=' + jwt.GetNewToken(retVal.data[0]._id)+';Path=/';
									response.writeHead(303,{'Set-Cookie':token,'Location':'../index.html'});									
								}									
								else
								{
									response.writeHead(400,{'Set-Cookie':'error=loginFailed;'});
								}
							}
						}
						response.end();
					},"T_USERS",searchQuery);
				break;
			}			
		}		
		this.handlePage=function(){
			var queryObject = querystring.parse(postData);				
			if(this.validateInput(queryObject)){
				this.postData(queryObject);
			}
		}
}
exports.handler=function(request,response,dburl,module,postdata){
	return new authHandler(request,response,dburl,module,postdata);
}