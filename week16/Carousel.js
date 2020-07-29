import { create } from './createElement'
import { Timeline, Animation } from './animation/animation.js'
import { ease } from './animation/timingFunctions.js'
import { enableGesture } from './gesture/gesture'
export class Carousel {
  constructor () {
    this.position = 0
    this.children = []
    this.root = null
    this.timer = null
    this.timeline = new Timeline
    this.timeline.start()
  }
  setAttribute (name, value) {
    this[name] = value
  }
  appendChild (child) {
    this.children.push(child)
  }
  mountTo (parent) {
    const render = this.render()

    this.root = render.root
    render.mountTo(parent)

    this.autoplay && this.loop()
    // this.listenDrag()
  }
  loop () {
    let run = () => {
      this.next()
      this.timer = setTimeout(run, this.duration)
    }
    this.timer = setTimeout(run, this.duration)
  }
  stop () {
    clearTimeout(this.timer)
  }
  // 如果是通过拖动完成 直接移动到下一张
  next () {
    if (this.timeline.state !== this.timeline.STATE_START) return
    let nextPosition = (this.position + 1) % this.data.length

    let current = this.root.children[this.position]
    let next = this.root.children[nextPosition]

    current.style.zIndex = 2
    next.style.zIndex = 1

    let currentAnimation = new Animation({
      element: current.style,
      property: 'transform',
      start: -100 * this.position,
      end: -100 - 100 * this.position,
      template: v => `translateX(${v}%)`,
      duration: 1000,
      timingFunction: ease
    })
    let nextAnimation = new Animation({
      element: next.style,
      property: 'transform',
      start: 100 - 100 * nextPosition,
      end: -100 * nextPosition,
      template: v => `translateX(${v}%)`,
      duration: 1000,
      timingFunction: ease
    })

    this.timeline.add(currentAnimation)
    this.timeline.add(nextAnimation)
    this.position = nextPosition
  }
  // 上一张只可能是通过拖拽
  prev () {
    let prevPosition = (this.position - 1 + this.data.length) % this.data.length
    let current = this.root.children[this.position]
    let prev = this.root.children[prevPosition]

    current.style.transition = 'ease 0.5s'
    prev.style.transition = 'ease 0.5s'

    current.style.transform = `translateX(${100 - 100 * this.position}%)`
    prev.style.transform = `translateX(${ -100 * prevPosition}%)`

    this.position = prevPosition
  }
  listenDrag () {
    this.root.addEventListener('mousedown', e => {
      const startX = e.clientX
      const width = this.root.offsetWidth


      // debugger
     

      current.style.transition = 'ease 0s'
      prev.style.transition = 'ease 0s'
      next.style.transition = 'ease 0s'

      current.style.transform = `translateX(${-width * this.position}px)`
      prev.style.transform = `translateX(${-width - width * prevPosition}px)`
      next.style.transform = `translateX(${width - width * nextPosition}px)`

      let mousemoveHandler = e => {
        const offset = e.clientX - startX > width / 2 ? width / 2 :
          e.clientX - startX < -width / 2 ? -width / 2 : e.clientX - startX

        current.style.transform = `translateX(${offset - width * this.position}px)`
        prev.style.transform = `translateX(${offset - width - width * prevPosition}px)`
        next.style.transform = `translateX(${offset + width - width * nextPosition}px)`
      }

      let mouseupHandler = e => {
        let dirEnum = {
          left: 1,
          right: 2
        }
        const offset = e.clientX - startX

        let dir
        offset > 100 && (dir = dirEnum.left)
        offset < -100 && (dir = dirEnum.right)

        if (!dir) {
          current.style.transition = 'ease .5s'
          prev.style.transition = 'ease .5s'
          next.style.transition = 'ease .5s'

          current.style.transform = `translateX(${-width * this.position}px)`
          prev.style.transform = `translateX(${-width - width * prevPosition}px)`
          next.style.transform = `translateX(${width - width * nextPosition}px)`
        } else {
          dir === dirEnum.right && this.next(true)
          dir === dirEnum.left && this.prev()
        }

        document.removeEventListener('mouseup', mouseupHandler)
        document.removeEventListener('mousemove', mousemoveHandler)
      }

      document.addEventListener('mouseup', mouseupHandler)
      document.addEventListener('mousemove', mousemoveHandler)
    })
  }
  render () {
    return <div class='carousel'>
             {this.data.map((url,currentPosition) => {

                const onStart = () => {
                  this.timeline.pause()
                }

                const onPan = e => {
                  let prevPosition = (currentPosition - 1 + this.data.length) % this.data.length
                  let nextPosition = (currentPosition + 1) % this.data.length

                  let current = this.root.children[currentPosition]
                  let prev = this.root.children[prevPosition]
                  let next = this.root.children[nextPosition]

                  console.log(current.style.transform)
                }
                const item = <img src={url} onPan={onPan} onPressend={()=> this.timeline.resume()} onPanend={onStart} alt='carouselItem' enableGesture={enableGesture} class='carousel-item' />
                item.addEventListener('dragstart', e => e.preventDefault())
              
                return item
              })}
           </div>
  }
}
