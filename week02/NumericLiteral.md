## 参考ECMA-262 11.8.3 Numeric Literals 数字字面量主要分为以下几种类型
+ NumericLiteral

  `/^(\.\d+|(0|[1-9]\d*)(\.\d*)?)([eE][-\+]?\d+)?$|^0[bB][01]+$|^0[oO][0-7]+$|^0[xX][0-9a-fA-F]+$/`
  + BinaryIntegerLiteral

    `^0[bB][01]+$`
    + BinaryDigits

      `/[01]+/`
    + BinaryDigit

      `/[01]/`
  + OctalIntegerLiteral

    `/^0[oO][0-7]+$/`
    + OctalDigits

      `/[0-7]+/`
    + OctalDigit

      `/[0-7]/`
  + HexIntegerLiteral

    `/^0[xX][0-9a-fA-F]+$/`
    + HexDigits

      `/[0-9a-fA-F]+/`
    + HexDigit

      `/[0-9a-fA-F]/`
  + DecimalLiteral

    `/^(\.\d+|(0|[1-9]\d*)(\.\d*)?)([eE][-\+]?\d+)?$/`
      + DecimalIntegerLiteral 
        
        `/^(0|[1-9]\d*)$/`
      + DecimalDigits

        `/\d+/`
      + DecimalDigit

        `/\d/`
      + ExponentPart

        `/^[eE][-\+]?\d+$/`
        + ExponentIndicator

          `/^[eE]$/`
        + SignedInteger

          `/^[-\+]?\d+$/`