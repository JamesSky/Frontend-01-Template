import { create } from './createElement.js'
import { Carousel } from '../component/Carousel'

const data = [
  'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1906469856,4113625838&fm=26&gp=0.jpg',
  'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1595943080883&di=6cc62e6bc15a2ef96e4af93148839636&imgtype=0&src=http%3A%2F%2Fa3.att.hudong.com%2F14%2F75%2F01300000164186121366756803686.jpg',
  'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1595943080883&di=afe83485bf976837f2c4d938220b75c7&imgtype=0&src=http%3A%2F%2Fa0.att.hudong.com%2F56%2F12%2F01300000164151121576126282411.jpg',
  'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1595943080883&di=ef734af28927aada4c6629a69742bc42&imgtype=0&src=http%3A%2F%2Fa1.att.hudong.com%2F05%2F00%2F01300000194285122188000535877.jpg'
]
const component = <Carousel data={data} duration={2000} autoplay>
</Carousel>
component.mountTo(document.body)
const restart = document.querySelector('.restart')
const resume = document.querySelector('.resume')
const pause = document.querySelector('.pause')
window.component = component

restart.onclick = () => {
  component.timeline.restart()
}
resume.onclick = () => {
  component.timeline.resume()
}
pause.onclick = () => {
  component.stop()
}
