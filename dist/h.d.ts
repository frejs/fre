declare type Key = string | number | any;
interface Attributes {
    key?: Key;
    jsx?: boolean;
}
declare type RenderableProps<P> = Readonly<P & Attributes>;
interface FunctionComponent<P = {}> {
    (props: RenderableProps<P>, context?: any): VNode<any> | null;
    displayName?: string;
    defaultProps?: Partial<P>;
}
declare type ComponentType<P = {}> = FunctionComponent<P>;
interface VNode<P = {}> {
    type: ComponentType<P> | string | null;
    props?: P | string | number | null;
    key?: Key;
}
export declare function h<P>(type: string | ComponentType<any>, props: Attributes & P | null, ...rest: Array<VNode<any> | Array<VNode<any>> | null | boolean>): VNode<any>;
export {};
