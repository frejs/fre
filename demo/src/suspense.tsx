import { render, lazy, Suspense, h, useState } from '../../src/index'

const Lazy = lazy(() => {
    return new Promise(resolve =>
        setTimeout(
            () =>
                resolve({
                    default: () => <div>Hello2</div>
                }),
            3000
        )
    )
})
const Lazy1 = lazy(() => {
    return new Promise(resolve =>
        setTimeout(
            () =>
                resolve({
                    default: () => <div>Hello1</div>
                }),
            2000
        )
    )
})
export function App() {
    const [count, setCount] = useState(0)
    return (
        <div>
            <button onClick={() => setCount(prev => prev + 1)}>{count}</button>
            <Suspense fallback={<div>loading...</div>}>
                <Lazy />
            </Suspense>
            <Suspense fallback={<div>loading...</div>}>
                <Lazy1 />
                <div>222</div>
            </Suspense>
        </div>
    )
}

render(<App />, document.getElementById('app'))