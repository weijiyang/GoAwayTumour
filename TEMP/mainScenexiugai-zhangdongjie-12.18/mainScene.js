/*
/!* 2016-11-23   曹阳   创建 *!/
var MainLayer = cc.Layer.extend({
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
    ctor : function()
    {
        this._super();
        var size = cc.winSize;
        DTHIS = this;    //DTHIS在此处类似于that
        // this.addChild(new cc.LayerColor(cc.color(184,153,0)));
/!*        var backgoundimage = new cc.Sprite(res.BackgoundImage);
        // backgoundimage.setRotation(180);
        backgoundimage.x = cc.winSize.width / 2;
        backgoundimage.y = cc.winSize.height / 2;
        this.addChild(backgoundimage);*!/

        this.initTc();
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


        var newCell = new MyCell(res.Cell_1);
        newCell.x = cc.winSize.width/2;
        newCell.y = cc.winSize.height*0.7;
        this.addChild(newCell);
        //实例化一个新的精灵对象
        var newSprite = new Move(res.abc0_png);
        this.newS = newSprite;
        newSprite.getArray(this.tiledMap,this.arr);
        var tileSize = this.tiledMap.getTileSize();
        var objectGroup = this.tiledMap.getObjectGroup("object");
        var player = objectGroup.getObject("player");
        newSprite.setAnchorPoint(cc.p(0.4,0.5));
        newSprite.x =player.x;
        newSprite.y =player.y;
        this.addChild(newSprite);
        newSprite.getLength(newSprite.arr);
        newSprite.times(newSprite.sort);

        //掉血的测试
        /!*newSprite.drop.dropBloodAction_two();
        newSprite.drop.dropBloodAction_two();
        newSprite.drop.dropBloodAction_two();
        newSprite.drop.dropBloodAction_three();
        newSprite.removeFromParent();*!/


        var protect = new cc.Sprite(res.cell52);
        this.pro = protect;
        var tileSize = this.tiledMap.getTileSize();
        var objectGroup = this.tiledMap.getObjectGroup("object");
        var end = objectGroup.getObject("end");
        protect.setAnchorPoint(cc.p(0.4,0.5));
        protect.x =end.x;
        protect.y =end.y;
        this.addChild(protect);

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
                // cc.log("ccc");
                // 没有触摸到地图区域内
                if (!result.isInMap) {
                    cc.log("没有在地图内");
                    self.loadTouchWarning(touch.getLocation().x, touch.getLocation().y);
                    // cc.log(this.tiledMapRectArray.length);
                }else if( 9 - result.row == 1 || 9 - result.row == 0 || 9 - result.row == 9 || result.cel == 0 || result.cel == 16){
                    cc.log("不可操作");
                }else{
/!*                    cc.log(result.row);
                    cc.log(result.cel);
                    cc.log(self.tiledMapRectArrayMap[9-result.row][result.cel]);*!/
                    // 已经有塔或者障碍物
                    if (self.tiledMapRectArrayMap[9 - result.row][result.cel] != self.tiledMapRectMapEnemu.NONE) {
                        self.loadTouchWarning(result.x + self.tileSize.width / 2, result.y + self.tileSize.height / 2);
                    }else{
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
    },
    collision:function () {
        // that =this;
        // if(cc.rectContainsPoint(this.pro.getBoundingBox(),this.newS.getPosition())){
        //     this.overpus.show(this.overpus, function(){
        //         that.unschedule(that.collision);
        //         console.log('游戏失败了');
        //     });
        // }
    },
    showTopBg:function(){
        var topBg = new cc.Sprite(res.topBg_png);
        topBg.x = cc.winSize.width*0.5;
        topBg.y = cc.winSize.height*0.93;
        this.addChild(topBg);

        var wavesBg = new cc.Sprite(res.wavesBg_png);
        wavesBg.x = cc.winSize.width*0.5;
        wavesBg.y = cc.winSize.height*0.93;
        this.addChild(wavesBg);

        var word = new cc.LabelTTF("波怪物","Arial",30);
        word.setFontFillColor(cc.color.WHITE);
        word.x = cc.winSize.width*0.55;
        word.y = cc.winSize.height*0.94;
        this.addChild(word);

        var immunity = new cc.LabelTTF("1000","",30);
        immunity.setFontFillColor(cc.color.WHITE);
        immunity.enableStroke(cc.color.WHITE, 2);
        immunity.x = cc.winSize.width*0.2;
        immunity.y = cc.winSize.height*0.94;
        this.addChild(immunity);

        var speed0Item = new cc.MenuItemImage(res.speed0_png,res.speed0_png, function () {
        }, this);
        var speed1Item = new cc.MenuItemImage(res.speed1_png,res.speed1_png, function () {
        }, this);

        var speedToggle = new cc.MenuItemToggle(speed0Item,speed1Item,function () {
            speedToggle.getSelectedIndex();
            if(speedToggle.getSelectedIndex()==1){
                this.newS.unschedule(this.newS.moveToNextRoad);
                this.newS.schedule(this.newS.moveToNextRoad_fast,0.25);
            }else{
                this.newS.unschedule(this.newS.moveToNextRoad_fast);
                this.newS.schedule(this.newS.moveToNextRoad,0.5);
            }
            cc.log(speedToggle.getSelectedIndex());
        },this);

        var speedMenu = new cc.Menu(speedToggle);
        speedMenu.x = cc.winSize.width*0.7;
        speedMenu.y = cc.winSize.height*0.93;
        this.addChild(speedMenu);

        var pause0Item = new cc.MenuItemImage(res.pause_0,res.pause_0, function () {
        }, this);
        var pause1Item = new cc.MenuItemImage(res.pause_1,res.pause_1, function () {
        }, this);

        var pauseToggle = new cc.MenuItemToggle(pause0Item,pause1Item,function () {
            //this.newS.unschedule(this.newS.moveToNextRoad);
            cc.director.pause();
            pauseToggle.getSelectedIndex();
            cc.log(pauseToggle.getSelectedIndex());
            if(pauseToggle.getSelectedIndex()==0){
                cc.director.resume();
            }
        },this);

        var pauseMenu = new cc.Menu(pauseToggle);
        pauseMenu.x = cc.winSize.width*0.8;
        pauseMenu.y = cc.winSize.height*0.93;
        this.addChild(pauseMenu);
    },
    onExit:function() {
        this._super();
        // cc.log("onExit调用，移除监听器");
        cc.eventManager.removeListener(this.listener);
    },
    loadTiledMap : function(){
        // cc.log("执行了");
        var tileMap=new cc.TMXTiledMap(res.BGS);
        this.addChild(tileMap);
        this.tiledMap = tileMap;
        this.tileSize = tileMap.getTileSize();
        tileMap.x = (cc.winSize.width - tileMap.width) / 2;
        tileMap.y = (cc.winSize.height - tileMap.height) / 2;
        // tileMap.setVisible(false);

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
 /!*        }
            // 中等障碍物[占用左右2格]
            else if (groupName == "little"){
                finalOffsetX = offsetX;
                finalOffsetY = offsetY + this.tileSize.height / 2;
            }else if (groupName == "small"
                || groupName == "road"
                || groupName == "start_end"
                || groupName == "invalid") {
                finalOffsetX = offsetX + this.tileSize.width / 2;
                finalOffsetY = offsetY + this.tileSize.height / 2;*!/
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
        //cc.log("GPMainLayer.loadCanTouchRect() : nextPosX is ", nextPosX);
        //cc.log("GPMainLayer.loadCanTouchRect() : nextPosY is ", nextPosY);

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
                // cc.log(properties.type);
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
        var node = new TowerPanel(args);
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
cc.log(data);
        var node = null;
        switch (data.name){
            case "Bottle":
                towerData.scope = 300;
                towerData.bulletSpeed = 40;
                node = new MyCell("res/mainScene/cell_1.png");
                break;
            case "Cell1":
                towerData.scope = 300;
                towerData.bulletSpeed = 40;
                node = new MyCell(res.cell1_png);
                break;
            case "Cell2":
                towerData.scope = 300;
                towerData.bulletSpeed = 40;
                node = new  MyCell(res.cell2_png);
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


        // bnt.setScale(2);
        var set = new cc.MenuItemImage( res.menu_png, res.menu_png, function () {
            //显示弹窗。function为回调函数，弹窗完全展示后回调
            this.newS.unschedule(this.newS.moveToNextRoad);
            this.newS.unschedule(this.newS.moveToNextRoad_fast);
            this.newS.schedule(this.newS.moveToNextRoad_slow,100);
            cc.director.resume();
            this.pus.show(this.pus, function(){
                console.log('弹窗打开了');
            });
        }, this );
        set.x = cc.winSize.width * 0.86;
        set.y = cc.winSize.height * 0.93;
        /!*
        var win = new cc.MenuItemFont( "闯关成功", function () {

            //显示弹窗。function为回调函数，弹窗完全展示后回调
            this.winpus.show(this.winpus, function(){
                console.log('闯关成功了');
            });

        }, this );
        win.x = cc.winSize.width * 0.8;
        win.y = cc.winSize.height * 0.6;*!/

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
            this.pus.hidden(this.pus, function(){
                cc.director.runScene(new LevelScene());
            });
        }, this);

        //继续游戏
        var continueItem = new cc.MenuItemImage(res.ContinueNormal_png,res.ContinueSelected_png, function () {
            this.newS.unschedule(this.newS.moveToNextRoad_slow);
            if(this.newS.speed=="normal"){
                this.newS.schedule(this.newS.moveToNextRoad,0.5);
            }else {
                this.newS.schedule(this.newS.moveToNextRoad_fast,0.3);
            }

            var pause0Item = new cc.MenuItemImage(res.pause_0,res.pause_0, function () {
            }, this);
            var pause1Item = new cc.MenuItemImage(res.pause_1,res.pause_1, function () {
            }, this);

            var pauseToggle = new cc.MenuItemToggle(pause0Item,pause1Item,function () {
                cc.director.pause();
                pauseToggle.getSelectedIndex();
                cc.log(pauseToggle.getSelectedIndex());
                if(pauseToggle.getSelectedIndex()==0){
                    cc.director.resume();
                }
            },this);

            var pauseMenu = new cc.Menu(pauseToggle);
            pauseMenu.x = cc.winSize.width*0.8;
            pauseMenu.y = cc.winSize.height*0.93;
            this.addChild(pauseMenu);
            //this.pause.getSelectedIndex()==0;
            this.pus.hidden(this.pus, function(){
                console.log('通过导演恢复场景');
                // cc.director.runScene(new LevelScene());
            });
        }, this);

        //重新开始
        var repeatItem = new cc.MenuItemImage(res.RepeatNormal_png,res.RepeatSelected_png, function () {
            this.pus.hidden(this.pus, function(){
                //this.newS.clearArray();
                cc.director.runScene(new MainScene());
            });
        }, this);

        var menu = new cc.Menu(selectItem, continueItem,repeatItem);
        menu.y = size.height * 0.45;
        menu.x = size.width *0.5 ;
        repeatItem.setScale(1.5);
        continueItem.setScale(1.5);
        selectItem.setScale(1.5);
        menu.alignItemsVerticallyWithPadding(40);
        layer.addChild(menu);

        /!*4、创建Popups对象。参数意义分别为 ：
         层
         弹窗一开始是否为可见，默认为true
         点击遮罩层的时候是否关闭弹窗，默认为false。若为true，则存放弹窗的layer必须设置宽高
         *!/
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

        //重新选关按钮
        var selectItem = new cc.MenuItemImage(res.SelectNormal_png,res.SelectSelected_png, function () {
            this.overpus.hidden(this.overpus, function(){
                // console.log('跳转到选关界面');
                cc.director.runScene(new LevelScene());
            });
        }, this);

        //重新开始按钮
        var repeatItem = new cc.MenuItemImage(res.RepeatNormal_png,res.RepeatSelected_png, function () {
            this.overpus.hidden(this.overpus, function(){
                cc.director.runScene(new MainScene());
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
            this.stars[i] = new cc.Sprite("res/mainScene/star"+(i+1)+".png");
            this.stars[i].x = size.width*(0.1*i+0.4);
            this.stars[i].y = size.height*(0.6);
            this.stars[i].setScale(1.2);
            layer.addChild(this.stars[i]);
        }

        //重新选关按钮
        var selectItem = new cc.MenuItemImage(res.SelectNormal_png,res.SelectSelected_png, function () {
            this.winpus.hidden(this.winpus, function(){
                console.log('跳转到选关界面');
                cc.director.runScene(new LevelScene());
            });
        }, this);

        //继续游戏按钮
        var continueItem = new cc.MenuItemImage(res.ContinueNormal_png,res.ContinueSelected_png, function () {
            this.winpus.hidden(this.winpus, function(){
                console.log('跳转到下一关界面');
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

var MainScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new MainLayer();
        this.addChild(layer);
    }
});

*/
var MainLayer = cc.Layer.extend({
    ctor : function() {
        this._super();
        var size = cc.winSize;

        if (cc.sys.localStorage.getItem("isMusicOn") == "YES") {
            cc.audioEngine.playMusic(res.Bg_mp3,true);
        }

        var bg = new cc.Sprite(res.bg);
        bg.x = cc.winSize.width / 2;
        bg.y = cc.winSize.height / 2;
        this.addChild(bg);

        //1、创建一个layer用于存放弹窗，layer的宽和高等于弹窗图片的大小
        var bgaaa = new cc.Sprite(res.help);
        bgaaa.x = cc.winSize.width / 2;
        bgaaa.y = cc.winSize.height / 2;
        bgaaa.setScale(0.8);
        bgaaa.setAnchorPoint(0.5, 0.5);
        this.addChild(bgaaa);

        //确定按钮
        var okItem = new cc.MenuItemImage(res.close3, res.close4, function () {
            cc.director.runScene(new MainScene1());
            EffectEngine.playEffect(res.Select);
        }, this);
        var menuaaa = new cc.Menu(okItem);
        menuaaa.x = bgaaa.width-200;
        menuaaa.y = bgaaa.height-100;
        bgaaa.addChild(menuaaa);
    }
});
var MainScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new MainLayer();
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