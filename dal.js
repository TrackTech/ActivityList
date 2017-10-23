//var MongoClient = require('mongodb').MongoClient;
console.log('DAL has been loaded');
exports.findDocuments = function(db,cback){
	var collection = db.collection('T_ACTIVITY_LIST');	
	collection.find({}).toArray(function(err,docs){		
		cback(JSON.stringify(docs));
		});
} 

exports.insertDocument = function(db,postData,cback){
	var collection = db.collection('T_ACTIVITY_LIST');	
	var jsonData;
	var dataToUpload={};
	
	jsonData = JSON.parse(postData);

	jsonData.forEach(function(element){
		dataToUpload[element.name] = element.value;
		//console.log(element);
	});
	collection.insert(dataToUpload);
	cback(true);
}
