var ajax_url_submit_fomr_mail = "/app/public/?s=/index/index/submit_form_mail";
$(function(){
	$(document)
	.on('submit-form-mail', function (e) {
		var aid = $('.tao-can li.active').data('aid');
		var num = $('[name="qty_item_1"]').val();
		var ming = $('[data-validate="ming"]').val();
		var phone = $('[data-validate="phone"]').val();
		$.post(ajax_url_submit_fomr_mail, {
			aid: aid,
			num: num,
			ming: ming,
			phone: phone
		}, function (data) {
			if (data.code == 200) {
				location.reload();
			} else {
				;
			}
			alert(data.msg);
		}, 'json')
	})
})