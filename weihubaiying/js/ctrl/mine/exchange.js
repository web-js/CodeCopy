var userInfo=JSON.parse(localStorage.getItem(app.userlocalKey));
//var bankcard = getExtraDataByKey('bankcard');
var bankcard = GetQueryString('bankcard');

function is_weixin() {
 	var ua = navigator.userAgent.toLowerCase();
	if (ua.match(/MicroMessenger/i) == "micromessenger") {//如果在微信浏览器端
		document.getElementById('back').style.display="none";
		document.getElementById('center').style.marginLeft='.5rem';
	} else {
	 	return false;
	}
}
is_weixin();

var exchangeVM = new Vue({
	el:'#exchangeVM',
	data:{
		quantity:'',
		userInfo:userInfo,
		bankcard:bankcard,
		balance:''
	},
	methods:{
		/*quanbu:function(){
			exchangeVM.quantity = userInfo.balance;
			console.log(exchangeVM.quantity);
		},*/
		submit:function(){
			if(this.quantity == ''){
				mui.toast('请输入兑换数量！');
			}else if(this.quantity > this.balance){
				console.log(this.quantity>this.balance)
				mui.toast('兑换数量不能大于余额！');
			}else if(this.quantity < '10'){
				mui.toast('兑换数量不能小于10！');
			}else{
				getPostData('pm.member.withdrawal',{
					'method':'pm.member.withdrawal',
					'memberId':userInfo.id,
					'accountNumber':bankcard,
					'money':exchangeVM.quantity
				},function(data,isSuccess){
					if(data.code==000){
						mui.toast("提示兑换申请已提交，请在兑换记录查看兑换进度");
						setTimeout(function(){
							location.reload();
						},1000)
					}else{
						mui.toast("申请失败")
					}
					
				});
			}
		}
	}
});

getPostData('pm.member.get',{
	"method":'pm.member.get',
	"memberId":userInfo.id
},function(data,isSuccess){
//	 console.log(data);
	if(data.data){
		exchangeVM.balance=data.data.balance;
	}
});

mui('body').on('tap','.back',function(){
	mui.back();
	setTimeout(function(){
		location.reload();
	},1000)
});

mui('body').on('tap','#all',function(){
	getPostData('pm.member.get',{
		"method":'pm.member.get',
		"memberId":userInfo.id
	},function(data,isSuccess){
		 console.log(data);
		if(data.data){
			exchangeVM.quantity=data.data.balance
		}
	});
});

mui('body').on('tap','#dhjl',function(){
	createWin(null,'exchangeRecord.html',null)
});
var exchangeModel = document.getElementById('exchangeModel');

mui('body').on('tap','#dhgz',function(){
	exchangeModel.classList.remove('mui-hidden');
});
mui('body').on('tap','div.tcDiv button',function(){
	exchangeModel.classList.add('mui-hidden');
});