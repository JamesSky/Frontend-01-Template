function match (pattern, string) {
  let stateHandlers = []

  for (const p of pattern) {
    const len = stateHandlers.length

    if(!len){
      stateHandlers.push(
        function start(c) {
          if (c === p)
            return stateHandlers[len+1]
          else 
            return start
        }
      )
    }
    else if (len < pattern.length) {
      stateHandlers.push(
        function (c) {
          if (c === p)
            return stateHandlers[len+1]
          else 
            return stateHandlers[0](c)
        }
      )
    }
  }
  stateHandlers.push(function end(){return end})

  let state = stateHandlers[0]

  for (const c of string) {
    state = state(c)
  }
  return state === stateHandlers[stateHandlers.length - 1]
}

