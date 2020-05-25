type Key = FreText;
interface RefObject<T> { current: T }

type RefCallback<T> = { bivarianceHack(instance: T | null): void }['bivarianceHack']
type Ref<T = any> = RefCallback<T> | RefObject<T> | null

interface Attributes extends Record<string, any> {
    key?: Key
    children?: FreNode;
    ref?: Ref
}

interface FC<P extends Attributes = {}> {
    (props: P): FreElement<P> | null;
    fiber?: IFiber;
    tag?: number;
    type?: string;
}

interface FreElement<P extends Attributes = any, T = string> {
    type: T;
    props: P;
}

type HookTpes = 'list' | 'effect' | 'layout';

interface IHook {
    list: IEffect[];
    layout: IEffect[];
    effect: IEffect[];
}

type IRef = (e: HTMLElement | undefined) => void | { current?: HTMLElement };

type FiberMap<P> = Record<string, IFiber<P>>;

interface IFiber<P extends Attributes = any> {
    key?: string;
    dirty?: boolean | number;
    tag: number;
    type: string | FC<P>;
    op: number;
    parentNode: HTMLElementEx;
    node: HTMLElementEx;
    kids?: FiberMap<P>;
    parent?: IFiber<P>;
    sibling?: IFiber<P>;
    last?: IFiber<P>;
    child?: IFiber<P>;
    done?: () => void;
    ref: IRef;
    hooks: IHook;
    lastProps: P;
    insertPoint: IFiber | null;
    props: P;
    oldProps?: P;
}

type HTMLElementEx = HTMLElement & { last: IFiber | null };
type IEffect = [Function?, number?, Function?];

type FreText = string | number;
type FreNode = FreText | FreElement | FreNode[] | boolean | null | undefined;
type SetStateAction<S> = S | ((prevState: S) => S);
type Dispatch<A> = (value: A) => void;
type Reducer<S, A> = (prevState: S, action: A) => S;
type IVoidCb = () => void;
type EffectCallback = () => void | (IVoidCb | undefined);
type DependencyList = ReadonlyArray<any>;

interface PropsWithChildren {
    children?: FreNode;
}


type ITaskCallback = ((time: number | boolean) => boolean) | boolean | null;

interface ITask {
    callback?: ITaskCallback;
    startTime: number;
    dueTime: number;
}


// #region - Heap

const NOWORK = 0;
const PLACE = 1;
const UPDATE = 2;
const DELETE = 3;
const SVG = 4;

let preCommit: IFiber | undefined;
let currentFiber: IFiber;
let WIP: IFiber | undefined;
let updateQueue: IFiber[] = [];
let commitQueue: IFiber[] = [];

const isArr = Array.isArray;
const isStr = (s: FreNode): boolean => typeof s === 'string' || typeof s === 'number';
const isFn = (fn: Function | string): boolean => typeof fn === 'function'

const MEMO = 0;

export function push(heap: ITask[], node: ITask): void {
    const i = heap.length;
    heap.push(node);
    siftUp(heap, node, i);
}

export function pop(heap: ITask[]): ITask | null {
    const first = heap[0];
    if (!first) return null;
    const last = heap.pop();
    if (last !== first) {
        heap[0] = last!;
        siftDown(heap, last!, 0);
    }
    return first;
}

function siftUp(heap: ITask[], node: ITask, i: number): void {
    while (i > 0) {
        const pi = (i - 1) >>> 1;
        const parent = heap[pi];
        if (cmp(parent, node) <= 0) return;
        heap[pi] = node;
        heap[i] = parent;
        i = pi;
    }
}

function siftDown(heap: ITask[], node: ITask, i: number): void {
    for (;;) {
        const li = i * 2 + 1;
        const left = heap[li];
        if (li >= heap.length) return;
        const ri = li + 1;
        const right = heap[ri];
        const ci = ri < heap.length && cmp(right, left) < 0 ? ri : li;
        const child = heap[ci];
        if (cmp(child, node) > 0) return;
        heap[ci] = node;
        heap[i] = child;
        i = ci;
    }
}

function cmp(a: ITask, b: ITask): number {
    return a.dueTime - b.dueTime;
}

export function peek(heap: ITask[]) : ITask {
    return heap[0] || null;
}

// #endregion

// #region schedule

let taskQueue: ITask[] = [];
let currentCallback: ITaskCallback | undefined;
let frameDeadline = 0;
const frameLength = 1000 / 60;

export function scheduleCallback(callback: ITaskCallback): void {
    const currentTime = getTime();
    const startTime = currentTime;
    const timeout = 3000;
    const dueTime = startTime + timeout;

    let newTask: ITask = {
        callback,
        startTime,
        dueTime
    };

    push(taskQueue, newTask);
    currentCallback = flush as ITaskCallback;
    planWork();
}

function flush(iniTime: number): boolean {
    let currentTime = iniTime;
    let currentTask = peek(taskQueue);

    while (currentTask) {
        const didout: boolean = currentTask.dueTime <= currentTime;
        if (!didout && shouldYeild()) break;

        let callback = currentTask.callback;
        currentTask.callback = undefined;

        if (typeof callback === 'function') {
            let next = callback(didout);
            next ? (currentTask.callback = next) : pop(taskQueue);
        }

        currentTask = peek(taskQueue);
        currentTime = getTime();
    }

    return !!currentTask;
}

function flushWork(): void {
    if (typeof currentCallback === 'function') {
        let currentTime = getTime();
        frameDeadline = currentTime + frameLength;
        let more = currentCallback(currentTime);
        more ? planWork() : (currentCallback = undefined);
    }
}

const planWork: (cb?: IVoidCb | undefined) => number | void = (() => {
    if (typeof MessageChannel !== 'undefined') {
        const { port1, port2 } = new MessageChannel();
        port1.onmessage = flushWork;
        return (cb?: IVoidCb) => (cb ? requestAnimationFrame(cb) : port2.postMessage(null));
    }
    return (cb?: IVoidCb) => setTimeout(cb || flushWork);
})();

function shouldYeild(): boolean {
    return getTime() >= frameDeadline;
}

const getTime = () => performance.now();

// #endregion

// #region - Hooks

let cursor = 0;

function resetCursor() { cursor = 0; }

export function useState<T>(initState: T): [T, Dispatch<SetStateAction<T>>] {
    return useReducer(undefined, initState); 
}

export function useReducer<S, A, Dependency = any>(reducer?: Reducer<S, A>, initState?: S): [S, Dispatch<A>] {
    const [hook, current]: [[S | A, Dependency], IFiber] = getHook<S>(cursor++);
    const setter = (value: A | Dispatch<A>) => {
        let newValue = reducer
            ? reducer((hook as [S, Dependency])[0], value as A)
            : isFn(value as Dispatch<A>)
              ? (value as Dispatch<A>)((hook as [A, Dependency])[0])
              : value;
        if (newValue !== hook[0]) {
            (hook as [S | A | Dispatch<A> | void, Dependency])[0] = newValue;
            scheduleWork(current);
        }
    }

    if (hook.length) {
        return [hook[0] as S, setter];
    } else {
        hook[0] = initState as S;
        return [initState!, setter];
    }
}

export function useEffect(cb: EffectCallback, deps?: DependencyList): void {
    return effectImpl(cb, deps!, 'effect');
}

export function useLayout(cb: EffectCallback, deps?: DependencyList): void {
    return effectImpl(cb, deps!, 'layout');
}

function effectImpl(cb: EffectCallback, deps: DependencyList, key: HookTpes ): void {
    let [hook, current] = getHook(cursor++);
    if (isChanged(hook[1], deps)) {
        hook[0] = useCallback(cb, deps);
        hook[1] = deps;
        current.hooks[key].push(hook);
    }
}

export function useMemo<S = Function>(cb: () => S, deps?: DependencyList): S {
    let hook = getHook<S>(cursor++)[0];
    if (isChanged(hook[1], deps!)) {
        hook[1] = deps;
        return (hook[0] = cb());
    }
    return hook[0];
}

export function useCallback<T extends (...args: any[]) => void>(cb: T, deps?: DependencyList): T {
    return useMemo(() => cb, deps);
}

export function useRef<T>(current: T): RefObject<T> {
    return useMemo(() => ({ current }), []);
}

export function getHook<S = Function | undefined, Dependency = any>(cursor: number): [[S, Dependency], IFiber] {
    const current: IFiber<any> = getCurrentFiber();
    let hooks = current.hooks || (current.hooks = { list: [], effect: [], layout: [] });
    if (cursor >= hooks.list.length) {
        hooks.list.push([] as IEffect);
    }
    return [hooks.list[cursor] as unknown as [S, Dependency], current];
}

export function isChanged(a: DependencyList, b: DependencyList) {
    return !a || b.some((arg, index) => arg !== a[index]);
}

// #region H

export function h<P extends Attributes = {}>(type: FC<P>, attrs: P, ...args: FreNode[]): Partial<IFiber> {
    let props = attrs || {};
    let key = props.key || null;
    let ref = props.ref || null;
    let children: FreNode[] = [];

    for (let i = 0; i < args.length; i++) {
        let vnode: FreNode | FreNode[] = args[i];
        if (vnode === null || vnode === undefined || vnode === true || vnode === false) {
            // useless value
        } else if (isStr(vnode as string)) {
            children.push(createText(vnode));
        } else {
            while (isArr(vnode as FreNode[]) && (vnode as FreNode[]).some(v => isArr(v))) {
                vnode = [...vnode as FreNode[]];
            }
            children.push(vnode);
        }
    }

    if (children.length) {
        props.children = children.length === 1 ? children[0] : children;
    }

    delete props.key;
    delete props.ref;

    return { type, props, key, ref } as Partial<IFiber>;
}

export function createText(vnode: FreNode): FreElement {
    return { type: 'text', props: { nodeValue: vnode } };
}

export function Fragment(props: PropsWithChildren): FreNode {
    return props.children;
}

export function memo<P extends Attributes = {}>(fn: IFiber<P>): IFiber<P> {
    fn.tag = MEMO;
    return fn;
}

// #region - DOM

export function updateElement<P extends Attributes>(dom: DOM, oldProps: P, newProps: P) {
    const allProps = { ...oldProps, ...newProps } as P;
    for (let name in allProps) {
        let oldValue = oldProps[name];
        let newValue = newProps[name];

        if (oldValue === newValue || name === 'children') {
            // nothing
        } else if (name === 'style') {
            // stryles
            const attrs = { ...oldValue, ...newValue } as HTMLElement['style'];
            for (const k in attrs) {
                if (!(oldValue && newValue && oldValue[k] === newValue[k])) {
                    (dom as HTMLElement).style[k] = (newValue && newValue[k]) || '';
                }
            }
        } else if (name.substr(0, 2) === 'on') {
            // events
            name = name.slice(2).toLowerCase() as Extract<keyof P, string>;
            if (oldValue) dom.removeEventListener(name, oldValue);
            dom.addEventListener(name, newValue);
        } else if (name in dom && !(dom instanceof SVGElement)) {
            // set
            // (dom as HTMLElement)[name] = newValue === null ? '' : newValue;
            (dom as HTMLElement).setAttribute(name, newValue === null ? '' : newValue);
        } else if (newValue == null || newValue === false) {
            (dom as HTMLElement).removeAttribute(name);
        } else {
            (dom as HTMLElement).setAttribute(name, newValue);
        }
    }
}

type DOM = HTMLElement | SVGElement | Text;

export function createElement<P = Attributes>(fiber: IFiber) {
    const dom: DOM =
        fiber.type === 'text'
            ? document.createTextNode('')
            : fiber.tag === SVG
                ? document.createElementNS('http://www.w3.org/2000/svg', fiber.type as string)
                : document.createElement(fiber.type as string);
    updateElement<P>(dom, {} as P, fiber.props as P);
    return dom;
}

// #endregion

// #region - Reconciler

export function render(vnode: FreElement, node: Element | Document | DocumentFragment | Comment, done?: () => void): void {
    const rootFiber = {
        node,
        props: { children: vnode },
        done
    } as IFiber;
    scheduleWork(rootFiber)
}

export function scheduleWork(fiber: IFiber): void {
    if (!fiber.dirty && (fiber.dirty = true)) {
        updateQueue.push(fiber);
    }
    scheduleCallback(reconcileWork as ITaskCallback);
}


function reconcileWork(didout: boolean): boolean | null | ITaskCallback {
    if (!WIP) WIP = updateQueue.shift();
    while (WIP && (!shouldYeild() || didout)) {
        WIP = reconcile(WIP);
    }
    if (!didout && WIP) {
        return reconcileWork.bind(null) as ITaskCallback;
    }
    if (preCommit) commitWork(preCommit);
    return null;
}

function reconcile(WIP: IFiber): IFiber | undefined {
    WIP.parentNode = getParentNode(WIP) as HTMLElementEx;
    isFn(WIP.type) ? updateHOOK(WIP) : updateHost(WIP);
    WIP.dirty = WIP.dirty ? false : 0;
    WIP.oldProps = WIP.props;
    commitQueue.push(WIP);

    if (WIP.child) return WIP.child
    while (WIP) {
        if (!preCommit && WIP.dirty === false) {
            preCommit = WIP;
            return undefined;
        }
        if (WIP.sibling) {
            return WIP.sibling;
        }
        WIP = WIP.parent!;
    }
}

function updateHOOK<P = Attributes>(WIP: IFiber): void {
    if (
        (WIP.type as FC<P>).tag === MEMO &&
        WIP.dirty == 0 &&
        !shouldUpdate<P>(WIP.oldProps, WIP.props)
    ) {
        cloneChildren(WIP);
        return;
    }
    currentFiber = WIP;
    (WIP.type as FC<P>).fiber = WIP;
    resetCursor();
    let children = (WIP.type as FC<P>)(WIP.props);
    if (isStr(children)) {
        children = createText(children);
    }
    reconcileChildren(WIP, children);
}

function updateHost(WIP: IFiber): void {
    if (!WIP.node) {
        if (WIP.type === 'svg') WIP.tag = SVG;
        WIP.node = createElement(WIP) as HTMLElementEx;
    }
    let p = WIP.parentNode || {};
    WIP.insertPoint = (p as HTMLElementEx).last || null;
    (p as HTMLElementEx).last = WIP;
    (WIP.node as HTMLElementEx).last = null;
    reconcileChildren(WIP, WIP.props.children);
}

function getParentNode(fiber: IFiber): HTMLElement | undefined {
    while ((fiber = fiber.parent!)) {
        if (!isFn(fiber.type)) { return fiber.node }
    }
}

function reconcileChildren<P = Attributes>(WIP: IFiber, children: FreNode): void {
    if (!children) return;
    delete WIP.child;
    const oldFibers: FiberMap<P> = WIP.kids!;
    const newFibers: FiberMap<P> = (WIP.kids = hashfy(children as IFiber));

    let reused: FiberMap<P> = {};

    for (const k in oldFibers) {
        let newFiber = newFibers[k];
        let oldFiber = oldFibers[k];

        if (newFiber && newFiber.type === oldFiber.type) {
            reused[k] = oldFiber;
        } else {
            oldFiber.op = DELETE;
            commitQueue.push(oldFiber);
        }
    }

    let prevFiber: IFiber | undefined;
    let alternate: IFiber | undefined;

    for (const k in newFibers) {
        let newFiber = newFibers[k];
        let oldFiber = reused[k];

        if (oldFiber) {
            alternate = createFiber(oldFiber, UPDATE);
            newFiber.op = UPDATE;
            newFiber = { ...alternate, ...newFiber };
            newFiber.lastProps = alternate.props;
            if (shouldPlace(newFiber)) {
                newFiber.op = PLACE;
            }
        } else {
           newFiber = createFiber(newFiber, PLACE);
        }

        newFibers[k] = newFiber;
        newFiber.parent = WIP;

        if (prevFiber) {
            prevFiber.sibling = newFiber;
        } else {
            if (WIP.tag === SVG) newFiber.tag = SVG;
            WIP.child = newFiber;
        }
        prevFiber = newFiber;
    }

    if (prevFiber) prevFiber.sibling = undefined;
}

function cloneChildren(fiber: IFiber): void {
    if (!fiber.child) return;
    let child = fiber.child;
    let newChild = child;
    newChild.op = NOWORK;
    fiber.child = newChild;
    newChild.parent = fiber;
    newChild.sibling = undefined;
}

function shouldUpdate<P = Attributes>(a: P, b: P): boolean {
    for (let i in a) if (!(i in b)) return true;
    for (let i in b) if (a[i] !== b[i]) return true;
    return false;
}

function shouldPlace(fiber: IFiber): string | boolean | undefined {
    let p = fiber.parent!;
    if (isFn(p.type)) return p.key && !p.dirty;
    return fiber.key;
}

function commitWork(fiber: IFiber): void {
    commitQueue.forEach(c => c.parent && commit(c));
    fiber.done && fiber.done();
    commitQueue = [];
    preCommit = undefined;
    WIP = undefined;
}


function commit(fiber: IFiber): void {
    const { op, parentNode, node, ref, hooks } = fiber
    if (op === NOWORK) {
        // do nothing
    } else if (op === DELETE) {
        hooks && hooks.list.forEach(cleanup);
        if (fiber.kids) { cleanupRef(fiber.kids); }
        while (isFn(fiber.type)) fiber = fiber.child!;
        parentNode.removeChild(fiber.node);
    } else if (isFn(fiber.type)) {
        if (hooks) {
            hooks.layout.forEach(cleanup);
            hooks.layout.forEach(effect);
            hooks.layout = [];
            planWork(() => {
                hooks.effect.forEach(cleanup);
                hooks.effect.forEach(effect);
                hooks.effect = [];
            })
        }
    } else if (op === UPDATE) {
        updateElement(node, fiber.lastProps, fiber.props)
    } else {
        const point = fiber.insertPoint ? fiber.insertPoint.node : null
        const after = point ? point.nextSibling : parentNode.firstChild
        if (after === node) return
        if (after === null && node === parentNode.lastChild) return
        parentNode.insertBefore(node, after)
    }
    refer(ref, node)
}

function createFiber(vnode: IFiber, op: number): IFiber {
    return { ...vnode, op } as IFiber;
}

function hashfy<P>(c: IFiber<P>): FiberMap<P> {
    const out: FiberMap<P> = {};
    isArr(c)
        ? c.forEach((v, i) => isArr(v)
            ? v.forEach((vi, j) => (out[hs(i, j, vi.key)] = vi))
            : (out[hs(i, null, v.key)] = v)
          )
        : (out[hs(0, null, c.key)] = c);
    return out;
}

function refer(ref: IRef, dom?: HTMLElement): void {
    if (!ref) { return; }
    isFn(ref) ? ref(dom) : ((ref as { current?: HTMLElement }).current = dom);
}

function cleanupRef<P = Attributes>(kids: FiberMap<P>): void {
    for (const k in kids) {
        const kid = kids[k];
        refer(kid.ref);
        if (kid.kids) cleanupRef(kid.kids);
    }
}

const cleanup = (e: IEffect): void => e[2] && e[2]();

const effect = (e: IEffect): void => {
    const res = e[0]!()
    if (isFn(res)) e[2] = res
}

export const getCurrentFiber = (): IFiber => currentFiber

const hs = (i: number, j: string | number | null, k?: string): string =>
    k !== null && j !== null
        ? '.' + i + '.' + k
        : j !== null
            ? '.' + i + '.' + j
            : k !== null
                ? '.' + k
                : '.' + i

// #endregion

const Fre = {
    h,
    Fragment,
    render,
    scheduleWork,
    useState,
    useReducer,
    useEffect,
    useMemo,
    useCallback,
    useRef,
    memo
}

export default Fre
