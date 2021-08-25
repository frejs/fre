import { render, Fragment, h, useState } from '../../src/index'

const App = () => {
	const [count1, setCount1] = useState(0)
	const [status, setStatus] = useState(false)
	const setCountAction1 = () => {
		setCount1(state => {
			return state + 1
		})
		setStatus(!status)
	}
	return (
		<div>
			<article onClick={setCountAction1}>
				{count1} - {status}
			</article>
		</div>
	)
}
render(<App />, document.getElementById('app'))