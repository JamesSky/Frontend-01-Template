### 字符串
- StringLiteral
  - " DoubleStringCharacters "

    `/"([^"\\\n\r\u2028\u2029]|\\(['"\\bfnrtv\n\r]|\r\n)|\\x[0-9a-fA-F]{2}|\\u[0-9a-fA-F]{4}|[^0-9ux'"\\bfnrtv\n\\\r\u2028\u2029])*"/`
      - SourceCharacter but not one of " or \ or LineTerminator

        `/"[^"\\\n\r\u2028\u2029]"/`
      - \ EscapeSequence
        `/\\(['"\\bfnrtv\n\r\u2028\u2029]|\r\n)|\\x[0-9a-fA-F]{2}|\\u[0-9a-fA-F]{4}/`
      - LineContinuation
        - \ LineTerminatorSequence
          `/\\([\n\r\u2028\u2029]|\r\n)/`
      - SingleEscapeCharacter
        
        `/'"\\bfnrtv/`
      - NonEscapeCharacter

        `[^0-9ux'"\\bfnrtv\n\\\r\u2028\u2029])`
  - ' SingleStringCharacters '

      `/'([^"\\\n\r\u2028\u2029]|\\(['"\\bfnrtv\n\r\u2028\u2029]|\r\n)|\\x[0-9a-fA-F]{2}|\\u[0-9a-fA-F]{4}|[^0-9ux'"\\bfnrtv\n\\\r\u2028\u2029])*'/`
  

