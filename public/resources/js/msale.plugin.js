var mSalePlugin = function(object) {
	this.url = "";
	this.dataLoad = "data-box";
	this.data = {};
	this.error = false;
    this.messages = [];
    this.method = "post";
    this.dataForm = new FormData();
    this.load_data_to_modal = function(object, modal){
    	$(modal).load($(object).attr('data-url'));
		$(modal).modal('show');
    };
    this.execute = function(){
        $.ajax({
            url : this.url,
            processData: false,
            contentType: false,
            type : this.method,
            dataType:"json",
            data : this.data,
            context : this,
            async: true,
            success : function(result)
            {
                $(ob).removeClass('saving');
                if(result.error==true){
                    $(ob).parents('form').find('.error-form').html('');
                    var alert_danger = $('<div class="alert alert-danger alert-dismissable fade in">'
                                    +'<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>'
                                    +'</div>');
                    if(Array.isArray(result.messages)){
                        for(var i=0;i<result.messages.length;i++){
                            alert_danger.append(result.messages[i]+"<br>");
                        }
                    }else{
                        alert_danger.append(result.messages);
                    }
                    $(ob).parents('form').find('.error-form').append(alert_danger);
                    $(ob).parents('form').find('.error-form').removeClass('hidden');
                    $(ob).removeClass('saving');
                }else{
                    $(ob).parents('form').find('.error-form').html('');
                    if(this.urlnext!='' && typeof(this.urlnext)!=undefined){
                        this.nextstep();
                    }else{
                        var success_form = $(ob).parents('form').find(".success-form");
                        if(typeof(this.urlnext)!=undefined){
                            $(ob).parents('form').find(".success-form").html('<i class="fa fa-check"></i> Cập nhật thay đổi thành công. Vui lòng tải lại trang để kiểm tra thay đổi.').removeClass('hidden');
                        }
                        $(ob).removeClass('saving');
                    }
                }
            },error: function(result){
                $(ob).parents('form').find('.error-form').html('');
                var alert_danger = $('<div class="alert alert-danger alert-dismissable fade in">'
                                    +'<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>'
                                    +'</div>');
                alert_danger.append("Bạn không có quyền thực thi chức năng này !");
                $(ob).parents('form').find('.error-form').append(alert_danger);
                $(ob).parents('form').find('.error-form').removeClass('hidden');
                $(ob).removeClass('saving');
            }
        });
    };
	// function load_data_to_modal(ob,modal){
   // console.log(123);
	// $(modal).load($(ob).attr('data-url'));
	// $(modal).modal('show');
} 