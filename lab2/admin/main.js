let table = $("#courseTable");
let date = $('#date')
let startDate = new Date();
var data;
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
    date.attr('value', `2023-${String(data[0].month).padStart(2,'0')}-${String(data[0].day).padStart(2,'0')}`);
    table.append("<tr><th style='width:10vw;'>場次</th><th>時間</th><th>地點</th><th>主題</th><th>備註</th><th>是否停課</th><th></th></tr>");
    for (var i = 1; i < data.length; i++) {
        if (data[i].exist) {
            table.append(`<tr data-index="${i}"><td style='width:8vw; font-weight: bold;'>${i}</td>` +
                        `<td>${(new Date(startDate.getTime() + 7 * (i-1) * millisecsPerDay)).toLocaleDateString()}</td>` +
                        `<td><input type = "text" size = "6" value="${data[i].place}" id="a${i}"></td>` +
                        `<td><input type = "text" size = "8" value="${data[i].topic}" id="b${i}"></td>` + 
                        `<td><input type = "text" size = "8" value="${data[i].remark}" id="c${i}"></td>` +
                        `<td><input type = "checkbox" id="d${i}">停課</td>` + 
                        `<td><strong style='color:#003060;' id="del${i}">&nbsp;刪除&nbsp;</strong></td></tr>`);
        } else {
            table.append(`<tr data-index="${i}" style="color:gray;"><td style='width:8vw;'>${i}</td>` +
                        `<td>${(new Date(startDate.getTime() + 7 * (i-1) * millisecsPerDay)).toLocaleDateString()}</td>` +
                        `<td><input type = "text" size = "6" value="" id="a${i}"></td>` +
                        `<td><input type = "text" size = "8" value="${data[i].topic}" id="b${i}"></td>` + 
                        `<td><input type = "text" size = "8" value="${data[i].remark}" id="c${i}"></td>` +
                        `<td><input type = "checkbox" id="d${i}" checked>停課</td>` + 
                        `<td><strong style='color:#003060;' id="del${i}">&nbsp;刪除&nbsp;</strong></td></tr>`);
        }
        $(`#del${i}`).on('mouseover', function() {
            $(this).css('text-decoration', 'underline');
        });
        
        $(`#del${i}`).on('mouseout', function() {
            $(this).css('text-decoration', 'none');
        });
        
        $(`#del${i}`).on('click', function() {
            let index = parseInt($(this).closest('tr').attr('data-index'));
            data.splice(index, 1);
            $('tr').remove();
            displayTable();
            console.log(data);
        });
    }
    table.append(("<tr><td colspan='7'><strong style='color:#003060;' id='addrow'>&nbsp;新增一列&nbsp;</strong></td></tr>"));
    $('#addrow').on('click', function() {
        data.push({topic: '', remark: '', exist: true, place: ''});
        $('tr').remove();
        displayTable();
        console.log(data);
    });
    $('#addrow').hover(
        function() {
            $('#addrow').css('text-decoration', 'underline');
        }, function() {
            $('#addrow').css('text-decoration', 'none');
        }
    );
}

$('#date').change(function() {
    data[0].month = date.val().substring(5,7);
    data[0].day = date.val().substring(8,10);
    setTime(data[0].month, data[0].day);
    $('tr').remove();
    displayTable();
});


$("#save").click(function() {
    console.log(data);
    for (var i = 1; i < data.length; i++) {
        data[i].topic = $(`#b${i}`).val();
        data[i].place = $(`#a${i}`).val();
        data[i].remark = $(`#c${i}`).val();
        data[i].exist = !$(`#d${i}`).is(":checked");
    }
    let dataStrs = JSON.stringify(data);
    console.log(dataStrs);
    $.ajax({
        url: './write.php',
        type: 'POST',
        cache: false,
        data: { data: dataStrs },
        success: function(response) {
            console.log(response);
        },
        error: function(xhr, status, error) { 
            console.error(error);
        }
    });
});
