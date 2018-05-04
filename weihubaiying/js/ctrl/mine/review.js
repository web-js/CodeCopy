var userInfo=JSON.parse(localStorage.getItem(app.userlocalKey));
//var id = getExtraDataByKey('id');
//var personalId = getExtraDataByKey('personalId');
//var id = GetQueryString('id');
      
var personalId = GetQueryString('personalId');

function is_weixin() {
 	var ua = navigator.userAgent.toLowerCase();
	if (ua.match(/MicroMessenger/i) == "micromessenger"){//如果在微信浏览器端
		document.getElementById('back').style.display="none";
		document.getElementById('center').style.marginLeft=0;
		return true;
	}else{
	 	return false;
	}
}
is_weixin();

var reviewVM = new Vue({
	el:'#reviewVM',
	data:{
		userInfo:JSON.parse(localStorage.getItem(app.userlocalKey)),
		id:'',
		personalId:personalId,
		feedback:''
	},
	methods:{
         //	    获取id
         gitId:function(){
         	reviewVM.id=GetQueryString('id');
         	console.log(GetQueryString('id'));
         },
		//审核中
		reviewing:function(){
			createWin(null, '../index.html', {id:userInfo.id});
			setTimeout(function(){
				location.reload();
			},1000);
		},
		//审核成功
		reviewOk:function(){
			localStorage.setItem("zmtOk",1);
			createWin(null, '../index.html', null);
			setTimeout(function(){
				location.reload()
			},1000);
		},
		//审核失败
		unreview: function() {
			localStorage.removeItem("weixin");
			localStorage.removeItem("weibo");
			localStorage.removeItem("qqkongjian");
			localStorage.removeItem("baidutieba");
			localStorage.removeItem("taobao");
			localStorage.removeItem("zmtInfo");
			createWin(null, '../renzheng/shenfen.html', {id:userInfo.id});
			setTimeout(function(){
				location.reload()
			},1000);
		}
	},
	mounted:function(){
		gitId()
	}
});
if(personalId!=null){
	getPostData('pm.media.reback',{
		"method":'pm.media.reback',
		"m_id":personalId
	},function(data,isSuccess){
		console.log(data);
		reviewVM.feedback=data.data.feedback;
	});
}
