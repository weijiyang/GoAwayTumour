
var HelloWorldLayer = cc.Layer.extend({
    sprite:null,
    scope           : 0,            // 视野
    bulletSpeed     : 10,           // 子弹速度
    bulletMoveTime  : 0,            // 子弹移动到终点所需的时间
    nearestEnemy    : null,         // 最近的敌人
    fireTargetPos   : cc.p(0, 0),   // 子弹最终的位置
    weapon  : null,     // 武器
    row     : -1,       // 行
    cel     : -1,       // 列
    currBulletPool : [],
    ctor:function () {
        this._super();
        var size = cc.winSize;
        this.addChild(new cc.LayerColor(cc.color.WHITE));
        this.schedule(this.onRotateAndFire, 0.5);

        this.cell = new cc.Sprite(res.hero_png);//细胞
        this.cell.setAnchorPoint(0.5,0.5);
        this.cell.x =size.width*0.2 ;
        this.cell.y = size.height*0.2;
        this.addChild(this.cell);


        this.tumour = new cc.Sprite(res.tumour_png);//肿瘤
        //this.tumour.setAnchorPoint(0.55,0);
        this.tumour.x =size.width*0.6;
        this.tumour.y = size.height*0.5;
        this.addChild(this.tumour);
        // this.schedule(this.callBack,0.5);

        //this.onRotateAndFire();


        return true;
    },
    loadWeapon : function(){
        var node = new cc.Sprite(res.bullet_png);//zidan
        this.addChild(node);
        this.weapon = node;
        node.setPosition(this.width / 2, this.height / 2);
        node.setRotation(90);
    },
/*    callBack:function () {
        //cc.log(this.speed);
        this.tumour.runAction(cc.moveBy(1,10,0));
        var bullet = Bullet.create(res.bullet_png, cc.p(300,0));
        if(cc.rectContainsRect(bullet.getBoundingBox(),this.tumour.getBoundingBox())){
            cc.log("碰到了");
        }
    },*/
    createBullet : function(){
        var node = new cc.Sprite(res.bullet_png);
        node.setPosition(this.getPosition());
        node.setRotation(this.weapon.getRotation());
        return node;
    },




    // 找到最近的敌人
    findNearestMonster : function(){
        // var monsterArray = this.currMonsterPool;
        var monsterArray = [];
        var currMinDistant = this.scope;
        var nearestEnemy = null;
        var monster = null;
        var distance = 0;
        for (var i = 0; i < monsterArray.length; i++) {
            for (var j = 0; j < monsterArray[i].length; j++){
                monster = monsterArray[i][j];
                distance = cc.pDistance(this.getPosition(), monster.getPosition());
                if (distance < currMinDistant) {
                    currMinDistant = distance;
                    nearestEnemy = monster;
                }
            }
        }
        this.nearestEnemy = nearestEnemy;
        return nearestEnemy;
    },

    // 旋转并开火
    onRotateAndFire : function(){
        var nearestEnemy =  this.findNearestMonster();
        if (nearestEnemy != null){
            this.weapon.stopAllActions();

            this.fireTargetPos = nearestEnemy.getPosition();

            var rotateVector = cc.pSub(nearestEnemy.getPosition(), this.getPosition());
            var rotateRadians = cc.pToAngle(rotateVector);
            // Cocos2d-x中规定顺时针方向为正，这显然与我们计算出的角度方向相反，所以转化的时候需要把角度a变为-a
            var rotateDegrees = cc.radiansToDegrees(-1 * rotateRadians);

            // speed表示炮塔旋转的速度，0.5 / M_PI其实就是 1 / 2PI，它表示1秒钟旋转1个圆
            var speed = 0.5 / cc.PI;
            // rotateDuration表示旋转特定的角度需要的时间，计算它用弧度乘以速度。
            var rotateDuration = Math.abs(rotateRadians * speed);

            var move = cc.rotateTo(rotateDuration, rotateDegrees);
            var callBack = cc.callFunc(this.onFire, this);
            var action = cc.sequence(move, callBack);
            this.weapon.runAction(action);
        }
    },
    onFire : function(){
        var currBullet = this.createBullet();
        this.getParent().addChild(currBullet);
        this.currBulletPool.push(currBullet);

        // 确保子弹会发射
        var shootVector = cc.pNormalize(cc.pSub(this.fireTargetPos, this.getPosition()));
        var normalizedShootVector = cc.pNeg(shootVector);

        var farthestDistance = 1.5 * cc.winSize.width;
        var overshotVector = cc.pMult(normalizedShootVector, farthestDistance);
        var offscreenPoint = cc.pSub(this.weapon.getPosition(), overshotVector);

        var move = cc.moveTo(this.bulletMoveTime, offscreenPoint);
        var callBack = cc.callFunc(this.removeBullet, currBullet);
        var action = cc.sequence(move, callBack);
        currBullet.runAction(action);
    },
    removeBullet : function(sender){
        // var event = new cc.EventCustom(jf.EventName.GP_REMOVE_BULLET);
        var event = new cc.EventCustom("gp_remove_bullet");
        event.setUserData({
            target : sender
        });
        cc.eventManager.dispatchEvent(event);
    }
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});

