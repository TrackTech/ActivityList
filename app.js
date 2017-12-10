"use strict";

var dataModule = dataModule || {};

var mainModule = (function(){
				return{
					getActivityList:function(){
						dataModule.Get('/data/activitylist',[mainModule.printActivityListHeader,mainModule.printActivityList]);						
					},
					getActivityWithRedraw:function(){						
						dataModule.Get('/data/activitylist',[mainModule.clearActivityList,mainModule.printActivityList]);
					},
					clearActivityList:function(){

						$('#tblActivitylist tbody').remove(); //space tr is decendent and not child for child use $('#tblActivitylist >tr')
					},
					printActivityListHeader:function(){
						var content="<thead><tr><th>Activity</th><th>Location</th><th>Notes</th><th>Target Date</th><th>Status</th></tr></thead>";						
						$('#tblActivitylist').append(content);
					},
					printActivityList:function(jsonresponse){
						var content="";
						jsonresponse.forEach(function(element){
							content = content + "<tr>";
							content = content + "<td>";
							content = content + element.activity;
							content = content + "</td>";
							content = content + "<td>";
							content = content + element.location;
							content = content + "</td>";
							content = content + "<td>";
							content = content + element.notes;
							content = content + "</td>";
							content = content + "<td>";
							content = content + element.targetdate;
							content = content + "</td>";
							content = content + "<td>";
							content = content + element.status;
							content = content + "</td>";
							content = content + "</tr>";
						});		
	
					$('#tblActivitylist').append(content);
					},
					postActivity:function(postData){
						dataModule.Post('/data/activity',postData,mainModule.getActivityWithRedraw);						
					},
					fetchLookupData:function(){
						var selectList = $('#formPanel select[data-lookuptoken]');						
						selectList.each(function(index){
							var token = $(this).data('lookuptoken');
							var lookupResource= '/lookup/'+token;
							var that = this;						
							dataModule.Get(lookupResource,function(data){
								var aryData = data[0][token];													
								$.each(aryData,function(index,value){																	
									$(that).append($("<option></option>").attr("id",value.key).text(value.value));									
								});								
							});
						});
					}
				};
		}
	)();
var pubSub = (function(){
	var eventList={};
	return {
		raiseCustomEvent:function(eventName){ //support passing of parameters [].slice.call(arguments,1);					
			if(!eventList[eventName]) return;
			for (var i = 0; i<eventList[eventName].length; i++) {
				eventList[eventName][i]();
			}						
		},
		subscribeCustomEvent:function(eventName,callback){		
			if(!eventList[eventName]){
				eventList[eventName]=[];				
			}	
			if(!eventList[eventName].includes(eventName)){
				eventList[eventName].push(callback);
			}
		}
	}
})();
var handlerModule = (function(psub){
	var currentUiState='open';
	var getUiState=function(){
		return currentUiState;
	}
	var setUiState=function(state){
			currentUiState = state;
		}
	var addActivityHandler=function(){
			var frm = JSON.stringify($('#frmActivity').serializeArray());					
				mainModule.postActivity(frm);
		}
	var showDialogHandler=function(){	
			if(getUiState()!='open'){
				return;
			}			
			$('#mainContainer').addClass('inactive');
			$('#tblActivitylist').removeClass('voverflow')							;
			$('#tblActivitylist').addClass('novoverflow')							;			
			$('#newActivityPanel').removeClass('hidden').addClass('activeCentered');
			$('#newActivityPanel').width($('#mainContainer').width() -50);		
			setUiState('close');	
		}
	var closeDialogHandler=function(){
			$('#mainContainer').removeClass('inactive');	
			$('#tblActivitylist').addClass('voverflow')							;
			$('#tblActivitylist').removeClass('novoverflow')							;									
			$('#newActivityPanel').addClass('hidden').removeClass('activeCentered');
			setUiState('open');			
		}
	psub.subscribeCustomEvent('show-dialog',showDialogHandler);
	psub.subscribeCustomEvent('add-activity',addActivityHandler);
	psub.subscribeCustomEvent('close-dialog',closeDialogHandler);

})(pubSub); //refactor - what if pubSub moves to different file
var eventList=(function(psub){
	return{
		showDialog:function(){
			psub.raiseCustomEvent('show-dialog');
		},
		closeDialog:function(){
			psub.raiseCustomEvent('close-dialog');			
		},
		addActivity:function(){
			psub.raiseCustomEvent('add-activity');
		}
	}
})(pubSub);
$(document).ready(function(){				
				mainModule.fetchLookupData();
				mainModule.getActivityList();
				$('#btnAddActivity').click(eventList.addActivity);
				$('#btnShowDialog').click(eventList.showDialog);				
				$('.close').click(eventList.closeDialog);		
			}
	);
