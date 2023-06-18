let thisButton = document.getElementsByTagName("button")[0];
let showData = document.getElementById("showData");
thisButton.addEventListener("click", loadServerData);

function loadServerData(){ 
    console.log("Load Server Data!"); 
    let xmlHttpRequest; 
    if (window.XMLHttpRequest) { 
        xmlHttpRequest = new XMLHttpRequest(); 
    } else { 
        alert("No XMLHttpRequest!"); 
        return; 
    } 
    xmlHttpRequest.open("GET", "DataFromServer.txt", true); 
    xmlHttpRequest.send(); 
    xmlHttpRequest.onreadystatechange = function () { 
        if (xmlHttpRequest.readyState == 4 && xmlHttpRequest.status == 200) { 
            showData.innerHTML = xmlHttpRequest.responseText; 
            thisButton.style.visibility = "hidden"; 
        } 
    } 
}
