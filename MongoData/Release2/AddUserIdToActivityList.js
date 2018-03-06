db = db.getSiblingDB('Activity');
var userFound = false;
function getUserId(u){
	if(u._id)		
	{
		userFound = true;
		db.T_ACTIVITY_LIST.updateMany({},{
			$set:{"userid":u._id.str}
		});		
	}
}

db.T_USERS.find({
	username:"rushikesh"	
}).forEach(getUserId);
if(!userFound){
	print('username invalid');
}
