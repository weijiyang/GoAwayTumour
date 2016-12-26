var Cell3 =  cc.Sprite.extend({
    listener:null,
    Level:null,
    MenuUp:null,
    AttackWay:"close",
    MenuClose:null,
    LevelNum:1,
    mySprite:null,
    frameName:"",
    tag:"on",
    ctor:function(fileName, rect, rotated){
        this._super(fileName, rect, rotated);
        var size=cc.winSize;

        var mySprite = new EffectNode(res.stamp);
        mySprite.x =35;
        mySprite.y =35;
        this.addChild(mySprite);
        this.mySprite=mySprite;
        this.mySprite.setLocalZOrder(-1);
        this.mySprite.setScale(0.1);

        this.LevelRunAction();

        this.addAttention();

        this.addLevelUpClose();
        this.addListener();

    },

    LevelRunAction:function(){
        var CellAnimation=new cc.Animation();
        for(var i=1;i<4;i++){
            var frameName=res["Cell5_"+this.LevelNum+"_"+i];
            CellAnimation.addSpriteFrameWithFile(frameName);
        }
        CellAnimation.setDelayPerUnit(1/5);
        CellAnimation.setRestoreOriginalFrame();
        var CellAnimate=cc.animate(CellAnimation);
        this.runAction(CellAnimate.repeatForever());
    },
    addListener:function(){
        var that=this;
        var listener = cc.EventListener.create({
            event:cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches:true,
            onTouchBegan: function (touch, event) {

                var location = touch.getLocation();
                var target = event.getCurrentTarget();
                if(cc.rectContainsPoint(target.getBoundingBox(),location)){

                    that.Level.runAction(cc.hide());
                    that.MenuUp.runAction(cc.show());
                    that.MenuClose.runAction(cc.show());
                    return true;
                }
                else{
                    if(that.LevelNum<3&&that.LevelNum>250){
                            that.Level.runAction(cc.show());
                    }
                    else{
                        that.Level.runAction(cc.hide());
                    }
                    that.MenuUp.runAction(cc.hide());
                    that.MenuClose.runAction(cc.hide());

                }
                return false;
            },
            onTouchMoved: function (touch, event) {

            },
            onTouchEnded: function (touch, event) {


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
        Level.x=30;
        Level.y=70;
        this.Level=Level;
        this.Level.runAction(cc.repeatForever(cc.jumpBy(0.5,0, 0, 10, 1),cc.jumpBy(0.5,0,0,10, 1).reverse()));
        this.Level.runAction(cc.hide());
    },
    addLevelUpClose:function(){
        //添加升级按钮  默认隐藏
        var that=this;
        var LevelUp = new cc.MenuItemImage(res.Level_up,res.Level_up_down,function(){
            console.log("点击升级按钮！"+this.LevelNum);
            that.Level.runAction(cc.hide());
            this.LevelNum++;


            if(this.LevelNum<=3){
                if(this.getParent().immunity>=100){
                    this.getParent().immunity-=100;
                }
                else{
                    var warning = new cc.Sprite(res.immunity);
                    warning.setLocalZOrder(-1);
                    warning.x =cc.winSize.width/2;
                    warning.y =cc.winSize.height*0.8;
                    this.getParent().warning = warning;
                    this.getParent().addChild(warning);
                    this.getParent().warning.setLocalZOrder(1);
                    var delayTime = cc.delayTime(2);
                    var hide = cc.hide();
                    this.getParent().warning.runAction(cc.sequence(delayTime,hide));
                    this.LevelNum--;
                }
                this.setTexture("res/mainScene/cell5-"+this.LevelNum+"-1.png");
                this.stopAllActions();
                this.LevelRunAction();
            }
            if(this.LevelNum>3){
                this.LevelNum=3;
            }
        },this);
        LevelUp.setScale(0.65);


        // 添加删除按钮  默认隐藏
        var LevelClose = new cc.MenuItemImage(res.Level_close,res.Level_close_down,function(){
            console.log("点击关闭按钮！");
            this.Level.runAction(cc.hide());
            //删除该细胞
            if(this.LevelNum==1){
                this.getParent().immunity+=150;
            }
            if(this.LevelNum==2){
                this.getParent().immunity+=150;
            }
            if(this.LevelNum==3){
                this.getParent().immunity+=150;
            }
            this.tag="off";
            this.getParent().removeChild(this);



        },this);
        LevelClose.setScale(0.65);

        var MenuUp = new cc.Menu(LevelUp);
        var MenuClose = new cc.Menu(LevelClose);

        this.addChild(MenuUp);
        this.addChild(MenuClose);
        MenuUp.x=55;
        MenuUp.y=55;
        MenuClose.x=55;
        MenuClose.y=15;
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
