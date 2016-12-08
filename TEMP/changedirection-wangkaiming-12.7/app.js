var jf = {};        // 定义自己的命名空间
jf.EventName = {};  // 事件名字对象
// 移除子弹
jf.EventName.GP_REMOVE_BULLET = "gp_remove_bullet";
var GameManager ={
    currBulletPool:[], // [当前]子弹节点池
};
var HelloWorldLayer = cc.Layer.extend({
    sprite:null,
    bulletMoveTime:0,            // 子弹移动到终点所需的时间
    ctor:function () {
        this._super();
        var size = cc.winSize;
        //病菌和炮塔
        var tumour=new cc.Sprite(res.tumour);
        tumour.x=size.width/2;
        tumour.y=size.height/2;
        this.addChild(tumour);

        var cell=new cc.Sprite(res.cell);
        cell.x=size.width/3;
        cell.y=size.height/3;
        this.addChild(cell);
        this.weapon = cell;
        
        //炮塔获取病菌位置
        if (tumour != null){
            this.weapon.stopAllActions();

            this.fireTargetPos = tumour.getPosition();

            var rotateVector = cc.pSub(tumour.getPosition(), this.getPosition());
            var rotateRadians = cc.pToAngle(rotateVector);
            // Cocos2d-x中规定顺时针方向为正，这显然与我们计算出的角度方向相反
            // 所以转化的时候需要把角度a变为-a
            var rotateDegrees = cc.radiansToDegrees(-1 * rotateRadians);

            // speed表示炮塔旋转的速度，0.5 / M_PI其实就是 1 / 2PI，它表示1秒钟旋转1个圆
            var speed = 0.5 / cc.PI;
            // rotateDuration表示旋转特定的角度需要的时间，计算它用弧度乘以速度。
            var rotateDuration = Math.abs(rotateRadians * speed);
            //开火射击
            var move = cc.rotateTo(rotateDuration, rotateDegrees);
            var callBack = cc.callFunc(this.onFire, this);
            var action = cc.sequence(move, callBack);
            this.weapon.runAction(action);
        }

        return true;
    },
    onFire : function(){
        var currBullet = this.createBullet();
        this.getParent().addChild(currBullet);
        GameManager.currBulletPool.push(currBullet);//子弹节点的缓冲池

        // 确保子弹会发射
        var shootVector = cc.pNormalize(cc.pSub(this.fireTargetPos, this.getPosition()));
        var normalizedShootVector = cc.pNeg(shootVector);

        var farthestDistance = 1.5 * cc.winSize.width;
        var overshotVector = cc.pMult(normalizedShootVector, farthestDistance);
        var offscreenPoint = cc.pSub(this.weapon.getPosition(), overshotVector);

        var move = cc.moveTo(this.bulletMoveTime, offscreenPoint);// 子弹移动到终点所需的时间,
        var callBack = cc.callFunc(this.removeBullet, currBullet);
        var action = cc.sequence(move, callBack);
        currBullet.runAction(action);
    },
    createBullet : function(){
        var node = new cc.Sprite(res.pbottle);//炮弹
        node.setPosition(this.getPosition());
        node.setRotation(this.weapon.getRotation());
        return node;
    },
    removeBullet : function(sender){
        var event = new cc.EventCustom(jf.EventName.GP_REMOVE_BULLET);
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

