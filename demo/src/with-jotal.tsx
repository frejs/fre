import { useState, useEffect, render, h } from "../../src/index";

export const atom = (read, write?) => {
    if (typeof read === "function") {
        return { read, write };
    }
    const config = {
        init: read,
        read: (get) => get(config),
        write:
            write ||
            ((get, set, arg) => {
                if (typeof arg === "function") {
                    set(config, arg(get(config)));
                } else {
                    set(config, arg);
                }
            })
    };
    return config;
};

const atomStateMap = new WeakMap();
const getAtomState = (atom) => {
    let atomState = atomStateMap.get(atom);
    if (!atomState) {
        atomState = {
            value: atom.init,
            listeners: new Set(),
            dependents: new Set()
        };
        atomStateMap.set(atom, atomState);
    }
    return atomState;
};
const readAtom = (atom) => {
    const atomState = getAtomState(atom);
    const get = (a) => {
        if (a === atom) {
            return atomState.value;
        }
        const aState = getAtomState(a);
        aState.dependents.add(atom); // XXX add only
        return readAtom(a); // XXX no caching
    };
    const value = atom.read(get);
    atomState.value = value;
    return value;
};
const notify = (atom) => {
    const atomState = getAtomState(atom);
    atomState.dependents.forEach((d) => {
        if (d !== atom) notify(d);
    });
    atomState.listeners.forEach((l) => l());
};
const writeAtom = (atom, value) => {
    const atomState = getAtomState(atom);
    const get = (a) => {
        const aState = getAtomState(a);
        return aState.value;
    };
    const set = (a, v) => {
        if (a === atom) {
            atomState.value = v;
            notify(atom);
            return;
        }
        writeAtom(a, v);
    };
    atom.write(get, set, value);
};

export const useAtom = (atom) => {
    const [value, setValue] = useState(null);
    useEffect(() => {
        const callback = () => setValue(readAtom(atom));
        const atomState = getAtomState(atom);
        atomState.listeners.add(callback);
        callback();
        return () => atomState.listeners.delete(callback);
    }, [atom]);
    const setAtom = (nextValue) => {
        writeAtom(atom, nextValue);
    };
    return [value, setAtom];
};


const countAtom = atom(0);
const doubleAtom = atom((get) => get(countAtom) * 2);

const Counter = () => {
    const [count, setCount] = useAtom(countAtom);
    const inc = () => setCount(count + 1);
    return (
        <div>
            {count} <button onClick={inc}>+1</button>
        </div>
    );
};

const DoubleCounter = () => {
    const [count] = useAtom(doubleAtom);
    return <div>double: {count}</div>;
};

export default function App() {
    return [<Counter />,
    <DoubleCounter />]

}

render(<App />, document.getElementById("app"))