db = db.getSiblingDB('Activity');
db.createUser({
	user:"activityProject",
	pwd:"XXXX",
	roles:[
	{role:"readWrite",db:"Activity"}
	]
});
