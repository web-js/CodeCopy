//var id = getExtraDataByKey('id');
var id = GetQueryString('id');
console.log(id);
function is_weixin() {
 	var ua = navigator.userAgent.toLowerCase();
	if (ua.match(/MicroMessenger/i) == "micromessenger") {//如果在微信浏览器端
		document.getElementById('back').style.display="none";
		document.getElementById('center').style.marginLeft="0.4rem";
	} else {
	 	return false;
	}
}
is_weixin();

var messageVM = new Vue({
	el:'#messageVM',
	data:{
		id:'',
		list:[]
	},
	methods:{},
	mounted:function(){
		message();
//		let the=this;
	}
})

function message(){
	getPostData('pm.main.info',{
		'method':'pm.main.info',
		'memberId':id
	},function(data,isSuccess){
		console.log(data)
//		mui.toast(data.description);
		if((data.code=="000")&&(data.data)){
			mui.each(data.data.info,function(index,val){
				val.createTime= new Date(val.createTime).toLocaleString();
			});
			messageVM.list=data.data.info;
//			messageVM.list=data.data.info.reverse();
		}
	});
	
	mui.init({
		swipeBack: false
	});
	
	(function($){
		$(".mui-scroll-wrapper").scroll({
			deceleration: 0.0005,
			bounce: false,//滚动条是否有弹力默认是true
			indicators: false, //是否显示滚动条,默认是true
		});
	})(mui);
	
	mui('body').on('tap','.back',function(e){
		sessionStorage.setItem("reload1",1)
		sessionStorage.setItem("reload2",1)
		mui.back();
	});
};
function clearList(){
	getPostData('pm.main.info.delete',{
		'method':'pm.main.info.delete',
		'memberId':id
	},function(data,isSuccess){
		console.log(data)
		mui.toast(data.description);
		setTimeout(function(){
			location.reload();
		},1000);
	})
}
Date.prototype.toLocaleString = function() {
    return this.getFullYear() + "年" + (this.getMonth() + 1) + "月" + this.getDate() + "日 " + (this.getHours()<10?'0'+this.getHours():this.getHours()) + ":" + (this.getMinutes()<10?'0'+this.getMinutes():this.getMinutes()) + ":" + (this.getSeconds()<10?'0'+this.getSeconds():this.getSeconds());
};