import {useState, h, useEffect, render} from "../../../src/index"

function B({i}) {
    console.log('子组件', i);
    return i
}

function App() {
    console.log('父组件');
    const [count, setCount] = useState(0);

    useEffect(() => {
        setCount(count + 1);
    }, []);

    return (
        <div>
            <B i={123}/>
            <B i={456}/>
            <h1 title={'hello'}>{count}</h1>
            <button onClick={() => setCount(count + 1)}>+</button>
        </div>
    )
}

export default App;
