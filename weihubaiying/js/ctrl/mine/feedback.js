//var id = getExtraDataByKey('id');
var id = GetQueryString('id');

function is_weixin(){
 	var ua = navigator.userAgent.toLowerCase();
	if (ua.match(/MicroMessenger/i) == "micromessenger") {//如果在微信浏览器端
		document.getElementById('back').style.display="none";
		document.getElementById('center').style.marginTop=0;
	} else {
	 	return false;
	}
}
is_weixin();

var feedbackVM = new Vue({
	el:'#feedbackVM',
	data:{
		content:'',
		id:''
	},
	methods:{
		feedback:function(){
			if(this.content == ''){
				mui.toast('内容不得为空！');
			}else{
				getPostData('pm.proposal.add',{
			   		'memberId':id,
			   		'content':this.content,
			   		'method':'pm.proposal.add'
			   	},function(data,isSuccess){
			   		mui.toast('反馈提交成功！');
			   		setTimeout(function(){
			   			mui.back();
			   		},1000)
			   	})
			}
		}
	},
	created:function(){},
	mounted:function(){}
});
