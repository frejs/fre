import { h, render, useState, Fragment } from "../../src/index"
function App() {
    const [bool, setbool] = useState(true)

    return <div onClick={() => setbool(!bool)}>
        {bool ? <Li /> : <div>removed</div>}</div>
}

function Li() {
    return <li>111</li>
}

render(<App />, document.getElementById("app"))
