var ctx, ctx2, thisImage; 
function showDate() { 
    var thisDate = this.value; 
    thisDate = thisDate.replace(/-/g, ""); 
    thisImage = new Image(); 
    thisImage.src = "flipClockNumbers.png"; 
    thisImage.onload = function () { 
        for (var x = 0; x < thisDate.length; x++) { 
            ctx2.drawImage(thisImage, thisDate[x] * 80, 0, 90, 130, 60 * x, 0, 60, 100);
         } 
    };    
}

function changeBackgroundColor() {
    var color = $(this).val();
    $("body").css("background-color", color);
}
function showTime() {
    var currentTime = new Date();
    var hours = currentTime.getHours();
    var minutes = currentTime.getMinutes();
    var seconds = currentTime.getSeconds();
  
    var timeString = formatTime(hours) + formatTime(minutes) + formatTime(seconds)
  
    ctx.clearRect(0, 0, $("#myCanvas")[0].width, $("#myCanvas")[0].height);
    for (var x = 0; x < timeString.length; x++) {
      ctx.drawImage(thisImage, timeString[x] * 80, 0, 90, 130, 50 * x, 0, 60, 100);
    }
  
    setTimeout(showTime, 1000);
  }
  
  function formatTime(time) {
    return time < 10 ? String("0" + time) : String(time);
  }
  
  $(function () {
    var initialColor = "#ADD8E6";
    $("#colorPicker").val(initialColor);
    $("body").css("background-color", initialColor);
    $("#colorPicker").on("change", changeBackgroundColor);
    
    ctx = $("#myCanvas2")[0].getContext("2d");
    thisImage = new Image();
    thisImage.src = "flipClockNumbers.png";
    thisImage.onload = showTime;

    $("[type='date']").on("change", showDate); 
    $("#colorPicker").on("change", changeBackgroundColor);
    ctx2 = $("#myCanvas")[0].getContext("2d"); 
});