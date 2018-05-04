var mobileReg=/^1(3|4|5|7|8)\d{9}$/;
var userInfo=JSON.parse(localStorage.getItem(app.userlocalKey));
var globalCameraCanvas;
var globalCameraVideo;
var fileArray = [];
//console.log(userInfo.id)

var uploader;
var weight=0;
var memberId=localStorage.getItem('memberId');

function is_weixin() {
 	var ua = navigator.userAgent.toLowerCase();
	if (ua.match(/MicroMessenger/i) == "micromessenger") {//如果在微信浏览器端
		document.getElementById('header').style.display="none";
		document.getElementById('center').style.marginTop=0;
	} else {
	 	return false;
	}
}
is_weixin();

(function($, doc) {
	$.init();
	$.ready(function() {
		var userPicker = new $.PopPicker();
		userPicker.setData([{
			value: '男',
			text: '男'
		}, {
			value: '女',
			text: '女'
		}]);
		var showUserPickerButton = doc.getElementById('showUserPicker');
		var userResult = doc.getElementById('userResult');
		showUserPickerButton.addEventListener('tap', function(event) {
			userPicker.show(function(items){
				userResult.value = items[0].value;
				userResult.innerText = items[0].text;
			});
		}, false);
	});
	}
)(mui,document);

var editDataVM = new Vue({
	el:'#editDataVM',
	data:{
		userInfo:JSON.parse(localStorage.getItem(app.userlocalKey)),
		industry:'',
		sex:'',
		phone:'',
		nick_name:'',
		loadSwitch:false,
		data:'',
		sourceLinkArr:[],
	},
	methods:{
		submitForm: function() {
			var sexText = document.getElementById('userResult').innerHTML;
			if(editDataVM.data.nick_name == ''){
				mui.toast('请输入用户名');
			}else 			if(!(mobileReg.test(editDataVM.data.mobile))){
				mui.toast('请输入正确的手机号码');
			}else if(sexText == ''){
				mui.toast('请完善资料');
			}else{
			 	uploader.start();
			 	$(".imgLoading").css("display","block");
			}
		}
	},
	mounted:function(){
		getUserInfo();
		setListener();
	}
});
getUserInfo();
function getUserInfo(){
	getPostData('pm.member.get',{
		"method":'pm.member.get',
		"memberId":userInfo.id
	},function(data,isSuccess){
		console.log(data);
		if(isSuccess){
			editDataVM.data = data.data;
		}
	});
	
	mui("body").on('tap', '.back', function(){
		sessionStorage.setItem('indexPage',"mine");
		createWin(null,'../index.html',null);
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
			
            var domain = up.getOption('domain');
            var res = JSON.parse(info.response);
            var sourceLink =domain +'/'+res.key;
//          editDataVM.sourceLinkArr=sourceLink
             editDataVM.sourceLinkArr.push(sourceLink);
             setTimeout(function(){
             	$(".imgLoading").css("display","none");
				mui.toast('上传成功');
             	addPlatform(editDataVM.sourceLinkArr);
             },1000);
        },
		'UploadComplete': function(){
             //队列文件处理完毕后，处理相关的事情
     		addPlatform(editDataVM.sourceLinkArr);
      	},
		'FilesAdded':function(uploader,files){
//			mui.toast('文件添加进队列后，处理相关的事情')
			var file_name = files[0].name; //文件名
			//构造html来更新UI
			var id='file-' + files[0].id;
			var file=files[0];
			!function(){
				previewImage(files[0],function(imgsrc){
					$("img#changeHeadImg").replaceWith('<img id="changeHeadImg" class="pull-right headPortrait" style="position:absolute;top:0;right:0;" src="'+ imgsrc +'" />')
				});
		    }();
		},
	}
});
}catch(e){
	console.log(e);
}


//任务进度接口
function addPlatform(sourceLinkArr){
	getPostData('pm.member.updateMember',{
		"method":'pm.member.updateMember',
		'memberId':editDataVM.data.id,
		'sex':document.getElementById("userResult").innerHTML,
		'headimgurl': sourceLinkArr[0]||editDataVM.data.headimgurl,
		'nickName':document.getElementById("nick_name").value,
	},function(data,isSuccess){
//		mui.toast('函数执行');
		if(data.code==000){
			editDataVM.data.nick_name=document.getElementById("nick_name").value;
			localStorage.setItem(app.userlocalKey,JSON.stringify(editDataVM.data));
			$(".imgLoading").css("display","none");
			mui.toast(data.description);
			setTimeout(function(){
				createWin(null,'../index.html',null);
			},500)
		}else{
			$(".imgLoading").css("display","none");
			mui.toast(data.description);
		}
	});
}

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
			cutImg(imgsrc);
		};
		preloader.load( file.getSource() );
	}	
}

function setListener(){
	mui('.mui-scroll-wrapper').scroll({
		deceleration: 0.0005
	});
}
//修改
//照片裁剪类  
function cutImg(img) {  
    $("#myProfile").css("display","block"); 
    $("#showEdit").fadeIn();
//  var $image = $('#report>img');  
    var $image = img;  
    $image.cropper('destroy');  
    $image.cropper({  
        checkImageOrigin: true,  
        aspectRatio: 1 / 1,  
        autoCropArea: 0.5,  
        zoom: -0.2  
    });  
}  
//确认照片，展示效果  
function confirm() {  
    $("#showEdit").css("display","none");  
    myProfileVM.loadSwitch=true;
    var $image = $('#report>img');  
    var dataURL = $image.cropper("getCroppedCanvas");  
    var imgurl = dataURL.toDataURL("image/png",0.5);  
    $("#user-avatar>img").attr("src", imgurl);  
    $("#myProfile").show();  
    postAvatar();
}  
//旋转照片  
function rotateimg() {  
    $("#readyimg").cropper('rotate',90);  
}  
function rotateimgleft() { 
    $("#readyimg").cropper('rotate',-90);  
}  
function closepop() {  
    $("#showEdit").fadeOut();  
    var $image = $('#report>img');  
    $image.cropper('destroy');  
    $("#myProfile").show();  
} 