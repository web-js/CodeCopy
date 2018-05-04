//var aType=localStorage.getItem('aType');

var userInfo=JSON.parse(localStorage.getItem(app.userlocalKey));
var id = getExtraDataByKey('taskId');
var list = getExtraDataByKey('list');
var renzhengid=getExtraDataByKey('id');
console.log(renzhengid);

var uploader1;
var weight=0;
var memberId=localStorage.getItem('memberId');

var weibo={};
var weixin={};
var taobao={};
var baidutieba={};
var qqkongjian={};

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

localStorage.setItem("list",JSON.stringify([{id:id,userid:userInfo.id}]));
console.log(localStorage);

var rzVM = new Vue({
	el: "#rzVM",
	data: {
		formid:renzhengid,
		key_word:[],
		taskId:'',
		mobile:'',
		f_id:'',
		feedback:"",
		time:0,
		content1:'',
		content2:'',
		content3:'',
		content4:'',
		content5:'',
		sourceLinkArr:[],
		fileName:[]
	},
	methods: {
		rzSbmit: function() {
			var arr = ($('#file-list li img')[0].src);
			var btnArray = ['取消','确认'];
			if(document.getElementById("account").value==""){
				mui.toast("请填写你的账号");
			}else if(rzVM.key_word.length==0){
				mui.toast("请选择关键词");
			}else if(document.getElementById("numberFans").value==""){
				mui.toast("请填写粉丝数量");
			}else{
				if(renzhengid=="weibo"){
					weibo.resources_type_id1=1;
					weibo.number1=document.getElementById("account").value;
					weibo.keyword1=rzVM.key_word;
					weibo.numberFans=document.getElementById("numberFans").value;
					if(arr.indexOf("sctp") != -1){
						addPlatform('','0');
					}else{
						if(document.getElementById('browse')==null){
							addPlatform(JSON.parse(localStorage.getItem("weibo")).contents,'2')
							return;
						}else{
							mui.confirm('一旦确认上传，此通讯录截图将不能进行修改！', '提示', btnArray, function(e) {
								if (e.index == 1) {
									uploader1.start();
				 					$(".imgLoading").css("display","block");
								} 
							});
						}
					}
				}else if(renzhengid=="weixin"){
					weixin.resources_type_id2=2;
					weixin.number2=document.getElementById("account").value;
					weixin.keyword2=rzVM.key_word;
					weixin.numberFans=document.getElementById("numberFans").value;
					if(arr.indexOf("sctp") != -1){
						addPlatform('','0');
					}else{
						if(document.getElementById('browse')==null){
							addPlatform(JSON.parse(localStorage.getItem("weixin")).contents,'2')
							return;
						}else{
							mui.confirm('一旦确认上传，此通讯录截图将不能进行修改！', '提示', btnArray, function(e) {
								if (e.index == 1) {
									uploader1.start();
				 					$(".imgLoading").css("display","block");
								} 
							});
						}
					}
				}else if(renzhengid=="taobao"){
					taobao.resources_type_id3=3;
					taobao.number3=document.getElementById("account").value;
					taobao.keyword3=rzVM.key_word;
					taobao.numberFans=document.getElementById("numberFans").value;
					if(arr.indexOf("sctp") != -1){
						addPlatform('','0');
					}else{
				 		if(document.getElementById('browse')==null){
							addPlatform(JSON.parse(localStorage.getItem("taobao")).contents,'2')
							return;
						}else{
							mui.confirm('一旦确认上传，此通讯录截图将不能进行修改！', '提示', btnArray, function(e) {
								if (e.index == 1) {
									uploader1.start();
				 					$(".imgLoading").css("display","block");
								} 
							});
						}
					}
				 	console.log(taobao)
				}else if(renzhengid=="baidutieba"){
					baidutieba.resources_type_id4=4;
					baidutieba.number4=document.getElementById("account").value;
					baidutieba.keyword4=rzVM.key_word;
					baidutieba.numberFans=document.getElementById("numberFans").value;
					if(arr.indexOf("sctp") != -1){
						addPlatform('','0');
					}else{
				 		if(document.getElementById('browse')==null){
							addPlatform(JSON.parse(localStorage.getItem("baidutieba")).contents,'2')
							return;
						}else{
							mui.confirm('一旦确认上传，此通讯录截图将不能进行修改！', '提示', btnArray, function(e) {
								if (e.index == 1) {
									uploader1.start();
				 					$(".imgLoading").css("display","block");
								} 
							});
						}
					}
				}else if(renzhengid=="qqkongjian"){
					qqkongjian.resources_type_id5=5;
					qqkongjian.number5=document.getElementById("account").value;
					qqkongjian.keyword5=rzVM.key_word;
					qqkongjian.numberFans=document.getElementById("numberFans").value;
					if(arr.indexOf("sctp") != -1){
						addPlatform('','0');
					}else{
						if(document.getElementById('browse')==null){
							addPlatform(JSON.parse(localStorage.getItem("qqkongjian")).contents,'2')
							return;
						}else{
							mui.confirm('一旦确认上传，此通讯录截图将不能进行修改！', '提示', btnArray, function(e) {
								if (e.index == 1) {
									uploader1.start();
				 					$(".imgLoading").css("display","block");
								} 
							});
						}
					}
				}
				
				
				
			}
		}
	},
	created: function() {},
	mounted: function() {
		setListener();
	}
});

function addPlatform(sourceLinkArr,imgType){
	if(renzhengid=="weibo"){
		weibo.contents=sourceLinkArr;
		localStorage.setItem(renzhengid,JSON.stringify(weibo));
		$(".imgLoading").css("display","block");
	}else if(renzhengid=="weixin"){
		console.log(sourceLinkArr)
		weixin.contents=sourceLinkArr;
		localStorage.setItem(renzhengid,JSON.stringify(weixin));
	}else if(renzhengid=="taobao"){
		taobao.contents=sourceLinkArr;
		localStorage.setItem(renzhengid,JSON.stringify(taobao));
	}else if(renzhengid=="baidutieba"){
		baidutieba.contents=sourceLinkArr;
		localStorage.setItem(renzhengid,JSON.stringify(baidutieba));
	}else if(renzhengid=="qqkongjian"){
		qqkongjian.contents=sourceLinkArr;
		localStorage.setItem(renzhengid,JSON.stringify(qqkongjian));
	}
	if(imgType == '0'){
		 console.log('没有图片上传数据');
	}else if(imgType == '2'){
		document.getElementById('loading').style.display='block';
		mui.toast('信息更改成功！');
		setTimeout(function(){
			document.getElementById('loading').style.display='none';
			createWin(null,'shenfen2.html',null);
		},1000);
	}else{
		mui.toast('第'+sourceLinkArr.length+'张图片');
		document.getElementById('loading').style.display='block';
		setTimeout(function(){
			document.getElementById('loading').style.display='none';
			createWin(null,'shenfen2.html',null);
		},10000);
	}
}
console.log(weixin);

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

var safe64 = function(base64) {
    base64 = base64.replace(/\+/g, "-");
    base64 = base64.replace(/\//g, "_");
    return base64;
};

var sourceLinkArr = [];

uploader1 = Qiniu.uploader({ //实例化一个plupload上传对象
	runtimes: 'html5,flash,html4',// 上传模式，依次退化
	browse_button : 'browse',// 上传选择的点选按钮，必需
	get_new_uptoken: false,
	uptoken_func: function(secretKey, putPolicy) {
		var accessKey="aFQt3ilD4j4bFT7ncBPt7blm4N4QMTNWFwmQ7M6D";//密钥AK
		var secretKey="n8wQJ1bkywohWwwD84ev6mO6LcWy07RlHT6yvC3c";//密钥SK
		var putPolicy={
			"scope":"weihubaiyingrenwu",
			"deadline":parseInt(new Date().getTime() / 1000 + 3600)
		}
	    var put_policy = JSON.stringify(putPolicy);
	    var encoded = new Base64().encode(utf16to8(put_policy));
	    var hash = CryptoJS.HmacSHA1(encoded, secretKey);
	    var encoded_signed = hash.toString(CryptoJS.enc.Base64);
	    var upload_token = accessKey + ":"+safe64(encoded_signed)+ ":" + encoded;
	    console && console.log("upload_token=", upload_token)
	    return upload_token;
	 },
	domain: 'http://p0zez0onh.bkt.clouddn.com',// bucket域名，下载资源时用到，必需http://p20f2fsbn.bkt.clouddn.com/o_1c2vh0kc86hurivpua12m11e65a.jpg
	flash_swf_url : '../../js/plupload/Moxie.swf',//引入flash，相对路径
//	dragdrop: true,// 开启可拖曳上传
//	drop_element: 'submitTask',// 拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
	silverlight_xap_url : '../../js/plupload/Moxie.xap',
	multi_selection: false,// 禁用多选
	init:{
		'FileUploaded': function(up,files,info) {// 文件添加进队列后，处理相关的事情
            var domain = up.getOption('domain');
            var res = JSON.parse(info.response);
            var sourceLink =domain +'/'+res.key;
            sourceLinkArr.push(sourceLink);
            console.log('55555555' + sourceLink,sourceLinkArr.length);
            addPlatform(sourceLinkArr,'1');
            setTimeout(function(){
             	$(".imgLoading").css("display","none");
				mui.toast('上传成功');
            },1000);
        },
		'UploadComplete': function() {
             //队列文件处理完毕后，处理相关的事情
            console.log('队列文件处理完毕后，处理相关的事情');
            addPlatform(sourceLinkArr,'1');
         	setTimeout(function(){
             	$(".imgLoading").css("display","none");
             },1000)
      	},
		'FilesAdded':function(uploader,files){
//			mui.toast('文件添加进队列后，处理相关的事情');
			for(var i = 0, len = files.length; i<len; i++){
				var file_name = files[i].name; //文件名
				//构造html来更新UI
				var id='file-' + files[i].id;
				var file=files[i];
				var a=document.getElementById("file-list");
				var lis=a.getElementsByTagName("li");
			    
				var html = '<li style="position:relative;float:left;width:32%;height:1.11rem;margin-right:1%;overflow-y:hidden;" id="'+id+'"></li>';
				
				if(lis.length<=3){
					$(html).insertBefore('#file-list .addPhoto');
					!function(i){
					previewImage(files[i],function(imgsrc){
						$('#file-'+files[i].id).append('<img style="position:absolute;top:-10px;left:0;width:100%;margin:auto;" src="'+ imgsrc +'" /><div class="closeLayer"><img style="position:absolute;right:0rem;top:0rem;width:.2rem;z-index:1;" src="../../img/img_delete_error.png"  class="plus-pic"></div>');
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
			callback && callback(imgsrc); //callback传入的参数为预览图片的url
			preloader.destroy();
			preloader = null;
		};
		preloader.load( file.getSource() );
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
}


//点击返回按钮  返回上一个页面
mui('body').on('tap','.back',function(){
	mui.openWindow({
		url:'shenfen2.html',
		id:'shenfen2.html'
	});
});

var imgBox = document.getElementById('imgBox');
var keyBox = document.getElementById('keyBox');
mui('body').on('tap','#toKeyword',function(){
	imgBox.classList.add('mui-hidden');
	keyBox.classList.remove('mui-hidden');
});


$(function(){
	$('ul.rzUl').on('tap','li',function(){
		for (var i=0;i<$('.rzUl li').length;i++) {
			
			if($('.rzUl li.active').length <= 2){
				if($(this).hasClass('active')){
					$(this).removeClass('active')
				}else{
					$(this).addClass('active');
				}
			}else{
				if($(this).hasClass('active')){
					$(this).removeClass('active')
				}
			}
		}
	})
	$('body').on('tap','#keyBtn',function(){
		var list=[];
		if ($('.active').length<2) {
			mui.toast('请选择至少两个标签');
		} else{
			$('.active').each(function(){
				list.push($(this).find('span').text());
			});
			rzVM.key_word = list;
//			console.log(list);
			imgBox.classList.remove('mui-hidden');
			keyBox.classList.add('mui-hidden');
		}
		
	})
});
if(renzhengid=="weibo"){
	JSON.parse(localStorage.getItem("weibo"))?document.getElementById("account").value=JSON.parse(localStorage.getItem("weibo")).number1:'';
	JSON.parse(localStorage.getItem("weibo"))?rzVM.key_word=JSON.parse(localStorage.getItem("weibo")).keyword1:'';
	JSON.parse(localStorage.getItem("weibo"))?document.getElementById("numberFans").value=JSON.parse(localStorage.getItem("weibo")).numberFans:'';
	JSON.parse(localStorage.getItem("weibo"))?rzVM.content1=JSON.parse(localStorage.getItem('weibo')).contents:'';
}
if(renzhengid=="weixin"){
	JSON.parse(localStorage.getItem("weixin"))?document.getElementById("account").value=JSON.parse(localStorage.getItem("weixin")).number2:'';
	JSON.parse(localStorage.getItem("weixin"))?rzVM.key_word=JSON.parse(localStorage.getItem("weixin")).keyword2:'';
	JSON.parse(localStorage.getItem("weixin"))?document.getElementById("numberFans").value=JSON.parse(localStorage.getItem("weixin")).numberFans:'';
	JSON.parse(localStorage.getItem("weixin"))?rzVM.content2=JSON.parse(localStorage.getItem('weixin')).contents:'';
}
if(renzhengid=="taobao"){
	JSON.parse(localStorage.getItem("taobao"))?document.getElementById("account").value=JSON.parse(localStorage.getItem("taobao")).number3:'';
	JSON.parse(localStorage.getItem("taobao"))?rzVM.key_word=JSON.parse(localStorage.getItem("taobao")).keyword3:'';
	JSON.parse(localStorage.getItem("taobao"))?document.getElementById("numberFans").value=JSON.parse(localStorage.getItem("taobao")).numberFans:'';
	JSON.parse(localStorage.getItem("taobao"))?rzVM.content3=JSON.parse(localStorage.getItem('taobao')).contents:'';
}
if(renzhengid=="baidutieba"){
	JSON.parse(localStorage.getItem("baidutieba"))?document.getElementById("account").value=JSON.parse(localStorage.getItem("baidutieba")).number4:'';
	JSON.parse(localStorage.getItem("baidutieba"))?rzVM.key_word=JSON.parse(localStorage.getItem("baidutieba")).keyword4:'';
	JSON.parse(localStorage.getItem("baidutieba"))?document.getElementById("numberFans").value=JSON.parse(localStorage.getItem("baidutieba")).numberFans:'';
	JSON.parse(localStorage.getItem("baidutieba"))?rzVM.content4=JSON.parse(localStorage.getItem('baidutieba')).contents:'';
}
if(renzhengid=="qqkongjian"){
	JSON.parse(localStorage.getItem("qqkongjian"))?document.getElementById("account").value=JSON.parse(localStorage.getItem("qqkongjian")).number5:'';
	JSON.parse(localStorage.getItem("qqkongjian"))?rzVM.key_word=JSON.parse(localStorage.getItem("qqkongjian")).keyword5:'';
	JSON.parse(localStorage.getItem("qqkongjian"))?document.getElementById("numberFans").value=JSON.parse(localStorage.getItem("qqkongjian")).numberFans:'';
	JSON.parse(localStorage.getItem("qqkongjian"))?rzVM.content5=JSON.parse(localStorage.getItem('qqkongjian')).contents:'';
}