let y = g => (f => f(f))(self => g((...args) => self(self)(...args)))
let f = y(self => n => n<0?0:n+self(n-1))
console.log(
f(100)
)