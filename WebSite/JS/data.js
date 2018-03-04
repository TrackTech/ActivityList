var dataModule=dataModule||{};
dataModule=(function(){
		return{
			Get:function(uri,successCallback){
				$.ajax({					
					url:uri,
					method:"Get",
					success:successCallback,
					error: function(xhr,ajaxOptions,throwError){
						alert(xhr.status);
						alert(throwError);
						if(xhr.status==403){
							window.location = "/";
						}
					}		
					});	
			},
			Post:function(uri,data,successCallback){
				$.ajax({					
					url:uri,
					method:"Post",
					contentType:"application/json",					
					data:data,
					complete:function(){							
					},					
					error:function(xhr,ajaxOptions,throwError){
						alert(xhr.status);
						alert(throwError);
					}
					}).success(successCallback); //two syntax to call success						
			}
		};
	}
	)();
