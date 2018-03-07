<template>
    <div id="app">
         <div class="modal" :style="{ width: modalWidth+'px', height: modalHeight + 'px' }">
        <img :src="bigPic" class="modal_content"
            v-touch:scaleTouch = "{func: scalePic, param: ''}"
            v-touch:slideTouch = "{func: movePic, param: ''}"
            :class="{'width80': bigPic ==='image_2.png'}"
        />
      </div>
    </div>
</template>

<script>
 
export default {
  name: 'app',
  data:function () {
      return{
          bigPic: '',
          isShowBigpic: false,
          modalWidth: 0,
          modalHeight: 0,
          baseLeft : 0,
          baseTop: 0,
          bodyWidth: document.body.clientWidth,
          ele: null, // 不能在这里设置， dom还没有生成
          
      }
  },
  methods:{
    handleShowPic: function(picSrc){ // 显示图片
        this.modalWidth = document.documentElement.clientWidth;
        this.modalHeight = document.documentElement.clientHeight;
        this.bigPic = picSrc;
        this.isShowBigpic = true;
        this.ele = document.getElementsByClassName('modal_content')[0];
        document.addEventListener('touchmove', this.preHandler, {passive:false});
        document.addEventListener('touchstart', this.preHandler, {passive:false});
    },
    handleCloseBigpic: function(){ // 恢复原状
      this.isShowBigpic = false;
      document.removeEventListener('touchmove',this.preHandler, {passive:false});
      document.removeEventListener('touchstart',this.preHandler, {passive:false});
      this.ele.style.margin =  '0px';
      this.ele.style.transform = 'translate(-50%, -50%) scale(1,1)';
    },
    scalePic: function(param, is_endScale){
      var nodeStyle = this.ele.style.transform;
      var changeSize = nodeStyle ?  parseFloat(nodeStyle.slice(nodeStyle.indexOf('scale')+6)) : 0;
      if(is_endScale){
        // 缩放图片结束，要重新计算定位
        this.setMaxdisp(changeSize,parseInt(this.ele.style.marginLeft), parseInt(this.ele.style.marginTop), 'scale')
        return 
      }
      if(nodeStyle){
        // 如果存在的话，就说明已经设置了，scale已经改变了
        var currScaleSize = changeSize + param; 
        currScaleSize > 3 ? currScaleSize = 3 : null
        currScaleSize < 1 ? currScaleSize = 1 : null
        this.ele.style.transform = 'translate(-50%, -50%) scale('+currScaleSize+','+currScaleSize+')';
      }else{ // 如果不存在，就说明是第一次设置
          var scale = param + 1 
          this.ele.style.marginLeft =  '0px';
          this.ele.style.marginTop  = '0px';
          this.ele.style.transform = 'translate(-50%, -50%) scale('+scale+','+scale+')';
      }
    },
    movePic: function(param){
     if(param.is_endMove){ // 每次移动松开手指的时候要下次移动的基础坐标
        this.baseLeft = parseInt(this.ele.style.marginLeft.slice(0, -2));
        this.baseTop = parseInt(this.ele.style.marginTop.slice(0, -2));
      }else{
        var nodeStyle = this.ele.style.transform 
        if(nodeStyle){ // 有这个就表示应该是移动
          var currScaleSize = parseFloat(nodeStyle.slice(nodeStyle.indexOf('scale')+6))
          this.setMaxdisp(currScaleSize,this.baseLeft+ param.x, this.baseTop + param.y, 'move')
        }
      }
    },
    setMaxdisp:function(changeSize, changeX, changeY, type){
      // 计算最大位移
      var picHeight =  this.bodyWidth  / (this.ele.naturalWidth / this.ele.naturalHeight); 
      var maxTop = ( picHeight * changeSize - window.innerHeight) /2 
      var maxLeft = this.bodyWidth / 2 * (changeSize - 1) 
      if(changeX >= maxLeft){
        this.ele.style.marginLeft = maxLeft + 'px'
      }else if(changeX < -maxLeft){
        this.ele.style.marginLeft = -maxLeft + 'px'
      }else if(type==='move'){
        this.ele.style.marginLeft =changeX +'px'; 
      }
      // 如果图片当前尺寸大于屏幕尺寸，可以移动
      if(maxTop > 0){
        if(changeY >= maxTop){
          this.ele.style.marginTop = maxTop + 'px';
        }else if(changeY < -maxTop){
          this.ele.style.marginTop = -maxTop + 'px'
        }else if(type==='move'){
          this.ele.style.marginTop = changeY+'px';
        }
      }else if(type==='move'){
        this.ele.style.marginTop = 0 +'px'; 
      }
    },
    preHandler:function(e){
      e.preventDefault();
    }
  }
}
</script>
<style lang="scss" rel="stylesheet/scss">
  @function count_font($n){
    @return $n/2;
  }
  @function count_space($n){
    @return $n/100;
  }
  #app{
    position: relative;
    margin: 0 count_space(40rem) count_space(59rem);
  }

  // 放大图片样式
  .modal{
    position: fixed;
    top: 0;
    left: 0;
    overflow: hidden;
    background: rgba(0, 0, 0, 1);
    text-align: center;
    .modal_content{
      position: absolute;
      width: 100%;
      width: 88%;
      top: 50%;
      transform: translate(-50%, -50%);
      margin-left: 0;
      margin-top: 0;
    }
    .close_modal{
      color: #ffffff;
      font-size: 12px;
      font-style: normal;
      background: rgba(0, 0, 0, 0.6);
      height: count_space(70rem);
      z-index: 100;
      position: relative;
      text-align: right;
      padding: 0 10px 0 0;
      .close_icon{
        border-radius: 50%;
        width:  count_space(40rem);
        padding: count_space(16rem);
      }
    }
  }
  .width80{
    width: 100% !important;
  }
</style>
