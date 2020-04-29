const testbody = [
  {
    label: "北京",
    value: "AREA|88cff55c-aaa4-e2e0",
    pinyin: "beijing",
    short: "bj",
  },
  {
    label: "安庆",
    value: "AREA|b4e8be1a-2de2-e039",
    pinyin: "anqing",
    short: "aq",
  },
  {
    label: "南宁",
    value: "AREA|2bc437ca-b3d2-5c3c",
    pinyin: "nanning",
    short: "nn",
  },
  {
    label: "北海",
    value: "AREA|7d0c1398-df56-c4e8",
    pinyin: "beihai",
    short: "bh",
  },
]

let newObj = testbody.reduce((acc, ele) => {
  // let tmp = ele.label[0]
  let tmp = ele.label.substring(0, 1)

  if (!acc[tmp]) {
    acc[tmp] = []
  }
  acc[tmp].push(ele)
  return acc
}, {})

console.log(newObj)
