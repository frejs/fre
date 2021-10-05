import {DOM, IFiber} from "../type";
import {isStr, LANE} from "../reconcile";
import {updateElement} from "../dom";

const filterAttribute = ['nodeValue'];

class ServerNode {
    attribute: {};
    children: ServerNode[];
    nodeType: string;
    nameSpace: string;
    textContent: string;

    constructor(nodeType) {
        this.attribute = {};
        this.children = [];
        this.nodeType = nodeType;
    }

    removeAttribute(key) {
        delete this.attribute[key]
    }

    setAttribute(key, value) {
        this.attribute[key] = value;
    }

    appendChild(child) {
        this.children.push(child);
    }

    insertBefore(node, after) {
        const afterNodeIndex = after && this.children.length > 0
            ? this.children.findIndex((node) => node === after)
            : 0;
        this.children.splice(afterNodeIndex, 0, node);
    }

    removeChild(childNode) {
        if (childNode && this.children.length > 0) {
            const willRemoveIndex = this.children.findIndex((node) => node === childNode);
            if (willRemoveIndex !== -1) {
                this.children.splice(willRemoveIndex, 1, childNode);
            }
        }
    }

    getAttributeString() {
        let string = '';
        const attrKeys = Object.keys(this.attribute);
        // title="2323"
        attrKeys.forEach(key => {
            if (isStr(this.attribute[key])) {
                string += `${key}="${this.attribute[key]}" `;
            }
        });
        return string.trimEnd()
    }

    genString() {
        const attributeString = this.getAttributeString();
        let string = '';
        let beforeChunk = '';
        let afterChunk = '';
        let tagString = '';

        if (this.nodeType) {
            tagString = `${this.nodeType} ${attributeString}`.trimEnd();
        }

        if (this.children.length === 0) {
            if (this.nodeType && this.nodeType === '#text') {
                string += this.textContent || this.attribute.nodeValue;
            } else if (this.nodeType) {
                string += `<${tagString}/>`
            }
        } else if (this.nodeType) {
            beforeChunk += `<${tagString}>`;
            afterChunk = `</${this.nodeType}>`;
        }

        this.children.forEach(childNode => {
            string += childNode.genString()
        });
        return beforeChunk + string + afterChunk + '\n';
    }

    removeEventListener() {
    }

    addEventListener() {
    }
}

export class ServerElement {
    static createElement(nodeType) {
        return new ServerNode(nodeType);
    }

    static createElementNS(nameSpace, type) {
        const node = new ServerNode(type);
        node.nameSpace = nameSpace;
        return node;
    }

    static createTextNode(text) {
        const node = new ServerNode('#text');
        node.textContent = text;
        return node;
    }
}

export const createServerElement = (fiber: IFiber) => {
    const dom =
        fiber.type === ""
            ? ServerElement.createTextNode('')
            : fiber.lane & LANE.SVG
            ? ServerElement.createElementNS("http://www.w3.org/2000/svg", fiber.type as string)
            : ServerElement.createElement(fiber.type);
    updateElement(dom, {}, fiber.props);
    return dom
};
