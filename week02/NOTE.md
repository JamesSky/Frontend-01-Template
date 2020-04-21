# 每周总结可以写在这里
 本周通过两次课程深一步的掌握了JS的语法和词法以及一些常见字面量的理解
 编写encodeUTF8时通过查询资料掌握了encodeURIComponent不能编码的字符集
 写出所有数字字面量和字符串字面量时对ECMA标准有了更深入的了解 并通过读ECMA标准给出了答案

#### 一般命令式编程语言构成
  1. Atom
     - Identifier
     - Literal
  2. Expression
     - Atom
     - Operator
     - Punctuator
  3. Statement
     - Expression
     - Keyword
     - Punctuator
  4. Structure
     - Function
     - Class
     - Process
     - Namespace
  5. Program
     - Program
     - Mould
     - Package
     - Library

TIPS: 多种换行符的出现其实是因为老式打字机的问题
  - WhiteSpace(尽量不使用除空格`<SP>`以外的空白符 )
    - `<TAB>：\t`
    - `<VT>： ``\v`
    - `<FF>：\f` 
    - `<SP>：\s`
    - `<NBSP>：NO-BREAK SPACE`
    - `<ZWNBSP>：ZERO WIDTH NO-BREAK SPACE`
    - `<USP>`
  - LineTerminator
    - `<LF>：\n`
    - `<CR>：\r`
    - `<LS>`
    - `<PS>`
  - Comment
    - `// comment 单行注释`
    - `/* comment */ 多行注释`
  - Token
    - IdentifierName
      - Keywords
      - Identifier
      - Future reserved Keywords: enum(枚举类型) 
    - Punctuator
    - Template
    - Literal
#### JS基本数据类型

  - Symbol 通常用来实现一些私有变量或唯一值
  - Number
    - 浮点数精度比较: Math.abs(0.1 + 0.2 - 0.3) < Number.EPSILON
    (这个式子有bug 1.1+1.3-2.4无法正确判断)
  - String
    - Code Point: U+0000 ~ U+10FFFF， 最好使用 U+0000 ~ U+FFFF范围内字符
  - Boolean
  - Undifined 在一些低版本浏览器undefined的值可以被重写
  - Null 这里有个历史遗留问题是typeof null 返回object的原因是因为js采用了低位存储 以000开头的变量会被typeof认为是object 而null表示都是0 所以会错误的被识别为object
  - BigInt 数字以n结尾 可以表示超出安全范围的数字(暂未进入标准)