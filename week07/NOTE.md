# 每周总结可以写在这里
## flex布局主轴相关的属性(交叉轴同理)
- mainSize 表示元素在主轴的尺寸 在flexDriection为row时为width column时为height
- mainBase 排布元素的起点 可以理解为origin 正向排布时为0 反向排布时对应元素的宽或高
- mainSign 向量的标志符 标识的是元素的排布方向是正向还是反向
- mainStart 元素排布的起始方向
- mainEnd 元素排布的结束方向
## 分行
- 根据元素的主轴尺寸吧元素进行分行
- 如果设置了nowrap 就只有一行 把所有元素都分配进第一行
- 一个flexline在交叉轴的尺寸取决于这个flexline中在交叉轴尺寸最大的一个子元素
## 计算主轴
- 计算主轴方向
  - 找出所有flex元素
  - 把主轴方向剩余尺寸按比例分配给这些元素
  - 若剩余空间为负数 所有flex元素为0 等比压缩剩余元素
## 计算交叉轴
- 计算交叉轴方向
  - 根据每一个flexline中的最大尺寸计算交叉轴尺寸
  - 根据交叉轴尺寸和align-items和align-self计算位置
## CSS总体结构
- @charset 文件编码
- @import  注意这两条顺序不能变
- rules
  - @media 媒体查询
  - @page
  - rule 普通规则
## CSS规则
- Selector
- KEY
  - Properties
  - Variables
- Value