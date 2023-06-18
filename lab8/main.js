$(function () { 
    $("[type='checkbox']").on("change", updateProgress); 
}); 

function updateProgress() { 
    let hasChecked = 0; 
    let total = $("[type='checkbox']").length;
    for (let x = 0; x < total; x++) {
        if ($("[type='checkbox']")[x].checked) { 
            hasChecked += 1; 
        } 
    }
    $("meter").attr("min",0);
    $("meter").attr("max", $("[type='checkbox']").length);
    $("meter").attr("value", hasChecked);
    updateRealProgress(hasChecked, total);
}
function updateRealProgress(hasChecked, total) {
    $("progress").attr("max", $("[type='checkbox']").length);
    $("progress").attr("value", hasChecked);
}
