export class Timeline {
  constructor () {
    this.animations = []
  }
  tick () {
    console.log('tick')
    let t = Date.now() - this.startTime 

    for (const animation of this.animations) {
      if (t > animation.duration + animation.delay) continue
      let {element, property, start, end,template, timingFunction, delay} = animation
      element[property] = template(timingFunction(start, end)(t - delay))
    }
    requestAnimationFrame(() => this.tick())
  }
  add(animation){
    this.animations.push(animation)
  }
  start () {
    this.startTime = Date.now()
    this.tick()
  }
  stop () {}
  pause () {}
  resume () {}
}

export class Animation {
  constructor ({ element = '', property= '', start= '', end= '', delay= 0,template='', duration= '', timingFunction=(start, end) => {
        return t => start + t / duration * (end - start)
      } }) {
    this.element = element
    this.property = property
    this.start = start
    this.end = end
    this.template = template
    this.delay = delay
    this.duration = duration
    this.timingFunction = timingFunction
    console.log(this)
  }
  start () {}
  pause () {}
}

/*
  let animation = new Animation(object,property,start,end,duration,timingFunction)
 */
