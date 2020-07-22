import { Wrapper, Text, create } from './createElement'
// import {Carousel} from './carousel.view'
import { Timeline, Animation } from './animation/animation'
import { cubicBezier } from './animation/cubicBezier.js';
class Carousel {
  constructor(config) {
    this.children = [];
    this.attributes = new Map();
    this.properties = new Map();
  }
  setAttribute(name, value) {
    this[name] = value;
  }
  appendChild(child) {
    this.children.push(child);
  }
  mountTo(parent) {
    this.render().mountTo(parent);
  }
  render() {
    // JSX的组件是一等公民，可以随便的赋值给变量，这是非常舒服的地方
    let children = this.data.map(url => {
      let element = <img src={url} />;
      element.addEventListener('dragstart', event => event.preventDefault());
      return element;
    });
    let root = <div class="container">
      <div class="carousel">
        {children}
      </div>
    </div>
    let position = 0;
    let tl = new Timeline;
    let ease = cubicBezier(0.25, .1, .25 ,1);
    children.forEach((child, index) => {
      tl.add(new Animation({
        element: child.root.style,
        property: 'transform',
        start: 0,
        end:100,
        duration:500,
        delay: 0,
        timingFunction:ease,
        template:v => {
          return `translateX(${ - v - 100 * (((index === 0) && (position === this.data.length - 1)) ? -1 : position)}%)`
        }
      }))
    })
    let nextPic = () => {
      tl.start();
      setTimeout(() => {
        position = (position + 1) % this.data.length;
        children.forEach((child, index) => {
          tl.add(new Animation({
            element: child.root.style,
            property: 'transform',
            start: 0,
            end:100,
            duration:500,
            delay: 0,
            timingFunction:ease,
            template:v => {
              return `translateX(${ - v - 100 * (((index === 0) && (position === this.data.length - 1)) ? -1 : position)}%)`
            }
          }))
        })
        nextPic();
      }, 3000);
    }
    setTimeout(nextPic, 3000);
    return root
  }
}

let component = <Carousel data={[
  "https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg",
  "https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg",
  "https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg",
  "https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg",
]}/>

component.mountTo(document.body);