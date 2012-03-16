/**
* name:滚动条插件
* author:Der
* date:2011/01/27
* depend:jQuery.js
*/
$.fn.setScrollBar = function(settings){
	//缺省值配置
	settings = $.extend({
		itemWrapStr:"ul", //相对于this选择器的容器元素
		itemStr:"ul > li", //相对于this选择器的单个软件元素
		scrollBar:".scroll_bar", //相对于this选择器的滚动条元素
		scrollBtn:".scroll_btn", //相对于this选择器的滚动按钮元素
		prevBtn:".prev", //相对于this选择器的往前按钮
		nextBtn:".next", //相对于this选择器的往后按钮
		scrollWrap:".scroll_wrap", //相对于this选择器的滚动容器
		stepCount:2, //点击按钮一次滚动的元素个数
		animateSpeed:"normal" //滚动动画速度
	},settings);
	
	//获取各DOM元素对象引用
	var $this = $(this).find(settings.scrollWrap), //滚动容器
		$scrollBar = $this.find(settings.scrollBar), //滚动条元素
		$scrollBtn = $this.find(settings.scrollBtn), //滚动按钮元素
		$itemStr = $this.find(settings.itemStr), //目标单个元素集合
		$itemWrapStr = $this.find(settings.itemWrapStr), //目标元素容器
		$prevBtn = $(this).find(settings.prevBtn), //往前按钮元素
		$nextBtn = $(this).find(settings.nextBtn); //往后按钮元素
		
	
	//初始值计算
	var counts = $itemStr.size(), //计算单元个数
		itemWidth = $itemStr.outerWidth(true), //单个元素的宽度值
		wrapWidth = itemWidth*counts; //计算出的容器宽度值
		
	//判断是否出现滚动条
	if($this.width() < wrapWidth){ //出现滚动条
		$scrollBar.show();//显示滚动条
		var	percent = $this.width()/wrapWidth, //内容与滚动条比例
			scrollBarWidth = $scrollBar.innerWidth(), //滚动条的宽度
			iWidth = $scrollBtn.innerWidth() - $scrollBtn.width(), //计算差值
			percentWidth = percent*scrollBarWidth-iWidth, //计算滚动条宽度
			step = (settings.stepCount*itemWidth)*(scrollBarWidth/wrapWidth), //步长
			animateSpeed = settings.animateSpeed, //动画速度
			scrollBarResultLeft; //滚动条的计算滚动left值
			
		//初始化设置滚动条
		$itemWrapStr.width(wrapWidth); //容器宽度设置
		$scrollBtn.width(percentWidth);//设置滚动条宽度
		
		//计算值
		var scrollBtnWidth = $scrollBtn.outerWidth(), //滚动按钮的宽度
			eqScrollWidth = scrollBarWidth - scrollBtnWidth; //计算允许滚动到的最大值
			
		//绑定拖动事件	
		startDrag();
		
	}else{ //不出现滚动条
		$scrollBar.hide();//隐藏滚动条
	}	
	
	//上一页绑定事件
	$prevBtn.mousedown(function(e){
		scrollBarResultLeft = $scrollBtn.position().left - step; //计算滚动的最终值
		scrollFun(scrollBarResultLeft,true); //滚动	
		e.preventDefault();
	});
	//下一页绑定事件
	$nextBtn.mousedown(function(e){
		scrollBarResultLeft = $scrollBtn.position().left + step; //计算滚动的最终值
		scrollFun(scrollBarResultLeft,true); //滚动		
		e.preventDefault();
	});

	//函数：滚动时状态改变
	function scrollFun(scrollLeft,isAnimate){
		//边界过滤
		if(scrollLeft < 0){
			scrollLeft = 0;	
		}else if(scrollLeft > eqScrollWidth){
			scrollLeft = eqScrollWidth;
		}
		//内容实际位置计算值
		var wrapResultLeft = -(wrapWidth/scrollBarWidth*scrollLeft); 
		if(isAnimate){ //动画
			$scrollBtn.stop().animate({"left":scrollLeft},animateSpeed);
			$itemWrapStr.stop().animate({"left":wrapResultLeft},animateSpeed); //内容随着拖动	
		}else{ //无动画
			$scrollBtn.css("left",scrollLeft);
			$itemWrapStr.css("left",wrapResultLeft); //内容随着拖动	
		}
	}
	
	//函数：绑定拖动事件
	function startDrag(){
		//滚动条拖动
		$scrollBtn.mousedown(function(e){	  
			var scrollBarPoLeft = e.pageX - $scrollBtn.offset().left, //鼠标差值计算	
				scrollBarLeft = $scrollBar.offset().left; //滚动条距window左侧距离
			$(document).bind("mousemove",function(e){
				scrollBarResultLeft = e.pageX - scrollBarLeft - scrollBarPoLeft;  //实际位置计算值	
				scrollFun(scrollBarResultLeft);//滚动改变状态
				e.preventDefault();//阻止浏览器默认行为,拖动过程不会全选页面
				//IE下事件监控
				if(document.body.setCapture){
					document.body.setCapture();	
				}
			}).bind("mouseup",function(){
				$(this).unbind(); //解除事件绑定
				//IE下移除事件监控
				if(document.body.releaseCapture){
					document.body.releaseCapture();	
				}
			});	
			e.stopPropagation(); //阻止冒泡
			e.preventDefault(); //阻止浏览器默认行为
		});	
		
		//点击滚动条
		$scrollBar.mousedown(function(e){	
			//计算滚动条相关信息
			var scrollBtnLeft = $scrollBtn.offset().left,
				scrollBarLeft = $scrollBar.offset().left; //滚动条距window左侧距离		
			
			//判断鼠标点击了滚动条左侧还是右侧
			if(e.pageX > (scrollBtnWidth+scrollBtnLeft)){ //点击按钮左侧的时候
				scrollBarResultLeft = e.pageX - scrollBarLeft - scrollBtnWidth;
			}else{ //点击按钮右侧的时候
				scrollBarResultLeft = e.pageX - scrollBarLeft;	
			}
			//开始滚动
			scrollFun(scrollBarResultLeft,true);
		});
	}
};