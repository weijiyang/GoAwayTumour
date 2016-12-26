/* 2016-11-23   曹阳   创建 */
var MainLayer2 = cc.Layer.extend({
    pus : null,
    sprite:null,
    stars:[],
    tiledMap            : null, // 瓦片地图
    tileSize            : null, // 瓦片大小
    roadPointArray      : [],   // 怪物路径
    towerPanel: null, // 构建塔的面板
    ZOrderEnum          : {},   // 对象层级枚举
    touchWarningNode    : null, // 触摸警告节点
    tiledMapRectArray   : [],   // 瓦片地图区域[二维区域]
    tiledMapRectArrayMap: [],   // 瓦片地图区域映射
    tiledMapRectMapEnemu: {},   // 瓦片地图区域映射枚举
    currGroupCreatedMonsterCount : 0,
    currGroupCreatedMonsterSum : 0,
    newS:null,
    pro:null,
    Monster:[],
    MonsterNumCheck:true,
    Cell:[],
    NowTimes:null,
    MonsterTimes:0,
    immunity:1000,
    getImmunityLabel:null,
    ProtectBlood:10,
    protectLabel:null,
    warning:null,
    winPusTime:"false",
    ctor : function()
    {
        this._super();
        var size = cc.winSize;
        cc.director.resume();
        this.Monster.length=0;
        this.Monster=[];
        this.Cell=[];
        DTHIS = this;    //DTHIS在此处类似于that

        this.initTc();
        if (cc.sys.localStorage.getItem("isMusicOn") == "YES") {
            cc.audioEngine.playMusic(res.Bg_mp3,true);
            //cc.log("value");
        }
        this.initoverTc();
        this.initwinTc();
        // 加载[属性]
        this.loadProperty();
        // 加载[瓦片地图]
        this.loadTiledMap();
        // 加载[可以触摸区域]
        this.loadCanTouchRect();
        // 加载[瓦片地图区域映射]
        this.loadTiledMapRectArrayMap();

        this.registerEvent();
        this.showTopBg();
        this.initBnt();

        var protect = new cc.Sprite(res.protect2);
        this.pro = protect;
        var tileSize = this.tiledMap.getTileSize();
        var objectGroup = this.tiledMap.getObjectGroup("object");
        var end = objectGroup.getObject("end");
        protect.setAnchorPoint(cc.p(0.4,0.5));
        protect.x =end.x;
        protect.y =end.y;
        this.addChild(protect);

        var kuang = new cc.Sprite(res.kuang);
        kuang.x =70;
        kuang.y = 150;
        protect.addChild(kuang);
        var protectLabel = new cc.LabelBMFont("10",res.number_fnt);
        protectLabel.setScale(0.7);
        protectLabel.x = 70;
        protectLabel.y = 150;
        this.protectLabel = protectLabel;
        protect.addChild(protectLabel);

        var  listener = cc.EventListener.create({
            event:cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches:true,
            onTouchBegan: function (touch, event) {
                var self = event.getCurrentTarget();
                return true;
            },
            onTouchMoved : function (touch, event) {
                var self = event.getCurrentTarget();
            },
            onTouchEnded : function (touch, event) {
                var self = event.getCurrentTarget();
                var result = self.getInfoFromMapByPos(touch.getLocation().x, touch.getLocation().y);
                if(self.immunity<250){
                    var warning = new cc.Sprite(res.immunity);
                    warning.setLocalZOrder(-1);
                    warning.x =cc.winSize.width/2;
                    warning.y =cc.winSize.height*0.8;
                    self.warning = warning;
                    self.addChild(warning);
                    self.warning.setLocalZOrder(1);
                    var delayTime = cc.delayTime(2);
                    var hide = cc.hide();
                    self.warning.runAction(cc.sequence(delayTime,hide));
                    // cc.log("免疫力不足，不可放置");
                }
                else if (!result.isInMap) {
                    // cc.log("没有在地图内");
                    self.loadTouchWarning(touch.getLocation().x, touch.getLocation().y);
                }else if( 9 - result.row == 1 || 9 - result.row == 0 || 9 - result.row == 9 || result.cel == 0 || result.cel == 16){
                    // cc.log("不可操作");
                } else{
                    // 已经有塔或者障碍物
                    if (self.tiledMapRectArrayMap[9 - result.row][result.cel] != self.tiledMapRectMapEnemu.NONE) {
                        self.loadTouchWarning(result.x + self.tileSize.width / 2, result.y + self.tileSize.height / 2);

                    }else{
                        if(this.immunity<=0){

                        }
                        // 当前位置没有塔和障碍物

                        if (self.towerPanel == null) {
                            self.loadTowerPanel({
                                cel : result.cel,
                                row : result.row,
                                x :result.x,
                                y: result.y
                            });
                        }else{
                            self.removeChild(self.towerPanel);
                            self.towerPanel = null;
                        }
                    }
                }
            },
        });
        cc.eventManager.addListener(listener,this);
        this.listener = listener;
        this.schedule(this.collision,0.5);
        this.schedule(this.attackTumour,0.5);

    },
    createMonster:function(dt){
        //实例化一个新的精灵对象
        var FileName=Math.floor(Math.random()*10);
        var newSprite = new Move("res/mainScene/monster"+FileName+"-1.png");
        newSprite.getArray(this.tiledMap,this.arr);
        var tileSize = this.tiledMap.getTileSize();
        var objectGroup = this.tiledMap.getObjectGroup("object");
        var player = objectGroup.getObject("player");
        newSprite.setAnchorPoint(cc.p(0.4,0.5));
        newSprite.x =player.x;
        newSprite.y =player.y;

// 波次血量翻倍
        if(this.MonsterTimes==0){
            newSprite.blood.allBlood=100;
            newSprite.blood.blood=100;
        }
        if(this.MonsterTimes==1){
            newSprite.blood.allBlood=200;
            newSprite.blood.blood=200;
        }
        if(this.MonsterTimes==2){
            newSprite.blood.allBlood=300;
            newSprite.blood.blood=300;
        }

        this.addChild(newSprite);
        newSprite.getLength(newSprite.arr);
        newSprite.times(newSprite.sort);

        this.Monster.push(newSprite);
        if(this.Monster.length>=10){
            for(var i in this.Monster){
                this.Monster[i].runAction(cc.show());
            }
            this.unschedule(this.createMonster);
        }


    },
    attackTumour:function (monsterPosition) {
        //更改免疫值数值
        if(this.immunity>=0){
            this.getImmunityLabel.setString(this.immunity);
        }
        else{
            this.stopAllActions();
        }

        for(var i in this.Monster){
               for(var j in this.Cell){
                   if(this.Cell[j].tag=="on"){
                       var  position=this.Cell[j].getBoundingBox();
                       position.x-=70;
                       position.y-=70;
                       position.width=210;
                       position.height=210;
                       var that=this;
                       if(cc.rectContainsPoint(position,this.Monster[i].getPosition())){
                           if(this.Monster[i].blood.getBlood()>0){
                               if(that.Cell[j].AttackWay=="close"){
                                   that.Cell[j].mySprite.loadAction();
                               }

                           }

                           //细菌掉血
                           if(that.Cell[j].AttackWay=="close"){
                               if(that.Cell[j].AttackWay=="close") {
                                   if(that.Cell[j].LevelNum==1){
                                       this.Monster[i].blood.dropBloodAction_one();
                                   }
                                   if(that.Cell[j].LevelNum==2){
                                       this.Monster[i].blood.dropBloodAction_two();
                                   }
                                   if(that.Cell[j].LevelNum==3){
                                       this.Monster[i].blood.dropBloodAction_three();
                                   }

                               }
                               if( this.Monster[i].blood.getBlood()<=0){

                                   this.Monster[i].runAction(cc.hide());
                                   this.Monster[i].stopAllActions();
                                   this.Monster[i].setTexture(res.TouMing);

                                   this.Monster[i].unschedule(this.Monster[i].moveToNextRoad);
                                   this.Monster[i].schedule(this.Monster[i].moveToNextRoad_fast,0.25);
                                   if(this.Monster[i].blood.getBlood()==0){
                                       if(this.MonsterTimes==0){
                                           this.immunity += 50;
                                       }else if(this.MonsterTimes==1){
                                           this.immunity +=80;
                                       }else if(this.MonsterTimes==2){
                                           this.immunity+=100;
                                       }
                                   }
                               }
                           }

                       }
                      }
                   else if(this.Cell[j].tag=="off"){
                          this.Cell.splice(j,1);
                   }
               }
        }


    },
    collision:function () {
        that =this;
        for(var i in that.Monster){
            if(cc.rectIntersectsRect(this.pro.getBoundingBox(),that.Monster[i].getBoundingBox())){
                if(that.Monster[i].blood.getBlood()>0){
                    that.ProtectBlood-=1;
                    that.protectLabel.setString(that.ProtectBlood);
                }
                if(that.ProtectBlood==0){
                    this.overpus.show(this.overpus, function(){
                        cc.director.pause();
                        console.log('游戏失败了');
                    });
                }

                that.removeChild(that.Monster[i]);
                that.Monster.splice(i,1);

                if(that.Monster.length==0){
                    this.MonsterTimes+=1;

                    if(this.MonsterTimes<3){
                        this.NowTimes.setString(this.MonsterTimes+1);
                    }
                }
            }
        }
        if(that.Monster.length==0&&this.MonsterTimes<3){
            that.schedule(this.createMonster,1);
            this.MonsterNumCheck=true;
        }
        else{
            if(this.MonsterTimes>=3){
                that.unschedule(this.createMonster);
                if(that.ProtectBlood>0){
                    if(that.winPusTime=="false"){
                        this.winpus.show(this.winpus, function(){
                            cc.director.pause();
                            that.winPusTime="true";
                            if(that.ProtectBlood<=7&&that.ProtectBlood>3){
                                that.stars[0].setTexture("res/mainScene/star1.png");
                                that.stars[1].setTexture("res/mainScene/star2.png");
                            }else if(that.ProtectBlood>0&&that.ProtectBlood<=3){
                                that.stars[0].setTexture("res/mainScene/star1.png");
                            }else{
                                that.stars[0].setTexture("res/mainScene/star1.png");
                                that.stars[1].setTexture("res/mainScene/star2.png");
                                that.stars[2].setTexture("res/mainScene/star3.png");
                            }
                            console.log('游戏成功了');
                        });
                    }

                }
            }
        }


        // 细胞可升级按钮提示
        for(var t in this.Cell){
                if(this.immunity<100){
                    this.Cell[t].Level.runAction(cc.hide());
                }
                else{
                    if(this.Cell[t].LevelNum<3){
                        this.Cell[t].Level.runAction(cc.show());
                    }
                    else{
                        this.Cell[t].Level.runAction(cc.hide());
                    }
                }
        }
    },
    showTopBg:function(){
        var topBg = new cc.Sprite(res.topBg1_png);
        topBg.x = cc.winSize.width*0.5;
        topBg.y = cc.winSize.height*0.93;
        this.addChild(topBg);

        var mianyizhi = new cc.Sprite(res.PIC_png);
        mianyizhi.x = cc.winSize.width*0.14;
        mianyizhi.y = cc.winSize.height*0.94;
        this.addChild(mianyizhi);

        var wavesBg = new cc.Sprite(res.wavesBg1_png);
        wavesBg.x = cc.winSize.width*0.5;
        wavesBg.y = cc.winSize.height*0.93;
        this.addChild(wavesBg);

        var word = new cc.LabelTTF("波怪物","Arial",30);
        word.setFontFillColor(cc.color.WHITE);
        word.x = cc.winSize.width*0.57;
        word.y = cc.winSize.height*0.93;
        this.addChild(word);

        var immunity = new cc.LabelBMFont("1000",res.number_fnt);
        immunity.setScale(0.6);
        immunity.x = cc.winSize.width*0.23;
        immunity.y = cc.winSize.height*0.93;
        this.addChild(immunity);
        this.getImmunityLabel=immunity;

        var allMonsterTimes = new cc.LabelBMFont("3",res.number_fnt);
        allMonsterTimes.setScale(0.5);
        allMonsterTimes.x = cc.winSize.width*0.5;
        allMonsterTimes.y = cc.winSize.height*0.93;
        this.addChild(allMonsterTimes);

        var allMonsterTimes = new cc.LabelTTF("/","","80");
        allMonsterTimes.setFontFillColor(cc.color.WHITE);
        allMonsterTimes.setScale(0.5);
        allMonsterTimes.x = cc.winSize.width*0.475;
        allMonsterTimes.y = cc.winSize.height*0.93;
        this.addChild(allMonsterTimes);

        var NowTimes = new cc.LabelBMFont("1",res.number_fnt);
        NowTimes.setScale(0.5);
        NowTimes.x = cc.winSize.width*0.45;
        NowTimes.y = cc.winSize.height*0.93;
        this.addChild(NowTimes);
        this.NowTimes=NowTimes;

        var pause0Item = new cc.MenuItemImage(res.pause_0,res.pause_0, function () {
        }, this);
        var pause1Item = new cc.MenuItemImage(res.pause_1,res.pause_1, function () {
        }, this);

        var pauseToggle = new cc.MenuItemToggle(pause0Item,pause1Item,function () {
            EffectEngine.playEffect(res.Select);
            pauseToggle.getSelectedIndex();
            if(pauseToggle.getSelectedIndex()==0){
                cc.director.resume();
            }
            else{
                cc.director.pause();
            }
        },this);

        var pauseMenu = new cc.Menu(pauseToggle);
        pauseMenu.x = cc.winSize.width*0.77;
        pauseMenu.y = cc.winSize.height*0.93;
        this.addChild(pauseMenu);
    },
    onExit:function() {
        this._super();
        for(var i in this.Cell){
            this.removeFromParent(this.Cell[i]);
        }
        for(var j in this.Monster){
            this.removeFromParent(this.Monster[j]);
        }
        this.Cell=[];
        this.Monster=[];
        cc.eventManager.removeListener(this.listener);
    },
    loadTiledMap : function(){
        var tileMap=new cc.TMXTiledMap(res.BGS1);
        this.addChild(tileMap);
        this.tiledMap = tileMap;
        this.tileSize = tileMap.getTileSize();
        tileMap.x = (cc.winSize.width - tileMap.width) / 2;
        tileMap.y = (cc.winSize.height - tileMap.height) / 2;

        // 设置[所有对象组]坐标偏移量
        var groups = this.tiledMap.getObjectGroups();
        var group = null;
        var offsetX = (cc.winSize.width - this.tiledMap.width) / 2;
        var offsetY = (cc.winSize.height - this.tiledMap.height ) / 2;
        var finalOffsetX = 0;
        var finalOffsetY = 0;
        var groupName = "";
        for (var i = 0; i < groups.length; i++) {
            group = groups[i];
            groupName = group.getGroupName();

            // 大障碍物[占4格]
            if (groupName == "block") {
               finalOffsetX = offsetX;
                finalOffsetY = offsetY;
            }else{
                cc.warn("GPMainLayer.loadTiledMap(): " + groupName + "对象组的坐标未调整");
            }
            group.setPositionOffset(cc.p(finalOffsetX, finalOffsetY));
        }
    },
    loadCanTouchRect : function(){
        var mapSize = this.tiledMap.getMapSize();

        var nextPosX = (cc.winSize.width - this.tiledMap.width) / 2 + this.tileSize.width / 2;
        var nextPosY = (cc.winSize.height - this.tiledMap.height) / 2 + this.tileSize.height / 2;

        for (var i = 0; i < mapSize.height; i++) {
            this.tiledMapRectArray[i] = [];
            for (var j = 0; j < mapSize.width; j++) {
                // 空地
                this.tiledMapRectArray[i][j] = cc.rect(nextPosX - this.tileSize.width / 2, nextPosY - this.tileSize.height / 2, this.tileSize.width, this.tileSize.height);
                nextPosX += this.tileSize.width;
            }

            nextPosX = (cc.winSize.width - this.tiledMap.width) / 2 + this.tileSize.width / 2;
            nextPosY += this.tileSize.height;
        }
    },
    // 加载[瓦片地图区域映射]
    loadTiledMapRectArrayMap : function(){
        var mapSize = this.tiledMap.getMapSize();
        var bgLayer = this.tiledMap.getLayer("bg");
        var tileGID =null;
        var properties =null;
        for (var i = 0; i < mapSize.height; i++) {
            this.tiledMapRectArrayMap[i] = [];
            for (var j = 0; j < mapSize.width; j++) {
                tileGID=bgLayer.getTileGIDAt(cc.p(j,i));
                properties=this.tiledMap.getPropertiesForGID(tileGID);
                if("ground" != properties.type){
                    if("road" == properties.type){
                        this.tiledMapRectArrayMap[i][j] = this.tiledMapRectMapEnemu.ROAD;
                    }else{
                        this.tiledMapRectArrayMap[i][j] = this.tiledMapRectMapEnemu.BLOCK;
                    }
                }else{
                    this.tiledMapRectArrayMap[i][j] = this.tiledMapRectMapEnemu.NONE;
                }
            }
        }
    },
    loadTouchWarning : function(x, y){
        var node = null;
        if (this.touchWarningNode != null) {
            node = this.touchWarningNode;
            node.stopAllActions();
            node.setOpacity(255);
        }else{
            node = new cc.Sprite("res/mainScene/play/warning.png");
            this.addChild(node, this.ZOrderEnum.WAMING);
            this.touchWarningNode = node;
        }
        node.setPosition(x, y);

        var delayTime = cc.delayTime(0.4);
        var fadeOut = cc.fadeOut(0.3);
        var callfunc = cc.callFunc(function(){
            this.removeChild(this.touchWarningNode);
            this.touchWarningNode = null;
        }.bind(this));
        var seq = cc.sequence(delayTime, fadeOut, callfunc);
        node.runAction(seq);
    },
    registerEvent : function(){
        // [事件监听]创建塔事件
        var onCreateTowerListener = cc.EventListener.create({
            event       : cc.EventListener.CUSTOM,
            target      : this,
            eventName   : jf.EventName.GP_CREATE_TOWER,
            callback    : this.onCreateTower
        });
        cc.eventManager.addListener(onCreateTowerListener, this);
    },
    loadProperty : function(){
        this.ZOrderEnum.START        = 10;   // 起点标识
        this.ZOrderEnum.CARROT       = 0;    // 萝卜
        this.ZOrderEnum.MONSTER      = 20;   // 怪物
        this.ZOrderEnum.WAMING       = 30;   // 警告提示
        this.ZOrderEnum.TOWER_PANEL  = 50;   // 创建塔面板

        this.tiledMapRectMapEnemu.NONE      = "ground";    // 空地  0
        this.tiledMapRectMapEnemu.ROAD      = "road";    // 道路  1
        this.tiledMapRectMapEnemu.BLOCK     = "block";    //  2  小障碍物[占1格]
        this.tiledMapRectMapEnemu.TOWER     = "tower";    // 塔

    },
    // 加载警告精灵节点
    loadTouch: function(x, y){
        var node = null;
        if (this.touchWarningNode != null) {
            node = this.touchWarningNode;
            node.stopAllActions();
            node.setOpacity(255);
        }else{
            node = new cc.Sprite("res/mainScene/play/warning.png");
            this.addChild(node, this.ZOrderEnum.WAMING);
            this.touchWarningNode = node;
        }
        node.setPosition(x, y);

        var delayTime = cc.delayTime(0.4);
        var fadeOut = cc.fadeOut(0.3);
        var callfunc = cc.callFunc(function(){
            this.removeChild(this.touchWarningNode);
            this.touchWarningNode = null;
        }.bind(this));
        var seq = cc.sequence(delayTime, fadeOut, callfunc);
        node.runAction(seq);
    },
    loadTowerPanel : function(args){
        // 接收行和列号
        var node = new TowerPanel2(args);
        this.addChild(node, this.ZOrderEnum.TOWER_PANEL);
        this.towerPanel = node;
    },
    //[事件]创建塔
    onCreateTower : function(event){
        var self = event.getCurrentTarget();
        var data = event.getUserData();

        // 工厂模式
        var node = self.createTower(data);
        node.x = data.x;
        node.y = data.y;
        self.addChild(node);
        self.Cell.push(node);
        self.immunity-=250;
        //cc.log(self.immunity);

        self.removeTowerPanel();
    },
    // 根据坐标获取在地图中的信息
    getInfoFromMapByPos : function(x, y){
        // cc.log("坐标获取到了");
        cc.assert(y !== undefined, "GPMainLayer.getInfoFromMapByPos(): Y坐标不能为空！");

        var isInMap = false;
        var index = {
            x : -1,
            y : -1
        };
        var rect = null;

        for (var i = 0; i < this.tiledMapRectArray.length; i++) {
            for (var j = 0; j < this.tiledMapRectArray[i].length; j++) {
                rect = this.tiledMapRectArray[i][j];
                if (cc.rectContainsPoint(rect, cc.p(x, y))) {
                    index.row = i;
                    index.cel = j;
                    index.x = rect.x;
                    index.y = rect.y;
                    isInMap = true;
                }
            }
        }

        return {
            isInMap : isInMap,
            row : index.row,  // 行
            cel : index.cel,  // 列
            x : index.x,
            y : index.y
        };
    },
    // 创建塔
    createTower : function(data){
        cc.assert(data.name, "GPMainLayer.createTower(): 名字无效！");
        cc.assert(data.x, "GPMainLayer.createTower(): X轴坐标无效！");
        cc.assert(data.y, "GPMainLayer.createTower(): Y轴坐标无效！");
        var mapSize = this.tiledMap.getMapSize();
        var towerData = {};
        towerData.name = data.name;
        towerData.x = data.x;
        towerData.y = data.y;
// cc.log(data);
        var node = null;
        switch (data.name){
            case "Ball":
                towerData.scope = 300;
                towerData.bulletSpeed = 40;
                node = new Ball("res/mainScene/cell4-1-3.png");
                break;
            case "Cell2":
                towerData.scope = 300;
                towerData.bulletSpeed = 40;
                node = new  Cell2("res/mainScene/cell2-1-1.png");
                break;
            case "Star":
                towerData.scope = 300;
                towerData.bulletSpeed = 40;
                node = new  Star("res/mainScene/cell3-1-1.png");
                break;
            default :
                cc.warn("GPMainLayer.createTower() : 异常");
                break;
        }

        // 属性设置
        if (node != null) {

        }

        return node;
    },
    initBnt : function()
    {
        var set = new cc.MenuItemImage( res.menu_png, res.menu_png, function () {
            //显示弹窗。function为回调函数，弹窗完全展示后回调
            EffectEngine.playEffect(res.Select);
cc.director.resume();
            this.pus.show(this.pus, function(){
                cc.director.pause();
                console.log('弹窗打开了');
            });

        }, this );
        set.x = cc.winSize.width * 0.84;
        set.y = cc.winSize.height * 0.93;

        var menu = new cc.Menu(set);
        menu.x = 0;
        menu.y = 0;
        this.addChild(menu);
    },
    initTc : function()
    {
        var size = cc.winSize;
        //1、创建一个layer用于存放弹窗，layer的宽和高等于弹窗图片的大小
        var layer = new cc.LayerColor(cc.color(0,0,0,0), 750, 427);


        //列表背景图
        var list = new cc.Sprite(res.List_png);
        list.x = cc.winSize.width / 2;
        list.y = cc.winSize.height / 2;
        list.setScale(1.2);
        list.setAnchorPoint(0.5,0.5);
        layer.addChild(list);  //注意这里

        //重新选关
        var selectItem = new cc.MenuItemImage(res.SelectNormal_png,res.SelectSelected_png, function () {
            //关闭弹窗。function为回调函数，弹窗完全关闭后回调
            cc.director.resume();
            cc.director.runScene(new LevelScene());

            this.pus.hidden(this.pus, function(){

            });

        }, this);

        //继续游戏
        var continueItem = new cc.MenuItemImage(res.ContinueNormal_png,res.ContinueSelected_png, function () {
            EffectEngine.playEffect(res.Select);
            cc.director.resume();


            var pause0Item = new cc.MenuItemImage(res.pause_0,res.pause_0, function () {
            }, this);
            var pause1Item = new cc.MenuItemImage(res.pause_1,res.pause_1, function () {
            }, this);

            var pauseToggle = new cc.MenuItemToggle(pause0Item,pause1Item,function () {
                cc.director.pause();
                pauseToggle.getSelectedIndex();
                if(pauseToggle.getSelectedIndex()==0){
                    cc.director.resume();
                }
            },this);

            var pauseMenu = new cc.Menu(pauseToggle);
            pauseMenu.x = cc.winSize.width*0.77;
            pauseMenu.y = cc.winSize.height*0.93;
            this.addChild(pauseMenu);
            this.pus.hidden(this.pus, function(){
            });
        }, this);

        //重新开始
        var repeatItem = new cc.MenuItemImage(res.RepeatNormal_png,res.RepeatSelected_png, function () {
            EffectEngine.playEffect(res.Select);
            this.pus.hidden(this.pus, function(){

            });
           this.Monster.length=0;
            cc.director.runScene(new MainScene2());



        }, this);

        var menu = new cc.Menu(repeatItem,selectItem, continueItem);
        menu.y = size.height * 0.54;
        menu.x = size.width *0.5 ;
        repeatItem.setScale(1.2);
        continueItem.setScale(1.2);
        selectItem.setScale(1.2);
        menu.alignItemsVerticallyWithPadding(41);
        layer.addChild(menu);

        /*4、创建Popups对象。参数意义分别为 ：
         层
         弹窗一开始是否为可见，默认为true
         点击遮罩层的时候是否关闭弹窗，默认为false。若为true，则存放弹窗的layer必须设置宽高
         */
        this.pus = new Popups(layer, false, false);
        this.addChild(this.pus);
    },
    initoverTc : function()
    {
        var size = cc.winSize;
        //1、创建一个layer用于存放弹窗，layer的宽和高等于弹窗图片的大小
        var layer = new cc.LayerColor(cc.color(0,0,0,0), 750, 427);
        //游戏失败背景
        var bg = new cc.Sprite(res.GameOver_png);
        bg.x = cc.winSize.width / 2;
        bg.y = cc.winSize.height / 2;
        bg.setScale(1.2);
        bg.setAnchorPoint(0.5,0.5);
        layer.addChild(bg);

        //星星
        for(var i=0;i<3;i++){
            this.stars[i] = new cc.Sprite("res/mainScene/graystar"+(i+1)+".png");
            this.stars[i].x = size.width*(0.1*i+0.4);
            this.stars[i].y = size.height*(0.6);
            this.stars[i].setScale(1.2);
            layer.addChild(this.stars[i]);
        }

        var diedMonsterItem = new cc.MenuItemImage(res.cell1_png,res.cell1_png, function () {
            cc.director.resume();
            this.overpus.hidden(this.overpus, function(){
                // console.log('跳转到选关界面');
                cc.director.runScene(new TumourDetailScene());
            });
        }, this);

        var diedMenu = new cc.Menu(diedMonsterItem);
        diedMenu.y = cc.winSize.height *0.45;
        diedMenu.x = cc.winSize.width *0.51;
        // diedMenu.setScale(2);
        layer.addChild(diedMenu);

        var tishi = new cc.LabelTTF("提示：","","30");
        tishi.x = -50;
        tishi.y = 20;
        diedMonsterItem.addChild(tishi);

        //重新选关按钮
        var selectItem = new cc.MenuItemImage(res.SelectNormal_png,res.SelectSelected_png, function () {
            cc.director.resume();
            this.overpus.hidden(this.overpus, function(){
                // console.log('跳转到选关界面');
                cc.director.runScene(new LevelScene());
            });
        }, this);

        //重新开始按钮
        var repeatItem = new cc.MenuItemImage(res.RepeatNormal_png,res.RepeatSelected_png, function () {
            EffectEngine.playEffect(res.Select);
            cc.director.resume();
            this.overpus.hidden(this.overpus, function(){
                that.Monster.length=0;
                cc.director.runScene(new MainScene2());
                console.log('跳转到游戏开始界面');
            });
        }, this);

        var menu = new cc.Menu(selectItem, repeatItem);
        menu.y = size.height *0.3;
        menu.x = size.width *0.48;
        repeatItem.setScale(1.0);
        selectItem.setScale(1.0);
        menu.alignItemsHorizontallyWithPadding(50);
        layer.addChild(menu);

        this.overpus = new Popups(layer, false, false);
        this.addChild(this.overpus);
    },
    initwinTc : function()
    {
        var size = cc.winSize;
        //1、创建一个layer用于存放弹窗，layer的宽和高等于弹窗图片的大小
        var layer = new cc.LayerColor(cc.color(0,0,0,0), 750, 427);
        //胜利背景图
        var bg = new cc.Sprite(res.Win_png);
        bg.x = cc.winSize.width / 2;
        bg.y = cc.winSize.height / 2;
        bg.setScale(1.2);
        bg.setAnchorPoint(0.5,0.5);
        layer.addChild(bg);

        //星星
        for(var i=0;i<3;i++){
            this.stars[i] = new cc.Sprite("res/mainScene/graystar"+(i+1)+".png");
            this.stars[i].x = size.width*(0.1*i+0.4);
            this.stars[i].y = size.height*(0.6);
            this.stars[i].setScale(1.2);
            layer.addChild(this.stars[i]);
        }

        var newFont = new cc.LabelTTF("新细胞：","","30");
        newFont.setFontFillColor(cc.color.WHITE);
        newFont.x = cc.winSize.width*0.42;
        newFont.y = cc.winSize.height*0.44;
        layer.addChild(newFont);

        var newCellItem = new cc.MenuItemImage(res.cell42,res.cell42, function () {
            cc.director.resume();
            this.winpus.hidden(this.winpus, function(){
                cc.director.runScene(new CellDetailScene());
            });
        }, this);

        var cellMenu = new cc.Menu(newCellItem);
        cellMenu.y = size.height *0.45;
        cellMenu.x = size.width *0.5;
        layer.addChild(cellMenu);

        var handItem = new cc.Sprite(res.tishi);
        handItem.x = 150;
        handItem.y = 50;
        newCellItem.addChild(handItem);
        this.handItem=handItem;

        var that = this;
        //重新选关按钮
        var selectItem = new cc.MenuItemImage(res.SelectNormal_png,res.SelectSelected_png, function () {
            cc.director.resume();
            this.winpus.hidden(this.winpus, function(){
                this.winPusTime="true";
                console.log('跳转到选关界面');
                cc.director.runScene(new LevelScene());
            });
        }, this);

        //继续游戏按钮
        var continueItem = new cc.MenuItemImage(res.ContinueNormal_png,res.ContinueSelected_png, function () {
            cc.director.resume();
            this.winpus.hidden(this.winpus, function(){
                this.winPusTime="true";
                console.log('跳转到下一关界面');
                cc.director.runScene(new MainScene3());//
            });
        }, this);

        var menu = new cc.Menu(selectItem, continueItem);
        menu.y = size.height *0.3;
        menu.x = size.width *0.5;
        continueItem.setScale(1.0);
        selectItem.setScale(1.0);
        menu.alignItemsHorizontallyWithPadding(50);
        layer.addChild(menu);

        this.winpus = new Popups(layer, false, false);
        this.addChild(this.winpus);
    },
    removeTowerPanel : function(){
        this.removeChild(this.towerPanel);
        this.towerPanel = null;
    }
});

var MainScene2 = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new MainLayer2();
        this.addChild(layer);
    }
});

//获取音效设置 王凯名
var EffectEngine = function(){};
EffectEngine.playEffect = function(url){
    if (cc.sys.localStorage.getItem("isEffectOn") == "YES") {
        cc.audioEngine.playEffect(url);
    }
};

