//should make a connection to MongoDB
//should return an object with result
//the result object has either data or err
console.log('DAL has been loaded');

var MongoClient = require('mongodb').MongoClient;

var findAllDocuments = function(db,cback,collectionName,findQuery,limit){	
	var collection = db.collection(collectionName);
	findQuery = findQuery || {};
	/*if(findQuery===undefined){
		findQuery={};
	} */
	//console.log(findQuery);	
	collection.find(findQuery).toArray(function(err,docs){	
		db.close();	
		var retVal = {};
		retVal.data = docs;
		retVal.responseCode = '200';
		cback(retVal);
		})};


var insertDocument = function(db,collectionName,postData,cback){
	var collection = db.collection(collectionName);	
	var jsonData;
	var dataToUpload={};	
	postData.forEach(function(element){
		dataToUpload[element.name] = element.value;
		//console.log(element);
	});
	collection.insert(dataToUpload);
	db.close();
	var retVal={};
	retVal.responseCode = '200';
	cback(retVal);
}

exports.findDocs = function(url,cback,collectionName,findQuery){
	
	MongoClient.connect(url,function(err,db){
		
				console.log('fetching list of activity');
				
				if(err){
					var retVal={};
						retVal.responseCode = '503';
						retVal.error = err;							
						cback(retVal);
					}
				else{												
				findAllDocuments(db,cback,collectionName,findQuery);	
				}							
		});		
}

exports.insertDoc = function(url,collectionName,postData,cback){
	MongoClient.connect(url,function(err,db){
		console.log('inserting activity');				
				if(err){
					var retVal = {};
						retVal.responseCode = '503';
						retVal.error = err;							
						cback(retVal);
					}
					else{
						insertDocument(db,collectionName,postData,cback);
					}
	});
}
