var currentVideoIndex = 0,  currentAudioIndex = 0;
var videos = ["sample-mp4-file.mp4", 
              "sample-mp4-file3.mp4", 
              "sample-mp4-file2.mp4"];
var musics = ["music0.mp3", 
              "music1.mp3", 
              "music2.mp3"];
var lock = false, mode = 0;

$(function () {
    $("#audio").on("click", function() {
        mode = 1;
        $("#myVideo")[0].pause();
        $("#playBtn").text("Play");
        $("#myVideo").hide();
        $("#fullBtn").hide();
        $("music").show();
        $("#channelDisplay").text(currentAudioIndex + 1);
        changeVideo();
    });
    $("#video").on("click", function() {
        mode = 0;
        $("#myVideo")[0].pause();
        $("#playBtn").text("Play");
        $("#myVideo").show();
        $("#fullBtn").show();
        $("music").hide();
        $("#channelDisplay").text(currentVideoIndex + 1);
        changeVideo();
    });

    $("music").hide();
    $("#myVideo").attr("src", "sample-mp4-file.mp4");
    $("#playBtn").on("click", function () {
        $("#volumeDisplay").text($("#myVideo")[0].volume.toFixed(2));
        $("#progressBar")[0].max = $("#myVideo")[0].duration;
        if ($("#myVideo")[0].paused) {
            $("#myVideo")[0].play();
            $("#playBtn").text("Pause");
            lock = false;
        } else {
            $("#myVideo")[0].pause();
            $("#playBtn").text("Play");
        }
    });
    $("#fullBtn").on("click", function () {
        $("#myVideo")[0].webkitEnterFullscreen();
    });
    $("#lowerVolumeBtn").on("click", downVolume);
    $("#higherVolumeBtn").on("click", upVolume);
    $("#myVideo").on("timeupdate", updateProgress);
    $("#progressBar").on("change", changeProgress);
    $("#channelDisplay").text(currentVideoIndex + 1);

    $("#lowerVideoIdx").on("click", function () {
        if (mode == 0 && currentVideoIndex > 0) {
            currentVideoIndex--;
            changeVideo();
        }
        if (mode == 1 && currentAudioIndex > 0) {
            currentAudioIndex--;
            changeVideo();
        }
    });

    $("#higherVideoIdx").on("click", function () {
        if (mode == 0 && currentVideoIndex < videos.length - 1) {
            currentVideoIndex++;
            changeVideo();
        }
        if (mode == 1 && currentAudioIndex < musics.length - 1) {
            currentAudioIndex++;
            changeVideo();
        }
    });

    function changeVideo() {
        lock = true;
        if (mode == 0) {
            $("#myVideo").attr("src", videos[currentVideoIndex]);
            $("#channelDisplay").text(currentVideoIndex + 1);
        } else if (mode == 1) {
            $("#myVideo").attr("src", musics[currentAudioIndex]);
            $("#channelDisplay").text(currentAudioIndex + 1);
        }
        $("#playBtn").text("Play");
        $("#myVideo")[0].pause();
        $("#progressBar")[0].value = 0;
        $("#timeDisplay").text("0 / ?");
        setPlaybackRate(1);
    }

    $("#halfSpeed").on("click", function() {
        setPlaybackRate(0.5);
    });
    
    $("#normalSpeed").on("click", function() {
        setPlaybackRate(1);
    });
    
    $("#doubleSpeed").on("click", function() {
        setPlaybackRate(2);
    });
    
    function setPlaybackRate(rate) {
        $("#myVideo")[0].playbackRate = rate;
        $("#speedDisplay").text(rate);
    }
});

function downVolume() {
    var myVideo = $("#myVideo")[0];
    if (myVideo.volume == 0) {
    } else if (myVideo.volume < 0.1) {
        myVideo.volume = 0;
    } else {
        myVideo.volume = myVideo.volume - 0.1;
    }
    volumeDisplay.innerHTML = myVideo.volume.toFixed(2);
}

function upVolume() {
    varmyVideo = $("#myVideo")[0];
    if (myVideo.volume == 1) {
    } else if (myVideo.volume > 0.9) {
        myVideo.volume = 1;
    } else {
        myVideo.volume = myVideo.volume + 0.1;
    }
    volumeDisplay.innerHTML = myVideo.volume.toFixed(2);
}
function updateProgress(){ 
    if (!lock) {
        $("#timeDisplay").text(Math.floor($("#myVideo")[0].currentTime)); 
        $("#timeDisplay").append(`/${Math.floor($("#myVideo")[0].duration)}秒`); 
        $("#progressBar")[0].value = $("#myVideo")[0].currentTime; 
    }
} 

function changeProgress(){ 
    $("#myVideo")[0].currentTime = $("#progressBar")[0].value; 
}