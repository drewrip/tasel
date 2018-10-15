const { ipcRenderer, remote } = require("electron");

function submitstory(event) {
    event.preventDefault(); // stop the form from submitting
    let storyp = document.getElementById("storypath").value;
    ipcRenderer.send("submitstory", storyp);
}

function redirectto(url){
    require("electron").shell.openExternal(url);
}

let map

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
        var tg = document.createElement("DIV")
        tg.innerHTML = t
        document.getElementById("story-tags").appendChild(tg);
    }
});

// Generates option buttons for this layer of the map
function genButtons(mp){
    document.getElementById("storybuttons").innerHTML = ""
    for(let i=0; i<mp.branches.length; i++){
        let b = mp.branches[i]
        let button = document.createElement("BUTTON")
        button.innerHTML = b.choice
        button.onclick = function(){update(i)}
        document.getElementById("storybuttons").insertAdjacentElement("afterbegin", button)
    }
}

function genEndButtons(){
    document.getElementById("storybuttons").innerHTML = ""
    let button = document.createElement("BUTTON")
    button.innerHTML = "RETURN TO MENU"
    button.onclick = function(){backtostart()}
    document.getElementById("storybuttons").insertAdjacentElement("afterbegin", button)
}

// Generates reading page for this layer of the map
function genRead(mp){
    console.log("Rendering page for " + mp.textpath)
    document.getElementById("storycontent").innerHTML = ipcRenderer.sendSync("getPage", mp.textpath);
}

function story(){
    let storyp = ipcRenderer.sendSync("getPath");
    map = ipcRenderer.sendSync("getMap");
    document.getElementById("content").innerHTML = "<div id=\"storybox\"><p id=\"storycontent\"></p><div id=\"storybuttons\"></div></div>";
    console.log(map)
    genRead(map)
    genButtons(map)
}

function update(i){
    map = map.branches[i]
    if(map.branches[0].choice == "END"){
        genEndButtons()
    }
    else{
        genButtons(map)
    }
    genRead(map)
}

function backtostart(){
    let start = "<body><h1 id=\"landingtitle\">Tasel</h1><form action=\"#\" onsubmit=\"JavaScript:submitstory(event)\" id=\"storyform\"><input type=\"text\" name=\"storypath\" id=\"storypath\" placeholder=\"Path to Story Folder...\"/><br><input id=\"submitbutton\" type=\"submit\" name=\"Load\"/></form></body><footer><p id=\"gitfooter\"><a href=\"#\" onclick=\"JavaScript:redirectto('https://github.com/drewrip/tasel')\">Visit Project On GitHub</a></p></footer>"
    document.getElementById("content").innerHTML = start;
}
