var Bottle =  cc.Node.extend({
    listener:null,
    Level:null,
    MenuUp:null,
    MenuClose:null,
    attack:null,
    LevelNum:1,
    scope           : 400,            // 视野
    bulletSpeed     : 20,           // 子弹速度
    bulletMoveTime  : 6.0,            // 子弹移动到终点所需的时间
    nearestEnemy    : null,         // 最近的敌人
    fireTargetPos   : cc.p(0, 0),   // 子弹最终的位置
    weapon  : null,     // 武器
    row     : -1,       // 行
    cel     : -1,       // 列
    AttackWay:"far",
    tag:"on",
    ctor:function(fileName){
        this._super();
        var size=cc.winSize;
        this.setAnchorPoint(0.5,0.5);
        this.loadWeapon(fileName);
        this.schedule(this.onRotateAndFire, 0.4);
        this.addAttention();
        this.addLevelUpClose();
        this.addListener();
    },

    // 找到最近的敌人
    findNearestMonster : function(){
        var monsterArray = this.getParent().Monster;
        var currMinDistant = this.scope;
        var nearestEnemy = null;
        var monster = null;
        var distance = 0;
        for (var i = 0; i < monsterArray.length; i++) {
            monster = monsterArray[i];
            // cc.log(monster);
            if(monster.blood.getBlood()>=0){
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
    loadWeapon : function(fileName){
        this.weapon = new cc.Sprite(fileName);//node;
        this.setPosition(this.width / 2, this.height / 2);
        this.addChild(this.weapon);
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
            var callBack = cc.callFunc(this.onFire, this);
            this.weapon.runAction(callBack);
        }
    },
    onFire : function(){
        var currBullet = this.createBullet();
        currBullet.runAction(cc.repeatForever(cc.rotateBy(0.5,60)));
        this.getParent().addChild(currBullet);
        GameManager.currBulletPool.push(currBullet);
        // 确保子弹会发射
        var shootVector = cc.pNormalize(cc.pSub(this.fireTargetPos, this.getPosition()));
        var normalizedShootVector = cc.pNeg(shootVector);

        var farthestDistance = 1.5 * cc.winSize.width;
        var overshotVector = cc.pMult(normalizedShootVector, farthestDistance);
        var offscreenPoint = cc.pSub(this.weapon.getPosition(), overshotVector);
        var move = cc.moveTo(this.bulletMoveTime, offscreenPoint);
        var callBack = cc.callFunc(this.checkCollide, currBullet);
        var action = cc.sequence(move, callBack);
        currBullet.runAction(action);
    },
    createBullet : function(){
        var node = new cc.Sprite(res.xue_3_png);
        node.setPosition(this.getPosition());
        node.setRotation(this.weapon.getRotation());
        return node;
    },
    // 碰撞检测
    checkCollide : function(){
        var bullet = null;
        var enemy = null;
        var enemyRect = null;
        var monsterArray = this.getParent().Monster;
        for (var i = 0; i < GameManager.currBulletPool.length; i++) {
            bullet = GameManager.currBulletPool[i];
            for (var z = 0; z < monsterArray.length; z++) {
                enemy = monsterArray[z];
                enemyRect = cc.rect(enemy.x - enemy.width, enemy.y - enemy.height, enemy.width*5, enemy.height*5);
                if (cc.rectIntersectsRect(enemyRect,bullet.getBoundingBox())) {
                    // 移除子弹
                    this.removeChild(GameManager.currBulletPool[i]);
                    GameManager.currBulletPool.splice(i, 1);
                    enemy.blood.dropBloodAction_one();
                    if( enemy.blood.getBlood()<=0){


                        enemy.runAction(cc.hide());
                        enemy.stopAllActions();
                        enemy.setTexture(res.TouMing);


                        enemy.unschedule(enemy.moveToNextRoad);
                        enemy.schedule(enemy.moveToNextRoad_fast,0.25);

                        var that=this;
                        if(enemy.blood.getBlood()==0){
                            that.getParent().immunity+=50;
                        }
                    }
                }
            }
        }

    },

    addListener:function(){
        var that=this;
        var listener = cc.EventListener.create({
            event:cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches:true,
            onTouchBegan: function (touch, event) {
                var location = touch.getLocation();
                var target = event.getCurrentTarget();
                var position=that.weapon.convertToNodeSpaceAR(location);
                if(cc.rectContainsPoint(target.getBoundingBox(),position)){
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

        cc.eventManager.addListener(listener,this.weapon);
        this.listener = listener;
    },
    addAttention:function(){
        // 添加可升级按钮    默认隐藏
        var Level = new cc.Sprite(res.Level);
        Level.setScale(0.5);
        this.addChild(Level);
        Level.x=5;
        Level.y=30;
        this.Level=Level;
        this.Level.setLocalZOrder(20);
        Level.runAction(cc.repeatForever(cc.jumpBy(0.5,0, 0, 10, 1),cc.jumpBy(0.5,0,0,10, 1).reverse()));
        this.Level.runAction(cc.hide());
    },
    addLevelUpClose:function(){
        //添加升级按钮  默认隐藏
        var LevelUp = new cc.MenuItemImage(res.Level_up,res.Level_up_down,function(){
            this.Level.runAction(cc.hide());
            cc.log(this.LevelNum);
            this.LevelNum++;


            if(this.LevelNum<=3){
                if(this.getParent().immunity>=100){
                    this.getParent().immunity-=100;
                    this.weapon.setTexture("res/mainScene/cell6-"+this.LevelNum+"-1.png");
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

            }
            if(this.LevelNum>3){
                this.LevelNum=3;
            }

        },this);
        LevelUp.setScale(0.65);
        // 添加删除按钮  默认隐藏
        var LevelClose = new cc.MenuItemImage(res.Level_close,res.Level_close_down,function(){
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
        MenuUp.x=15;
        MenuUp.y=10;
        MenuClose.x=15;
        MenuClose.y=-30;
        MenuUp.runAction(cc.hide());
        MenuClose.runAction(cc.hide());
        this.MenuUp=MenuUp;
        this.MenuClose=MenuClose;
        this.MenuUp.setLocalZOrder(2000);
        this.MenuClose.setLocalZOrder(2000);
    },
    onExit:function(){
        this._super();
        cc.eventManager.removeListener(this.listener);
    }
});
