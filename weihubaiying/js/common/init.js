//var serverUrl='http://192.168.200.11:8080/zhidongpaotui/';
//线上的测试地址 
//var serverUrl = 'http://192.168.200.218:8080/whby-api/app?';
//var serverUrl = 'http://123.233.116.47:8080/whby-api/app?';
//var serverUrl = 'http://222.175.139.165:8085/whby-api/app?';
//正式地址
var serverUrl='http://124.133.43.12:8081/whby-api/app?';
//var serverUrl = 'http://222.175.139.165:8066/whby-api/app?';
//var serverUrl = 'http://weixin.zhouzhangbao.me/app?';

//李晓依本地电脑地址
//var serverUrl = 'http://192.168.200.99:8080/whby-api/app?';


var app = {
	//应用程序的key
	appkey:'002',
	//版本
	v:'1.0',
	//输出格式（XML、JSON）
	format:'JSON',
	//终端类型
	overType: '2',
	//APP版本
	version: '1.0.0',
	basePath: "/zdApp/",
	//APPid
	appid: 'HBuilder',
	//marketpagesession key
	marketPageSessionKey: 'MarketPageSessionKey_zhidongH5',
	//pagesession key
	pageSessionKey: 'PageSessionKey_zhidongH5',
	//usersession key
	userlocalKey: 'userlocalKey_zhidongH5',
	//addresssession key
	addSessionKey: 'AddressSessionKey_zhidongH5',
	//settingSession key
	settingSessionKey: 'SettingSessionKey_zhidongH5',
	//cartListSession key
	cartListSessionKey: 'CartListSessionKey_zhidongH5',
	//oauth key 包括授权和登录等
	oauthSessionKey: 'OauthSessionKey_zhidongH5',
	//全局验证参数
	validateData: 'Epoint_WebSerivce_**##0601',
	//更新文件地址 
	updateFileUrl: '',
	//页面级系统参数,注册的时候用到
	userSource: '3',
	//0：Android APP 1：iOS APP 2：PC Web 3：WAP 4：QQ 5：新浪微博 6：微信 7：其它
}

/**
 * 默认的页面风格
 */
var defaultStyle = {
	top: '0px',
	bottom: '0px',
	scrollIndicator: 'none',
	scalable: false,
	popGesture: "close",
	//anishow 是显示窗口动画用到的slide-in-right pop-in none
	//android上的pop-in 
	aniShow: "slide-in-right",
	//隐藏时的动画slide-out-right pop-out
	aniHide: "slide-out-right",
	//duration显示Webview窗口动画的持续时间,默认时间600ms,这里改为300ms
	duration: 300,
	//waiting,等待对话框参数,
	waiting: {
		//自动显示等待框，为true代表显示
		autoShow: false,
		//等待对话框上显示的提示内容
		title: '加载中...',
		options: {
			size: '20px',
			padlock: false,
			modal: false,
			color: '#ffff00',
			background: 'rgba(0,0,0,0.8)',
			loading: {
				display: 'inline'
			}
		}
	},
	//webview拓展参数,可用来优化
	extras: {
		acceleration: 'auto'
	},
	//设置系统状态栏的背景颜色
	statusBarBackground: '#CC2321'
};

var subIframes = [];

/**
 * @description 显示一个窗口,使用默认样式
 * 注意,这里为了统一,openSingle的页面不能通过showWin显示,只能通过openSingle显示
 * @param {String||webview} id 窗口id或者是webview
 * @param {String} aniShow 显示动画
 * @param {Number} duration 显示时间
 * @param {Function} showedCB 显示完毕后的回调
 */
function showWin(id, aniShow, duration, showedCB, extras) {
	//采用默认的style
	var webview;
		//h5情况
		var showPage = document.getElementById(id);
		if(!showPage) {
			console.error('h5情况页面显示时错误:' + id + '页面不存在!');
			return;
		}
		showPage.style.display = 'block';
		showedCB && showedCB();
}
/**
 * @description 因此一个窗口,使用默认样式
 * @param {String||webview} id 窗口id或者是webview
 * @param {String} aniHide 隐藏
 * @param {Number} duration 显示时间
 */
function hideWin(id, aniHide, duration, extras) {
	//采用默认的style
	var webview;
	//h5情况
	var page = document.getElementById(id);
	if(!page) {
		console.error('h5情况页面隐藏时错误:' + id + '页面不存在!');
		return;
	}
	page.style.display = 'none';
};

function createSubWins(options, styles, loadedCallback) {
	styles = styles || {};
	var isShowFirst = (typeof styles.isShowFirst === 'boolean') ? styles.isShowFirst : true;
	var parentDom = styles.parentDom;
	var allPagesStr = "";
	//h5情况
	allPagesStr = createIframe(options, isShowFirst, parentDom, loadedCallback);
	return allPagesStr;
};

function createIframe(optionsArray, isShowFirst, parentDom, loadedCallback) {
	if(!optionsArray || !Array.isArray(optionsArray)) {
		return;
	}
	var allPagesStr = "";
	var completedNum = 0;
	for(var i = 0; i < optionsArray.length; i++) {
		var options = optionsArray[i];
		options.id = options.id || options.url;
		allPagesStr += options.id + ",";
		var parent = null;
		if(parentDom) {
			if(typeof parentDom == 'string') {
				parentDom = document.querySelector(parentDom);
			}
			parent = parentDom;
		}
		var wrapper = document.createElement('div');
		wrapper.className = 'mui-iframe-wrapper';
		wrapper.id = options.id;
		var styles = options.styles || {};
		//console.log('top:' + styles.top);
		if(typeof styles.top !== 'string') {
			styles.top = '0px';
		}
		if(typeof styles.bottom !== 'string') {
			styles.bottom = '0px';
		}
		if(typeof styles.left !== 'string') {
			styles.left = '0px';
		}
		if(typeof styles.right !== 'string') {
			styles.right = '0px';
		}
		//默认为99层级
		wrapper.style.zIndex = styles.zindex || 0;
		//类似于webview中,iframe统一用fixed布局
		//这样就没有必要计算iframe高度了
		wrapper.style.position = 'fixed';
		//注意,top和bottom
		wrapper.style.top = styles.top;
		wrapper.style.bottom = styles.bottom;
		//注意,left和right
		wrapper.style.left = styles.left;
		wrapper.style.right = styles.right;
		wrapper.style.webkitOverflowScrolling = 'touch';
		wrapper.style.overflow= 'hidden';

		var iframe = document.createElement('iframe');
		var extrasDataStr = '';
		//加上唯一id
		if(extrasDataStr.indexOf('?') == -1 && options.url.indexOf('?') == -1) {
			extrasDataStr += '?';
		} else {
			extrasDataStr += '&';
		}
		extrasDataStr += 'H5PageId=' + options.id;
		//解决缓存问题
		extrasDataStr += '&_t=' + Math.random();
		if(optionsArray[i].extras) {

			for(var item in optionsArray[i].extras) {
				extrasDataStr += '&';
				extrasDataStr += item + '=' + optionsArray[i].extras[item];
			}
		}
		iframe.src = options.url + extrasDataStr;
		iframe.name = options.id;
		//现在用fixed布局不必计算高度
		//iframe.style.width = window.innerWidth - parseInt(styles.left) - parseInt(styles.right) + 'px';
		//iframe的高度要减去预留的高度
		//iframe.style.height = window.innerHeight - parseInt(styles.bottom) - parseInt(styles.top) + 'px';
		//console.log("bottom:"+styles.bottom);
		//console.log("top:"+styles.top);
		//console.log("winheight:"+window.innerHeight);
		//console.log("finalheight:"+iframe.style.height);
		//去除iframe的border
		iframe.style.border = '0px';
		//监听onload
		iframe.onload = iframe.onreadystatechange = function() {
			if(!iframe.readyState || iframe.readyState == "complete") {
				//console.log("Local iframe is now loaded.");
				completedNum++;
				if(completedNum >= optionsArray.length) {
					//如果已经全部完成
					loadedCallback && loadedCallback();
				}
			}
		};
		//console.log('width:' + window.innerWidth + ',height:' + window.innerHeight);
		wrapper.appendChild(iframe);
		document.body.appendChild(wrapper);

		//处理现实与隐藏关系,目前只显示第一个子页面(Iframe)
		if(i == 0) {
			if(isShowFirst == true) {
				wrapper.style.display = 'block';
			} else {
				wrapper.style.display = 'none';
			}

		} else {
			wrapper.style.display = 'none';
		}
		//处理浏览器样式,去除滑动条
		document.body.style['overflow-x'] = 'hidden';
		document.body.style['overflow-y'] = 'hidden';
		//目前仅处理微信
		//			mui.os.wechat && handleScroll(wrapper, iframe);
		//将创建好的iframe添加进入父级中
		if(parent) {
			parent.appendChild(wrapper);
		}
		//添加进入数组中管理
		subIframes.push({
			iframe: iframe,
			styles: styles
		});
	}
	return allPagesStr;
};

/**
 * @description 通过自定义的style,创建一个新窗口(webview),参数是在plus的create基础上扩充
 * 扩充了 waiting- 对话框显示样式
 * aniShow-窗口动画,duration-动画时间
 * @param {String} id 窗口的id,可以为空-取默认路径,每一个id的window只会有一个
 * @param {String} url 窗口的路径,必填
 * @param {JSON} extras 传的额外参数
 * @param {JSON} styles 控制样式的参数
 * @param {Function} openCallback 打开窗口后回调,第一次加载,或者是之后的打开都会触发
 * @param {Function} closeCallBack 关闭窗口后回调
 */

/**
 * ajax获取数据
 */
function getPostData(url, requestData, callback) {
	if(typeof requestData == 'function') {
		callback = requestData;
		requestData = {};
	}
	var reqdata = mui.extend(true, {
		appKey: app.appkey,
		v: app.v,
		format:app.format
	}, requestData);
	try {
		var xhrObj = mui.ajax(serverUrl + url, {
			data: reqdata,
			//默认为json格式,不提供其它格式
			dataType: "json",
			//默认超时10秒
			timeout: "30000",
			//后台如果关闭OPTIONS, 前端的请求必须是简单类型
			type: "POST",
			success: function(response) {
				callback && callback(response, true);
			},
			error: function(statusText, status, xhr) {
				var errorJson = {
					statusText: statusText,
					responseText: xhrObj.responseText,
					status: status,
					xhr: xhr
				};
				console.log("error:" + JSON.stringify(errorJson));
				callback && callback(errorJson, false);
			}
		});
		//监听错误
		xhrObj.addEventListener('error', function(e) {
			console.log(e);
		}, false)
	} catch(e) {
		throw new Error('mui ajax请求错误:' + e);
	}
}
function getGetData( requestData, callback) {
	if(typeof requestData == 'function') {
		callback = requestData;
		requestData = {};
	}
	var reqdata = mui.extend(true, {
		appKey: app.appkey,
		v: app.v,
		format:app.format
	}, requestData);
	try {
		var xhrObj = mui.ajax(serverUrl, {
			data: reqdata,
			//默认为json格式,不提供其它格式
			dataType: "json",
			//默认超时10秒
			timeout: "30000",
			//后台如果关闭OPTIONS, 前端的请求必须是简单类型
			type: "GET",
			success: function(response) {
				callback && callback(response, true);
			}
		});
	} catch(e) {
		throw new Error('mui ajax请求错误:' + e);
	}
}

function getPostHtml(url, requestData, callback) {
	if(typeof requestData == 'function') {
		callback = requestData;
		requestData = {};
	}
	var reqdata = mui.extend(true, {
		appkey: app.appkey,
		v: app.v,
		format:app.format
	}, requestData);
	try {
		var xhrObj = mui.ajax(serverUrl +"method="+ url, {
			data: {
				data: JSON.stringify(reqdata)
			},
			//默认为json格式,不提供其它格式
			dataType: "html",
			//默认超时10秒
			timeout: "10000",
			//后台如果关闭OPTIONS, 前端的请求必须是简单类型
			type: "POST",
			success: function(response) {
				callback && callback(response, true);
			},
			error: function(statusText, status, xhr) {
				var errorJson = {
					statusText: statusText,
					responseText: xhrObj.responseText,
					status: status,
					xhr: xhr
				};
				console.log("error:" + JSON.stringify(errorJson));
				callback && callback(errorJson, false);
			}
		});
		//监听错误
		xhrObj.addEventListener('error', function(e) {
			console.log(e);
		}, false)
	} catch(e) {
		throw new Error('mui ajax请求错误:' + e);
	}
}

/**
 * @description 正常的创建一个全屏webView
 * @param {String} id 窗口的id,可以为空-取默认路径,每一个id的window只会有一个
 * @param {String} url 窗口的路径,必填
 * @param {JSON} extras
 * @param {JSON} styles
 * @param {Function} openCallback
 * @param {Function} closeCallBack
 * @example 跨平台开发中显示页面的api
 */
function createWin(id, url, extras, styles, openCallback, closeCallBack) {
	//采用默认的style
	return createWinWithStyle(id, url, extras, styles, openCallback, closeCallBack);
};
/**
 * @description 通过自定义的style,创建一个新窗口(webview),参数是在plus的create基础上扩充
 * 扩充了 waiting- 对话框显示样式
 * aniShow-窗口动画,duration-动画时间
 * @param {String} id 窗口的id,可以为空-取默认路径,每一个id的window只会有一个
 * @param {String} url 窗口的路径,必填
 * @param {JSON} extras 传的额外参数
 * @param {JSON} styles 控制样式的参数
 * @param {Function} openCallback 打开窗口后回调,第一次加载,或者是之后的打开都会触发
 * @param {Function} closeCallBack 关闭窗口后回调
 */
function createWinWithStyle(id, url, extras, styles, openCallback, closeCallBack) {
	if(typeof url === 'undefined') {
		console.error('错误:创建窗口的url不能为空');
		return;
	}
	styles = styles || {};
	extras = extras || {};
	var extrasDataStr = '';
	//加上唯一id
	if(extrasDataStr.indexOf('?') == -1 && url.indexOf('?') == -1) {
		extrasDataStr += '?';
	} else {
		extrasDataStr += '&';
	}
	extrasDataStr += 'H5PageId=' + id;
	//解决缓存问题
	extrasDataStr += '&_t=' + Math.random();
	for(var item in extras) {
		extrasDataStr += '&';
		extrasDataStr += item + '=' + encodeURIComponent(extras[item]);
	}

	//console.log('额外数据:' + extrasDataStr);
	//处理非plus的情况,兼容普通浏览器
	//记录下来一个页面栈,便于QQ手机客户端的兼容性处理
	//所以,平时清除缓存绝对不能将storage清空,否则就会出问题
	//可知的是-这时候已经有window id了
	//栈的排列  {'PageId':{'href':'...',nextHref:'...',beforeHref:'...'},...}
	var html5PageStack = localStorage.getItem('Html5_Compatible_PageStack') || {};
	var nextWinId = getWindowIdByHref(url + extrasDataStr);
	if(html5PageStack[window.id] != null) {
		//如果存在,证明不是首页,前面页面创建了对应的beforeHref
		//所以只需要手动赋值一个nextHref就可以了
		html5PageStack[window.id]['nextHref'] = url + extrasDataStr;
	} else {
		//不存在,重新创建一个,这时候可以确定的是,肯定是首页
		//因为如果不是首页,正常来说打开页面是会手动创建一个值得,而且只有首页才没有beforeHref
		html5PageStack[window.id] = {
			'href': window.location.href,
			'nextHref': url + extrasDataStr
		};
	}
	//给next window创建一个,id手动获取
	html5PageStack[nextWinId] = {
		'href': url + extrasDataStr,
		'beforeHref': window.location.href
	};
	//然后再存储回去
	localStorage.setItem('Html5_Compatible_PageStack', html5PageStack);
	if(styles.isNewWindow) {
		//打开新窗口
		window.open(url + extrasDataStr, '');
	} else {
		window.parent.location.href = url + extrasDataStr;
	}

	//console.log('目标url:' + url + extrasDataStr);
	return;
};

function getAddrInfoId(addr, cb) {
	var addrInfoId = {
		provinceId: '',
		cityId: '',
		areaId: ''
	}
	mui.getJSON(app.basePath + 'data/getAddrId.json', function(data) {
		var provinceList = data.province;
		for(var i = 0; i < provinceList.length; i++) {
			var province = provinceList[i];
			if(province.name == addr.province) {
				addrInfoId.provinceId = province.id;
				var cityList = province.city;
				for(var j = 0; j < cityList.length; j++) {
					var city = cityList[j];
					if(city.name + "市" == addr.city) {
						addrInfoId.cityId = city.id;
						var countryList = city.country
						for(var k = 0; k < countryList.length; k++) {
							var country = countryList[k];
							if(country.name == addr.district) {
								addrInfoId.areaId = country.id;
								if(typeof cb == "function") {
									cb(addrInfoId);
								}
								break;
							}
						}
					}
				}
			}
		}
	});
}
/**
 * @description 以webview优化方式打开页面,前提是要基于框架,并且有模板页面
 * 模板页面的作用是动画时显示,当真的页面加载完毕后,会通过fade-in显示,从而无缝过渡
 * @param {String} id 窗口的id,可以为空-取默认路径,每一个id的window只会有一个
 * @param {String} url 窗口的路径,必填
 * @param {JSON} extras 传的额外参数
 * @param {JSON} styles 控制样式的参数
 * styles里面可以有 templateOptions title
 * @param {Function} openCallback 打开窗口后回调,第一次加载,或者是之后的打开都会触发
 * @param {Function} closeCallBack 关闭窗口后回调
 * 
 */
function openWinWithTemplate(id, url, extras, styles, openCallback, closeCallBack, templateOptions) {
	//只针对Android进行优化，iOS中,不优化速度更快
	createWin(id, url, extras, styles, openCallback, closeCallBack);
	return;

	id = id || url;
	extras = extras || {};
	styles = mui.extend(true, {}, defaultStyle, styles);

	//拿到模板控制相关参数
	var templateOptions = styles.templateOptions || {};

	var template = getDefaultTemplate();
	//获得共用父模板
	var headerWebview = template.header;
	//获得共用子webview
	var contentWebview = template.content;
	if(!(/^(http|https|ftp)/g.test(url))) {
		//不是网络路径
		//转为绝对路径
		url = plus.io.convertLocalFileSystemURL(url);
	}

	//console.log("全路径:"+url);
	//通知模板修改标题，并显示隐藏右上角图标；
	mui.fire(headerWebview, 'updateHeader', {
		templateOptions: templateOptions,
		target: url,
		//content页面的id,用来通过webview找寻时有用到
		id: id,
		//额外参数
		extras: extras,
		aniShow: styles.aniShow,
		duration: styles.duration,
	});

};
/**
 * @description 根据传入的href,获取对应的window id
 * @param {String} href
 * @return {String} 返回id
 */
function getWindowIdByHref(href) {
	var pageId = getUrlParamsValue(href, 'H5PageId');
	//可知,只有首页是没有id的
	var winId = pageId !== 'undefined' ? pageId : 'H5index.html';
	return winId;
};
/**
 * @description 普通的html href通过传入参数名,得到对应的参数值
 * @param {String} url 目标url
 * @param {String} paramName 参数名
 * @return {String} 返回对应的参数值
 */
function getUrlParamsValue(url, paramName) {
	var paraString = url.substring(url.indexOf("?") + 1, url.length).split("&");
	var paraObj = {}
	var i, j;
	for(i = 0; j = paraString[i]; i++) {
		paraObj[j.substring(0, j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf("=") + 1, j.length);
	}
	var returnValue = paraObj[paramName.toLowerCase()];
	//需要解码浏览器编码
	returnValue = decodeURIComponent(returnValue);
	if(typeof(returnValue) == "undefined") {
		return null;
	} else {
		return returnValue;
	}
};

/**
 * @description 一些windowUtil带来的全局影响
 * 1.自定义CustomEvent 事件
 * 2.给每一个window加上一个id (H5PageId这个参数)
 * 只要引用了WindowUtil就会有
 */
(function() {
	function CustomEvent(event, params) {
		params = params || {
			bubbles: false,
			cancelable: false,
			detail: undefined
		};
		//createEvent()方法返回新创建的Event对象，支持一个参数，表示事件类型，具体如下：
		//参数			事件接口	        初始化方法
		//HTMLEvents	HTMLEvent	initEvent()
		//MouseEvents	MouseEvent	initMouseEvent()
		//UIEvents		UIEvent		initUIEvent()

		var evt = document.createEvent('HTMLEvents');
		var bubbles = true;
		for(var name in params) {
			(name === 'bubbles') ? (bubbles = !!params[name]) : (evt[name] = params[name]);
		}
		evt.initEvent(event, bubbles, true);
		return evt;
	};
	//console.log('重写CustomEvent');
	CustomEvent.prototype = window.Event.prototype;
	if(typeof window.CustomEvent === 'undefined') {
		window.CustomEvent = CustomEvent;
	}
	window.id = getWindowIdByHref(window.location.href);
	//		if(mui.os.ejs&&ejs){
	//			//ejs下设置页面标题
	//			//var title = document.querySelector('head').querySelector('title').innerText;
	//			//console.log("title:"+title);
	//			//ejs.navigator.setTitle(title);
	//		}
	//console.log('页面id:' + window.id);
})();

/**
 * @description 通过传入key值,得到页面key的初始化传值
 * plus情况为plus.webview.currentWebview.***
 * h5情况为 window.location.href 中的参数的值
 * @param {String} key
 */
function getExtraDataByKey(key) {
	if(!key) {
		return null;
	}
	var value = null;
	//h5
	value = getUrlParamsValue(window.location.href, key);
	if(value === 'undefined') {
		value = null;
	}
	return value;
};
/**
 * @description 关闭当前页面
 */
function closeCurrentPage() {
	//h5模式
	//在某些实际应用中，window.close() and self.close() 
	//是不能关闭非弹出窗口（opener=null及非window.open()打开的窗口）
	if(window.opener) {
		window.opener = null;
		window.open('', '_self');
		window.close();
	} else {
		//非opener打开的页面
		if(window.history.length > 1) {
			window.history.back();
			return true;
		}
	}
}
/**
 * @description mui的PopPicker,单例显示
 * @param {JSON} data 装载的数据,
 * 格式为[{value:'...',text:'...'},{value:'...',text:'...'}]
 * @param {Function} chooseCallBack
 */
var popPicker = null;
//上一次的layer,如果layer换了,也需要重新换一个
var lastLayer = null;
function showPopPicker(data, chooseCallBack, layer) {
	//依赖于mui.min.css,mui.picker.min.css,mui.poppicker.css,mui.min.js,mui.picker.min.js,mui.poppicker.js
	if (window.mui&&window.mui.PopPicker) {
		layer = layer || 1;
		if (lastLayer !== layer) {
			//如果两次类别不一样,重新构造
			if (popPicker) {
				//如果存在,先dispose
				popPicker.dispose();
				popPicker = null;
			}
			lastLayer = layer;
		}
		popPicker = popPicker || new mui.PopPicker({
			'layer': layer
		});
		data = data || [];
		popPicker.setData(data);
		popPicker.show(function(items) {
			if (chooseCallBack && typeof(chooseCallBack) == 'function') {
				chooseCallBack(items[0].text, items[0].value, items[0],items);
			}
		});
	} else {
		console.error('未引入mui pop相关js(css)');
	}
};
function GetQueryString(name){
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}