//Node Requires
const fs = require('fs');
const path = require('path')
const {dialog, Menu} = require('electron').remote
const app = require('electron').remote;
const ipc = require('electron').ipcRenderer;
var rimraf = require('rimraf');
const remote = require('electron').remote;
const BrowserWindow = remote.BrowserWindow;



//Enviroment Variables
var cv, margin, concat;
var iconName = "adjust"; //Icon Selection
var datas = [];
var imageFormat = ["png", "jpg", "gif", "jpeg", "swf", "bmp", "tif", "tiff", "eps", "svg"];
var powerpoint = ["ppt", "pptx", "pptm"];
var word = ["doc", "docm", "docx", "docs"];
var excel = ["xls", "xml", "xlam"];
var compressed = ["zip", "gzip", "bzip2", "rar", "tar", "7z"];
var txt = ["txt", "rtf", "ps"];
var dats;
var folds;
var fileName;
var backupFileName;
var readyToRead = false;
var color, pathS;
var prefJSON;
var saveColor;
var defraction = 50;
var lbl = $("#prefs #mainCard #selectionColor div label");
var colorPickerInit;
var pink, blue, green, purple, freeColor;
var prefsToggle = false;

//Screen Adjust Functions
reloadW();
reload();


//Set Preferences


initColor();
function openPrefs(){
    if(prefsToggle == false){
        $('#prefs').fadeIn(500);
        setTimeout(() => {
            $('#prefs #mainCard').css("top", "50%");
        }, 300);
        
        prefsToggle = true;
    }else{
        $('#prefs').fadeOut(500);
        setTimeout(() => {
            $('#prefs #mainCard').css("top", "-100%");
        }, 700);
        
        
        $('.colorpicker').fadeOut(500);
        prefsToggle = false;
    }
}
$("#shadowCard").click(function(){
    $('#prefs').fadeOut(500);
    $('.colorpicker').fadeOut(500);
    prefsToggle = false;
})



$("#prefs #mainCard #selectionColor div label").click(function(){
    var iptColor = $(this).parent().find("input").val();
    colorPickerInit = iptColor;
    saveColor = colorPickerInit;
    $("#prefs #mainCard #selectionColor div").css("border", "none");
    $(this).parent().css({
        "border" : "4px solid "+$(this).parent().find("label").css("background").toHex()
    })
    $(this).parent().find("input").ColorPicker({
        color : colorPickerInit,
        onShow: function (colpkr) {
            var prt = $(this).parent();
            $(colpkr).fadeIn(500);
            lbl = $(prt).find("label");
            setColorPicker(defraction, lbl);
            return false;
        },
        onHide: function (colpkr) {
            $(colpkr).fadeOut(500);
            return false;
        },
        onChange: function (hsb, hex, rgb) {
            saveColor = "#"+hex;
            lbl.css('background', '#' + hex);
            $("#prefs #mainCard #selectionColor div").css("border-color", '#' + hex);
        },
        onSubmit: function(hsb, hex, rgb){
            saveColor = "#"+hex;
            $(".colorpicker").fadeOut(500);
        }
    });
})
$("#hidePrefs").click(function(){
    $('#prefs').fadeOut(500);
    $('.colorpicker').fadeOut(500);
    prefsToggle = false;
})
$("#savePrefs").click(function(){
    saveColors();
    saveJSON();
    app.getCurrentWindow().reload();
})

function saveColors(){
    pink = $("#pink label").css('backgroundColor').toHex();
    blue = $("#blue label").css('backgroundColor').toHex();
    green = $("#green label").css('backgroundColor').toHex();
    purple = $("#purple label").css('backgroundColor').toHex();
    freeColor = $("#freeColor label").css('backgroundColor').toHex();
}


setColorPicker(defraction, lbl);
function setColorPicker(defraction){
    var h = lbl.offset();
    var oper = (h.top) + defraction;
    if( $(lbl).parent().find("strong").text() == "Your color"){
        if(defraction == 50){
            $(".colorpicker").css({
                "margin-top" : oper+"px",
                "margin-left" : (h.left) - 250 + "px"
            });
        }else{
            $(".colorpicker").css({
                "margin-top" : oper+"px",
                "margin-left" : (h.left) - 200 + "px"
            });
        }
    }else{
        $(".colorpicker").css({
            "margin-top" : oper+"px",
            "margin-left" : (h.left) + "px"
        });
    }
    
}



function saveJSON(){
    prefJSON = '{\n\t"pathS" : '+'"'+fileName+'"'+',\n\t"color" : '+'"'+saveColor+'"'+',\n\t"color1" : '+'"'+pink+'"'+',\n\t"color2" : '+'"'+blue+'"'+',\n\t"color3" : '+'"'+green+'"'+',\n\t"color4" : '+'"'+purple+'"'+',\n\t"yourColor" : '+'"'+freeColor+'"'+'\n}';
    fs.writeFile('preferences.json', prefJSON, function (err) {
        if (err) return console.log(err);
    });
}
function setCs(array){
        if(color == array[0]){
            $("#prefs #mainCard #selectionColor #pink").css({
                "border" : "4px solid "+color
            })
        }
        if(color == array[1]){
            $("#prefs #mainCard #selectionColor #blue").css({
                "border" : "4px solid "+color
            })
        }
        if(color == array[2]){
            $("#prefs #mainCard #selectionColor #green").css({
                "border" : "4px solid "+color
            })
        }
        if(color == array[3]){
            $("#prefs #mainCard #selectionColor #purple").css({
                "border" : "4px solid "+color
            })
        }
        if(color == array[4]){
            $("#prefs #mainCard #selectionColor #freeColor").css({
                "border" : "4px solid "+color
            })
        }
}

function initColor(){
    $.getJSON("../preferences.json", function(data){
        pathS = data.pathS;
        color = data.color;
        pink = data.color1;
        blue = data.color2;
        green = data.color3;
        purple = data.color4;
        freeColor = data.yourColor;
        saveColor = color;
        csl = [pink, blue, green, purple, freeColor];
        setCs(csl);
 
            $("#pink label").css({"background" : pink});
            $("#blue label").css({"background" : blue});
            $("#green label").css({"background" : green});
            $("#purple label").css({"background" : purple});
            $("#freeColor label").css({"background" : freeColor});
            $("#pink input").val(pink);
            $("#blue input").val(blue);
            $("#green input").val(green);
            $("#purple input").val(purple);
            $("#freeColor input").val(freeColor);            
        $("#path").css("background", "linear-gradient(to right,rgba(0,0,0,0),"+color+")");
        $("#ret").css("background" , color);
        $("#ssl").css("background" , color);
        $(".box").css("background" , color);
        $(".toolBar").css("background" , color);
        $("#rel").css("background", color);
        $("#addBox").css("background", color);
        if(pathS != "undefined"){
            fileName = pathS;
            backupFileName = fileName;
            var folderName = path.basename(fileName);
            fs.readdir(fileName, 'utf-8', (err, data) =>{
                dats = data;
                folds = folderName;
                readyToRead = true;
                setContents(dats, folds); 
                reload();
            });
        }
    })
}



//Menus
ipc.on("showPrefs",() =>{
    openPrefs();
})

ipc.on("reloadMenu",() =>{
    reload();
})

// ipc.on("addMenu",() =>{
//     reload();
// })
// ipc.on("editMenu",() =>{
//     reload();
// })

ipc.on("deleteMenus",() =>{
    selecDel();
})


//Prototypes
String.prototype.searchRepeat=function(rpt, str){
    var count = 0;
    for(var i = 0;i < this.length;i++){
        if(this.charAt(i) == str){
            count++;
        }
    }
    if(count == rpt){
        return true;
    }else{
        return false;
    }
}
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

String.prototype.getSearchPosition = function(str, index){
    var count = 0;
    for(var i = 0; i < this.length; i++){
        if(this.charAt(i) == str){
            count++;
            if(count == index){
                return i;
            }
        }
    }
}
function trim (str) {
    return str.replace(/^\s+|\s+$/gm,'');
  }
  
String.prototype.toHex = function() {
      var parts = this.substring(this.indexOf("(")).split(","),
          r = parseInt(trim(parts[0].substring(1)), 10),
          g = parseInt(trim(parts[1]), 10),
          b = parseInt(trim(parts[2]), 10)
          var hexs; 
          if(r == 00){
            hexs = ('#' + "00" + g.toString(16) + b.toString(16));
          }else if(g == 00){
            hexs = ('#' + r.toString(16) + "00" + b.toString(16));
          }else if( b == 00){
            hexs = ('#' + r.toString(16) + g.toString(16) + "00");
          }else if( r == 00 && g == 00 && b == 00){
            hexs = ('#000000');
          }else{
            hexs = ('#' + r.toString(16) + g.toString(16) + b.toString(16));
          }
          return hexs;
  }
String.prototype.toRGB = function() {
    var c;
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(this)){
        c= this.substring(1).split('');
        if(c.length== 3){
            c= [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c= '0x'+c.join('');
        return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+',0.6)';
    }
}

//--------------

document.getElementById("returnBox").style.opacity = "0";

function reloadW(){
    var w = window.innerWidth;
    cv = w/1000;
    margin = ((w - (20 + (255*cv) + (255*cv) + (255*cv) + 10))/4)*cv;
    concat = "scale("+cv+", "+cv+")";
    if(cv == 1){
        $("#navBar").css("padding-left", "75px");
        document.getElementById("setRel").style.marginTop = "56px";

        $('#intr').css({
            "transform" : "scale("+cv+", "+cv+")"+" translate(-50%, -50%)"
        })
      
    }else{
        $("#navBar").css("padding-left", "40px");
        document.getElementById("setRel").style.marginTop = "56px";
        $('#intr').css({
            "transform" : "scale("+cv+", "+cv+")"+" translate(-50%, -35%)"
        })
    }
}

function reload(){
    setTimeout(() => {
        $('#warningDelete').css({
            "transform" : concat
        })
        $('#mainCard').css({
            "transform" : "translate(-50%, -50%) "+concat
        })
    }, 100);

    if(readyToRead == true){
    setBtns();
    setContractionFolder(fileName);
    $("#reus").show();
    $("#rel").show();
    setTimeout(() =>{
    saveJSON();
    var folderName = path.basename(fileName);
    fs.readdir(fileName, 'utf-8', (err, data) =>{
        dats = data;
        folds = folderName;
        setContents(dats, folds);  
     });
     if(cv != 1){
        setTimeout(() =>{
            $("#ctr div").css({
                "height" : "170px"
            })
            $(".dataF").addClass("datsB");
            $(".dataR").css({
                "padding-top" : "23%"
            })
            $(".dataD").css({
                "padding-top" : "30%"
            })
            $(".dataE").css({
                "padding-top" : "23%"
            })
            defraction = 70;
            setColorPicker(defraction, lbl);
        }, 100)
     }else{
        setTimeout(() =>{
            $("#ctr div").css({
                "height" : "150px"
            })
            defraction = 50;
            setColorPicker(defraction, lbl); 
        }, 100)
     }
    }, 10);
}else{
    $("#reus").hide();
    $("#rel").hide();
}
}

function setContractionFolder(str){
    var format = document.createElement("i");
    if(readyToRead == true){
        if(str.length >= 48){
            format.innerHTML = "Home/... /"+path.basename(str);
        }else{
            var setHomeContraction = fileName.replace(backupFileName, "Home");
            var setNamesFormat = setHomeContraction.replace(/\//g, " / ");
            format.innerHTML = setNamesFormat;
        }
        document.getElementById("path").innerHTML = "";
        document.getElementById("path").appendChild(format);
    }
}

//Get the Directory

function openDir(){
    dialog.showOpenDialog({properties : ['openDirectory']},(fileNames) =>{
        if (fileNames === undefined){
            document.getElementById("intr").style.display = "block"; 
        }else{  
            fileName = fileNames[0];
            backupFileName = fileName;
            var folderName = path.basename(fileName);
            fs.readdir(fileName, 'utf-8', (err, data) =>{
                dats = data;
                folds = folderName;
                readyToRead = true;
                setContents(dats, folds); 
                reload();
             });
        }
       });
}

//Order the content

function setContents(data, folder){
    if(readyToRead == true){
    reloadW();
    document.querySelector("#ctr").innerHTML = '';
    document.querySelector(".box").style.display = "none";
    document.querySelector("#intr").style.display = "none";
    document.querySelector(".title").style.display = "none";
    document.querySelector("#ctr").style.display = "grid";
    document.getElementById("returnBox").style.opacity = "1";
    setTimeout(() =>{
        document.getElementById("shadowToolbar").style.background = "rgba(0,0,0,0.3)";
    }, 500);
    document.getElementById("dirContents").innerHTML = folder;
    intelIcons(folder);
 
    for(var e=0;e < data.length;e++){
        var dataAs = document.createElement("div");
        var check = document.createElement("i");
        var str = document.createElement("strong");
        var info = document.createElement("h6");

        if(data[e].charAt(0) == "."){
            dataAs.style.opacity = "0.3";
        }
        if(data[e].includes("DS_Store") != true){ 
            if(data[e].length >= 20){
                var len = data[e].length - 5;
                var cut1 = cut(data[e], 18, len);
                var set = replaceAt(cut1, 9, " ... ");
                var lowS = set.toLowerCase();
                str.innerHTML = lowS.capitalize();
            }else{
                var ste = data[e].toLowerCase();
                str.innerHTML = ste.capitalize();
            }
            check.classList.add("material-icons", "iconSel");
            check.innerHTML = "none"; 
            dataAs.style.transform = concat;
            var steinf = data[e].toLowerCase();
            info.innerHTML = steinf.capitalize();
            dataAs.appendChild(info);
            dataAs.appendChild(check);
            dataAs.appendChild(str);
            document.getElementById("ctr").appendChild(dataAs);
       }
        //Remove .DS_Store macOs File 
            if(data[e].includes(".") != true){
                dataAs.classList.add("dataFOL");
                if(data[e].searchRepeat(2, "-") == true){
                    var resp = replaceIndex(data[e], "-", 2, "!");
                    var com2 = cut(resp, resp.getSearchPosition("!", 1), resp.length - 1);
                    var com3 = replaceAt(com2, com2.length -1, "...");
                    var comp = com3.toLowerCase();
                    if(comp.length < 13){
                        if(cv == 1){
                        dataAs.classList.add("exception");
                        }else{
                            dataAs.classList.add("exceptionCvD");
                        }
                    }else{
                        if(cv == 1){
                        dataAs.style.paddingLeft = "20%";
                        dataAs.style.paddingRight = "20%";
                        }else{
                            dataAs.classList.add("exceptionCv");
                        }
                    }
                    str.innerHTML = comp.capitalize();
                }
                if(data[e].length > 6 && data[e].length < 13){
                    dataAs.classList.add("dataD");
                    dataAs.style.fontSize = "1.25em";
                    dataAs.style.paddingTop = "26.5%";
                }
                else if(data[e].length >= 13 && data[e].length < 20){
                    dataAs.style.fontSize = "1.25em";
                    dataAs.classList.add("dataR");
                    if(data[e].includes("-") != true){
                        var rep = replaceAt(data[e], data[e].length - 7, "-");
                        var up = rep.toLowerCase();
                        str.innerHTML = up.capitalize();
                    }
                    if(cv == 1){
                        dataAs.style.padding = "19% 20%";
                    }else{
                        dataAs.style.padding = "5% 20%";
                    }
                    
                }else if(data[e].length >= 20 && data[e].length < 23){
                    dataAs.classList.remove("dataR");
                    dataAs.style.fontSize = "1.25em";
                    dataAs.classList.add("dataDE");
                    if(cv != 1){
                        dataAs.style.padding = "23% 5%";
                    }
                }else if(data[e].length >= 23){
                    
                    dataAs.classList.add("dataDE");
                    if(cv != 1){
                        dataAs.style.fontSize = "1.1em";
                        dataAs.style.padding = "25% 10%";
                    }else{
                        dataAs.style.fontSize = "1.1em";
                        dataAs.style.padding = "23% 15%";
                    }
                }
                else if(data[e].length <= 6){
                    dataAs.classList.add("dataF");
                }
                if(data[e].includes(" ") == true){
                    dataAs.classList.add("dataE");
                    dataAs.style.padding = "19.5% 20% 20% 20%";
                }
                $(".dataFOL").css({"background-color": saveColor.toRGB()});
            }else{
                var setIm = includeArray(data[e], imageFormat);
                var setPowerPoint = includeArray(data[e], powerpoint);
                var setWord = includeArray(data[e], word);
                var setExcel = includeArray(data[e], excel);
                var setZip = includeArray(data[e], compressed);
                var setTxt = includeArray(data[e], txt);
                if(setIm == true){
                    // var res = data[e].replace(/.png|.jpg|.gif/gi, "");
                    var imageS = fileName+"/"+data[e];
                    var image = document.createElement("img");
                    if(data[e].includes(".png") == true || data[e].includes(".svg") == true){
                        dataAs.classList.add("imageDPNG");
                    }else{
                        dataAs.classList.add("imageD");
                    }
                    
                    image.setAttribute("src", imageS);
                    dataAs.appendChild(image);           
                }
                else if(setPowerPoint == true){
                    dataAs.classList.add("allDoc", "powerPt");
                }
                else if(setWord == true){
                    dataAs.classList.add("allDoc", "wordPt");
                }else if(setExcel == true){
                    dataAs.classList.add("allDoc", "excelPt");
                }
                else if(setZip == true){
                    dataAs.classList.add("allDoc", "zips");
                }else if(data[e].includes(".pdf") == true){
                    dataAs.classList.add("allDoc", "pdf");
                }else if(setTxt == true){
                    dataAs.classList.add("allDoc", "txt");
                }else{
                    dataAs.classList.add("allDoc", "txt");
                }
            }
             for(var i = 0;i < document.getElementById("ctr").childElementCount; i++){
                 if(i <= 2){
                     dataAs.style.marginTop = "0px";
                 }else{
                     dataAs.style.marginTop = (margin)*cv+"px";
                 } 
             }
     }//jquery
     document.querySelector("#ctr").addEventListener("contextmenu", setBtns);   
     $(".dataFOL").dblclick(function(){
        var getStr = $(this).find("h6").text();
        fileName = fileName+"/"+getStr;
        reload();
     }) 
     $(".imageD").dblclick(function(){
        var getStr = $(this).find("h6").text();
        var img = fileName+"/"+getStr;
        openIMG(img);
     })
     $(".imageDPNG").dblclick(function(){
        var getStr = $(this).find("h6").text();
        var img = fileName+"/"+getStr;
        openIMG(img);
     })
     $("#ctr div").contextmenu(function(){
             var tst =  $(this).find(".iconSel").text();
             if(tst == "none"){
             $(this).find(".iconSel").html(iconName);
             if($(this).find('h6').text().includes('.') != true){
                $(this).find(".iconSel").css({
                    "top" : "18%",
                    "right" : "12%"
                })
             }else{
                $(this).find(".iconSel").css({
                    "top" : "0%",
                    "right" : "0%"
                })
             }
             $(this).find(".iconSel").css({
                 "background" : "#fff",
                 "padding" : "0",
                 "color" : color,
                 "opacity" : "1",
                 "box-shadow" : "0 0 7px rgba(0,0,0,.2)"
             })
             $(this).css({
                 "border-bottom" : "5px solid rgba(0,0,0,.2)",
             })   
             }else{
                 $(this).find(".iconSel").html("none");
                 $(this).find(".iconSel").css({
                 "background" : "transparent",
                 "color" : "rgba(0,0,0,.3)",
                 "opacity" : '0',
                 "box-shadow" : "none"
             })
             $(this).css({
                 "border-bottom" : "none",
             })
             }
         })  
    document.getElementById("ctr").style.paddingTop = (margin+(margin/3.8))+"px";
    document.getElementById("ctr").style.paddingBottom = (margin+(margin/3.8))+"px";
        } 
}

 function getDir(dir, dep){
    var x = dir.textContent;
    if(dep == true){
        datas.push(x);
    }
    return datas;
}
function backDir(){
    var newPath = path.dirname(fileName);
    if(newPath != path.dirname(backupFileName)){
        fileName = newPath;
        reload();
    }else{
        readyToRead = false;
        $("#reus").hide();
        $("#rel").hide();
        document.querySelector("#ctr").innerHTML = '';
        document.querySelector(".box").style.display = "block";
        document.querySelector("#intr").style.display = "block";
        document.querySelector(".title").style.display = "block";
        document.querySelector("#ctr").style.display = "none";
        document.getElementById("returnBox").style.opacity = "0";
        setTimeout(() =>{
            document.getElementById("shadowToolbar").style.background = "rgba(0,0,0,.5)";
        }, 500);
    }
}

//FullScreen Change 

app.getCurrentWindow().on('enter-full-screen', () =>{
    setTimeout(() =>{
        reload();
        reloadW();
    }, 100)
})
app.getCurrentWindow().on('leave-full-screen', () =>{
    setTimeout(() =>{
        reload();
        reloadW();
    }, 100)
    
})

//ToolBar

function setBtns(){
    var pts = false;
    var chld = document.getElementById("ctr").childNodes;
    datas = [];
    setTimeout(function(){
        for(var s = 0; s < chld.length;s++){
            var schld = chld[s].childNodes;
            if(schld[1].textContent == iconName){
                getDir(schld[0], true);
                document.getElementById("del").classList.remove("disabled");
                document.getElementById("infoS").classList.remove("disabled");
                document.getElementById("edits").classList.remove("disabled");
                document.getElementById("del").classList.add("active");
                document.getElementById("infoS").classList.add("active");
                document.getElementById("edits").classList.add("active");
               /// $(".active").fadeIn(300);
                pts = true;
            }
            if(pts == false ){
                getDir(schld[0], false);
                document.getElementById("del").classList.remove("active");
                document.getElementById("infoS").classList.remove("active");
                document.getElementById("edits").classList.remove("active");
                document.getElementById("del").classList.add("disabled");
                document.getElementById("infoS").classList.add("disabled");
                document.getElementById("edits").classList.add("disabled");
               /// $(".disabled").fadeOut(300);
            }
        }
        return pts;
    }, 100);
}

function selecDel(){
    if(datas != ""){
    $('#warningDelete').css({
        "transform" : concat
    })
    setTimeout(() =>{
        $('#warningDelete').modal('toggle');
    },100);
    }
}

//Toolbar Icons

function intelIcons(name){
    ic = name.toLowerCase();
    //Set Name Conditions
    if(ic.includes("desktop")){
        toAdd = "desktop_windows";
    }
    else if(ic.includes("api")){
        toAdd = "developer_board";
    }
    else if(ic.includes("design")){
        toAdd = "palette";
    }
    else if(ic.includes("page")){
        toAdd = "code";
    }
    else if(ic.includes("app")){
        toAdd = "apps";
    }else if(ic.includes("wallpaper")){
        toAdd = "collections";
    }else if(ic.includes("download")){
        toAdd = "file_download";
    }else{
        toAdd = "";
    }
    //Create Icon
    icon = document.createElement("i");
    icon.classList.add("material-icons");
    icon.innerHTML = toAdd;
    document.getElementById("dirContents").appendChild(icon);
}

//Screen Modal

function backNormal(){
    $('#warningDelete').modal('toggle');
}

// Tools

function replaceAt(string, index, replace) {
    return string.substr(0, index) + replace + string.substr(index+replace.length);
}
function cut(str, cutStart, cutEnd){
    return str.substr(0,cutStart) + str.substr(cutEnd);
}
function replaceIndex(string, search, SearchIndex, replace){
    var count = 0;
    for(var i = 0;i < string.length;i++){
        if(string.charAt(i) == search){
            count++;
            if(count == SearchIndex){
                var resp = replaceAt(string, i, replace);
                return resp;
            }
        }
    }
}

function includeArray(str, array){
    var respTS = false;
    for(var e = 0; e < array.length;e++){
        var arrC = str.toLowerCase();
        if(arrC.includes(array[e]) == true){
            respTS = true;
            break;
        }
    }
    return respTS;
}

document.body.ondrop = (e) => {
    e.preventDefault();

    for (let f of e.dataTransfer.files) {
        fileName = f.path;
        readyToRead = true;
        reload();
    }
    
    return false;
};


//Delete Directory

function deleteDir(){
    backNormal();
    for(var s = 0; s < datas.length; s++){
        if(datas[s].includes(".") != true){
            rimraf(fileName+"/"+datas[s], (err) =>{
                console.log(err)
            })
        }else{
            fs.unlink(fileName+"/"+datas[s], (err) =>{
                console.log(err);
            })
        }
    }  
    setTimeout(() => {
        reload(); 
    }, 100);
}

//open images
var win;
function openIMG(path){
    win = new BrowserWindow({  
        width: 800, 
        height: 550,
       frame: true, 
       backgroundColor : "rgba(0,0,0,0)",
        vibrancy: 'medium-light'
    });
    win.loadFile(path);
    createMenuImage();
    win.on('close', () =>{
        createMenu();
    })
}


function createMenuImage(){
    var menu = Menu.buildFromTemplate([
        {
            label: 'Menu',
            submenu: [
                {label:'About Popers'},
                {type : "separator"},
                {
                    label:'Preferences',
                    click(){
                       openPrefs();
                    },
                    accelerator : "CmdOrCtrl+P",
                },
                {type : "separator"},
                { 
                    label:'Exit',
                    click(){
                        win.close();
                    },
                    accelerator : "Cmd+Q"
                }
            ],
        },
        {   label : "View",
        submenu:[
            { role : "ZoomIn",},
            {role : "ZoomOut"},
        ]
    }
    ])
    Menu.setApplicationMenu(menu);
}

function createMenu(){
    var menu = Menu.buildFromTemplate([
        {
            label: 'Menu',
            submenu: [
                {label:'About Popers'},
                {type : "separator"},
                {
                    label:'Preferences',
                    click(){
                       openPrefs();
                    },
                    accelerator : "CmdOrCtrl+P",
                },
                {type : "separator"},
                { 
                    label:'Exit',
                    click(){
                        app.getCurrentWindow().close();
                    },
                    accelerator : "Cmd+Q"
                }
            ],
        },
         {   label : "View",
            submenu:[
                { 
                    label : "Reload",
                    accelerator : "CmdOrCtrl+R",
                    click(){
                        reload();
                     }
                },
                {type : "separator"},
                {role : "minimize"},
                {role : "togglefullscreen"}
            ]
        },
        {
            label : "Edit",
            submenu:[
                { 
                    label : "Add",
                    accelerator : "CmdOrCtrl+N",
                    click(){
                        win.webContents.send("addMenu");
                     }
                },
                { 
                    label : "Edit",
                    accelerator : "CmdOrCtrl+E",
                    click(){
                        win.webContents.send("editMenu");
                     }
                },
                { 
                    label : "Delete",
                    accelerator : "CmdOrCtrl+Backspace",
                    click(){
                        selecDel();
                     }
                },
                {type : "separator"},
                {
                    label : "About",
                    accelerator : "CmdOrCtrl+I",
                    click(){
                        win.webContents.send("infoMenu");
                     }
                }
            ]
        }
    ])
    Menu.setApplicationMenu(menu);
}



//Events
 
document.getElementById("closeBtn").addEventListener("click", backNormal);
document.getElementById("warningDelete").addEventListener("click", backNormal);
document.getElementById("ssl").addEventListener("click", openDir);
document.getElementById("del").addEventListener("click", selecDel);
document.getElementById("delYes").addEventListener("click", deleteDir);
document.getElementById("setRel").addEventListener("click", reload);
document.getElementById("return").addEventListener("click", backDir);