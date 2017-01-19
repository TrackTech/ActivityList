var main = function(){
	"use strict";
	//window.alert("hello world");
	$.ajax({
		url:"http://localhost:1237",
		method:"Get"		
		}).success(function(jsonresponse){
				var content=""
				jsonresponse.forEach(function(element){
					content = content + "<tr>";
					content = content + "<td>";
					content = content + element.activity;
					content = content + "</td>";
					content = content + "<td>";
					content = content + element.location;
					content = content + "</td>";
					content = content + "<td>";
					content = content + element.TargetDate;
					content = content + "</td>";
					content = content + "<td>";
					content = content + element.status;
					content = content + "</td>";
					content = content + "</tr>";
				});				
					$('#tblActivitylist').html(content);
		});
};

$(document).ready(main);