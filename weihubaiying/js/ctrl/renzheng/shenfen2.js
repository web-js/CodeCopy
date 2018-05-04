var userInfo=JSON.parse(localStorage.getItem(app.userlocalKey));
var zmtInfo=JSON.parse(localStorage.getItem("zmtInfo"));
var firststrp=JSON.parse(localStorage.getItem(firststrp));
/*var weixin=localStorage.getItem("weixin");
console.log(weixin)*/
function is_weixin(){
 	var ua = navigator.userAgent.toLowerCase();
	if (ua.match(/MicroMessenger/i) == "micromessenger") {//如果在微信浏览器端
		document.getElementById('header').style.display="none";
		document.getElementById('content').style.marginTop=0;
	} else {
	 	return false;
	}
}
is_weixin();

var shenfenVM = new Vue({
	el:'#shenfenVM',
	data:{
		renzhengid:""||localStorage.getItem("renzhengid"),
	}
});
if(localStorage.getItem("weibo")){
	document.getElementById("weibo").className += 'active';
}
if(localStorage.getItem("weixin")){
	document.getElementById("weixin").className += 'active';
}
if(localStorage.getItem("qqkongjian")){
	document.getElementById("qqkongjian").className += 'active';
}
if(localStorage.getItem("baidutieba")){
	document.getElementById("baidutieba").className += 'active';
}
if(localStorage.getItem("taobao")){
	document.getElementById("taobao").className += 'active';
}

mui('body').on('tap','.back',function(){
	mui.openWindow({
		url:'shenfen.html',
		id:'shenfen.html'
	});
});

mui('body').on('tap','ul.sjzh li',function(){
	var id = this.id;
	createWin(null,'renzhengWX.html',{id:id});
});

mui('body').on('tap','button',function(){
	if(!   ("weixin")){
		mui.toast("请填写个人微信信息")
	}else{
		$(".imgLoading").css("display","block");
		getPostData("pm.memberapply.add",{//领取任务 ,查看任务进度
			'method':"pm.memberapply.add",
	    	"memberId":userInfo.id,//会员id
	    	"headimage_url":localStorage.getItem('img')?(localStorage.getItem('img')):(JSON.parse(localStorage.getItem('zmtInfo')).headimgurl),//头像
			"content":zmtInfo.introduce,//个人描述
			"nick_name":zmtInfo.name,//完成任务时的id
			"sex":zmtInfo.sex,
			"area":zmtInfo.region,//地区
			"identify":zmtInfo.identity,//身份
			"resources_type_id2":JSON.parse(localStorage.getItem("weibo"))==null?'':(JSON.parse(localStorage.getItem("weibo")).resources_type_id1),//1 微博 2微信 3淘宝 4百度 5知乎
			"number2":JSON.parse(localStorage.getItem("weibo"))==null?'':(JSON.parse(localStorage.getItem("weibo")).number1),//资源账号
			"keyword2":JSON.parse(localStorage.getItem("weibo"))==null?'':(JSON.stringify(JSON.parse(localStorage.getItem("weibo")).keyword1).replace(/\[/,"").replace(/\]/,"")),//关键词
			"fansi_num2":JSON.parse(localStorage.getItem("weibo"))?JSON.parse(localStorage.getItem("weibo")).numberFans:"",//粉丝数量
			"contents2":JSON.parse(localStorage.getItem("weibo"))==null?'':(JSON.stringify(JSON.parse(localStorage.getItem("weibo")).contents).replace(/\[/,"").replace(/\]/,"")),//资源截图
			"resources_type_id1":2,
			"number1":JSON.parse(localStorage.getItem("weixin")).number2,//资源账号
			"keyword1":JSON.stringify(JSON.parse(localStorage.getItem("weixin")).keyword2).replace(/\[/,"").replace(/\]/,""),//关键词
			"fansi_num1":JSON.parse(localStorage.getItem("weixin")).numberFans,//粉丝数量
			"contents1":JSON.stringify(JSON.parse(localStorage.getItem("weixin")).contents).replace(/\[/,"").replace(/\]/,""),//资源截图
			"resources_type_id3":JSON.parse(localStorage.getItem("taobao"))==null?'':(JSON.parse(localStorage.getItem("taobao")).resources_type_id3),
			"number3":JSON.parse(localStorage.getItem("taobao"))==null?'':(JSON.parse(localStorage.getItem("taobao")).number3),//资源账号
			"keyword3":JSON.parse(localStorage.getItem("taobao"))==null?'':(JSON.stringify(JSON.parse(localStorage.getItem("taobao")).keyword3).replace(/\[/,"").replace(/\]/,"")),//关键词
			"fansi_num3":JSON.parse(localStorage.getItem("taobao"))?JSON.parse(localStorage.getItem("taobao")).numberFans:"",//粉丝数量
			"contents3":JSON.parse(localStorage.getItem("taobao"))==null?'':(JSON.stringify(JSON.parse(localStorage.getItem("taobao")).contents).replace(/\[/,"").replace(/\]/,"")),//资源截图
			"resources_type_id4":JSON.parse(localStorage.getItem("baidutieba"))==null?'':(JSON.parse(localStorage.getItem("baidutieba")).resources_type_id4),
			"number4":JSON.parse(localStorage.getItem("baidutieba"))==null?'':(JSON.parse(localStorage.getItem("baidutieba")).number4),//资源账号
			"keyword4":JSON.parse(localStorage.getItem("baidutieba"))==null?'':(JSON.stringify(JSON.parse(localStorage.getItem("baidutieba")).keyword4).replace(/\[/,"").replace(/\]/,"")),//关键词
			"fansi_num4":JSON.parse(localStorage.getItem("baidutieba"))?JSON.parse(localStorage.getItem("baidutieba")).numberFans:"",//粉丝数量
			"contents4":JSON.parse(localStorage.getItem("baidutieba"))==null?'':(JSON.stringify(JSON.parse(localStorage.getItem("baidutieba")).contents).replace(/\[/,"").replace(/\]/,"")),//资源截图
			"resources_type_id5":JSON.parse(localStorage.getItem("qqkongjian"))==null?'':(JSON.parse(localStorage.getItem("qqkongjian")).resources_type_id5)||'',
			"number5":JSON.parse(localStorage.getItem("qqkongjian"))==null?'':(JSON.parse(localStorage.getItem("qqkongjian")).number5),//资源账号
			"keyword5":JSON.parse(localStorage.getItem("qqkongjian"))==null?'':(JSON.stringify(JSON.parse(localStorage.getItem("qqkongjian")).keyword5).replace(/\[/,"").replace(/\]/,"")),//关键词
			"fansi_num5":JSON.parse(localStorage.getItem("qqkongjian"))?JSON.parse(localStorage.getItem("qqkongjian")).numberFans:"",//粉丝数量
			"contents5":JSON.parse(localStorage.getItem("qqkongjian"))==null?'':(JSON.stringify(JSON.parse(localStorage.getItem("weixin")).contents).replace(/\[/,"").replace(/\]/,""))//资源截图
		},function(data,isSuccess){
			console.log(data);
			console.log(JSON.parse(localStorage.getItem("weixin")).number2)
			if(isSuccess){
				if(data.code==000){
					$(".imgLoading").css("display","none");
					mui.toast("身份认证提交成功！")
					setTimeout(function(){
						createWin(null, '../mine/review.html', {id:1});
						window.location();
					},1000)
				}else{
					$(".imgLoading").css("display","none");
					mui.toast(data.description);
				}
			}
		});
	}
});
