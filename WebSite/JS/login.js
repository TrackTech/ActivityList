"use strict";

var loginModule = (function(){
	/*var getUrlVars = function()
	{
	    var vars = [], hash;
	    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
	    for(var i = 0; i < hashes.length; i++)
	    {
	        hash = hashes[i].split('=');
	        vars.push(hash[0]);
	        vars[hash[0]] = hash[1];
	    }
	    return vars;
	} */
	return {
		getUrlVars:function(){
			 var vars = [], hash;
		    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
		    for(var i = 0; i < hashes.length; i++)
		    {
		        hash = hashes[i].split('=');
		        vars.push(hash[0]);
		        vars[hash[0]] = hash[1];
		    }
		    return vars;
		},
		getCookie:function(cname) {
		    var name = cname + "=";
		    var decodedCookie = document.cookie;
		    var ca = decodedCookie.split(';');
		    for(var i = 0; i <ca.length; i++) {
		        var c = ca[i];
		        while (c.charAt(0) == ' ') {
		            c = c.substring(1);
		        }
		        if (c.indexOf(name) == 0) {
		            return c.substring(name.length, c.length);
		        }
		    }
		    return "";
		}	
	}
})();

$(document).ready(function(){	
	var urlParms = loginModule.getUrlVars();
	$('#hdnCSRF').val(urlParms['tkn']);
	var backedEndError = loginModule.getCookie('error');
	if(backedEndError!="")
		alert(backedEndError);
	}
);
