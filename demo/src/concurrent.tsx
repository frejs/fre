// import { h, render, useState, useEffect } from 'fre'
import { h, render, useState, useEffect } from '../../src/index'

const UPDATE_EVERY = 500
const BLOCK_FOR = 5
const NUM_COMPONENTS = 100

const App = () => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    setTimeout(() => setCount(count + 1), UPDATE_EVERY)
  })

  const values = []

  for (let i = count; i < count + NUM_COMPONENTS; i++) {
    values.push(i)
  }

  return (
    <div className="wraper">
      <h1>Count: {count}</h1>
      {values.map((value, index) => (
        <SlowComponent key={value} value={value} />
      ))}
    </div>
  )
}

const SlowComponent = ({ value }) => {
  const start = performance.now()
  while (performance.now() - start < BLOCK_FOR) {}

  return <li className="slow">{value}</li>
}

const root = document.getElementById('root')
let div = document.createElement('div')
div.innerHTML = `<style>
body {
  background: #010911;
  font-family: sans-serif;
}

h1 {
  color: rgb(0, 204, 10);
}

#animation {
  width: 380px;
  height: 380px;
  transform: translate(50%, 50%);
  margin: 20px auto;
}

.slow {
  background: #f60066;
  color: white;
  padding: 5px;
  display: inline-block;
  margin: 5px;
  font-size: 12px;
  border-radius: 50%;
}

.wraper{
  margin: 20px auto;
  width: 700px;
  text-align: center;
}

ul.solarsystem {
  position: relative;
  height: 400px;
  list-style: none;
  transition: all 0.09s ease-in;
  transform: translate(-480px, -336px);
}

ul.solarsystem li {
  text-indent: -9999px;
  display: block;
  position: absolute;
  border: 2px solid #394057;
}

ul.solarsystem li span {
  display: block;
  position: absolute;
  width: 10px;
  height: 10px;
  border-radius: 5px;
}

ul.solarsystem li.active.sun span,
ul.solarsystem li.active.earth .moon {
  border: none;
  box-shadow: none;
}

ul.solarsystem li.sun {
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background: #fc3;
  background-image: gradient(linear,
      left bottom,
      left top,
      color-stop(0.22, rgb(204, 153, 0)),
      color-stop(1, rgb(255, 219, 112)));
  top: 302px;
  left: 462px;
  border: none;
  box-shadow: 0 0 50px #c90;
  z-index: 100;
  transition: all 0.2s ease-in;
}

ul.solarsystem li.sun span {
  width: 60px;
  height: 60px;
  border-radius: 50%;
}

ul.solarsystem li.mercury {
  width: 100px;
  height: 100px;
  border-radius: 52px;
  top: 270px;
  left: 430px;
  z-index: 99;
}

ul.solarsystem li.mercury span {
  background: #b6bac5;
  top: 10px;
  left: 10px;
}

ul.solarsystem li.venus {
  width: 160px;
  height: 160px;
  border-radius: 82px;
  top: 240px;
  left: 400px;
  z-index: 98;
}

ul.solarsystem li.venus span {
  background: #bf8639;
  top: 118px;
  left: 5px;
}

ul.solarsystem li.earth {
  width: 220px;
  height: 220px;
  border-radius: 112px;
  top: 210px;
  left: 370px;
  z-index: 97;
}

ul.solarsystem li.earth span {
  background: #06c;
  top: 56px;
  left: 5px;
}

ul.solarsystem li.earth span.moon {
  width: 4px;
  height: 4px;
  border-radius: 2px;
  background: #ccc;
  top: 12px;
  left: 12px;
}

ul.solarsystem li.mars {
  width: 280px;
  height: 280px;
  border-radius: 142px;
  top: 180px;
  left: 340px;
  z-index: 96;
}

ul.solarsystem li.mars span {
  background: #aa4200;
  top: 0px;
  left: 175px;
}

ul.solarsystem li.asteroids_meteorids {
  top: 155px;
  left: 315px;
  z-index: 1;
  width: 330px;
  height: 330px;
  border-radius: 165px;
  border: none;
}

ul.solarsystem li.jupiter {
  width: 340px;
  height: 340px;
  border-radius: 172px;
  top: 150px;
  left: 310px;
  z-index: 95;
}

ul.solarsystem li.jupiter span {
  background: #e0ae6f;
  top: 67px;
  left: 24px;
}

ul.solarsystem li,
ul.solarsystem li.earth span {
  animation-iteration-count: infinite;
  animation-timing-function: linear;
  animation-name: orbit;
}

ul.solarsystem li.mercury {
  animation-duration: 5s;
}

ul.solarsystem li.venus {
  animation-name: retrograde;
  animation-duration: 8s;
}

ul.solarsystem li.earth {
  animation-duration: 12s;
}

ul.solarsystem li.earth span {
  animation-duration: 2s;
}

ul.solarsystem li.mars {
  animation-duration: 20s;
}

ul.solarsystem li.asteroids_meteorids {
  animation-duration: 50s;
}

ul.solarsystem li.jupiter {
  animation-duration: 30s;
}

@keyframes orbit {
  from {
    transform: rotate(0deg);
    color: white;
    font-size: 200%;
  }

  to {
    transform: rotate(360deg);
    color: black;
    font-size: 50%;
  }
}

@keyframes retrograde {
  from {
    transform: rotate(0deg);
    color: white;
    font-size: 200%;
  }

  to {
    transform: rotate(-360deg);
    color: black;
    font-size: 50%;
  }
}
</style>
<div id="animation">
<ul class="solarsystem">
  <li class="sun"><span>Sun</span></li>
  <li class="mercury"><span>Mercury</span></li>
  <li class="venus"><span>Venus</span></li>
  <li class="earth"><span>Earth<span class="moon">Moon</span></span>
  </li>
  <li class="mars"><span>Mars</span></li>
  <li class="asteroids_meteorids"><span>Asteroids</span></li>
  <li class="jupiter"><span>Jupiter</span></li>
</ul>
</div>`

document.body.insertBefore(div, root)
render(<App />, root)
// const root = createRoot(document.getElementById('root'))
// root.render(<App />)
