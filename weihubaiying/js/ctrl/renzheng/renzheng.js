$(function(){
	$('.rzUl').on('tap','li',function(){
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
	$('body').on('tap','.btn',function(){
		var list=[];
		if ($('.active').length<2) {
			mui.toast('请选择至少两个标签');
		} else{
			$('.active').each(function(){
				list.push($(this).find('span').text());
			})
			createWin(null,'renzhengWX.html',{list:list})
		}
		
	})
})
