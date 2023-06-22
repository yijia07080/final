const music = $('#music');
const whiteImg = $('#whiteImg');
const blackImg = $('#blackImg');
const lightImg = $('#lightImg');
const foreImg = $('#foreImg');
const loadImg = $('#loadImg');
const backImg = $('#backImg');
const backBtn = $('#button1');
const skipBtn = $('#button2');
const startBtn = $('#startBtn');
const textSelf = $('#introText');
const soundHint = $('#soundHint');
const ansCont = $('#ansContainer');
const textCont = $('#textContainer');
const allImgs = $('#picContainer img');
const ansRegions = [ $('#ansRegion1'), $('#ansRegion2'), $('#ansRegion3'), $('#ansRegion4') ];

const transText = ['\"鬆開上班的枷鎖，為靈魂獲取自由...\"', 
                   '\"活得像花一樣燦爛，每朵花都有它獨特的美麗！\"', 
                   '\"天上無數顆星，總有一顆是為你而亮！\"' ];
const titleText = ['下班回家時，你通常會注意馬路上的什麼？', 
                   '為今天的你送上一束花吧！',
                   '哪一個星座最吸引你呢？' ];
const ansRegCoor = [[['23%', '31%', '13vw', ''    , '32vw', '8'], 
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
                     ['29%', '42%', '140vw', ''   , '34vw', '9']]];
const align = ['top', 'bottom', 'center'];

let scores = Array(3).fill().map(() => Array(3).fill(-1));
let transitionTimeouts = [];
let ansValid = true;
let resNum = 1;
let level = 0;
let ratio = 0;

$(document).ready(function () {
    // Initialize and animate the start button
    initAttr(); 
    animateStart();
    preloadMusic(1);
    preloadImages(1);
    // skipToLevel(4);

    // Check device orientation (computer or landscape mobile)
    checkOrientation();
    $(window).on('resize', function () {
        checkOrientation();
    });

    // Answer regions
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

    // Back button
    backBtn.on("click", function() {
        if (level > 1 && level < 4) {
            blackImg.animate({ opacity: 1 }, 800);
            clearTransitionTimeouts();
            getAnswer(4);
        }
    });

    // Skip button
    skipBtn.on("click", function() {
        if (level == 3) {
            whiteImg.animate({ opacity: 1 }, 600);
            clearTransitionTimeouts();
            showResults();
        } else if (scores[0][0] != -1) {
            blackImg.animate({ opacity: 1 }, 800);
            clearTransitionTimeouts();
            getAnswer(5);
        }
    });

    // Download button
    $('#download').on("click", function() {
        $.ajax({
            url: `./results/download${resNum}.png`,
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

    // Restart button
    $('#restart').on("click", function() {
        location.reload();
    })

});

function getAnswer(num) {
    ansValid = false;
    if (num < 4) { // Answer given (not skipBtn or backBtn)
        if (level == 0) {
            level += 1;
            preloadImages(2);
            transition();
            animateLight();
        } else if (level == 1) {
            if (num == 0)       // Moon
                updateScores(0, 1, 3, 0);
            else if (num == 1)  // Traffic light
                updateScores(0, 2, 2, 0);
            else if (num == 2)  // Crowd
                updateScores(0, 1, 0, 3);
            else if (num == 3)  // Signboard
                updateScores(0, 2, 0, 3);
            level += 1;
            preloadImages(3);
            transition();
        } else if (level == 2) {
            if (num == 0)       // Sunflower
                updateScores(1, 1, 1, 3);
            else if (num == 1)  // Rose
                updateScores(1, 4, 1, 0);
            else if (num == 2)  // Tulip
                updateScores(1, 0, 4, 0);
            else if (num == 3)  // Baby's breath
                updateScores(1, 0, 2, 2);
            // Flower animation based on the result
            flowerAnimation(num + 1);
            transitionTimeouts.push(setTimeout(function () {
                level += 1;
                preloadImages(4);
                transition();
            }, 2500));
        } else if (level == 3) {
            if (num == 0)       // Ursa Major
                updateScores(2, 1, 0, 2);
            else if (num == 1)  // Cassiopeia
                updateScores(2, 0, 2, 0);
            else if (num == 2)  // Aquila
                updateScores(2, 2, 0, 1);
            else if (num == 3)  // Big Dipper
                updateScores(2, 0, 1, 1);
            showResults();
        }
    } else if (num == 4) { // Back button
        level -= 1;
        transition();
    } else if (num == 5) { // Skip button
        level += 1;
        transition();
    }
}

function transition() {
    // Set the range of option objects
    let attrs = ['left', 'width', 'top', 'bottom', 'height', 'z-index'];
    for (let i = 0; i < 4; i++)
        for (let j = 0; j < 6; j++)
            ansRegions[i].css(attrs[j], ansRegCoor[level - 1][i][j]);

    // Change music
    $('#music').animate({ volume: 0 }, {
        duration: 1000,
        step: function(now) {
            $(this).prop('volume', 1 - now);
        },
        complete: function() {
            $(this).prop('volume', 1);
            $(this).attr('src', `./musics/music${level}.mp3`);
            this.load();
            this.play();
        }
    });

    // Change images and set clipping edges when fully black
    transitionTimeouts.push(setTimeout(function () {
        textSelf.text(transText[level - 1]);
        textCont.css('opacity', '0');
        loadImg.css('opacity', '0');
        backImg.css('z-index', '1');
    }, 1100));
    transitionTimeouts.push(setTimeout(function () {
        lightImg.attr('src', `./images/0${level}_light.png`);
        backImg.attr('src', `./images/0${level}_back.png`);
        foreImg.attr('src', `./images/0${level}_fore.png`);
        imgAlign(align[level - 1]);
        startBtn.hide();
        soundHint.hide();
    }, 1400));

    // Temporarily reduce margin to accommodate more text
    if (level == 2 || level == 3) {
        transitionTimeouts.push(setTimeout(function () {
            textSelf.css('margin', '8%');
        }, 6500));
        transitionTimeouts.push(setTimeout(function () {
            textSelf.css('margin', '15%');
        }, 10000));
    }

    // Adjust skip button and back button colors
    if (level == 2 && skipBtn.css('opacity') == '0') {
        skipBtn.animate({ opacity: 1 }, 400);
    }
    if (level == 1) {
        backBtn.animate({ opacity: 0 }, 400);
    } else if (backBtn.css('opacity') == '0') {
        backBtn.animate({ opacity: 1 }, 400);
    }
    if (level != 2) {
        $('#nav p').css('color', 'lightgrey');
    }

    // Part 1 animations
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

    // Part 2 animations
    transitionTimeouts.push(setTimeout(function () {
        textSelf.text(titleText[level - 1]);
        blackImg.animate({ opacity: 0.4 });
        textCont.animate({ opacity: 1 }, 750);
        preloadMusic(level + 1);
    }, 6500));
    transitionTimeouts.push(setTimeout(function () {
        textCont.animate({ opacity: 0 }, 1000);
        blackImg.animate({ opacity: 0 }, 1000);
        if (level == 2) {
            $('#nav p').css('color', '#363737');
        }
    }, 9000));
    transitionTimeouts.push(setTimeout(function () {
        ansValid = true;
    }, 9500));
}

function flowerAnimation(num) {
    // Preload the resulting image to avoid delays
    loadImg.attr('src', `./images/02_res${num}.png`);

    // Change images when fully white
    whiteImg.animate({ opacity: 1 }, 400);
    transitionTimeouts.push(setTimeout(function () {
        backImg.css('z-index', '4');
        loadImg.css('opacity', '1');
    }, 400));
    transitionTimeouts.push(setTimeout(function () {
        whiteImg.animate({ opacity: 0 }, 1000);
    }, 600));
}


function showResults() {
    // Calculate vote counts
    level = 4;
    let totals = [0, 0, 0];
    for (let i = 0; i < 3; i++) {
        totals[0] += scores[i][0];
        totals[1] += scores[i][1];
        totals[2] += scores[i][2];
    }
    for (let i = 1; i < 3; i++)
        if (totals[i] > totals[resNum - 1])
            resNum = i + 1;

    // Change music
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

    // Set up the result page based on the device screen size
    let resBlock = $('#root #resContainer #resFrame div');
    if (ratio > 0.525) {
        ip = 3 + (ratio - 0.5714) / (0.5263 - 0.5714) * (5 - 3);
        resBlock.css('margin-top', `${ip}%`);
        resBlock.css('margin-bottom', `${ip}%`);
        $('#extra1').hide();
        $('#extra2').hide();
    } else {
        ip = 3.5 + (ratio - 0.5) / (0.4504 - 0.5) * (5 - 3.5);
        resBlock.css('margin-top', `${ip}%`);
        resBlock.css('margin-bottom', `${ip}%`);
        $('#extra1').show();
        $('#extra2').show();
        $('#extra2').css('margin-top', '0%');
    } 
    $('#btnContainer div').css('margin-top','');
    $('#btnContainer div').css('margin-bottom','');

    // Transition animation
    backBtn.animate({ opacity: 0 }, 400);
    skipBtn.animate({ opacity: 0 }, 400);
    $('#resBack').attr('src', './results/back.png');
    whiteImg.animate({ opacity: 1 }, 600);
    setTimeout(function () {
        textSelf.css('opacity', '0');
        $('#nav').hide();
        $('#ansContainer').hide();
        $('#picContainer').hide();
        $('#textContainer').hide();
        $('#resContainer').show();
        $('#resPart1').attr('src', `./results/fore1_${resNum}.png`);
        $('#resPart2').attr('src', `./results/fore2_${resNum}.png`);
        $('#resPart3').attr('src', `./results/fore3_${resNum}.png`);
    }, 600);
    setTimeout(function () {
        whiteImg.animate({ opacity: 0 }, 1000);
    }, 1000);
    setTimeout(function () {
        whiteImg.hide();
    }, 2000);
}

function initAttr() {
    imgAlign('top');
    $('#resContainer').hide();

    foreImg.attr('src', './images/00_fore.png');
    blackImg.attr('src', './images/black.png');
    whiteImg.attr('src', './images/white.png');
    startBtn.attr('src', './images/start.png');
    soundHint.attr('src', './images/hint.png');

    backImg.css('z-index', '1');
    lightImg.css('z-index', '2');
    foreImg.css('z-index', '3');
    loadImg.css('z-index', '4');
    blackImg.css('z-index', '5');
    whiteImg.css('z-index', '6');
    textCont.css('z-index', '7');

    backBtn.css('opacity', '0');
    skipBtn.css('opacity', '0');
    loadImg.css('opacity', '0');
    blackImg.css('opacity', '0');
    whiteImg.css('opacity', '0');

    const ansRegionStyles = {
        left: '0%',
        width: '101%',
        top: '0vh',
        height: '100vh',
        'z-index': '8'
    };
    ansRegions[0].css(ansRegionStyles);
}

function checkOrientation() {
    ratio = window.innerWidth / window.innerHeight;
    console.log(`device ratio: ${ratio}`);
    if (ratio >= 0.45036 && ratio <= 0.57143) {
        $('#warning1').hide();
        $('#warning2').hide();
        $('#root').show();
        if (level == 4)
            showResults();
    } else if (level == 0) {
        $('#warning1').show();
        $('#warning2').hide();
        $('#root').hide();
    } else {
        $('#warning2').show();
        $('#warning1').hide();
        $('#root').hide();
    }
}
function clearTransitionTimeouts() {
    for (let i = 0; i < transitionTimeouts.length; i++)
        clearTimeout(transitionTimeouts[i]);
    transitionTimeouts = [];
}

function animateLight() {
    if (level == 4) return;
        lightImg.animate({ opacity: 1 }, 1000, function() {
            lightImg.animate({ opacity: 0 }, 1000, animateLight);
        });
}

function animateStart() {
    if (level != 0) return;
    startBtn.animate({ opacity: 1 }, 900, function() {
        startBtn.animate({ opacity: 0.3 }, 900, animateStart);
    });
}
function imgAlign(side) {
    allImgs.css({
        'top': '',
        'bottom': '',
        'transform': ''
    });

    if (side === 'top')
        allImgs.css('top', '0');
    else if (side === 'bottom')
        allImgs.css('bottom', '0');
    else if (side === 'center')
        allImgs.css({
            'top': '50%',
            'transform': 'translateY(-50%)'
        });
}

function updateScores(idx, s1, s2, s3) {
    scores[idx][0] = s1;
    scores[idx][1] = s2;
    scores[idx][2] = s3;
}

function skipToLevel(num) {
    level = num - 1;
    getAnswer(0);
    startBtn.hide();
    soundHint.hide();
}

function preloadImages(level) {
    console.log(`preload images : level ${level}`);
    if (level >= 1 && level <= 3) {
        $("<img>").attr('src', `./images/0${level}_fore.png`);
        $("<img>").attr('src', `./images/0${level}_back.png`);
        $("<img>").attr('src', `./images/0${level}_light.png`);
    }
    if (level == 2) {
        for (let i = 1; i <= 4; i++)
            $("<img>").attr('src', `./images/02_res${i}.png`);
    }
    if (level == 4) {
        $("<img>").attr('src', './results/back.png');
        $("<img>").attr('src', './results/logo.png');
        $("<img>").attr('src', './results/line.png');
        $("<img>").attr('src', './results/again.png');
        $("<img>").attr('src', './results/download.png');
        for (let i = 1; i <= 3; i++)
            for (let j = 1; j <= 3; j++)
                $("<img>").attr('src', `./results/fore${i}_${j}.png`);
    }
}   

function preloadMusic(level) {
    console.log(`preload music : level ${level}`);
    $("<audio>").attr('src', `./musics/music${level}.mp3`)[0].load();
}   