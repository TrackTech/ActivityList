var main = function(){
	"use strict";
	//window.alert("hello world");
	$.ajax({
		url:"http://localhost:1237",
		method:"Get"		
		}).success(function(jsonresponse){
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
					content = content + element.Notes;
					content = content + "</td>";
					content = content + "<td>";
					content = content + element.TargetDate;
					content = content + "</td>";
					content = content + "<td>";
					content = content + element.status;
					content = content + "</td>";
					content = content + "</tr>";
				});		
				//content = content + "</tbody>";		
					$('#tblActivitylist').append(content);
		});
};

$(document).ready(main);