let table = $("#courseTable");
let date = $('#date')
var data;
let url = `./db.json?timestamp=${new Date().getTime()}`;

window.onload = function () {
	init();
};

let init = function() {
  $.get(url, function(res) {
  		data = res;
      displayTable();
	})
	
};

function displayTable() {
    table.append("<tr><th style='width:10vw;'>#</th><th>Task</th><th></th><th></th></tr>");
    for (var i = 0; i < data.length; i++) {
        table.append(`<tr data-index="${i}"><td style='width:8vw; font-weight: bold;'>${i+1}</td>` +
                    `<td><input type = "text" size = "20" value="${data[i].task}" id="b${i}"></td>` + 
                    `<td><strong style='color:#003060;' id="upd${i}">&nbsp;更新&nbsp;</strong></td>`+ 
                    `<td><strong style='color:#003060;' id="del${i}">&nbsp;刪除&nbsp;</strong></td></tr>`);
        $(`#upd${i}`).on('mouseover', function() {
            $(this).css('text-decoration', 'underline');
        });
        
        $(`#upd${i}`).on('mouseout', function() {
            $(this).css('text-decoration', 'none');
        });
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
            save();
        });
        
        $(`#upd${i}`).on('click', function() {
            save();
        });
    }
    table.append(("<tr><td colspan='7'><strong style='color:#003060;' id='addrow'>&nbsp;新增一項&nbsp;</strong></td></tr>"));
    $('#addrow').on('click', function() {
        data.push({task: ''});
        $('tr').remove();
        displayTable();
        save();
    });
    $('#addrow').hover(
        function() {
            $('#addrow').css('text-decoration', 'underline');
        }, function() {
            $('#addrow').css('text-decoration', 'none');
        }
    );
}

function save() {
    for (var i = 0; i < data.length; i++) {
        data[i].task = $(`#b${i}`).val();
    }
    console.log(data);
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
};
