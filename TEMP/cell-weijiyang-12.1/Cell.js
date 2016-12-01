//细胞的类
var Cell = cc.Sprite.extend({
    data : {}, //数据
    // blood : 0, //血量
    // level : 0, //等级
    index : 0, //索引
    fileNamePrefix : "cell_", //帧前缀
    ctor : function(fileName,data,fileNamePrefix){
        this._super(fileName);
        //加载属性
        this.loadProperty(data,fileNamePrefix);
    },
    //加载属性
    loadProperty : function(data,fileNamePrefix){
        //如果信息为假   打印相应信息
        cc.assert(data.level,"Cell.loadProrerty():速度不能为空!");
        cc.assert(data.index >= 0,"Cell.loadProperty():索引不能为空!");
        cc.assert(fileNamePrefix,"Cell.loadProperty():文件名前缀不能为空!");

        this.data = data;
        this.level = data.level;
        this.blood = data.blood;
        this.index = data.index;
        this.fileNamePrefix = fileNamePrefix;
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
    getData : function(){
        return this.data;
    },
    getBlood : function () {
        return this.blood;
    },
    // setBlood : function(level){
    //     this.blood = blood;
    // },
    // getLevel : function () {
    //     return this.level;
    // },
    // setLevel : function(level){
    //     this.level = level;
    // },
    getIndex : function () {
        return this.index;
    },
    setIndex : function(index){
        this.index = index;
    }
});

var AbcCell = Cell.extend({

})

var a = new AbcCell();
a.getBlood()
a.addChild()