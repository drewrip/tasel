const { app, BrowserWindow, ipcMain} = require("electron")
const fs = require("fs");
const path = require("path")

  let win
  let storydir
  let info
  let map
  function createWindow () {

    win = new BrowserWindow({ width: 800, height: 600 , title: "Tasel - OpenTA Player"})


    win.loadFile("src/main.html")

    win.on("closed", () => {

      win = null
    })
  }

  app.on("ready", createWindow)


  app.on("window-all-closed", () => {

    if (process.platform !=="darwin") {
      app.quit()
    }
  })

  app.on("activate", () => {

    if (win === null) {
      createWindow()
    }
  })

  ipcMain.on("submitstory", function(event, storyp){
      storydir = storyp
      info = require(storyp + "info.json")
      map = require(storyp + "map.json")
      event.sender.send("render", info, "<div id=\"info\"><h1 id=\"story-title\"></h1><h2 id=\"story-author\"></h2><h4 id=\"story-agerec\"></h4><p id=\"story-description\"></p><p id=\"story-disclaimer\"></p><div id=\"story-tags\"></div><div id=\"navButtons\"><button id=\"backButton\" onclick=\"backtostart()\">◅ Back</button><button id=\"startButton\" onclick=\"story()\">Next ▻</button></div></div>")
  });

  ipcMain.on("getPath", function(event){
      event.returnValue = storydir;
  })

  ipcMain.on("getInfo", function(event){
      event.returnValue = info;
  })

  ipcMain.on("getMap", function(event){
      event.returnValue = map;
  })

  ipcMain.on("getPage", function(event, pt){
      fs.readFile(path.join(storydir, pt + ".tas"), "utf8", function(err, data){
          if (err) console.log(err)
          event.returnValue = data;
      })
  })
