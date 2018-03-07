# vueDirect
vue手势指令
> 在项目中需要一组手势，网上找了一堆，最后还是自己写了一个比较合适自己项目的
> 主要是针对图片操作的

### Features
- [x] 单指移动
- [x] 双指缩放
- [x] 移动

### 使用
在入口文件引用
```bash
import myTouch from './myTouch'
myTouch(Vue)
```
使用：
```bash
 <img src="pic.png" class="modal_content"
            v-touch:scaleTouch = "{func: scalePic, param: ''}"
            v-touch:slideTouch = "{func: movePic, param: ''}"
            v-touch:tap = "{func: tao, param: ''}"
        />
```
> func: 绑定的函数名称
> paran: 函数传递的参数
