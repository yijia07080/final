let mainArea;
let whiteX, whiteY;
let step = 0;
let time = new Date();
let startTime = time.getTime();
let map = Array.from({ length: 16 }, (_, i) => i + 1);

window.onload = function () {
    mainArea = $("#mainArea");
    init();
};

function init() {
    shuffle();
    for (var i = 0; i < 4; i++)
        for (var j = 0; j < 4; j++)
            if (map[pos2num(i, j)] != 16) {
                mainArea.append(`<div id='${map[pos2num(i, j)]}' style='top:${21 * i}vh; left:${21 * j}vh;'>${map[pos2num(i, j)]}</div>`);
            } else {
                whiteX = i;
                whiteY = j;
            }
}

$(document).on("keydown", function (event) {
    event.preventDefault();
    if (event.code == "ArrowLeft" && whiteY < 3) {
        move(0,1);
    } else if (event.code == "ArrowRight" && whiteY > 0) {
        move(0,-1);
    } else if (event.code == "ArrowUp" && whiteX < 3) {
        move(1,0);
    } else if (event.code == "ArrowDown" && whiteX > 0) {
        move(-1,0);
    }
});

function move(dx,dy) {
    $('#move').html(String(++step));
    let x = whiteX + dx;
    let y = whiteY + dy;
    let a = pos2num(x,y);
    let b = pos2num(whiteX, whiteY);
    moveAnimation(pos2num(x,y), x, y, dx, dy);
    [map[a], map[b]] = [map[b], map[a]];
    [whiteX, whiteY] = [x, y]
}

function shuffle() {
    for (let i = map.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [map[i], map[j]] = [map[j], map[i]];
    }
    map = [9, 1, 16, 2, 5, 3, 12, 7, 14, 15, 4, 6, 10, 13, 11, 8];
}

function pos2num(i, j) {
    return i * 4 + j;
}

function moveAnimation(id, x, y, dx, dy) {
    
    let red = [215, 113, 106];
    let green = [32, 102, 102];
    let gx = x - dx;
    let gy = y - dy;
    let startColor = $(`#${map[id]}`).css('background-color') == 'rgb(215, 113, 106)' ? red:green;
    let correct = (pos2num(gx,gy) == map[id] - 1);
    console.log(pos2num(gx,gy), map[id]);
    console.log(correct)
    let endColor = correct ? green : red;

    // 計算移動距離和時間
    id = map[id];
    [gx, gy] = [gy * 21, gx * 21];
    [dx, dy] = [-dy * 21, -dx * 21];
    const distance = Math.sqrt(dx * dx + dy * dy);
    const duration = 5000;

    // 設定加速度和最大速度
    const acceleration = distance / (0.2 * duration * duration);
    
    // 開始移動與變色
    let startTime;
    let lastTime = 0;
    let currentPosition = 0;
    let currentSpeed = 0;

    function frame(currentTime) {
        if (!startTime) startTime = currentTime;
        const deltaTime = currentTime - startTime;
        const deltaDistance = (currentSpeed + 0.5 * acceleration * deltaTime) * deltaTime;
        currentPosition += deltaDistance;

        currentSpeed += acceleration * deltaTime;
        if (currentPosition >= distance) {
            document.getElementById(id).style.transform = `translate(0vh, 0vh)`;
            $(`#${id}`).css('top', `${gy}vh`);
            $(`#${id}`).css('left', `${gx}vh`);
            $(`#${id}`).css('background-color', `rgb(${endColor[0]}, ${endColor[1]}, ${endColor[2]})`);
            return;
        }
        const xPosition = (currentPosition / distance) * dx;
        const yPosition = (currentPosition / distance) * dy;
        document.getElementById(id).style.transform = `translate(${xPosition}vh, ${yPosition}vh)`;
        
        const progress = deltaTime / 340;
        const currentColor = startColor.map((channel, index) =>
            Math.round(channel * (1 - progress) + endColor[index] * progress)
        );
        document.getElementById(id).style.backgroundColor = `rgb(${currentColor[0]}, ${currentColor[1]}, ${currentColor[2]})`;

        requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
}

setInterval(function() {
    let timen = new Date();
    var nowTime = timen.getTime();
    var offsetTime = (nowTime - startTime) / 1000;
    var sec = parseInt(offsetTime % 60);
    var min = parseInt((offsetTime / 60) % 60);
    console.log(min, sec);
    $("#min").html(String(min));
    $("#sec").html(String(sec));
}, 1000);