export class Timeline {
  constructor () {
    this.STATE_PAUSE = 'TIMELINE_PAUSE'
    this.STATE_START = 'TIMELINE_START'
    this.STATE_INIT = 'TIMELINE_INIT'

    this.animations = []
    this.frameInstance = null
    this.pauseTime = 0
    this.state = this.STATE_INIT
  }
  tick = () => {
    let t = Date.now() - this.startTime
    let animations = this.animations.filter(animation => !animation.finished)

    if (!animations.length) {
      this.frameInstance = requestAnimationFrame(this.tick)
      return
    }

    for (const animation of animations) {
      let {element, property, start, end, duration, addTime, template, timingFunction, delay} = animation
      let progression = timingFunction((t - delay - addTime) / duration)

      if (t > duration + delay + addTime) {
        progression = 1
        animation.finished = true
      }

      let value = animation.valurFromProgression(progression)

      element[property] = template(value)
    }

    this.frameInstance = requestAnimationFrame(this.tick)
  }

  add (animation, addTime) {
    animation.finished = false

    if(this.state === this.STATE_START){
      animation.addTime = addTime !== undefined ? addTime : Date.now() - this.startTime
    }else{ 
      animation.addTime = addTime !== undefined ? addTime : 0
    }
    this.animations.push(animation)
  }

  start () {
    if(this.state !== this.STATE_INIT) return

    this.state = this.STATE_START
    this.startTime = Date.now()
    this.tick()
  }

  restart () {
    if(this.state !== this.STATE_START) return

    this.pause()
    this.animations = []
    this.frameInstance = null
    this.startTime = Date.now()
    this.pauseTime = 0
    this.state = this.STATE_START
    this.tick()
  }

  pause () {
    if(this.state !== this.STATE_START) return

    this.state = this.STATE_PAUSE
    this.pauseTime = Date.now()
    this.frameInstance && cancelAnimationFrame(this.frameInstance)
  }

  resume () {
    if(this.state !== this.STATE_PAUSE) return

    this.state = this.STATE_START
    this.startTime += Date.now() - this.pauseTime
    this.tick()
  }
}

export class Animation {
  constructor ({ element = '', property= '', start= '', end= '', delay= 0, template='', duration= '', timingFunction=(start, end) => {
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
  valurFromProgression(progression){
    return this.start + progression * (this.end - this.start)
  }
}

export class ColorAnimation {
  constructor ({ element = '', property= '', start= '', end= '', delay= 0, template='', duration= '', timingFunction=(start, end) => {
        return t => start + t / duration * (end - start)
      } }) {
    this.element = element
    this.property = property
    this.start = start
    this.end = end
    this.template = template || (v => `rgba(${v.r},${v.g},${v.b},${v.a})`)
    this.delay = delay
    this.duration = duration
    this.timingFunction = timingFunction
    console.log(this)
  }
  valurFromProgression(progression){
    return {
      r:this.start.r + progression * (this.end.r - this.start.r),
      g:this.start.g + progression * (this.end.g - this.start.g),
      b:this.start.b + progression * (this.end.b - this.start.b),
      a:this.start.a + progression * (this.end.a - this.start.a)
    }
  }
}

/*
  let animation = new Animation(object,property,start,end,duration,timingFunction)
 */
