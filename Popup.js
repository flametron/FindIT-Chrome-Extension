var storetabs = {};
var hasaudiodir = [];
var multipletitles = [];


function addTolist(tab, index){
    if(tab.title+"" in storetabs || multipletitles.includes(tab.title+"") ){
        // if(tab.title in storetabs && !(multipletitles.includes(tab.title))){
        //     chrome.tabs.get(parseInt(storetabs[tab.title]), function(tab3){
        //         if(tab3.url == tab.url){
        //             return;
        //         }
        // })
        // }
        // !TODO: not intended behaviour

        if(multipletitles.includes(tab.title+"")){
            //it already has 2 tabs
            storetabs[tab.title+"("+tab.url+")"]=tab.id;
        }
        else{
            var temptitle = tab.title+"";
            var id = storetabs[temptitle];
            delete storetabs[temptitle];
            // Let's add the old one back
            chrome.tabs.get(parseInt(id), function(tab2){
                storetabs[temptitle+"("+tab2.url+")"]=id;
            })
            storetabs[temptitle+"("+tab.url+")"]=tab.id;
            multipletitles.push(temptitle);
        }
        // console.log(multipletitles);
    }
    else{
        storetabs[tab.title+""]=tab.id;
    }
    if(tab.audible){
        hasaudiodir.push(tab.id);
    }
    }

function startingCheck(){
    chrome.tabs.query({ currentWindow:true }, tabs => {
        tabs.forEach( addTolist
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
    button.textContent = k;
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
    p = document.getElementById('Results');
    
    p.classList.add('hide')
    setTimeout(function() { 
        ul.innerHTML='';
        for(var k in found){
            addChild(ul,k,found[k]);
        }
    }, 50);
    setTimeout(function() { 
        p.classList.remove('hide')
    }, 50);
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