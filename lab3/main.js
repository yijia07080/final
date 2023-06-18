let title;
let radio = [];
let next, restart;
let question, result;
let num = 0;
let score = [0, 0, 0, 0, 0];
let animal = ['老虎', '孔雀', '無尾熊', '貓頭鷹', '變色龍'];

window.onload = function () {
	title = $('#title');
	radio = [$('#radio-1'), $('#radio-2'), $('#radio-3'), $('#radio-4'), $('#radio-5')];
    next =  $('#next');
    restart =  $('#restart');
    result = $('#res');
    init();
};

function init() {
    changeTitle(++num);
	next.on('click', clickHandler);
};

// 指針 onclick 事件
let clickHandler = function() {
    cmpScore();
    num++;
    if (num > 30) {
        showRes();
        return;
    }
    changeTitle();
}

function cmpScore() {
    if (num == 4 || num == 9 || num == 13 || num == 17 || num == 23 || num == 29) {
        score[0] += getScore();
    } else if (num == 2 || num == 5 || num == 12 || num == 19 || num == 21 || num == 28) {
        score[1] += getScore();
    } else if (num == 1 || num == 7 || num == 14 || num == 16 || num == 24 || num == 27) {
        score[2] += getScore();
    } else if (num == 0 || num == 6 || num == 10 || num == 15 || num == 20 || num == 25) {
        score[3] += getScore();
    } else if (num == 3 || num == 8 || num == 11 || num == 18 || num == 22 || num == 26) {
        score[4] += getScore();
    }
}

function getScore() {
    if (radio[0].is(":checked")) return 1;
    if (radio[1].is(":checked")) return 2;
    if (radio[2].is(":checked")) return 3;
    if (radio[3].is(":checked")) return 4;
    if (radio[4].is(":checked")) return 5;
}
function changeTitle() {
    var strRet = ""
    switch (num)
    {
        case 1:
            strRet = "你做事是一個值得信賴的人嗎？";
            break;
        case 2:
            strRet = "你個性溫和嗎？";
            break;
        case 3:
            strRet = "你有活力嗎？";
            break;
        case 4:
            strRet = "你善解人意嗎？";
            break;
        case 5:
            strRet = "你獨立嗎？";
            break;
        case 6:
            strRet = "你受人愛戴嗎？";
            break;
        case 7:
            strRet = "做事認真且正直嗎？";
            break;
        case 8:
            strRet = "你富有同情心嗎？";
            break;
        case 9:
            strRet = "你有說服力嗎？";
            break;
        case 10:
            strRet = "你大膽嗎？";
            break;
        case 11:
            strRet = "你精確嗎？";
            break;
        case 12:
            strRet = "你適應能力強嗎？";
            break;
        case 13:
            strRet = "你組織能力好嗎？";
            break;
        case 14:
            strRet = "你是否積極主動？";
            break;
        case 15:
            strRet = "你害羞嗎？";
            break;
        case 16:
            strRet = "你強勢嗎？";
            break;
        case 17:
            strRet = "你鎮定嗎？";
            break;
        case 18:
            strRet = "你勇於學習嗎？";
            break;
        case 19:
            strRet = "你反應快嗎？";
            break;
        case 20:
            strRet = "你外向嗎？";
            break;
        case 21:
            strRet = "你注意細節嗎？";
            break;
        case 22:
            strRet = "你愛說話嗎？";
            break;
        case 23:
            strRet = "你的協調能力好嗎？";
            break;
        case 24:
            strRet = "你勤勞嗎？";
            break;
        case 25:
            strRet = "你慷慨嗎？";
            break;
        case 26:
            strRet = "你小心翼翼嗎？";
            break;
        case 27:
            strRet = "你令人愉快嗎？";
            break;
        case 28:
            strRet = "你傳統嗎？";
            break;
        case 29:
            strRet = "你親切嗎？";
            break;
        case 30:
            strRet = "你工作足夠有效率嗎？";
            break;			
    }
    console.log(strRet);
    title.html(`${String(num)}. ${strRet}`);
}

function showRes() {
    next.hide();
    restart.hide();
    $('.tabs').hide();

    let maxIndex = 0;
    for (let i = 1; i < score.length; i++) {
        if (score[i] > score[maxIndex]) {
          maxIndex = i;
        }
      }
      
    title.html(`結果：${animal[maxIndex]}`);
}