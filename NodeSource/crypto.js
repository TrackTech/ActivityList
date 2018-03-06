var crypto = require('crypto');


exports.generateHash = function(userSecret,usersalt,iterations){	
	var crySalt = usersalt || crypto.randomBytes(64).toString('hex');	
	var iter = iterations || 10000;
	const crykey = crypto.pbkdf2Sync(userSecret,crySalt,10000,64,'sha512');
	return {		
		passwordhash: crykey.toString('hex'),
		passwordsalt: crySalt
	}
}
