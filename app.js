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
var handlerModule = (function(){
	var currentUiState='open';
	var getUiState=function(){
		return currentUiState;
	}
	var setUiState=function(state){
			currentUiState = state;
		}
	return {			
		addActivityHandler:function(){
			var frm = JSON.stringify($('#frmActivity').serializeArray());					
				mainModule.postActivity(frm);
		},
		showDialogHandler:function(){
			if(getUiState()!='open'){
				return;
			}			
			$('#mainContainer').addClass('inactive');
			$('#tblActivitylist').removeClass('voverflow')							;
			$('#tblActivitylist').addClass('novoverflow')							;			
			$('#newActivityPanel').removeClass('hidden').addClass('activeCentered');
			$('#newActivityPanel').width($('#mainContainer').width() -50);		
			setUiState('close');	
		},
		closeDialogHandler:function(){
			$('#mainContainer').removeClass('inactive');	
			$('#tblActivitylist').addClass('voverflow')							;
			$('#tblActivitylist').removeClass('novoverflow')							;									
			$('#newActivityPanel').addClass('hidden').removeClass('activeCentered');
			setUiState('open');			
		}
	}
})();
$(document).ready(function(){
				mainModule.fetchLookupData();
				mainModule.getActivityList();
				$('#btnAddActivity').click(handlerModule.addActivityHandler);
				$('#btnShowDialog').click(handlerModule.showDialogHandler);
				$('.close').click(handlerModule.closeDialogHandler);				
			}
	);
