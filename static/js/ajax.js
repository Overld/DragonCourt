var Ajax = {
	call: (url, params, callback) => {
        var _s = this;
		$.ajaxSetup({
			timeout: 30000,
			data: params,
			cache: false,
			method: "post",
			dataType: "json",
			success: function(data){
				$('#ajaxLoader').hide();
				callback(data);
			},
			error: function(xhr, status, err){
				$('#ajaxLoader').hide();
				console.log(status);
				console.log(err);
			}
		});
		_s.xhr = $.ajax({
			url : "http://192.227.142.120:33030/"+url
		});
	}
};

(function($) {
    "use strict"; // Start of use strict
    $(document).ready(function(){
		$('#ajaxLoader').hide();
    });
    
    $(document).ajaxStart(function(){
		$('#ajaxLoader').show();
	});
	$(document).ajaxComplete(function(){
		$('#ajaxLoader').hide();
	});
	$(document).ajaxSuccess(function(){
		$('#ajaxLoader').hide();
	});
	$(document).ajaxError(function(){
		$('#ajaxLoader').hide();
	});
})(jQuery); // End of use strict