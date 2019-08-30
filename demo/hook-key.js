import { h, render, useState } from 'fre';


//import { createElement, render, useState, useEffect } from 'preact/compat';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      Count: {count}
      <button onClick={() => setCount(count + 1)}>
        +
      </button>
    </div>
  );
}

function App() {
  const [counters, setCounters] = useState(1);

  return <div>
    {new Array(counters).fill().map(i => (
      <Counter/>
    ))}
    <button onClick={() => setCounters(counters + 1)}>
      Add
    </button>
    <button onClick={() => setCounters(counters + 1)}>
      Add
    </button>
  </div>
}

render(<App/>, document.body);
