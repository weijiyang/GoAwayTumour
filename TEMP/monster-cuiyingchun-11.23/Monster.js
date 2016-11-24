//肿瘤的类
var Monster = cc.Sprite.extend({
    road : [], //移动路径
    data : {}, //数据
    blood : 0, //血量
    speed : 0, //速度
    index : 0, //索引
    roadIndex : 0, //当前移动路径的前缀
    fileNamePrefix : "", //帧前缀
    ctor : function(fileName,data,fileNamePrefix){
        this._super(fileName);
        //加载属性
        this.loadProperty(data,fileNamePrefix);
    },
    //加载属性
    loadProperty : function(data,fileNamePrefix){
        cc.assert(data.speed,"Monster.loadProrerty():速度不能为空!");
        cc.assert(data.road,"Monster.loadProrperty():移动路径不能为空!");
        cc.assert(data.index >= 0,"Monster.loadProperty():索引不能为空!");
        cc.assert(fileNamePrefix,"Monster.loadProperty():文件名前缀不能为空!");

        this.data = data;
        this.speed = data.speed;
        this.blood = data.blood;
        this.road = data.road;
        this.index = data.index;
        this.fileNamePrefix = fileNamePrefix;
    },
    run : function(){
        this.runNextRoad();
        //跑到下一个标记点上
        this.playRunAnimation();
    },
    end : function(){
        var that = this;
        if(that.blood == 0){
          var callBackAction = cc.callFunc(function(){that.removeChild(that)});
          this.runAction(callBackAction);
      }
    },
    //粒子系统(暂时未用)
    particle : function(){
        var particle = new cc.ParticleFire();
        particle.texture = cc.textureCache.addImage(res.Fire_png);
        //这里是一个文理
        particle.x = this.width;
        particle.y = this.height;
        this.addChild(particle);

        particle.setTotalParticles(500);//粒子最大数量
        particle.setStartSize(20);//开始时粒子的大小
        particle.setStartSizeVar(5);//每个粒子的改动
        particle.setEndSize(20);
        particle.setEndSizeVar(5);
    },
    //跑到下一个标记点上
    runNextRoad : function(){
        //转方向
        if(this.road[this.roadIndex].x <= this.road[this.roadIndex+1].x){
            this.setFlippedX(false);
        }else{
            this.setFlippedX(true);
        }
        var distance = cc.pDistance(this.road[this.roadIndex],this.road[this.roadIndex+1]);
        var time = distance / this.speed;
        var moveTo = cc.moveTo(time,this.road[this.roadIndex + 1]);
        var callback = cc.callFunc(function(){
            if(this.roadIndex < this.road.length - 1){
                this.runNextRoad();
            }else{
                //吃到保护对象事件(jf是自己定义的命名空间）
                var event = new EventCustom(jf.EventName.GP_MONSTER_EAT_TARGET);
                event.setUserData({
                    target : this
                });
                cc.eventManager.dispatchCustomEvent(event);
            }
        }.bind(this));
        var seq = cc.sequence(moveTo,callback);
        this.runAction(seq);
        this.roadIndex++;
    },
    //跑动动作
    playRunAnimation : function(){
        var frames = [];
        for(var i=1;i<4;i++){
            var str = this.fileNamePrefix + i + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            frames.push(frame);
        }
        var animation = new cc.Animation(frames,0.15);
        animation.setRestoreOriginalFrame(true);

        var animate = cc.animate(animation);
        this.runAction(animate.repeatForever());
    },
    getRoad : function(){
        return this.road;
    },
    setRoad : function(road){
        this.road = road;
    },
    getData : function(){
        return this.data;
    },
    getBlood : function () {
        return this.blood;
    },
    setBlood : function(speed){
        this.blood = blood;
    },
    getSpeed : function () {
        return this.speed;
    },
    setSpeed : function(speed){
        this.speed = speed;
    },
    getIndex : function () {
        return this.index;
    },
    setIndex : function(index){
        this.index = index;
    }

});
