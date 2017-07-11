"use strict";

var dataModule = dataModule || {};

var mainModule = (function(){
				return{
					getActivityList:function(){
						var jsonresponse = dataModule.Get('/data/activitylist',mainModule.printActivityList);						
					},
					printActivityList:function(jsonresponse){
						var content="<tr><th>Activity</th><th>Location</th><th>Notes</th><th>Target Date</th><th>Status</th></tr>";
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
						dataModule.Post('/data/activity',postData,mainModule.getActivityList);
						//dataModule.Post('/data/activity',"hello world",mainModule.printActivityList);
					}
				};
		}
	)();
//$(document).ready(mainModule.getActivityList);
$(document).ready(function(){
				mainModule.getActivityList();
				$('#btnAddActiivty').click(function(){
					var frm = JSON.stringify($('#frmActivity').serializeArray());
					//alert(frm);
					mainModule.postActivity(frm);
				});

			}
	);
