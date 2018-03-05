var helper = require('./helper');
var jwt = require('./jwt');
var pageHandler = function(request,response,cback){
		this.handlePage=function(){
			console.log('in handlePage');						
			if(!this.validateJWTCookie(request.headers.cookie))
			{	
				console.log('validate JWT cookie failed');		
				response.writeHead(403,{'Set-Cookie':'error=loginRequired;Path=/login.html;max-age=5'});	
				response.end();	
				return;
			}
			this.validateJWT(request.headers.cookie,cback);	
		}
};
pageHandler.prototype.validateJWTCookie=function(cookies){		
		return helper.getCookieValue(cookies,'jwt');				
}
pageHandler.prototype.validateJWT=function(cookies,cback){	
	jwt.ValidateToken(helper.getCookieValue(cookies,'jwt'),cback);			
}
exports.handler=function(request,response,cback){
	return new pageHandler(request,response,cback);
}