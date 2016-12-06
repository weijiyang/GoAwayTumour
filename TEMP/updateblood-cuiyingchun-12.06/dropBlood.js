//掉血demo-----进度条的变化
 var dropBlood = cc.Sprite.extend({
     blood : 0, //现有血量
     allBlood : 0, //总血量
     timer : null,
     ctor : function(){
         this._super();

         var bloodBar = new cc.Sprite(res.bloodBar);
         this.addChild(bloodBar);
         var bloodSprite = new cc.Sprite(res.dropBlood);
         this.addChild(bloodSprite);
     },
     dropBloodAction:function(){
         //进度条(也是需要动作的)
         var timer = new cc.ProgressTimer(res.dropBlood);
         timer.type = cc.ProgressTimer.TYPE_BAR;//进度条的形式(由里向外)
         timer.midPoint = cc.p(0,0);//中间点
         timer.barChangeRate = cc.p(1,0);//改变率，指方向（x，y）
         this.timer = timer;
         this.blood = this.blood;
         this.addChild(timer);
         //可变
         var per = (this.blood / this.allBlood)*100;
         var timerAction = cc.progressFromTo(2.0,100,per);//2秒内，百分比到另一个百分比
         timer.runAction(timerAction);
     },
     getBlood : function(){
         return this.blood;
     },
     setBlood : function(blood){
         this.blood = blood;
     },
     getAllBlood : function() {
         return this.allBlood;
     },
     setAllBlood : function(allBlood){
         this.allBlood = allBlood;
     }
 });