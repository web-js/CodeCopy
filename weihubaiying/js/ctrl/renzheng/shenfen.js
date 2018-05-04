var userInfo=JSON.parse(localStorage.getItem(app.userlocalKey));
var globalCameraCanvas;
var globalCameraVideo;
var fileArray = [];

var uploader;
var weight=0;
var memberId=localStorage.getItem('memberId');

function is_weixin() {
 	var ua = navigator.userAgent.toLowerCase();
	if (ua.match(/MicroMessenger/i) == "micromessenger") {//如果在微信浏览器端
		document.getElementById('header').style.display="none";
		document.getElementById('content').style.marginTop=0;
	} else {
	 	return false;
	}
}
is_weixin();

(function($,doc) {
	$.init();
	$.ready(function() {
		var userPicker = new $.PopPicker();
		userPicker.setData([{
			value: 'man',
			text: '男'
			}, {
				value: 'woman',
				text: '女'
			}]);
			var showUserPickerButton = doc.getElementById('showUserPicker');
			var userResult = doc.getElementById('userResult');
			showUserPickerButton.addEventListener('tap', function(event) {
						userPicker.show(function(items) {
							userResult.innerText = items[0].text;
						});
					}, false);
			var cityPicker3 = new $.PopPicker({
				layer: 3
			});
			cityPicker3.setData(cityData3);
			var showCityPickerButton = doc.getElementById('showCityPicker3');
			var cityResult3 = doc.getElementById('cityResult3');
			showCityPickerButton.addEventListener('tap', function(event) {
				cityPicker3.show(function(items) {
					cityResult3.innerText = (items[0] || {}).text + " " + (items[1] || {}).text + " " + (items[2] || {}).text;
					//return false;
				});
			}, false);
		});
	}
)(mui,document);

var shenfenVM = new Vue({
	el:'#shenfenVM',
	data:{
		zmtInfo:JSON.parse(localStorage.getItem('zmtInfo'))||{},
		identity:'',
		region:'',
		data:'',
		sourceLinkArr:[],
		img:localStorage.getItem('img')
	},
	methods:{
		submitForm:function(){
			var nick_name=document.getElementById("nick_name").value;
//			console.log(nick_name)
			var region = mui('#cityResult3')[0].innerHTML;
			var identity = mui('#identity')[0].innerHTML;
			var introduce = mui('#sf_textarea')[0].value;
			var sex=document.getElementById('userResult').innerHTML;
			console.log(sex);
			if(nick_name == ''){
				mui.toast('请输入昵称！');
			}else if((region == '')||(region == '点击选择地区')){
				mui.toast('请选择地区');
			}else if((sex == '')||(sex == '点击选择性别')){
				mui.toast('请选择性别！');
			}else if((identity == '')||identity == '点击选择身份'){
				mui.toast('请选择身份！');
			}else if(introduce == ''){
				mui.toast('请输入自我介绍！');
			}else{
				var arr = ($('#file-list li img')[0].src);
				if(arr==''){
					mui.toast("请上传头像");
					return;
				}else if(arr.indexOf("base64")==-1){
					if(arr.indexOf("p0zez0onh.bkt.clouddn.com")==-1){
						mui.toast("请上传头像");
						return;
					}else{//修改头像
						shenfenVM.zmtInfo.name=document.getElementById("nick_name").value;
						shenfenVM.zmtInfo.region=document.getElementById("cityResult3").innerHTML;//地区
						shenfenVM.zmtInfo.sex=document.getElementById("userResult").innerHTML;//性别
						shenfenVM.zmtInfo.identity=document.getElementById("identity").innerHTML;//身份
						shenfenVM.zmtInfo.introduce=document.getElementById("sf_textarea").value;//自我介绍
						shenfenVM.zmtInfo.headimgurl=arr;
						localStorage.setItem("zmtInfo",JSON.stringify(shenfenVM.zmtInfo));
						uploader.start();
					 	$(".imgLoading").css("display","block");
					}
					
				}else{//第一次上传头像
						shenfenVM.zmtInfo.name=document.getElementById("nick_name").value;
						shenfenVM.zmtInfo.region=document.getElementById("cityResult3").innerHTML;//地区
						shenfenVM.zmtInfo.sex=document.getElementById("userResult").innerHTML;//性别
						shenfenVM.zmtInfo.identity=document.getElementById("identity").innerHTML;//身份
						shenfenVM.zmtInfo.introduce=document.getElementById("sf_textarea").value;//自我介绍
						shenfenVM.zmtInfo.headimgurl=$('#file-list li img')[0].src;
						localStorage.setItem("zmtInfo",JSON.stringify(shenfenVM.zmtInfo));
						uploader.start();
					 	$(".imgLoading").css("display","block");
					}
			}
		}
	},
	mounted:function(){
	}
});

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
try{
	uploader = Qiniu.uploader({//实例化一个plupload上传对象
	runtimes: 'html5,flash,html4',// 上传模式，依次退化
	browse_button : 'changeHeadImg',// 上传选择的点选按钮，必需
	get_new_uptoken: false,  // 设置上传文件的时候是否每次都重新获取新的uptoken
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
	silverlight_xap_url : '../../js/plupload/Moxie.xap',
	auto_start:false,
	multi_selection: false,
	init:{
		'FileUploaded': function(up,files,info) {// 文件添加进队列后，处理相关的事情
			mui.toast('上传成功');
            var domain = up.getOption('domain');
            var res = JSON.parse(info.response);
            var sourceLink =domain +'/'+res.key;
            console.log(shenfenVM.sourceLinkArr)
            shenfenVM.sourceLinkArr.push(sourceLink);
            console.log(shenfenVM.sourceLinkArr)
             setTimeout(function(){
             	$(".imgLoading").css("display","none");
             	addPlatform(shenfenVM.sourceLinkArr);
             },1000)
        },
		'UploadComplete': function(){
            //队列文件处理完毕后，处理相关的事情
//          mui.toast('上传成功');
            console.log(shenfenVM.sourceLinkArr);
            setTimeout(function(){
             	$(".imgLoading").css("display","none");
             	addPlatform(shenfenVM.sourceLinkArr);
             },1000)
      	},
		'FilesAdded':function(uploader,files){
//			mui.toast('文件添加进队列后，处理相关的事情');
			var file_name = files[0].name; //文件名
			//构造html来更新UI
			var id='file-' + files[0].id;
			var file=files[0];
			!function(){
				previewImage(files[0],function(imgsrc){
					$("img#changeHeadImg").replaceWith('<img id="changeHeadImg" class="pull-right" style="position:absolute;top:0;right:0;width: 0.6rem!important;height:0.6rem;border-radius: 50%;margin: 0.08rem 0.16rem 0 0!important;" src="'+ imgsrc +'" />')
				});
		    }();
		},
	}
});
}catch(e){
	console.log(e);
}
function addPlatform(sourceLinkArr){
	console.log(sourceLinkArr)
	shenfenVM.zmtInfo.headimgurl=shenfenVM.sourceLinkArr.length==0?(JSON.parse(localStorage.getItem('zmtInfo')).headimgurl):(shenfenVM.sourceLinkArr[0]);
	localStorage.setItem("zmtInfo",JSON.stringify(shenfenVM.zmtInfo));
	setTimeout(function(){
		createWin(null,'shenfen2.html',null);
	},1000);
}
function previewImage(file,callback){//file为plupload事件监听函数参数中的file对象,callback为预览图片准备完成的回调函数
	if(!file || !/image\//.test(file.type)) return; //确保文件是图片
	if(file.type=='image/gif'){//gif使用FileReader进行预览,因为mOxie.Image只支持jpg和png
		var fr = new mOxie.FileReader();
		console.log(fr);
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


mui('body').on('tap','.back',function(){
	mui.openWindow({
		url:'../index.html',
		id:'../index.html'
	});
});

var identityDiv = document.getElementById('identityDiv');//href="identity.html"
var sf_popup = document.getElementById('sf_popup');
var firstStep = document.getElementById('firstStep');

mui('body').on('tap','#identityChoice',function(){
	identityDiv.classList.remove("mui-hidden"); 
});

mui('body').on('tap','ul.rzUl li',function(){
	$('.rzUl li').removeClass('active')
	$(this).addClass('active');
});
mui('body').on('tap','#identitySelection',function(){
	shenfenVM.identity = mui('.rzUl>.active>span')[0].innerText;
	identityDiv.classList.add("mui-hidden");
});

//点击下一步

mui('body').on('tap','#sf_popup .modelClose',function(){
	sf_popup.classList.add('mui-hidden');
});
mui('body').on('tap','#sf_popup div button',function(){
	sf_popup.classList.add('mui-hidden');
});