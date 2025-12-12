import { useState, memo, h, render, useEffect } from "../../src/index"

// 注入样式（包含CSS动画）
const styleSheet = document.createElement("style")
styleSheet.textContent = `
.container {
  position: absolute;
  transform-origin: 0 0;
  left: 50%;
  top: 50%;
  width: 10px;
  height: 10px;
  background: #eee;
  animation: scaleAnimation 10s linear infinite;
  transform: translateZ(0);
}

@keyframes scaleAnimation {
  0% { transform: scaleX(0.476) scaleY(0.7); }  /* 1/2.1 ≈ 0.476 */
  50% { transform: scaleX(0.905) scaleY(0.7); } /* (1+0.9)/2.1 ≈ 0.905 */
  100% { transform: scaleX(0.476) scaleY(0.7); }
}

.dot {
  position: absolute;
  background: #61dafb;
  font: normal 15px sans-serif;
  text-align: center;
  cursor: pointer;
}
`
document.head.appendChild(styleSheet)

const SlowDot = memo(({ x, y, size, text }) => {
  const [hover, setHover] = useState(false)
  const start = performance.now()
  while (performance.now() - start < 2) {} // here

  const dotStyle = {
    width: `${size * 1.3}px`,
    height: `${size * 1.3}px`,
    left: `${x}px`,
    top: `${y}px`,
    borderRadius: `${size * 1.3 / 2}px`,
    lineHeight: `${size * 1.3}px`,
    background: hover ? "#ff0" : "#61dafb"
  }

  return (
    <div
      className="dot"
      style={dotStyle}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {hover ? `*${text}*` : text}
    </div>
  )
})

// Sierpinski 三角形组件
const targetSize = 25

const getValue = (key, kid) => {
  const number = kid.props.nodeValue
  return number
}

const SierpinskiTriangle = memo(({ x, y, s, children }) => {
  const number = getValue(`${x}-${y}-${s}-${children}`, children)

  if (s <= targetSize) {
    return (
      <SlowDot
        x={x - targetSize / 2}
        y={y - targetSize / 2}
        size={targetSize}
        text={number}
      />
    )
  }

  const newSize = s / 2

  return (
    <div>
      <SierpinskiTriangle x={x} y={y - newSize / 2} s={newSize}>
        {children}
      </SierpinskiTriangle>
      <SierpinskiTriangle x={x - newSize} y={y + newSize / 2} s={newSize}>
        {children}
      </SierpinskiTriangle>
      <SierpinskiTriangle x={x + newSize} y={y + newSize / 2} s={newSize}>
        {children}
      </SierpinskiTriangle>
    </div>
  )
})

// 主应用组件
const App = () => {
  const [seconds, setSeconds] = useState(0)

  // 仅更新秒数
  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(prev => (prev % 10) + 1)
    }, 1000)
    
    return () => clearInterval(timer)
  }, [])

  return (
    <div>
      <h1>Fre Time Slicing</h1>
      <div className="container">
        <SierpinskiTriangle x={0} y={0} s={1000}>
          {seconds}
        </SierpinskiTriangle>
      </div>
    </div>
  )
}

// 渲染入口
render(<App />, document.body)