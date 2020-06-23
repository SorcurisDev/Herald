var Actor = function(x, y, spd, charW , charH, spImg_W, spImg_H, spriteImage){
    var self = {
        x:x,
        y:y,
        spd:spd,
        charW:charW,
        charH:charH,
        spriteImgW: spImg_W,
        spriteImgH: spImg_H,
        

        dir:0,
        pos:0,
        posFin:0,
        message:"",
        mFlag:false
        
    }
    self.chatBox = new Image();
    self.chatBox.src = "assets/chatbox.png";
    self.frameWidth = self.spriteImgW/3;
    self.frameHeight = self.spriteImgH/4;

    self.sprite = new Image();
    self.sprite.src = spriteImage;

    self.bumpers = {
        bumperLeftPos:false,
        bumperRighPos:false,
        bumperBottomPos:false,
        bumperTopPos:false
    };

    self.Draw = function(){
        if(self.pos !== null){
            if(self.pos == self.spriteImgW-self.charW){
                self.pos = 0;
            }else{
                self.pos += 0.2;
                self.posFin = Math.floor(self.pos % 3);
            };
        }
        ctx.drawImage(self.sprite, self.posFin*self.frameWidth,self.dir*self.frameHeight, self.spriteImgW/3, self.spriteImgH/4, self.x, self.y, self.charW, self.charH);
        if(self.mFlag !== false){
            if(self.y < 160){
                self.yDec = self.y+self.charH*5;
                self.yTpos = self.y+self.charH*7;
                self.chatBox.src = "assets/chatbox_Up.png";
            }else{
                self.yDec = self.y-self.charH*5
                self.yTpos = self.y-self.charH*4;
                self.chatBox.src = "assets/chatbox.png";
            }
            ctx.drawImage(self.chatBox, self.x-80,self.yDec, self.boxW+5, 132);
            for(var e=0; e<self.intThree.length; e++){
                ctx.fillText(self.intThree[e], self.x-65,self.yTpos);
                self.yTpos += 32;
            }
        }
    }
    return self;
}


var Player = function(x, y, spd, charW , charH, spImg_W, spImg_H, spriteImage){
    var self = Actor(x, y, spd, charW , charH, spImg_W, spImg_H, spriteImage);

    self.tState=0;
    var super_Draw = self.Draw;
    self.Draw = function(){
        //collision
        isColliding(self,currentMap);
        super_Draw();
        self.tState = tileState(self.x, self.y);
        
        self.direction = function(){
            if(keys[38]){
                if(!self.bumpers.bumperTopPos && !self.bumpEnt){
                    if(self.y <= 10){
                        self.y = self.y;
                    }else{
                        self.y -= self.spd;
                    };
                }else{
                }
                self.dir = 3;
            };
            if(keys[37]){
                if(!self.bumpers.bumperLeftPos && !self.bumpEnt){
                    if(self.x <= 0){
                        self.x = self.x;
                    }else{
                        self.x -= self.spd;
                    };
                };
                self.dir = 1;
            };
            if(keys[40]){
                if(!self.bumpers.bumperBottomPos && !self.bumpEnt){
                    if(self.y >= height-30){
                        self.y = self.y;
                    }else{
                        self.y += self.spd;
                    }
                }
                self.dir = 0
            }
            if(keys[39]){
                if(!self.bumpers.bumperRightPos && !self.bumpEnt){
                    if(self.x >= width-20){
                        self.x = self.x;
                    }else{
                        self.x += self.spd;
                    }
                }
                self.dir = 2;
            }
        }
        self.direction();
        //exit points
        if(self.tState !== 0){
                //EAST
                if(self.tState == 4 && currentMap.waypoints.E !== null){
                    curMap(window[currentMap.waypoints.E]);
                    self.x = self.spd*5
                }
                //WEST
                if(self.tState == 5 && currentMap.waypoints.W !== null){ 
                    curMap(window[currentMap.waypoints.W]);
                    self.x = width - self.spd*5;
                }
                //NORTH
                if(self.tState == 3 && currentMap.waypoints.N !== null){
                    curMap(window[currentMap.waypoints.N]);
                    self.y = height - self.spd*5;
                }
                //SOUTH
                if(self.tState == 2 && currentMap.waypoints.S !== null){
                    curMap(window[currentMap.waypoints.S]);
                    self.y = self.spd*5;
            }
        }
        if(keys[32] && currentMap.objects !== null && self.mFlag == false){
            var baseY = self.dir*self.frameHeight
            if( baseY == 0 ){
                itemCheck(self.x+16, self.y+32, self);
            }
            if(baseY == 32){
                itemCheck(self.x+-7, self.y+16, self);
            }
            if(baseY == 64){
                itemCheck(self.x+32, self.y+16, self);
            }
            if(baseY == 96){
                itemCheck(self.x+16, self.y-7, self);
            }
            keys[32] = false;
        }
    };
    return self;
};

var npc_ = function(x, y, spd, charW , charH, spImg_W, spImg_H, spriteImage, repeat, m_SetString, map_Loc, name, mess){
    var self = Actor(x, y, spd, charW , charH, spImg_W, spImg_H, spriteImage);
    self.m_Set = [];
    self.message = mess;
    self.name = name;
    self.bumpEnt=false;
    for(var st=0; st<m_SetString.length; st++){
        self.m_Set.push(m_SetString[st]);
    }

    self.mapLoc = map_Loc;
    self.posRun = 0;
    self.f = 0;
    self.animCounter  = 0;
    var oldPos = [0,0];

    var super_Draw = self.Draw;
    self.Draw = function(){

        if(currentMap.titleMap == self.mapLoc){
            super_Draw();

            var gridX = Math.floor(self.x / currentMap.tileW);
            var gridY = Math.floor(self.y / currentMap.tileH);
            

            if(self.posRun !== self.m_Set.length && !self.bumpEnt){
                if(self.m_Set[self.f]=="R"){
                    self.x += self.spd;
                    self.dir = 2;
                }
                if(self.m_Set[self.f]=="L"){
                    self.x -= self.spd;
                    self.dir = 1;
                }
                if(self.m_Set[self.f]=="U"){
                    self.y -= self.spd;
                    self.dir = 3;
                }
                if(self.m_Set[self.f]=="D"){
                    self.y += self.spd;
                    self.dir = 0;
                }
                if(self.m_Set[self.f]=="d"){
                    self.dir = 0;
                    self.pos = null;
                    currentMap.tileGrid[gridY+1][gridX] = 6;
                }
                if(repeat==true){
                    self.posRun += 1;
                    self.f += 1;
                }else{
                    self.posRun = self.m_Set.length;
                }
            currentMap.tileGrid[oldPos[1]][oldPos[0]] = 0;
            currentMap.tileGrid[gridY+1][gridX] = 6;
            oldPos = [gridX,gridY+1];
            }else{
                if(repeat==true && !self.bumpEnt){
                    self.posRun = 0;
                    self.f = 0;
                }
            }
        }
        if(keys[32] && self.bumpEnt){
            formBox(self);
        }
    }    

    npc[self.name] = self;
}

var map = function(waypoints, bg, titleMap, tileH, tileW, tileSet, objects=null){
    var self = {
        waypoints:waypoints,
        bg:bg,
        titleMap:titleMap,
        tileH:tileH,
        tileW:tileW,
        objects:objects,

        itemDatas:{}
    }
    self.tileGrid = [];
    self.objGrid = [];
    for(var h = 0; h < 20; h++){
        self.tileGrid[h] = [];
        if(objects !== null){
            self.objGrid[h] = [];
        }
        for(var w = 0; w < 20; w++ ){
            var hole = tileSet[h * 20 +w];
            if(objects !== null){
                var holeObj = objects[h * 20 +w];
                if(holeObj > 1){
                    holeObj -= 1;
                    self.objGrid[h][w] = holeObj;
                }else{
                    self.objGrid[h][w] = holeObj;
                }
            }
            if(hole==1593)
                hole = 1;
            if(hole==1594)
                hole = 2;
            if(hole==1595)
                hole = 3;
            if(hole==1596)
                hole = 4;
            if(hole==1597)
                hole = 5;
            self.tileGrid[h][w] = hole;
        }
    }

    self.checkTile = function(xW, yW, grid){
        var gridX = Math.floor(xW / self.tileW);
        var gridY = Math.floor(yW / self.tileH);

        if(grid[gridY]==undefined){
            gridY = grid.length-1;
        }else{
            var tilePos =  grid[gridY][gridX];
        }
        return tilePos;
    }

    self.isPosition = function(xW, yW, grid)
    {
        var pos = self.checkTile(xW, yW, grid);
        if(pos == 1){
            return true;
        }else if(pos == 6){
            return true;
        }else{
            return false;
        }
    }
    return self;
};

var newItem = function(id, name, desc, map){
	var self = {
        name:name,
		desc:desc
    }
    map.itemDatas[id] = self;
}