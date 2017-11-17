//should make a connection to MongoDB
//should return an object with result
//the result object has either data or err
console.log('DAL has been loaded');

var MongoClient = require('mongodb').MongoClient;

var findAllDocuments = function(db,cback,collectionName,findQuery){
	//var collection = db.collection('T_ACTIVITY_LIST');	
	var collection = db.collection(collectionName);
	if(findQuery===undefined){
		findQuery={};
	}	
	collection.find(findQuery).toArray(function(err,docs){	
		db.close();	
		var retVal = {};
		retVal.data = JSON.stringify(docs);
		retVal.responseCode = '200';
		cback(retVal);
		})};


var findAllDocuments2 = function(db,cback){
	var collection = db.collection('T_LOOKUP');	
	collection.find({'activitystatus':{$exists:true}}).toArray(function(err,docs){	
		db.close();	
		var retVal = {};
		retVal.data = JSON.stringify(docs);
		retVal.responseCode = '200';
		cback(retVal);
		})};


var insertDocument = function(db,postData,cback){
	var collection = db.collection('T_ACTIVITY_LIST');	
	var jsonData;
	var dataToUpload={};
	
	jsonData = JSON.parse(postData);

	jsonData.forEach(function(element){
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

exports.insertDoc = function(url,postData,cback){
	MongoClient.connect(url,function(err,db){
		console.log('inserting activity');				
				if(err){
					var retVal = {};
						retVal.responseCode = '503';
						retVal.error = err;							
						cback(retVal);
					}
					else{
						insertDocument(db,postData,cback);
					}
	});
}

exports.findDocs2 = function(url,cback){
	
	MongoClient.connect(url,function(err,db){
		
				console.log('fetching lookup data');
				
				if(err){
					var retVal={};
						retVal.responseCode = '503';
						retVal.error = err;							
						cback(retVal);
					}
				else{												
				findAllDocuments2(db,cback);	
				}							
		});		
}
