var userInfo=JSON.parse(localStorage.getItem(app.userlocalKey));
var id = getExtraDataByKey('taskId');
localStorage.setItem("list",JSON.stringify([{id:id,userid:userInfo.id}]));

function is_weixin() {
 	var ua = navigator.userAgent.toLowerCase();
	if (ua.match(/MicroMessenger/i) == "micromessenger") {//如果在微信浏览器端
		document.getElementById('back').style.display="none";
		document.getElementById('center').style.marginLeft="0.1rem";
	} else {
	 	return false;
	}
}
is_weixin();

var uploader1;
var weight=0;
var memberId=localStorage.getItem('memberId');
var taskListDetailsVM = new Vue({
	el: "#taskListDetailsVM",
	data: {
		taskId:'',
		mobile:'',
		f_id:'',
		feedback:"",
		time:0,
		task:'',
		f_name:'',//完成任务的社交账号名称
		statu:0,
		sourceLinkArr:[],
	},
	methods: {
		submitForm: function(){
			if(document.getElementById("socialName").value==''){
				mui.toast("请填写"+this.f_name);
			}else{
				var arr = ($('#file-list li img')[0].src);
				if(arr.indexOf("sctp") != -1){
					addPlatform('','0');
					/*mui.toast("请上传图片");
					return;*/
				}else{
			 		uploader1.start();
			 		$(".imgLoading").css("display","block");
				}
			}
		}
	},
	created: function() {},
	mounted: function() {
		setListener();
	}
});
if(taskListDetailsVM.statu==0){
//任务提交审核接口
function addPlatform(sourceLinkArr,imgType){
	getPostData("pm.task.doing",{
		'method':"pm.task.doing",
    	"memberId":userInfo.id,//会员id
    	"taskId":id,//任务id
		"contents":JSON.stringify(sourceLinkArr),//做任务截图
		"f_id":document.getElementById("socialName").value,//完成任务时的id
	},function(data,isSuccess){
		console.log(data);
		if(imgType == '0'){
			 console.log('没有图片上传数据');
		}else{
			mui.toast('第'+sourceLinkArr.length+'张图片');
			if(data.code==000){
				$(".imgLoading").css("display","none");
				document.getElementById('loading').style.display='block';
				setTimeout(function(){
					document.getElementById('loading').style.display='none';
					location.reload();
				},10000);
			}
		}
	});
}

function utf16to8(str) {
    var out, i, len, c;
    out = "";
    len = str.length;
    for (i = 0; i < len; i++) {
      c = str.charCodeAt(i);
      if ((c >= 0x0001) && (c <= 0x007F)) {
        out += str.charAt(i);
      } else if (c > 0x07FF) {
        out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
        out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
        out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
      } else {
        out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
        out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
      }
    }
    return out;
}

var safe64 = function(base64){
    base64 = base64.replace(/\+/g, "-");
    base64 = base64.replace(/\//g, "_");
    return base64;
};

var sourceLinkArr = [];
	uploader1 = Qiniu.uploader({//实例化一个plupload上传对象
	runtimes: 'html5,flash,html4',// 上传模式，依次退化
	browse_button : 'browse',// 上传选择的点选按钮，必需
	get_new_uptoken: false,  // 设置上传文件的时候是否每次都重新获取新的uptoken
//	uptoken:"ValMdSj_M4Bzxr9P_c-bq5frrF9yc_srmNvIAZiP:Ln1tukOFQkVGl27QSnlBXOaLreg=:eyJzY29wZSI6ImZtd2wiLCJkZWFkbGluZSI6MTUwMTgyNTgyMH0=",
	// uptoken是上传凭证，由其他程序生成
	multi_selection: false,// 禁用多选
	uptoken_func: function(secretKey, putPolicy) {
		var accessKey="aFQt3ilD4j4bFT7ncBPt7blm4N4QMTNWFwmQ7M6D";//密钥AK
		var secretKey="n8wQJ1bkywohWwwD84ev6mO6LcWy07RlHT6yvC3c";//密钥SK
		var putPolicy={"scope":"weihubaiyingrenwu","deadline":parseInt(new Date().getTime()/1000+3600)}
	    var put_policy = JSON.stringify(putPolicy);
	    var encoded = new Base64().encode(utf16to8(put_policy));
	    var hash = CryptoJS.HmacSHA1(encoded, secretKey);
	    var encoded_signed = hash.toString(CryptoJS.enc.Base64);
	    var upload_token = accessKey + ":"+safe64(encoded_signed)+ ":" + encoded;
	    return upload_token;
	 },
	domain: 'http://p0zez0onh.bkt.clouddn.com',// bucket域名，下载资源时用到，必需
	flash_swf_url : '../../js/plupload/Moxie.swf',//引入flash，相对路径
	dragdrop: true,// 开启可拖曳上传
	drop_element: 'submitTask',// 拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
	silverlight_xap_url : '../../js/plupload/Moxie.xap',
	multi_selection: false,
	init:{
		'FileUploaded': function(up,files,info) {// 文件添加进队列后，处理相关的事情
            var domain = up.getOption('domain');
            var res = JSON.parse(info.response);
            var sourceLink =domain +'/'+res.key;
            sourceLinkArr.push(sourceLink)
            addPlatform(sourceLinkArr,'1');
            mui.toast('上传成功');
        },
		'UploadComplete': function() {
             //队列文件处理完毕后，处理相关的事情
            addPlatform(sourceLinkArr,'1');
            mui.toast('上传成功');
      	},
		'FilesAdded':function(uploader,files){
			for(var i = 0, len = files.length; i<len; i++){
				var file_name = files[i].name; //文件名
				//构造html来更新UI
				var id='file-' + files[i].id;
				var file=files[i];
				var html = '<li style="position:relative;float:left;width:32%;height:1.11rem;margin-right:1%;overflow-y:hidden;" id="'+id+'"></li>';
				var a=document.getElementById("file-list");
				var lis=a.getElementsByTagName("li");
				if(lis.length<=3){
					$(html).insertBefore('#file-list .addPhoto');
					!function(i){
						previewImage(files[i],function(imgsrc){
							$('#file-'+files[i].id).append('<img style="position:absolute;top:-10px;left:0;width:100%;margin:auto;" src="'+ imgsrc +'" /><div class="closeLayer "><img style="position:absolute;right:-0.13rem;top:-0.12rem;width:.2rem;z-index:1;" src="../../img/img_delete_error.png"  class="plus-pic"></div>');
						});
				    }(i);
				}
			    mui('#'+id).on('tap','.plus-pic',function() {
					uploader1.removeFile(file);
					$('#'+id).remove();
				});
				if(lis.length>=4){
					alert("最多添加3张图片!");
					return;
				}
			}
		}
	}
});

//绑定文件添加进队列事件

//plupload中为我们提供了mOxie对象
//有关mOxie的介绍和说明请看：https://github.com/moxiecode/moxie/wiki/API
//如果你不想了解那么多的话，那就照抄本示例的代码来得到预览的图片吧
function previewImage(file,callback){//file为plupload事件监听函数参数中的file对象,callback为预览图片准备完成的回调函数
	if(!file || !/image\//.test(file.type)) return; //确保文件是图片
	if(file.type=='image/gif'){//gif使用FileReader进行预览,因为mOxie.Image只支持jpg和png
		var fr = new mOxie.FileReader();
		fr.onload = function(){
			callback(fr.result);
			fr.destroy();
			fr = null;
		}
		fr.readAsDataURL(file.getSource());
	}else{
		var preloader = new mOxie.Image();
		preloader.onload = function() {
			preloader.downsize( 300, 300 );//先压缩一下要预览的图片,宽300，高300
			var imgsrc = preloader.type=='image/png' ? preloader.getAsDataURL('image/png',80) : preloader.getAsDataURL(); //得到图片src,实质为一个base64编码的数据
//			console.log(imgsrc)
			callback && callback(imgsrc); //callback传入的参数为预览图片的url
			preloader.destroy();
			preloader = null;
		};
		preloader.load(file.getSource());
	}	
}

}

function setListener(){
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
	
	getPostData("pm.task.do",{
		'method':"pm.task.do",
    	"memberId":userInfo.id,//会员id
    	"taskId":id,//任务id
		"pageNum":1,//当前页数
		"pageNum":5,//每页条数
	},function(data,isSuccess){
		console.log(data)
		taskListDetailsVM.f_name=data.data.f_name;
		
		var time1=window.setInterval(doTick,1000);
		doTick();
		function doTick() {
			var a=(data.data.taskTime);//任务到期时间
			var timeChange=parseInt((a-$.now())/1000);
			timeChange--;
			if(timeChange==0){
				mui.confirm('任务未在规定时间内完成，已过期。', '提示', ['确认'], function(e) {
					if (e.index == 0) {
						sessionStorage.setItem("reload",1);//处理app端返回不刷新问题
						sessionStorage.setItem("reload4",1);//处理微信端返回不刷新问题
						getPostData('pm.task.over',{
							'method' : 'pm.task.over',
							'memberId' : userInfo.id,
							'taskId' : id,
						},function(data,isSuccess){
							console.log(data);
						});
						setTimeout(function(){
							mui.back();
							
						},500);
					} 
				});
			}
			var time=Time(timeChange);
			taskListDetailsVM.time=time;
			if(document.getElementById('time')){
				document.getElementById('time').innerHTML=taskListDetailsVM.time;
			}else{
				window.clearInterval(time1);
			}
    	}
		
		console.log(taskListDetailsVM.time)
		
	});
	
	document.getElementById('back').onclick=function(){
		sessionStorage.setItem("reload",1);
		setTimeout(function(){
			mui.back();
		},500)
	}
	
	mui('body').on('tap','a.wxy',function(){
		createWin(null,"../task/taskSquare.html",{id:"wxy"});
	});

	mui("body").on("tap","li.task",function(){
		console.log(this.id)
		createWin(null,'taskDetails.html',{id:this.id});
	});
	
	//statu任务状态 0进行中 1 待审核 2已结束 3 通过 4未通过
	getPostData("pm.task.result",{
		'method':"pm.task.result",
		"memberId":userInfo.id,//会员id
		"taskId":id,//任务id
	},function(data,isSuccess){
		console.log(data,id)
		if(isSuccess){
			taskListDetailsVM.feedback=data.data.feedback;
			taskListDetailsVM.statu=data.data.statu;
			taskListDetailsVM.task=data.data.task;
		}
	});
}

//时间转换函数
function Time(timeChange) {
	var Hours= Math.floor((timeChange % 86400) / 3600)<0?0:Math.floor((timeChange % 86400) / 3600);
        var Minutes = Math.floor(((timeChange % 86400) % 3600) / 60)<0?0:Math.floor(((timeChange % 86400) % 3600) / 60);
        var Seconds = Math.floor((((timeChange % 86400) % 3600) % 60) % 60)<0?0:Math.floor((((timeChange % 86400) % 3600) % 60) % 60);
        return (Hours<10?'0'+Hours:Hours)+"&#58;"+(Minutes<10?'0'+Minutes:Minutes)+'&#58;'+(Seconds<10?'0'+Seconds:Seconds);
}