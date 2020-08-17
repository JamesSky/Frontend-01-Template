import { Wrapper, Text, create } from '../lib/createElement.js'
import { TabPanel } from '../lib/TabPanel.js'

let component = <TabPanel>
                  <span title='张三的家'>炸了</span>
                  <span title='李四的家'>炸了</span>
                  <span title='张三的厕所'>也炸了</span>
                  <span title='张三的厕所'>又炸了</span>
                </TabPanel>

component.mountTo(document.body)
