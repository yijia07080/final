
var music = $('#music');
var whiteImg = $('#whiteImg');
var blackImg = $('#blackImg');
var lightImg = $('#lightImg');
var foreImg = $('#foreImg');
var loadImg = $('#loadImg');
var backImg = $('#backImg');
var backBtn = $('#button1');
var skipBtn = $('#button2');
var restart = $('#restart');
var download = $('#download');
var startBtn = $('#startBtn');
var textSelf = $('#introText');
var soundHint = $('#soundHint');
var ansCont = $('#ansContainer');
var textCont = $('#textContainer');
var ansRegions = [ $('#ansRegion1'), $('#ansRegion2'), $('#ansRegion3'), $('#ansRegion4') ];

var transText = ['\"鬆開上班的枷鎖，為靈魂獲取自由...\"', 
                 '\"活得像花一樣燦爛，每朵花都有它獨特的美麗！\"', 
                 '\"天上無數顆星，總有一顆是為你而亮！\"' ];
var titleText = ['下班回家時，你通常會注意馬路上的什麼？', 
                 '為今天的你送上一束花吧！',
                 '哪一個星座最吸引你呢？' ];
var ansRegCoor = [  [['23%', '31%', '13vw', ''    , '32vw', '8'], 
                     ['11%', '26%', '49vw', ''    , '71vw', '8'], 
                     ['24%', '42%', '88vw', ''    , '33vw', '9'], 
                     ['70%', '30%', '28vw', ''    , '74vw', '8']], 
                    [['10%', '40%', ''    , '53vw', '56vw', '8'], 
                     ['61%', '25%', ''    , '52vw', '51vw', '8'], 
                     ['18%', '23%', ''    , '0vw' , '51vw', '8'], 
                     ['53%', '46%', ''    , '0vw' , '51vw', '8']],  
                    [['11%', '69%', '13vw', ''    , '57vw', '8'], 
                     ['55%', '34%', '62vw', ''    , '33vw', '9'], 
                     ['10%', '62%', '90vw', ''    , '51vw', '8'], 
                     ['29%', '42%', '140vw', ''   , '34vw', '9']] ];
var transitionTimeouts = [];
var scores = [[-1, -1, -1], [-1, -1, -1], [-1, -1, -1]];
var level = 0, resIdx = 0;
var ansValid = true;

function checkOrientation() {
    var ratio = window.innerWidth / window.innerHeight;
    var isPortrait = ratio <= 0.65;
    if (isPortrait) {
        $('#warning1').addClass('hidden');
        $('#warning2').addClass('hidden');
        $('#root').removeClass('hidden');
    } else if (level == 0) {
        $('#warning1').removeClass('hidden');
        $('#warning2').addClass('hidden');
        $('#root').addClass('hidden');
    } else {
        $('#warning2').removeClass('hidden');
        $('#warning1').addClass('hidden');
        $('#root').addClass('hidden');
    }
}
function imgAlign(side) {
    $('#root #picContainer img').css('top', '');
    $('#root #picContainer img').css('bottom', '');
    $('#root #picContainer img').css(side, '0');
}
function initAttr() {
    imgAlign('top');
    foreImg.attr('src', './images/00_fore.png');
    blackImg.attr('src', './images/black.png');
    whiteImg.attr('src', './images/white.png');
    startBtn.attr('src', './images/start.png');
    soundHint.attr('src', './images/hint.png');
    backImg.css('z-index', '1');
    foreImg.css('z-index', '3');
    loadImg.css('z-index', '4');
    loadImg.css('opacity', '0');
    lightImg.css('z-index', '2');
    blackImg.css('z-index', '5');
    blackImg.css('opacity', '0');
    whiteImg.css('z-index', '6');
    whiteImg.css('opacity', '0');
    textCont.css('z-index', '7');
    backBtn.css('opacity', '0');
    skipBtn.css('opacity', '0');
    ansRegions[0].css('left', '0%');
    ansRegions[0].css('width', '101%');
    ansRegions[0].css('top', '0vh');
    ansRegions[0].css('height', '100vh');
    ansRegions[0].css('z-index', '8');
    $('#resContainer').addClass('hidden');
}
function animateLight() {
    lightImg.animate({ opacity: 1 }, 1000, function() {
        lightImg.animate({ opacity: 0 }, 1000, animateLight);
    });
}
function animateStart() {
    startBtn.animate({ opacity: 1 }, 900, function() {
        startBtn.animate({ opacity: 0.3 }, 900, animateStart);
    });
}
function transition(level) {
    // Reset
    transitionTimeouts = [];
    var attrs = ['left', 'width', 'top', 'bottom', 'height', 'z-index'];
    for (var i = 0; i < 4; i++)
        for (var j = 0; j < 6; j++)
            ansRegions[i].css(attrs[j], ansRegCoor[level][i][j]);

    // Adjust
    transitionTimeouts.push(setTimeout(function () {
            textSelf.text(transText[level]);
            // textCont.css('top', '12%');
            textCont.css('opacity', '0');
            loadImg.css('opacity', '0');
            backImg.css('z-index', '1');
    }, 1100));
    transitionTimeouts.push(setTimeout(function () {
            lightImg.attr('src', './images/0' + (level + 1) + '_light.png');
            backImg.attr('src', './images/0' + (level + 1) + '_back.png');
            foreImg.attr('src', './images/0' + (level + 1) + '_fore.png');
            level == 1 ? imgAlign('bottom') : imgAlign('top');
            startBtn.addClass('hidden');
            soundHint.addClass('hidden');
    }, 1400));
    if (level == 1 || level == 2) {
        transitionTimeouts.push(setTimeout(function () {
            textSelf.css('margin', '8%');
        }, 6500));
        transitionTimeouts.push(setTimeout(function () {
            textSelf.css('margin', '15%');
        }, 10000));
    }

    // music
    $('#music').animate({ volume: 0 }, {
        duration: 1000,
        step: function(now) {
            $(this).prop('volume', 1 - now);
        },
        complete: function() {
            $(this).prop('volume', 1);
            $(this).attr('src', './musics/music'+ (level + 1) + '.mp3');
            this.load();
            this.play();
        }
    });

    // nav text
    if (level == 1 && skipBtn.css('opacity') == '0')
        skipBtn.animate({ opacity: 1 }, 400);
    if (level == 0)
        backBtn.animate({ opacity: 0 }, 400);
    else if (backBtn.css('opacity') == '0')
        backBtn.animate({ opacity: 1 }, 400);
    if (level != 1)
        $('#nav p').css('color', 'lightgrey');

    // Part 1
    blackImg.animate({ opacity: 1 }, 800);
    transitionTimeouts.push(setTimeout(function () {
        textCont.animate({ opacity: 1 }, 1200);
    }, 1400));
    transitionTimeouts.push(setTimeout(function () {
        blackImg.animate({ opacity: 0.75 }, 1500);
    }, 3000));
    transitionTimeouts.push(setTimeout(function () {
        textCont.animate({ opacity: 0 }, 1500);
    }, 4700));
    transitionTimeouts.push(setTimeout(function () {
        blackImg.animate({ opacity: 0 }, 1000);
    }, 5000));
    
    // Part 1 - 2
    transitionTimeouts.push(setTimeout(function () {
        textSelf.text(titleText[level]);
    }, 6500));

    // Part 2
    transitionTimeouts.push(setTimeout(function () {
        blackImg.animate({ opacity: 0.4 });
    }, 6500));
    transitionTimeouts.push(setTimeout(function () {
        textCont.animate({ opacity: 1 }, 750);
    }, 6500));
    transitionTimeouts.push(setTimeout(function () {
        textCont.animate({ opacity: 0 }, 1000);
        blackImg.animate({ opacity: 0 }, 1000);
        if (level == 1)
            $('#nav p').css('color', '#363737');
    }, 9000));
    transitionTimeouts.push(setTimeout(function () {
        ansValid = true;
    }, 9500));
}
function flowerAnimation(num) {
    loadImg.attr('src', './images/02_res' + (num + 1) + '.png');
    whiteImg.animate({ opacity: 1 }, 400);
    transitionTimeouts.push(setTimeout(function () {
        backImg.css('z-index', '4');
        loadImg.css('opacity', '1');
    }, 400));
    transitionTimeouts.push(setTimeout(function () {
        whiteImg.animate({ opacity: 0 }, 1000);
    }, 600));
}
function updateScores(idx, s1, s2, s3) {
    scores[idx][0] = s1;
    scores[idx][1] = s2;
    scores[idx][2] = s3;
}
function getAnswer(num) {
    ansValid = false;
    if (num != 4) {
        if (level == 1) {
            if (num == 0)       // 月亮
                updateScores(0, 1, 3, 0);
            else if (num == 1)  // 紅綠燈
                updateScores(0, 2, 2, 0);
            else if (num == 2)  // 人群
                updateScores(0, 1, 0, 3);
            else if (num == 3)  // 招牌
                updateScores(0, 2, 0, 3);
        } else if (level == 2) {
            if (num == 0)       // 向日葵
                updateScores(1, 1, 1, 3);
            else if (num == 1)  // 玫瑰
                updateScores(1, 4, 1, 0);
            else if (num == 2)  // 鬱金香
                updateScores(1, 0, 4, 0);
            else if (num == 3)  // 滿天星
                updateScores(1, 0, 2, 2);
        } else if (level == 3) {
            if (num == 0)       // 大熊座
                updateScores(2, 1, 0, 2);
            else if (num == 1)  // 仙后座
                updateScores(2, 0, 2, 0);
            else if (num == 2)  // 天鷹座
                updateScores(2, 2, 0, 1);
            else if (num == 3)  // 北斗七星
                updateScores(2, 0, 1, 1);
            level++
            showResults();
        }
        if (level == 2) {
            flowerAnimation(num);
            transitionTimeouts.push(setTimeout(function () {
                transition(level++);
            }, 2500));
        } else {
            transition(level++);
        }
    } else if (level < 3) {
        transition(level++);
    } else {
        level++
        showResults();
    }
}

function showResults() {
    // music
    $('#music').animate({ volume: 0 }, {
        duration: 1000,
        step: function(now) {
            $(this).prop('volume', 1 - now);
        },
        complete: function() {
            $(this).prop('volume', 1);
            $(this).attr('src', './musics/music4.mp3');
            this.load();
            this.play();
        }
    });

    // margin
    var resBlock = $('#root #resContainer #resFrame div');
    var ratio = window.innerWidth / window.innerHeight;
    console.log(ratio);
    if (ratio > 0.60) {
        resBlock.css('margin-top', '3.5%');
        resBlock.css('margin-bottom', '3.5%');
        $('#extra1').addClass('hidden');
        $('#extra2').addClass('hidden');
    } else if (ratio > 0.55) {
        resBlock.css('margin-top', '4%');
        resBlock.css('margin-bottom', '4%');
        $('#extra1').addClass('hidden');
        $('#extra2').addClass('hidden');
    } else if (ratio > 0.50) {
        resBlock.css('margin-top', '4%');
        resBlock.css('margin-bottom', '4%');
        $('#extra2').css('margin-top', '0%');
    } else {
        resBlock.css('margin-top', '4.5%');
        resBlock.css('margin-bottom', '4.5%');
        $('#extra2').css('margin-top', '0%');
    } 
    $('#btnContainer div').css('margin-top','');
    $('#btnContainer div').css('margin-bottom','');
    // compute
    var totals = [0, 0, 0];
    for (var i = 0; i < 3; i++) {
        totals[0] += scores[i][0];
        totals[1] += scores[i][1];
        totals[2] += scores[i][2];
    }
    for (let i = 1; i < 3; i++)
        if (totals[i] > totals[resIdx])
            resIdx = i;

    // transition
    backBtn.animate({ opacity: 0 }, 400);
    skipBtn.animate({ opacity: 0 }, 400);
    $('#resBack').attr('src', './results/back.png');
    whiteImg.animate({ opacity: 1 }, 600);
    setTimeout(function () {
        textSelf.css('opacity', '0');
        $('#nav').addClass('hidden');
        $('#ansContainer').addClass('hidden');
        $('#picContainer').addClass('hidden');
        $('#textContainer').addClass('hidden');
        $('#resContainer').removeClass('hidden');
        $('#resPart1').attr('src', './results/fore1_'+ (resIdx + 1) +'.png');
        $('#resPart2').attr('src', './results/fore3_'+ (resIdx + 1) +'.png');
        $('#resPart3').attr('src', './results/fore4_'+ (resIdx + 1) +'.png');
    }, 600);
    setTimeout(function () {
        whiteImg.animate({ opacity: 0 }, 1000);
    }, 1000);
    
    setTimeout(function () {
        whiteImg.addClass('hidden');
    }, 2000);
}

$(document).ready(function () {
    initAttr();
    checkOrientation();
    // skip level 1-3
    // level = 2;
    // scores[0][0] = 1;
    // getAnswer(4);
    // setTimeout(function () {
    //     whiteImg.animate({ opacity: 1 }, 600);
    //     getAnswer(4);
    // }, 0);

    $(window).on('resize', function () {
        checkOrientation();
    });
    ansRegions[0].on("click", function() {
        if (ansValid)
            getAnswer(0);
    });
    ansRegions[1].on("click", function() {
        if (ansValid)
            getAnswer(1);
    });
    ansRegions[2].on("click", function() {
        if (ansValid)
            getAnswer(2);
    });
    ansRegions[3].on("click", function() {
        if (ansValid)
            getAnswer(3);
    });
    backBtn.on("click", function() {                
        if (level > 1 && level < 4) {
            level -= 2;
            for (var i = 0; i < transitionTimeouts.length; i++)
                clearTimeout(transitionTimeouts[i]);
            blackImg.animate({ opacity: 1 }, 800);
            getAnswer(4);
        }
    });
    skipBtn.on("click", function() {
        if (scores[0][0] != -1 && level < 4) {
            for (var i = 0; i < transitionTimeouts.length; i++)
                clearTimeout(transitionTimeouts[i]);
            if (level == 3)
                whiteImg.animate({ opacity: 1 }, 600);
            else
                blackImg.animate({ opacity: 1 }, 800);
            getAnswer(4);
        }
    });
    download.on("click", function() {
        $.ajax({
            url: "./results/download" + (resIdx + 1) + ".png",
            xhrFields: {
                responseType: "blob"
            }
            }).done((data) => {
            const $a = document.createElement("a");
            const url = URL.createObjectURL(data);
            $a.download = "your_result.png";
            $a.href = url;
            $a.click();
        })
    })
    restart.on("click", function() {
        location.reload();
    })
    animateStart();
    animateLight();
});