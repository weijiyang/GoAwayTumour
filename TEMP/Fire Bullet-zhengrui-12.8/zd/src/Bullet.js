var Bullet = cc.Sprite.extend({
    velocity: 0,			//精灵移动速度
    ctor: function (spriteFrameName, velocity) {
        this._super(spriteFrameName);//精灵纹理图片
        this.velocity = velocity;//精灵移动速度
    },
    shootBulletFromFighter: function (p) {
        this.setPosition(p);//设置子弹初始位置
        this.scheduleUpdate();//开始游戏循环
    },

    //设置移动子弹的新位置
    update: function (dt) {
        var size = cc.winSize;
        //计算移动位置
        this.x = this.x +this.velocity.x * dt;
        this.y = this.y - this.velocity.y * dt;//向下发射
        //判断子弹是否超出屏幕，如果超出屏幕，停止游戏循环，将子弹从父节点移除
        if (this.y >= size.height) {
            this.unscheduleUpdate();
            this.removeFromParent();
        }
    },
    //unuse函数在对象放入池中时调用
    unuse: function () {
        this.retain();//if in jsb，保持子弹内存不被释放
        this.setVisible(false);//设置子弹不可见
    },
    //从池中获得重用对象，
    reuse: function (spriteFrameName, velocity) {
        this.spriteFrameName = spriteFrameName;//精灵
        this.velocity = velocity;//速度
        this.setVisible(true);//精灵可见
    }
});

Bullet.create = function (spriteFrameName, velocity) {

    if (cc.pool.hasObject(Bullet)) {
       // cc.log("获得可重用对象。");
        return cc.pool.getFromPool(Bullet, spriteFrameName, velocity);//对象存在获得重用
    } else {
        //cc.log("创建新对象。");
        return new Bullet(spriteFrameName, velocity);//对象不存在创建对象
    }
}
