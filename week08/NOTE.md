# 每周总结可以写在这里
### 课堂练习
#### 写出下面选择器的优先级
- div#a.b .c[id=x] [0,1,3,1]
- #a:not(#b) [0,2,0,0]
- *.a [0,0,1,0]
- div.a [0,0,1,1]
### 选择器优先级
下面列表中，选择器类型的优先级是递增的：

#### 类型选择器（例如，h1）和伪元素（例如，::before）   
#### 类选择器 (例如，.example)，属性选择器（例如，[type="radio"]）和伪类（例如，:hover）
#### ID 选择器（例如，#example）。
#### 通配选择符（universal selector）（*）关系选择符（combinators）（+, >, ~, ' ', ||）和 否定伪类（negation pseudo-class）（:not()）对优先级没有影响。（但是，在 :not() 内部声明的选择器会影响优先级）。

### 其他
- ::first-line 永远是在浏览器中实际显示的第一行

- HTML代码中可以书写开始标签 结束标签 和自封闭标签 一对起止标签 表示一个元素
- DOM树种存储的是元素和其他类型的节点(Node)
- CSS选择器选中的是元素
- CSS选择器选中的元素 在排版时可能产生多个盒
- 排版和渲染的基本单位是盒
### 正常流排版
- 收集盒进行
- 计算盒在行内的排布
- 计算行的排布
- vertical-align 最好只取Top Bottom Middle
- 一个元素有可能生成多个盒

### BFC
- block-level 表示可以被放入bfc
- block-container 表示可以容纳bfc
- block-box = block-level + block-container
- block-box 如果 overflow 是 visible， 那么就跟父bfc合并
- Block-level boxes：flex、table、grid、block
- block containers: block、inline-block、table-cell
- block boxes：block

### Flex排版
- 收集盒进行
- 计算盒在主轴的排布
- 计算盒在交叉轴的排布