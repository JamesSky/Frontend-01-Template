const string2Number = require('./../week03/string2Number')

describe('string2Number', () => {
  it('传入正确参数有正确返回值', () => {
    expect(string2Number('2', 10)).toBe(2)
    expect(string2Number('10', 2)).toBe(2)
    expect(string2Number('2', 8)).toBe(2)
    expect(string2Number('2', 16)).toBe(2)
  // expect(string2Number('2',)).toBe(2)
  })
})
