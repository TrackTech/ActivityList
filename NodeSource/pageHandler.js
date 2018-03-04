var helper = require('./helper');
var jwt = require('./jwt');
var pageHandler = function(request,response,cback){
	handlePage=function(request,response,cback){
		if(!validateJWTCookie(request.headers.cookie));
		{			
			response.writeHead(403,{'Set-Cookie':'error=loginRequired;Path=/login.html;max-age=5'});	
			response.end();	
			return;
		}
		validateJWT(request.headers.cookie,cback);	
	}
};
pageHandler.prototype.validateJWTCookie=function(cookies){
	
			if(!helper.getCookieValue(cookies,'jwt')){
				return false;												
			}
			return true;
}
pageHandler.prototype.validateJWT=function(cookies,cback){
	jwt.ValidateToken(helper.getCookieValue(cookies,'jwt'),cback);			
}
exports.handler=function(request,response,cback){
	return pageHandler(request,response,cback);
}