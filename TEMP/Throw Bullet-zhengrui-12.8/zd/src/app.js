var HelloWorldLayer = cc.LayerColor.extend({
    cell: null,
    tumour:null,
    speed:0,
    ctor: function () {
        var size = cc.winSize;
        this._super(cc.color.BLACK, size.width, size.height);
        this.cell = new cc.Sprite(res.hero_png);
        this.cell.setAnchorPoint(0.5,0.5);
        this.cell.x =size.width*0.2 ;
        this.cell.y = size.height*0.2;
        this.addChild(this.cell);


        this.tumour = new cc.Sprite(res.tumour_png);
        //this.tumour.setAnchorPoint(0.55,0);
        this.tumour.x =size.width*0.6;
        this.tumour.y = size.height*0.5;
        this.addChild(this.tumour);
        //this.schedule(this.callBack,0.5);




       //炮塔获取病菌位置
        if (this.tumour != null){
            //this.weapon.stopAllActions();

            //this.fireTargetPos = tumour.getPosition();

            var rotateVector = cc.pSub(this.tumour.getPosition(), this.cell.getPosition());
            var rotateRadians = cc.pToAngle(rotateVector);
            // Cocos2d-x中规定顺时针方向为正，这显然与我们计算出的角度方向相反
            // 所以转化的时候需要把角度a变为-a
            var rotateDegrees = cc.radiansToDegrees(-1 * rotateRadians);

            // speed表示炮塔旋转的速度，0.5 / M_PI其实就是 1 / 2PI，它表示1秒钟旋转1个圆
            var speed = 3 / cc.PI;
            // rotateDuration表示旋转特定的角度需要的时间，计算它用弧度乘以速度。
            var rotateDuration = Math.abs(rotateRadians * speed);
            //开火射击
            var move = cc.rotateTo(rotateDuration, rotateDegrees);
            var callBack = cc.callFunc(this.onFire, this);
            var action = cc.sequence(move, callBack);
            this.cell.runAction(action);
        }


        //每0.2s 调用shootBullet函数发射1发炮弹.
        this.schedule(this.shootBullet, 0.2);

        return true;
    },
/*
    callBack:function () {
        //cc.log(this.speed);
        this.tumour.runAction(cc.moveBy(1,10,0));
       if(cc.rectContainsPoint(this.cell.getBoundingBox(),this.sprite.getPosition())){
            cc.log("碰到了");
        }
    },*/




    //飞机发射炮弹
    shootBullet: function (dt) {
        var bullet = Bullet.create(res.bullet_png, cc.p(300,0));
        if (bullet.getParent() == null) {
            this.cell.addChild(bullet);
            cc.pool.putInPool(bullet);
        }
        bullet.shootBulletFromFighter(cc.p(this.cell.x -this.cell.getContentSize().width / 2, this.cell.y - this.cell.getContentSize().height / 2) );
    },
    onExit: function () {
        this._super();
        this.unschedule(this.shootBullet);
        cc.pool.drainAllPools();
    }
});

var HelloWorldScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});

