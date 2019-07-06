import { merge } from './util'

type Key = string | number | any;

interface Attributes {
  key?: Key;
  jsx?: boolean;
}

type RenderableProps<P> = Readonly<
P & Attributes
>;

interface FunctionComponent<P = {}> {
  (props: RenderableProps<P>, context?: any): VNode<any> | null;
  displayName?: string;
  defaultProps?: Partial<P>;
}

// FIXME: do not support class component yet
type ComponentType<P = {}> = FunctionComponent<P>;

interface VNode<P = {}> {
  type: ComponentType<P> | string | null;
  props?: P | string | number | null;
  key?: Key;
}

export function h<P>(type: string | ComponentType<any>, props: Attributes & P | null, ...rest: Array<VNode<any> | Array<VNode<any>> | null | boolean>): VNode<any> {
  let children: VNode<any> | Array<VNode<any>> = []
  let length = arguments.length

  while (rest.length) {
    let vnode = rest.pop()
    if (vnode && Array.isArray(vnode)) {
      for (length = vnode.length; length--;) rest.push(vnode[length])
    } else if (vnode === null || vnode === true || vnode === false) {
      // @ts-ignore
      vnode = { type: () => {} }
    } else if (typeof vnode === 'function') {
      children = vnode
    } else {
      children.push(
        typeof vnode === 'object'
          ? vnode
          : { type: 'text', props: { nodeValue: vnode } }
      )
    }
  }
  return {
    type,
    props: merge(props, { children }),
    key: props && props.key
  }
}
