import { h, render, useState, Fragment, useEffect } from './fre'


const App = () => {
    useEffect(()=>{
        console.log(123)
    },[])
    const [count, setCount] = useState(0)
    console.log(count)
    return <>
        <button onClick={() => setCount(count + 1)}>
            {count}
        </button>
    </>
}
render(<App />, document.body)