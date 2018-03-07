/* One time key generation
var crypto = require('crypto');
var signingKey = crypto.randomBytes(256);
var key = signingKey.toString('base64');
console.log(key);
var key = "IId5OSCRTvk4ORpV4ut83bDy+W8yWSHDDbSfRrHPce8nJ2woCIAR2Bjvv6dvI3MTjkETzDgYdy0bjt0jK3Tti41QLwq4H+vU9W8MPtsulwtRuHMjc9bHddTI7Ky0C3Xucjv6ts+66rNXqNhK5EbTCrcR2SEECxfK+W6AHCOnjazXiLzC2kkfb9Mwp+WVWMEUPX/COxJXrbxmephiFeLDrJWQB6572ZSuMg30UfMuJXm63r0PPY4RcJsj9kShE8yCPTRVYHSbAELkr5jtv+4mEPt5ayOyaNYXdkPDHV3tNeJbPaG7q/oGXYBeDvmNKsTGHhYW7KNyuqCsX4L9ZxNqaA==";
var fetchBufferFromToken = Buffer.from(key,'base64');
*/

var nJwt = require('njwt');
var key = "IId5OSCRTvk4ORpV4ut83bDy+W8yWSHDDbSfRrHPce8nJ2woCIAR2Bjvv6dvI3MTjkETzDgYdy0bjt0jK3Tti41QLwq4H+vU9W8MPtsulwtRuHMjc9bHddTI7Ky0C3Xucjv6ts+66rNXqNhK5EbTCrcR2SEECxfK+W6AHCOnjazXiLzC2kkfb9Mwp+WVWMEUPX/COxJXrbxmephiFeLDrJWQB6572ZSuMg30UfMuJXm63r0PPY4RcJsj9kShE8yCPTRVYHSbAELkr5jtv+4mEPt5ayOyaNYXdkPDHV3tNeJbPaG7q/oGXYBeDvmNKsTGHhYW7KNyuqCsX4L9ZxNqaA==";
var signingKey = Buffer.from(key,'base64');

exports.GetNewToken=function(userId,accessList){
//function GetNewToken(userId,accessList){
	var accList=accessList|| ['index'];
	var claims ={
			iss:"my.activity.com",
			sub: userId,
			scope:accList
	}		
	var token= nJwt.create(claims,signingKey);	
	token.setExpiration(new Date().getTime() + (60*60*1000));
	console.log(token);
	return token.compact();
}
exports.ValidateToken=function(token,cBack){	
//	function ValidateToken(token,cBack){	
	nJwt.verify(token,signingKey,cBack);
}

/*console.log(GetNewToken("123","index"));
ValidateToken('eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJteS5hY3Rpdml0eS5jb20iLCJzdWIiOiIxMjMiLCJzY29wZSI6ImluZGV4IiwianRpIjoiZjkyMDI4MTEtNjY2Ny00YjM0LThkMzctN2IzMmZhMGQ3ZmVjIiwiaWF0IjoxNTE5OTczODU1LCJleHAiOjE1MTk5Nzc0NTV9.5-hqmfrt6pITfD_-2QSdwzIoP8PQ__omtZK8rdPWD8g',function(err,verifiedToken){
	if(err){

	}
	else{
		console.log(verifiedToken.body["scope"].includes('indexd'));
	}
}); */
