/* 2016-11-23   曹阳   创建 */
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

    ctor : function()
    {
        this._super();
        var size = cc.winSize;
        DTHIS = this;    //DTHIS在此处类似于that
        // this.addChild(new cc.LayerColor(cc.color(184,153,0)));
/*        var backgoundimage = new cc.Sprite(res.BackgoundImage);
        // backgoundimage.setRotation(180);
        backgoundimage.x = cc.winSize.width / 2;
        backgoundimage.y = cc.winSize.height / 2;
        this.addChild(backgoundimage);*/

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

        this.initBnt();
        this.registerEvent();
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
                    self.loadTouchWarning(touch.getLocation().x, touch.getLocation().y);
                    // cc.log(this.tiledMapRectArray.length);
                }else {
                    // 已经有塔或者障碍物
                    if (self.tiledMapRectArrayMap[result.row][result.cel] != self.tiledMapRectMapEnemu.NONE) {
                        cc.log("aaa"+self.tiledMapRectArrayMap[result.row][result.cel]);
                        self.loadTouchWarning(result.x + self.tileSize.width / 2, result.y + self.tileSize.height / 2);
                    }else{
                        // 当前位置没有塔和障碍物
                        if (self.towerPanel == null) {
                            // cc.log("bbb");
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
/*        this.createTower();
        this.onCreateTower();*/
        // this.removeTowerPanel();
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
            if (groupName == "big") {
                finalOffsetX = offsetX;
                finalOffsetY = offsetY;
            }
            // 中等障碍物[占用左右2格]
            else if (groupName == "little"){
                finalOffsetX = offsetX;
                finalOffsetY = offsetY + this.tileSize.height / 2;
            }else if (groupName == "small"
                || groupName == "road"
                || groupName == "start_end"
                || groupName == "invalid") {
                finalOffsetX = offsetX + this.tileSize.width / 2;
                finalOffsetY = offsetY + this.tileSize.height / 2;
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
                //node = new cc.Sprite();
                //this.addChild(node, 200);
                //node.setTextureRect(cc.rect(0, 0, tileSize.width - 2, tileSize.height - 2));
                //node.setColor(cc.color(122, 122, 255));
                //node.setPosition(nextPosX, nextPosY);
                //node.setOpacity(120);
                nextPosX += this.tileSize.width;
            }

            nextPosX = (cc.winSize.width - this.tiledMap.width) / 2 + this.tileSize.width / 2;
            nextPosY += this.tileSize.height;
        }
    },
    // 加载[瓦片地图区域映射]
    loadTiledMapRectArrayMap : function(){
        var i;
        var mapSize = this.tiledMap.getMapSize();
        for (i = 0; i < mapSize.height; i++) {
            this.tiledMapRectArrayMap[i] = [];
            for (var j = 0; j < mapSize.width; j++) {
                this.tiledMapRectArrayMap[i][j] = this.tiledMapRectMapEnemu.NONE;
                // cc.log("地图区域映射加载完成");
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
        this.tiledMapRectMapEnemu.SMALL     = "block";    //  2  小障碍物[占1格]
        this.tiledMapRectMapEnemu.LITTLE    = 3;    // 中障碍物[占2格]
        this.tiledMapRectMapEnemu.BIG       = 4;    // 大障碍物[占4格]
        this.tiledMapRectMapEnemu.INVALID   = 5;    // 无效区域
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
                    //cc.log("GPMainLayer.getInfoFromMapByPos() : rect is ", rect);
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

        var towerData = {};
        towerData.name = data.name;
        towerData.x = data.x;
        towerData.y = data.y;

        var node = null;
        switch (data.name){
            case "Bottle":
                towerData.scope = 300;
                towerData.bulletSpeed = 40;
                node = new Bottle(towerData);
                break;
            default :
                cc.warn("GPMainLayer.createTower() : 异常");
                break;
        }

        // 属性设置
        if (node != null) {
            // 标记当前位置有塔
            this.tiledMapRectArrayMap[data.row][data.cel] = this.tiledMapRectMapEnemu.TOWER;
        }

        return node;
    },
    initBnt : function()
    {
        var pause = new cc.MenuItemImage( res.pause_0, res.pause_0, function () {
            //显示弹窗。function为回调函数，弹窗完全展示后回调
            this.pus.show(this.pus, function(){
                console.log('弹窗打开了');
            });

        }, this );
        pause.x = cc.winSize.width * 0.83;
        pause.y = cc.winSize.height * 0.95;
        // bnt.setScale(2);
        var set = new cc.MenuItemImage( res.menu_png, res.menu_png, function () {

            //显示弹窗。function为回调函数，弹窗完全展示后回调
            this.pus.show(this.pus, function(){
                console.log('弹窗打开了');
            });

        }, this );
        set.x = cc.winSize.width * 0.9;
        set.y = cc.winSize.height * 0.95;
        // bnt1.setScale(2);
        // var OverLabel = new cc.LabelTTF("游戏失败");
        // OverLabel.setFontSize(cc.winSize.width / 8);
        // OverLabel.setFontFillColor(cc.color.BLACK);
        // OverLabel.enableStroke(cc.color.YELLOW, 5);
        var over = new cc.MenuItemFont( "游戏失败", function () {

            //显示弹窗。function为回调函数，弹窗完全展示后回调
            this.overpus.show(this.overpus, function(){
                console.log('游戏失败了');
            });

        }, this );

        over.x = cc.winSize.width * 0.8;
        over.y = cc.winSize.height * 0.4;

        var win = new cc.MenuItemFont( "闯关成功", function () {

            //显示弹窗。function为回调函数，弹窗完全展示后回调
            this.winpus.show(this.winpus, function(){
                console.log('闯关成功了');
            });

        }, this );
        win.x = cc.winSize.width * 0.8;
        win.y = cc.winSize.height * 0.6;

        var menu = new cc.Menu(pause,set,over,win);
        menu.x = 0;
        menu.y = 0;
        // menu.setFontFillColor(cc.color.BLACK);
        this.addChild(menu);
    },
    initTc : function()
    {
        var size = cc.winSize;
        //1、创建一个layer用于存放弹窗，layer的宽和高等于弹窗图片的大小
        var layer = new cc.LayerColor(cc.color(0,0,0,0), 750, 427);
        // layer.x = 400 - (layer.width/2);
        // layer.y = 640 - (layer.height/2);
        /*		//2、创建弹窗图片
         var tc = new cc.Sprite('res/tc.png');
         tc.x = layer.width / 2;
         tc.y = layer.height / 2;
         layer.addChild(tc);

         //3、弹窗的按钮
         var bnt = new cc.MenuItemImage( 'res/bnt.png', 'res/bnt.png', function () {

         //关闭弹窗。function为回调函数，弹窗完全关闭后回调
         this.pus.hidden(this.pus, function(){
         console.log('弹窗关闭了');
         });

         }, this );
         bnt.x = layer.width / 2;
         bnt.y = 45;
         var menu = new cc.Menu(bnt);
         menu.x = 0;
         menu.y = 0;
         layer.addChild(menu); */

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
                // console.log('跳转到选关界面');
                cc.director.runScene(new LevelScene());
            });
        }, this);

        //继续游戏
        var continueItem = new cc.MenuItemImage(res.ContinueNormal_png,res.ContinueSelected_png, function () {
            this.pus.hidden(this.pus, function(){
                console.log('通过导演恢复场景');
                // cc.director.runScene(new LevelScene());
            });
        }, this);

        //重新开始
        var repeatItem = new cc.MenuItemImage(res.RepeatNormal_png,res.RepeatSelected_png, function () {
            this.pus.hidden(this.pus, function(){
                // console.log('跳转到游戏开始界面');
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

