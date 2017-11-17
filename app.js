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

$(document).ready(function(){
				mainModule.fetchLookupData();
				mainModule.getActivityList();
				$('#btnAddActiivty').click(function(){
					var frm = JSON.stringify($('#frmActivity').serializeArray());					
					mainModule.postActivity(frm);
				});

			}
	);
