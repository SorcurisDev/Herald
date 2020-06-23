var c = document.getElementById('mainCanvas');
var ctx = c.getContext('2d');
var width = 640;
var height = 640;
var keys = [];
var framerate = 27;
var pos = 0;
var currentMap;
var npc = {};

var Herald = Player(width/2, height/2, 10, 32, 32,96,128,"assets/chars/Herald.png");

//items
//flowerpots
new newItem(943, "Flowers","A beautifully potted lillies and daisies",fare)
//knives
new newItem(1010,"Knives","A set of knives for fighting small monsters.",fare);
//treasurechests
new newItem(862,"Chests","A chest container.", fare);
//greenrobe
new newItem(1041,"Green Robe","A green relaxing robe for sorcerers.",fare);
//bluerobe
new newItem(1043,"Blue Coat", "A nice blue coat for magicians.",fare);
//sign
new newItem(236,"Sign","The sign says 'The Graveyard of Moths.'",forest);
//direction post
new newItem(237,"Directions","<< to Grasslands",forest);
//Unknown Jar
new newItem(859,"Jar","There is a some kind of powder inside.",forest);
//old bucket
new newItem(227,"Old bucket","An old bucket abandoned by someone.",forest);

//x, y, spd, charW , charH, spImg_W, spImg_H, spriteImage, repeat, m_Set, map_Loc)
npc_(50,50,10, 32, 32, 96, 128, "assets/chars/NPC_FEMALE_1.png", true, "DDDDDRRRRRUUUUULLLLL","Grasslands","lana","Im gonna run until I die!");
npc_(450,400,10, 32, 32, 96, 128, "assets/chars/NPC_FEMALE_2.png", false, "d","Grasslands","rana", "Hmm, this fodder looks moldy.");


//Default Map
curMap(grassland);

function curMap(WhichMap){
    currentMap = WhichMap;
    c.style.backgroundImage = "url("+currentMap.bg+")";
}

window.addEventListener("keydown", function(e){
    keys[e.keyCode] = true;
}, false);
window.addEventListener("keyup", function(e){
    keys[e.keyCode] = false;
}, false);

var timer = setInterval(update,framerate);
function update(){
    ctx.clearRect(0, 0, width, height);

    Herald.Draw();
    for(var key in npc){
        npc[key].Draw();
        var checkDist = getDist(Herald, npc[key]);
        if(checkDist < 32){
            npc[key].bumpEnt = true;
        }else{
            npc[key].bumpEnt = false;
        }
    }
    //console.log(Herald.x + " : " + Herald.y);
    //console.log(currentMap.checkTile(Herald.x,Herald.y,currentMap.tileGrid));
}

function tileState(x, y){
    var pos = currentMap.checkTile(x, y, currentMap.tileGrid);
    if(pos == 2){
        return 2;
    }else if(pos == 3){
        return 3;
    }else if(pos == 4){
        return 4;
    }else if(pos == 5){
        return 5;
    }else{
        return 0;
    }
}

function isColliding(obj, mapIn)
{
    obj.bumpers.bumperRightPos = mapIn.isPosition(obj.x+32, obj.y+16, mapIn.tileGrid);
    obj.bumpers.bumperLeftPos = mapIn.isPosition(obj.x-7, obj.y+16,  mapIn.tileGrid); 
    obj.bumpers.bumperTopPos = mapIn.isPosition(obj.x+16, obj.y-7,  mapIn.tileGrid);
    obj.bumpers.bumperBottomPos = mapIn.isPosition(obj.x+16, obj.y+32,  mapIn.tileGrid);
}

function itemCheck(xP, yP, char){
    var objGridPos = currentMap.checkTile(xP, yP, currentMap.objGrid);
    if(currentMap.itemDatas[objGridPos] !== undefined){
        char.message = currentMap.itemDatas[objGridPos].desc
        formBox(char);
    }
}

function formBox(char){
        var intOne = char.message.split(/\s+/);
        var pos = 0;
        var intTwo = "";
        var intThree = [];
        for(var o=0; o<=intOne.length; o++){
            if(pos==3 || o == intOne.length-1){
                intTwo += intOne[o]+" ";
                intThree.push(intTwo);
                pos = 0;
                intTwo = "";
            }else{
                intTwo += intOne[o]+" ";
                pos++;
            }
        }
        char.boxW = 172;
        for(var f=0; f<intThree.length; f++ ){
            if(intThree[f].length*10 > char.boxW){
                char.boxW = intThree[f].length*10;
            }
        }
        ctx.font = "16px monospace";
        char.intThree = intThree;
        char.mFlag = true;
        setTimeout(()=>{char.mFlag=false},1500);
}

function getDist(ent1, ent2){
    var d1 = ent1.x - ent2.x;
    var d2 = ent1.y - ent2.y;
    return Math.sqrt(d1*d1+d2*d2);
}
