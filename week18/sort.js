const bubbleSort = arr => {
  if (arr.length < 2) return arr

  let len = arr.length
  for (let i = 0; i < len; i++) {
    let flag = false

    for (let j = 0; j < len - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        let temp = arr[j + 1]

        arr[j + 1] = arr[j]
        arr[j] = temp
        flag = true
      }
    }
    if (!flag) break
  }
  return arr
}
function insertSort (arr) {
  let len = arr.length

  if (len < 2) return arr

  for (let i = 1;i < len;i++) {
    let value = arr[i]
    let j = i - 1

    for (; i >= 0;j--) {
      if (arr[j] > value) {
        arr[j + 1] = arr[j]
      }else {
        break
      }
    }
    arr[j + 1] = value
  }
  return arr
}
const shellSort = function (arr) {
  var gap, i, j
  var temp
  for (gap = Math.floor(arr.length / 2); gap > 0; gap = Math.floor(gap / 2))
    for (i = gap; i < arr.length; i++) {
      temp = arr[i]
      for (j = i - gap; j >= 0 && arr[j] > temp; j -= gap)
        arr[j + gap] = arr[j]
      arr[j + gap] = temp
  }
  return arr
}
const mergeSort = function (arr) {
  function compare(arr,p,r){

  }
  
}
console.log(shellSort([2, 4, 3, 6, 8, 10, 1, 3]))
