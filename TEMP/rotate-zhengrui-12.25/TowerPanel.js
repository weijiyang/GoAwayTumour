var TowerPanel = cc.Sprite.extend({
    ctor : function(args){
        this._super("res/mainScene/play/select_01.png");
        // var frameCache = cc.spriteFrameCache;
        // frameCache.addSpriteFrames(gameres.Bottleplist_plist,gameres.Bottle_png);

        // cc.spriteFrameCache.addSpriteFrames("res/mainScene/play/Tower/Bottle.plist","res/mainScene/play/Tower/Bottle.png" );

/*        var heroSpriteFrame = frameCache.getSpriteFrame("png");
        var hero1 = new cc.Sprite(heroSpriteFrame);*/

        this.loadProperty(args);
        this.loadTower();
    },
    loadProperty : function(args){
        cc.assert(args.cel >= 0, "TowerPanel.loadProperty(): 列数必须大于0");
        cc.assert(args.row >= 0, "TowerPanel.loadProperty(): 行号必须大于0");
        cc.assert(args.x, "TowerPanel.loadProperty(): X轴坐标必须指定");
        cc.assert(args.y, "TowerPanel.loadProperty(): Y轴坐标必须指定");
        this.cel = args.cel;
        this.row = args.row;
        this.x = args.x + this.width / 2;
        this.y = args.y + this.height / 2;
    },
    loadTower : function(){
        // cc.spriteFrameCache.addSpriteFrames(gameres.Bottleplist_plist,gameres.Bottle_png);
        cc.spriteFrameCache.addSpriteFrames(res.Bottleplist_plist,res.Bottle_png);
        var node = new cc.Sprite(res.Money3);
        var node1 = new cc.Sprite(res.Money1);
        var node2 = new cc.Sprite(res.Money2);
        // var node = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("Bottle00.png"));
        // var node = new cc.Sprite(gameres.Bottle_01);

        // node.anchorX = 0;
        // node.anchorY = 0;
        this.addChild(node);
        this.addChild(node1);
        this.addChild(node2);
        node.setAnchorPoint(0.5, 0);
        node1.setAnchorPoint(0.5, 0);
        node2.setAnchorPoint(0.5, 0);
        node.setName("Bottle");
        node1.setName("Cell1");
        node2.setName("Cell2");

        // 位置修正
        if (this.y >= cc.winSize.height - 2 * this.height) {
            node.setPosition(this.width / 2, -this.height);
            node1.setPosition(-this.width / 2 , 0);
            node2.setPosition(3 * this.width / 2 ,0);
        }else{
            node.setPosition(this.width / 2, this.height);
            node1.setPosition(-this.width / 2 , 0);
            node2.setPosition(3 * this.width / 2 , 0);
        }

        // 注册触摸事件
        var onTouchEventListener = cc.EventListener.create({
            event           : cc.EventListener.TOUCH_ONE_BY_ONE,
            target          : node,
            swallowTouches  : true,
            onTouchBegan  : this.onTouchBegan,
            onTouchMoved  : this.onTouchMoved,
            onTouchEnded  : this.onTouchEnded
        });
        var onTouchEventListener1 = cc.EventListener.create({
            event           : cc.EventListener.TOUCH_ONE_BY_ONE,
            target          : node1,
            swallowTouches  : true,
            onTouchBegan  : this.onTouchBegan,
            onTouchMoved  : this.onTouchMoved,
            onTouchEnded  : this.onTouchEnded
        });
        var onTouchEventListener2 = cc.EventListener.create({
            event           : cc.EventListener.TOUCH_ONE_BY_ONE,
            target          : node2,
            swallowTouches  : true,
            onTouchBegan  : this.onTouchBegan,
            onTouchMoved  : this.onTouchMoved,
            onTouchEnded  : this.onTouchEnded
        });

        cc.eventManager.addListener(onTouchEventListener, node);
        cc.eventManager.addListener(onTouchEventListener1, node1);
        cc.eventManager.addListener(onTouchEventListener2, node2);
    },
    onTouchBegan: function (touch, event) {
        var target = event.getCurrentTarget();
        var locationInNode = target.convertToNodeSpace(touch.getLocation());
        var size = target.getContentSize();
        var rect = cc.rect(0, 0, size.width, size.height);
        if (!cc.rectContainsPoint(rect, locationInNode)) {
            return false;
        }

        return true;
    },
    onTouchMoved: function (touch, event) {
        var target = event.getCurrentTarget();
    },
    onTouchEnded: function (touch, event) {
        // target 指向对应塔的图标
        // cc.log("ddd");
        var target = event.getCurrentTarget();
        // 创建塔事件分发
        var createTowerEvent = new cc.EventCustom(jf.EventName.GP_CREATE_TOWER);
        createTowerEvent.setUserData({
            name : target.getName(),
            // target.getParent() 指向TowerPanel
            x : target.getParent().getPositionX(),
            y : target.getParent().getPositionY(),
            cel : target.getParent().cel,
            row : target.getParent().row
        });
        cc.eventManager.dispatchEvent(createTowerEvent);
    }
});