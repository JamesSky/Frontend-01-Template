import {parseHTML} from '../src/parser.js'
import assert from 'assert'
import { hasProperty, getProperty } from '../util/testUtil'

describe('Test parser', function () {
    it('parse a single element', function () {
      let div = parseHTML('<div></div>').children[0]
      assert.equal(div.tagName, 'div')
      assert.equal(div.type, 'element')
      assert.equal(div.children.length, 0)
      assert.equal(div.attributes.length, 0)
    })
    it('parse a single element with text content', function () {
      let div = parseHTML('<div>skel</div>').children[0]
      let text = div.children[0]
      assert.equal(text.content, 'skel')
      assert.equal(text.type, 'text')
    })
    it('tag mismatch', () => {
      try {
        let doc = parseHTML('<div></vd>')
      } catch (e){
        assert.equal(e.message,`Tag start end doesn't match!`)
      }
    })
    it('text with <', () => {
      let div = parseHTML('a < b').children[0]
      let text = div.children[0]
      assert.equal(text.content,`a < b`)
    })
    it('element with property', () => {
      let div = parseHTML('<div class=\'cls\' id=test data=\"abc\" ></div>').children[0]
      let attrs = div.attributes

      assert.equal(hasProperty(attrs,'class'), true)
      assert.equal(hasProperty(attrs,'id'), true)
      assert.equal(hasProperty(attrs,'data'), true)
      assert.equal(getProperty(attrs,'class'), 'cls')
      assert.equal(getProperty(attrs,'id'), 'test')
      assert.equal(getProperty(attrs,'id'), 'test')
    })
    it('element with doublequoted property', () => {
      let div = parseHTML('<div class=\'cls\' id=test data=\"abc\"></div>').children[0]
      let attrs = div.attributes
      
      assert.equal(hasProperty(attrs,'class'), true)
      assert.equal(hasProperty(attrs,'id'), true)
      assert.equal(hasProperty(attrs,'data'), true)
      assert.equal(getProperty(attrs,'class'), 'cls')
      assert.equal(getProperty(attrs,'id'), 'test')
      assert.equal(getProperty(attrs,'id'), 'test')
    })
    it('element with singlequoted property', () => {
      let div = parseHTML('<div class=\'cls\'></div>').children[0]
      let attrs = div.attributes
      
      assert.equal(hasProperty(attrs,'class'), true)
      assert.equal(getProperty(attrs,'class'), 'cls')
    })
    it('element with unquoted property', () => {
      let div = parseHTML('<div class=cls></div>').children[0]
      let attrs = div.attributes
      
      assert.equal(hasProperty(attrs,'class'), true)
      assert.equal(getProperty(attrs,'class'), 'cls')
    })
    it('element with unquoted property & selfclosing', () => {
      let div = parseHTML('<div class=cls/>').children[0]
      let attrs = div.attributes
      
      assert.equal(hasProperty(attrs,'class'), true)
      assert.equal(getProperty(attrs,'class'), 'cls')
    })
    it('element with doublequoted property & has morequote', () => {
      let div = parseHTML('<div class=\"cl\"s\"/>').children[0]
      let attrs = div.attributes
      
      assert.equal(hasProperty(attrs,'class'), true)
      assert.equal(getProperty(attrs,'class'), 'cls')
    })
    it('element with singlequoted property & has morequote', () => {
      let div = parseHTML('<div class=\'cl\'s\'/>').children[0]
      let attrs = div.attributes
      
      assert.equal(hasProperty(attrs,'class'), true)
      assert.equal(getProperty(attrs,'class'), 'cls')
    })
    it('selfclosing element', () => {
      let div = parseHTML('<div class=\'cls\' />').children[0]
      let attrs = div.attributes
      
      assert.equal(hasProperty(attrs,'class'), true)
      assert.equal(getProperty(attrs,'class'), 'cls')
    })
    it('selfclosing element without property', () => {
      let div = parseHTML('<div/>').children[0]
      
      assert.equal(div.type, 'element')
    })
    it('allow script tag', () => {
      let content = '<div>abcd</civ><div>x</civ><sca<sa<scrb<scrc<scripe</sca</sd</scrg</scris</scripa</script<scriptd/scriptd><scriptyt'
      let script = parseHTML(`<script class=\'cls\' >${content}</script>`).children[0]
      assert.equal(script.children[0].content, content)
    })
    it('element with novalue property', () => {
      let div = parseHTML('<div disabled></div>').children[0]
      let attrs = div.attributes

      assert.equal(hasProperty(attrs,'disabled'), true)
    })
})
