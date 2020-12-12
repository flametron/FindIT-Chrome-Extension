var storetabs = {};
var hasaudiodir = [];

function startingCheck(){
    chrome.tabs.query({ currentWindow:true }, tabs => {
        tabs.forEach( function(tab, index){
            storetabs[tab.title+""]=tab.id;
            if(tab.audible){
                hasaudiodir.push(tab.id);
            }
            }
        );
    });
}

function goToTab(id){
    // alert(typeof(parseInt(id)));
    // chrome.tabs.sendMessage(parseInt(id), "FocusMe" );
    var updateProperties = { 'active': true };
    chrome.tabs.update(parseInt(id), updateProperties, (tab) => { });
}

function addChild(ul,k,id){
    var listItem = document.createElement("li");
    var button = document.createElement("Button");
    button.setAttribute('class','foundlist');
    button.textContent = k + " - "+ id;
    button.setAttribute('tab-id',id);
    button.onclick = function(event) {
        goToTab(id);
    }
    // audible
    if(hasaudiodir.includes(id)){
        button.classList.add("audible");
    }
    listItem.appendChild(button);
    ul.appendChild(listItem);
}


function runParsing(){
    var found = {};
    const tabreqired = document.querySelector('#tabname').value;
    for(var k in storetabs){
        if(k.toLowerCase().includes(tabreqired.toLowerCase())){
            found[k]=storetabs[k];
        }
    }
    var ul = document.querySelector("#ResultList");
    ul.innerHTML='';
    for(var k in found){
        addChild(ul,k,found[k]);
    }
}

function setListners(){
    document.getElementById('checkTabs').addEventListener('click', runParsing);
    document.getElementById('tabname').addEventListener('keydown',(event) => setTimeout(runParsing, 10));
}

document.addEventListener('DOMContentLoaded', function() {
    startingCheck();
    setTimeout(setListners, 10);
    document.querySelector('#tabname').focus();
    });