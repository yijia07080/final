let food = $('.food');
let foodpic = $('img');
let wheel = $('.wheelBody');
let contentCon = $('.contentCon');
let preAngle, last;
let starAngle = 0;
let data = [];
let url = './db.json';

window.onload = function () {
	wheel_init();
};

// 初始化
let wheel_init = function() {
	starAngle = 0;
	wheel.html('<div class="hand"><p><strong>按我</strong></p><img src="./images/hand.svg" /></div>');
	contentCon.html('');
	food.html(`<u style="color:#824C2D;">${blank(12)}</u>`);
	// 從 db.json 撈選項
	$.get(url, function(res) {
		data = res;
		data.forEach((item, index) => {
			preAngle = 360 / data.length;
			let patternAngle = preAngle / -2 + index * preAngle;
			// 先產生一個扇形
			let pattern = $('<div class="pattern"></div>');
			let inner = $('<div class="inner"></div>');
			let content = $(
				`<div class="content"><br><br><p><strong>${item.text}</strong></p></div>`
			);
			// 旋轉然後 append 進去
			pattern.css('transform', `rotate(${patternAngle}deg)`);
			inner.css('transform', `rotate(${preAngle}deg)`);
			content.css('transform', `rotate(${index * preAngle}deg)`);
			pattern.append(inner);
			wheel.append(pattern);
			contentCon.append(content);
		})
	})
	
	// 指針的 onclick 事件
	$('.hand').on('click', clickHandler);
}

// 指針 onclick 事件
let clickHandler = function() {
	$('.hand').off('click');
	$('.pattern').removeClass('picked');
	$('.content').removeClass('picked');
	handRotate( choose(), 3000); // 旋轉動畫
}

// 指針旋轉影格
let handRotate = function(goal, second) {
	simu = Math.floor((Math.random() - 0.5) * (preAngle - 10))
	let goAngle = starAngle + 1440 + goal * preAngle - (starAngle % 360) + simu;
	starAngle = goAngle;
	$('.hand').css({
		transition: `${second}ms`,
		transform: `rotate(${goAngle}deg)`,
	});
	setTimeout(function() { // 互斥鎖
		$('.hand').on('click', clickHandler);
		foodpic.attr('src', `images/${last}.png`)
		if (data[last].text == '減肥')
			food.html(`${blank(2)}泥土${blank(2)}`);
		else
			food.html(blank(2) + data[last].text + blank(2));
	}, second);
}

// 隨機選擇一個晚餐，且與前一次不一樣
let choose = function() {
	while(true) {
		res = Math.floor(Math.random() * data.length);
		if (last != res) {
			last = res;
			return res;
		}
	};
}

// 排版用
let blank = function(x) { 
	return new Array(x).join('&nbsp;');
};