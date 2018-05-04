var id = getExtraDataByKey('id')||GetQueryString('id');
//var id = GetQueryString('id');

//function is_weixin() {
// 	var ua = navigator.userAgent.toLowerCase();
//	if (ua.match(/MicroMessenger/i) == "micromessenger") {//如果在微信浏览器端
//		document.getElementById('back').style.display="none";
//		document.getElementById('center').style.marginLeft="0.1rem";
//	} else {
//	 	return false;
//	}
//}
//is_weixin();

var mainVM = new Vue({
	el:'#mainVM',
	data:{
		memberId:'',
		lw:[],
		addtime:'',
		list:[]
	},
	methods:{},
	mounted:function(){
		integral()
	}
});

function integral(){
	getPostData("pm.member.jifen",{
		"method":'pm.member.jifen',
		"memberId":id
	},function(data,isSuccess){
		console.log(data);
		if(isSuccess){
			var list = data.data.lw;
			mui.each(list,function(index,val){
				val.addtime = getLocalTime(val.addtime)
			});
			mainVM.lw = list;
		}
	})
}

function getLocalTime(nS) {     
    return new Date(parseInt(nS)).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");      
} 