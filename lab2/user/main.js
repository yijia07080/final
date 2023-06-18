let table = $("#courseTable");
let date = $('#date')
let startDate = new Date();
let data;
let url = `./db.json?timestamp=${new Date().getTime()}`;

window.onload = function () {
	init();
};

let init = function() {
    $.get(url, function(res) {
		data = res;
        setTime();
        displayTable();
	})
};

function setTime() {
    startDate.setMonth(data[0].month - 1, data[0].day); 
    startDate.setHours(0); 
    startDate.setMinutes(0); 
    startDate.setSeconds(0);
} 

function displayTable() {
    let millisecsPerDay = 24 * 60 * 60 * 1000;
    table.append("<tr><th style='width:7vw;'>場次</th><th>時間</th><th>地點</th><th>主題</th><th>停課</th><th>備註</th></tr>");
    for (var i = 1; i < data.length; i++)
        if (data[i].exist) {
            table.append(`<tr><td style='width:7vw; font-weight: bold;'>${i}</td>` +
                        `<td>${(new Date(startDate.getTime() + 7 * (i-1) * millisecsPerDay)).toLocaleDateString()}</td>` +
                        `<td>${data[i].place}</td>` +
                        `<td>${data[i].topic}</td>` + 
                        `<td></td>` + 
                        `<td style="width:14vw">${data[i].remark}</td></tr>`);
        } else {
            table.append(`<tr style="color:gray;"><td style='width:7vw;'>${i}</td>` +
                        `<td>${(new Date(startDate.getTime() + 7 * (i-1) * millisecsPerDay)).toLocaleDateString()}</td>` +
                        `<td>-</td>` +
                        `<td>${data[i].topic}</td>` + 
                        `<td>停課</td>` + 
                        `<td style="width:14vw">${data[i].remark}</td></tr>`);
        }
}