db = db.getSiblingDB('admin');

db.createUser(
{
	user:"root",
	pwd:"***",
	roles:[
	"root"]
});