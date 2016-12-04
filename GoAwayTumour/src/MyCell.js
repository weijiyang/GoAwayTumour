var MyCell =  cc.Sprite.extend({
    listener:null,
    Level:null,
    MenuUp:null,
    MenuClose:null,
    LevelNum:2,
    ctor:function(fileName, rect, rotated){
        this._super(fileName, rect, rotated);
        var size=cc.winSize;
        this.addAttention();
        this.addLevelUpClose();
        this.addListener();

    },
    addListener:function(){
        var that=this;
        var listener = cc.EventListener.create({
            event:cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches:true,
            onTouchBegan: function (touch, event) {
                console.log("ontouchbegin");
                var location = touch.getLocation();
                var target = event.getCurrentTarget();
                if(cc.rectContainsPoint(target.getBoundingBox(),location)){
                    // cc.log("点击到细胞！并且可升级隐藏掉 升级 删除显示");

                    that.Level.runAction(cc.hide());
                    that.MenuUp.runAction(cc.show());
                    that.MenuClose.runAction(cc.show());
                    return true;
                }
                else{
                    that.Level.runAction(cc.show());
                    that.MenuUp.runAction(cc.hide());
                    that.MenuClose.runAction(cc.hide());

                }
                return false;
            },
            onTouchMoved: function (touch, event) {
                // var delta = touch.getDelta();
                // var target = event.getCurrentTarget();
                // target.x += delta.x;
                // target.y += delta.y;
                console.log("ontouchmoved");
            },
            onTouchEnded: function (touch, event) {
                console.log("ontouchended");

            }

        });

        cc.eventManager.addListener(listener,this);
        this.listener = listener;
    },
    addAttention:function(){
        // 添加可升级按钮    默认隐藏
        var Level = new cc.Sprite(res.Level);
        Level.setScale(0.5);
        this.addChild(Level);
        Level.x+=30;
        Level.y+=70;
        this.Level=Level;
        Level.runAction(cc.repeatForever(cc.jumpBy(0.5,0, 0, 10, 1),cc.jumpBy(0.5,0,0,10, 1).reverse()));
    },
    addLevelUpClose:function(){
        //添加升级按钮  默认隐藏
        var LevelUp = new cc.MenuItemImage(res.Level_up,res.Level_up_down,function(){
            console.log("点击升级按钮！");
            cc.log(this.getTexture());
            if(this.LevelNum==4){
                return false;
                // this.LevelNum=1;
            }
            var LevelName="res/mainScene/Cell_"+this.LevelNum+".png";
            this.LevelNum++;
            this.setTexture(LevelName);



        },this);
        LevelUp.setScale(0.5);
        // 添加删除按钮  默认隐藏
        var LevelClose = new cc.MenuItemImage(res.Level_close,res.Level_close_down,function(){
            console.log("点击关闭按钮！");
            //删除该细胞
            this.getParent().removeChild(this);

        },this);
        LevelClose.setScale(0.5);

        var MenuUp = new cc.Menu(LevelUp);
        var MenuClose = new cc.Menu(LevelClose);

        this.addChild(MenuUp);
        this.addChild(MenuClose);
        MenuUp.x=60;
        MenuUp.y=60;
        MenuClose.x=60;
        MenuClose.y=10;
        MenuUp.runAction(cc.hide());
        MenuClose.runAction(cc.hide());
        this.MenuUp=MenuUp;
        this.MenuClose=MenuClose;
    },
    onExit:function(){
        this._super();
        cc.log("onExit调用，移除监听器");
        cc.eventManager.removeListener(this.listener);
    }
});
