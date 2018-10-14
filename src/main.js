const { ipcRenderer, remote } = require("electron");

function submitstory(event) {
    event.preventDefault(); // stop the form from submitting
    let storyp = document.getElementById("storypath").value;
    ipcRenderer.send("submitstory", storyp);
}

function redirectto(url){
    require("electron").shell.openExternal(url);
}

ipcRenderer.on("render", function(event, inf, data){
    document.getElementById("content").innerHTML = data;
    document.getElementById("story-title").innerHTML = inf.title;
    document.getElementById("story-description").innerHTML = inf.description;
    document.getElementById("story-author").innerHTML = "By: " + inf.author;
    if(inf.agerec != 0){
        document.getElementById("story-agerec").innerHTML = inf.agerec;
    }
    document.getElementById("story-disclaimer").innerHTML = inf.disclaimer;
    for(let t of inf.tags){
        var tg = document.createElement("LI")
        tg.innerHTML = t
        document.getElementById("story-tags").appendChild(tg);
    }
});

function startstory(){
    let storyp = ipcRenderer.sendSync("getPath");
    let mp = ipcRenderer.sendSync("getMap");
    document.getElementById("content").innerHTML = "<div id=\"storybox\"><p id=\"storycontent\"></p></div>";
    let initial = ipcRenderer.sendSync("getPage", mp.textpath)
    showpage(initial)
}

function backtostart(){
    let start = "<body><h1 id=\"landingtitle\">Tasel</h1><form action=\"#\" onsubmit=\"JavaScript:submitstory(event)\" id=\"storyform\"><input type=\"text\" name=\"storypath\" id=\"storypath\" placeholder=\"Path to Story Folder...\"/><br><input id=\"submitbutton\" type=\"submit\" name=\"Load\"/></form></body><footer><p id=\"gitfooter\"><a href=\"#\" onclick=\"JavaScript:redirectto('https://github.com/drewrip/tasel')\">Visit Project On GitHub</a></p></footer>"
    document.getElementById("content").innerHTML = start;
}

function showpage(cont){
    document.getElementById("storycontent").innerHTML = cont;
}
