/**
 * @description 创建系统选择按钮框
 * @param {String} title 弹出窗标题 传null代表不要title
 * @param {JSON} buttons 按钮集合,格式[{title:"1",value:'11',className:''},{title:"2",value:'22'}]
 * @param {Function} chooseCallBack 选择按钮框关闭后的回调函数,回调选中的按钮
 */
function actionSheet(title, buttons, chooseCallBack) {
	if (window.plus) {
		if (buttons.length > 0) {
			var config = {
				cancel: "取消",
				buttons: buttons
			};
			if (title) {
				config.title = title;
			}
			plus.nativeUI.actionSheet(config, function(e) {
				if (e.index > 0) {
					if (chooseCallBack && typeof(chooseCallBack) == "function") {
						//回调 
						chooseCallBack(buttons[e.index - 1].title,buttons[e.index - 1].value,buttons[e.index - 1]);
					}
				}
			});
		}
	} else {
		//h5版 actionsheet
		var options = {};
		options.title = title;
		options.data = buttons;
		options.id = options.id || 'defaultActionSheetId';
		var html = createActionSheetH5(options);
		//console.log('添加html:'+html);
		if (document.getElementById('actionSheetContent') == null) {
			//不重复添加
			var wrapper = document.createElement('div');
			wrapper.id = 'actionSheetContent';
			wrapper.innerHTML = html;
			document.body.appendChild(wrapper);
			mui('body').on('shown', '.mui-popover', function(e) {
				//console.log('shown:'+e.detail.id, e.detail.id); //detail为当前popover元素
			});
			mui('body').on('hidden', '.mui-popover', function(e) {
				//console.log('hidden:'+e.detail.id, e.detail.id); //detail为当前popover元素
			});
			//监听
			mui('body').on('tap', '.mui-popover-action li>a', function(e) {
				var title = this.innerText;
				var value = undefined;
				var mClass = this.className;
				if (this.nextSibling && this.nextSibling.textContent) {
					value = this.nextSibling.textContent;
				}
				//console.log('class:' + mClass);
				//console.log('点击,title:' + title + ',value:' + value);
				if (this.className.indexOf('titleActionSheet') == -1) {
					//排除title的点击
					mui('#' + options.id).popover('toggle');
					if (this.className.indexOf('cancelActionSheet') == -1) {
						//排除取消按钮,回调函数
						chooseCallBack && chooseCallBack(title,value,{
							'title': title,
							'value': value,
							'className': mClass
						});
					}
				}
			});
		} else {
			//直接更改html
			document.getElementById('actionSheetContent').innerHTML = html;
		}
		//显示actionsheet
		mui('#' + options.id).popover('toggle');

	}
};

function createActionSheetH5(options) {
	options = options || {};
	var finalHtml = '';
	var idStr = options.id ? 'id="' + options.id + '"' : '';
	finalHtml += '<div ' + idStr + ' class="mui-popover mui-popover-action mui-popover-bottom">';
	//加上title
	if (options.title != null) {
		finalHtml += '<ul class="mui-table-view">';
		finalHtml += '<li class="mui-table-view-cell">';
		finalHtml += '<a class="titleActionSheet"><b>' + options.title + '</b></a>';
		finalHtml += '</li>';
		finalHtml += '</ul>';
	}
	finalHtml += '<ul class="mui-table-view">';
	//添加内容
	if (options.data && Array.isArray(options.data)) {
		for (var i = 0; i < options.data.length; i++) {
			var tmpInfo = options.data[i];
			finalHtml += '<li class="mui-table-view-cell">';
			tmpInfo.className = tmpInfo.className || '';
			finalHtml += '<a class="' + tmpInfo.className + '">' + tmpInfo.title + '</a>';
			//隐藏域,存放value
			finalHtml += '<span style="display:none;" class="hiddenValue">' + tmpInfo.value + '</span>'
			finalHtml += '</li>';
		}
	}
	finalHtml += '</ul>';
	//加上最后的取消
	finalHtml += '<ul class="mui-table-view">';
	finalHtml += '<li class="mui-table-view-cell">';
	finalHtml += '<a class="cancelActionSheet"><b>取消</b></a>';
	finalHtml += '</li>';
	finalHtml += '</ul>';

	//补齐mui-popover
	finalHtml += '</div>';
	return finalHtml;
};
//fileTools
/**
 * @description 设置,将input标签设为选择文件的标签,选择成功后返回dataSrc(根据类别不同返回不同)
 * @param {HTMLElement||String} dom input标签,最好直接是file类型(防止歧义)
 * @param {Function} successCB(dataSrc) 成功选择后的回调,返回dataSrc字符串
 * 注意: 没选择一张图片就会回调一次
 * @param {JSON} options 设置参数
 */
function setSelectFilesFromwDisks(dom, successCB, options) {
	if(typeof dom == 'string') {
		dom = document.querySelector(dom);
	}
	if(!dom || !(dom instanceof HTMLElement)) {
		console.error('错误:input file标签的dom为空！或者不为Html元素!');
	}
	options = options || {};
	//设置单个文件选择需要的 属性
	dom.setAttribute('type', 'file');
	if(options.isMulti) {
		dom.setAttribute('multiple', 'multiple');
	} else {
		dom.removeAttribute('multiple');
	}
	var type = 'File';
	var filter;
	if(options.type === 'Image') {
		filter = 'image/*';
		type = 'DataUrl';
	} else if(options.type === 'Camera') {
		if(mui.os.ejs){
			filter = 'camera/*';
		}else{
			filter = 'image/*';
		}
		type = 'DataUrl';
	} else if(options.type === 'Image_Camera') {
		if(mui.os.ejs){
			filter = 'image_camera/*';
		}else{
			filter = 'image/*';
		}
		type = 'DataUrl';
	} else if(options.type === 'Image_File') {
		if(mui.os.ejs){
			filter = 'image_file/*';
		}else{
			filter = '*';
		}
		type = 'DataUrl';
	}else if(options.type === 'Camera_File') {
		if(mui.os.ejs){
			filter = 'camera_file/*';
		}else{
			filter = '*';
		}
		type = 'DataUrl';
	}  else if(options.type === 'Text') {
		if(mui.os.ejs){
			filter = 'text/*';
		}else{
			filter = 'file/*';
		}
		type = 'Text';
		
	} else if(options.type === 'File') {
		if(mui.os.ejs){
			filter = 'file/*';
			type = 'DataUrl';
		}else{
			filter = '*';
			type = 'File';
		}
		
	}else if(options.type === 'All') {
		if(mui.os.ejs){
			filter = '*/*';
			type = 'DataUrl';
		}else{
			filter = '*';
			type = 'DataUrl';
		}
		
	}else {
		filter = '*';
		type = 'File';
	}
	filter = options.filter || filter;
	dom.setAttribute('accept', filter);
	var changeHandle = function() {
		var aFiles = dom.files;
		var len = aFiles.length;
		if(len === 0) {
			return;
		}
		//定义文件读取器和后缀类型过滤器
		var oFReader = new window.FileReader();
		var index = 0;

		var chainCall = function() {
			if(index >= len) {
				return;
			}
			loadDataFromFile(oFReader, aFiles[index], function(b64Src) {
				successCB && successCB(b64Src, aFiles[index]);
				index++;
				chainCall();
			}, type);
		};
		chainCall();
	};
	//给dom设置改变监听
	dom.removeEventListener('change', changeHandle);
	dom.addEventListener('change', changeHandle);
};
/**
 * @description 设置,将input标签设为图片(ejs中摄像+图片)的标签,选择成功后返回图片src(base64数据)
 * @param {HTMLElement||String} dom input标签,最好直接是file类型(防止歧义)
 * @param {Function} successCB(b64Src) 成功选择后的回调,返回base64字符串
 * 注意: 没选择一张图片就会回调一次
 * @param {JSON} options 设置参数
 */
function setSelectImageCameraFromDisks(dom, successCB, options) {
	//rFilter = /^(?:image\/bmp|image\/cis\-cod|image\/gif|image\/ief|image\/jpeg|image\/jpeg|image\/jpeg|image\/pipeg|image\/png|image\/svg\+xml|image\/tiff|image\/x\-cmu\-raster|image\/x\-cmx|image\/x\-icon|image\/x\-portable\-anymap|image\/x\-portable\-bitmap|image\/x\-portable\-graymap|image\/x\-portable\-pixmap|image\/x\-rgb|image\/x\-xbitmap|image\/x\-xpixmap|image\/x\-xwindowdump)$/i;
	setSelectFilesFromwDisks(dom, successCB, {
		isMulti: options.isMulti || false,
		filter: options.filter,
		type: 'Image_Camera'
	});
};
/**
 * @description 从一个file对象,加载对应的数据
 * FileReader的方法
 * 方法名 				参数				描述
 * readAsBinaryString 	file 			将文件读取为二进制编码
 * readAsText			file,[encoding] 将文件读取为文本
 * readAsDataURL		file			将文件读取为DataURL
 * abort				(none)			终端读取操作
 * @param {FileReader} oFReader 对应的加载器
 * @param {File} file 文件对象,选择的是img类型
 * @param {Function} successCB 成功加载完毕后的回调,回调result(不同的加载方式result类型不同)
 * @return {FileReader} 返回文件加载器对象
 * @param {String} type 类型,DataUrl还是Text还是Binary
 */
function loadDataFromFile(oFReader, file, successCB, type) {
	if(window.FileReader || !oFReader || !(oFReader instanceof FileReader)) {
		oFReader.onload = function(oFREvent) {
			//解决DataUrl模式下的b64字符串不正确问题
			var b64 = oFREvent.target.result;
			if(type === 'DataUrl') {
				//正常的图片应该是data:image/gif;data:image/png;;data:image/jpeg;data:image/x-icon;
				//而在Android的一些5.0系统以下(如4.0)的设备中,有些返回的b64字符串缺少关键image/gif标识,所以需要手动加上
				if(b64 && b64.indexOf('data:base64,') !== -1) {
					//去除旧有的错误头部
					b64 = b64.replace('data:base64,', '');
					var dataType = '';
					//文件名字
					var name = file.name;
					if(name && name.toLowerCase().indexOf('.jpg') !== -1) {
						//jpeg
						dataType = 'image/jpeg';
					} else if(name && name.toLowerCase().indexOf('.png') !== -1) {
						//png
						dataType = 'image/png';
					} else if(name && name.toLowerCase().indexOf('.gif') !== -1) {
						//gif
						dataType = 'image/gif';
					} else if(name && name.toLowerCase().indexOf('.icon') !== -1) {
						//x-icon
						dataType = 'image/x-icon';
					}
					b64 = 'data:' + dataType + ';base64,' + b64;
				}
			}
			successCB && successCB(b64);
		};
		if(type === 'DataUrl') {
			oFReader.readAsDataURL(file);
		} else if(type === 'Text') {
			oFReader.readAsText(file);
		} else {
			oFReader.readAsBinaryString(file);
		}
		return oFReader;
	} else {
		console.error('错误:FileReader不存在!');
	}
}
//htmlTools
/**
 * @description 将string字符串转为html对象,默认创一个div填充
 * @param {String} strHtml 目标字符串
 * @return {HTMLElement} 返回处理好后的html对象,如果字符串非法,返回null
 */
function pareseStringToHtml(strHtml) {
	if (strHtml == null || typeof(strHtml) != "string") {
		return null;
	}
	//创一个灵活的div
	var i, a = document.createElement("div");
	var b = document.createDocumentFragment();
	a.innerHTML = strHtml;
	while (i = a.firstChild) b.appendChild(i);
	return b;
};
/**
 * @description给html对象添加子元素
 * @param {HTMLElement} targetObj 目标dom，必须是原生对象
 * @param {HTMLElement||String} childElem 目标html的字符串或者是dom对象
 */
function appendHtmlChildCustom(targetObj, childElem) {
	if(typeof targetObj === 'string'){
		targetObj = document.querySelector(targetObj);
	}
	if (targetObj == null || childElem == null || !(targetObj instanceof HTMLElement)) {
		return;
	}
	if (childElem instanceof HTMLElement) {
		targetObj.appendChild(childElem);
	} else {
		//否则,创建dom对象然后添加
		var tmpDomObk = pareseStringToHtml(childElem);
		if (tmpDomObk != null) {
			targetObj.appendChild(tmpDomObk);
		}
	}
};