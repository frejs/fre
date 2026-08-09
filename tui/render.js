// input.ts
import EventEmitter from "events";
var Input = class {
  ee;
  queue = [];
  constructor() {
    this.ee = new EventEmitter();
  }
  terminate() {
    this.ee.removeAllListeners();
  }
  onData = (key) => {
    const raw = key.toString();
    const chunks = this.parse(raw);
    if (chunks.length > 1) this.queue = chunks.slice(1);
    this.ee.emit("data", chunks[0], () => {
      this.queue = [];
      return raw;
    });
  };
  parse(input) {
    const chars = input.split("");
    let res;
    const chunks = [];
    while (res = chars.shift()) {
      if (["", "\x1B"].includes(res)) {
        res += chars.shift() || "";
        if (res.endsWith("[")) {
          res += chars.shift() || "";
          if (res.endsWith("1") || res.endsWith("4") || res.endsWith("5") || res.endsWith("6")) {
            res += chars.shift() || "";
          } else if (res.endsWith("M")) {
            res += chars.shift() || "";
            res += chars.shift() || "";
            res += chars.shift() || "";
          }
        }
      }
      chunks.push(res);
    }
    return chunks;
  }
  on(callback) {
    if (this.ee.listenerCount("data") === 0) process.stdin.on("data", this.onData);
    this.ee.on("data", callback);
  }
  off(callback) {
    this.ee.off("data", callback);
    if (this.ee.listenerCount("data") === 0) process.stdin.off("data", this.onData);
  }
  render() {
    const chunk2 = this.queue.shift();
    if (chunk2) setTimeout(() => this.ee.emit("data", chunk2), 0);
  }
};

// reconciler.ts
import { computeLayout } from "./flex.js"
var currentUpdatePriority = 0;
var TextElement = class {
  props;
  parent;
  children;
  constructor(props = {}) {
    this.props = props;
    this.parent = null;
    this.children = [];
  }
  terminate() {
    this.children = [];
  }
  appendChild(child) {
    this.children = [...this.children, child];
  }
  commitUpdate(nextProps) {
    this.props = nextProps;
  }
  insertBefore(child, beforeChild) {
    const index = this.children.indexOf(beforeChild);
    if (index !== -1) this.children.splice(index, 0, child);
  }
  removeChild(child) {
    const index = this.children.indexOf(child);
    if (index !== -1) this.children.splice(index, 1);
  }
  measureText(limit) {
    const renderToString = (node) => {
      if (!node) return ''
      if (node instanceof TextInstance) return node.value
      if (node instanceof TextElement) {
        const { children } = node
        if (!children || children.length === 0) return node.props?.children ?? ''
        return children.map(renderToString).join('')
      }
      return String(node)
    }
    const text = renderToString(this)
    const lines = text.split('\n')
    const width = Math.max(...lines.map((l) => l.length), 0)
    const height = lines.length
    return { width, height }
  }
};
var TextInstance = class {
  value;
  constructor(value) {
    this.value = value;
  }
  commitTextUpdate(value) {
    this.value = value;
  }
  toString() {
    return this.value;
  }
  measureText(limit) {
    const lines = (this.value || '').toString().split('\n')
    const width = Math.max(...lines.map((l) => l.length), 0)
    const height = lines.length
    return { width, height }
  }
};
var reconciler_default = (resetAfterCommit) => {
  const reconciler = Reconciler({
    supportsMutation: true,
    appendChild(parentInstance, child) {
      parentInstance.appendChild(child);
    },
    appendChildToContainer(container, child) {
      container.appendChild(child);
    },
    appendInitialChild(parentInstance, child) {
      parentInstance.appendChild(child);
    },
    clearContainer() {
    },
    commitTextUpdate(textInstance, _oldText, newText) {
      textInstance.commitTextUpdate(newText);
    },
    commitUpdate(instance, _type, _prevProps, nextProps) {
      instance.commitUpdate(nextProps);
    },
    createInstance(type, props) {
      if (type === "text") {
        return new TextElement(props);
      } else {
        throw new Error("must be <Text>");
      }
    },
    createTextInstance(text) {
      return new TextInstance(text);
    },
    detachDeletedInstance() {
    },
    finalizeInitialChildren() {
      return false;
    },
    getChildHostContext() {
      return {};
    },
    getPublicInstance(instance) {
      return instance;
    },
    getRootHostContext(rootContainer) {
      return rootContainer;
    },
    insertBefore(parentInstance, child, beforeChild) {
      parentInstance.insertBefore(child, beforeChild);
    },
    insertInContainerBefore(container, child, beforeChild) {
      container.insertBefore(child, beforeChild);
    },
    prepareForCommit() {
      return null;
    },
    // @ts-expect-error any
    prepareUpdate() {
      return true;
    },
    removeChild(parentInstance, child) {
      parentInstance.removeChild(child);
    },
    removeChildFromContainer(container, child) {
      container.removeChild(child);
    },
    resetAfterCommit() {
      resetAfterCommit();
    },
    shouldSetTextContent() {
      return false;
    },
    setCurrentUpdatePriority(newPriority) {
      currentUpdatePriority = newPriority;
    },
    getCurrentUpdatePriority() {
      return currentUpdatePriority;
    },
    resolveUpdatePriority() {
      return currentUpdatePriority !== 0 ? currentUpdatePriority : 16;
    },
    maySuspendCommit() {
      return false;
    }
  });
  return reconciler;
};

// screen.ts
var Screen = class {
  buffer;
  cursor = { x: 0, y: 0 };
  size = { x1: 0, y1: 0, x2: 0, y2: 0 };
  constructor() {
    this.buffer = this.generateBuffer();
  }
  generateBuffer() {
    this.size = { x1: 0, y1: 0, x2: process.stdout.columns, y2: process.stdout.rows };
    return [...Array(this.size.y2)].map(() => [...Array(this.size.x2)].map(() => [" ", {}]));
  }
  clearBuffer() {
    this.buffer = this.generateBuffer();
    this.cursor = { x: 0, y: 0 };
  }
  render(elements) {
    this.clearBuffer();
    this.renderElement(elements, { ...this.cursor, ...this.size });
  }
  stringAt(value, limit) {
    const percent = parseFloat(value);
    let diff = "";
    const index = value.search(/%[+-]\d+$/);
    if (index !== -1) diff = value.substring(index + 1);
    if (!value.endsWith("%" + diff) || isNaN(percent)) throw new Error("must be percent");
    return Math.round(limit / 100 * percent) + parseInt(diff || "0");
  }
  renderElement(element, prevBounds, prevProps = {}) {
    if (Array.isArray(element)) return element.forEach((i) => this.renderElement(i, prevBounds, prevProps));
    const { children, ...props } = element.props ?? { children: element };
    if (typeof props.x === "string")
      props.x = this.stringAt(props.x, props.absolute ? this.buffer[0].length : prevBounds.x2 - prevBounds.x);
    if (typeof props.y === "string")
      props.y = this.stringAt(props.y, props.absolute ? this.buffer.length : prevBounds.y2 - prevBounds.y);
    if (typeof props.width === "string")
      props.width = this.stringAt(props.width, props.absolute ? this.buffer[0].length : prevBounds.x2 - prevBounds.x);
    if (typeof props.height === "string")
      props.height = this.stringAt(props.height, props.absolute ? this.buffer.length : prevBounds.y2 - prevBounds.y);
    if (props.width !== void 0 && isNaN(props.width)) props.width = 0;
    if (props.height !== void 0 && isNaN(props.height)) props.height = 0;
    const x = props.x !== void 0 ? (props.absolute ? 0 : prevBounds.x) + props.x : this.cursor.x;
    const y = props.y !== void 0 ? (props.absolute ? 0 : prevBounds.y) + props.y : this.cursor.y;
    const x1 = props.x !== void 0 ? props.absolute ? props.x : Math.max(prevBounds.x, prevBounds.x + props.x) : prevBounds.x1;
    const y1 = props.y !== void 0 ? props.absolute ? props.y : Math.max(prevBounds.y, prevBounds.y + props.y) : prevBounds.y1;
    const x2 = props.width !== void 0 ? Math.min(props.absolute ? this.buffer[0].length : prevBounds.x2, props.width + x) : props.absolute ? this.buffer[0].length : prevBounds.x2;
    const y2 = props.height !== void 0 ? Math.min(props.absolute ? this.buffer.length : prevBounds.y2, props.height + y) : props.absolute ? this.buffer.length : prevBounds.y2;
    const bounds = { x, y, x1, y1, x2, y2 };
    this.cursor.x = bounds.x;
    this.cursor.y = bounds.y;
    const modifiers = Object.fromEntries(
      ["color", "background", "bold", "dim", "italic", "underline", "blinking", "inverse", "strikethrough"].map((i) => [i, props[i] ?? prevProps[i]]).filter((i) => i[1])
    );
    if ((props.background || props.clear) && (props.width || props.height))
      this.fill(bounds, props.absolute ? bounds : prevBounds, modifiers);
    if (Array.isArray(children) || children?.props) {
      this.renderElement(element.children, bounds, modifiers);
    } else if (typeof children === "number" || children) {
      const text = children.toString();
      if (text.includes("\n")) {
        const lines = children.toString().split("\n");
        lines.forEach((line, index) => {
          this.renderElement(line, bounds, modifiers);
          if (index < lines.length - 1) this.carret(prevBounds);
        });
      } else {
        this.cursor.x = this.put(text, bounds, modifiers);
      }
    }
    if (props.block) this.carret(prevBounds);
    if (props.width || props.height) {
      this.cursor.x = props.block ? prevBounds.x : bounds.x2;
      this.cursor.y = props.block ? bounds.y2 : prevBounds.y;
    }
  }
  fill(bounds, prevBounds, modifiers) {
    for (let y = bounds.y; y < bounds.y2; y++) {
      if (y < Math.max(0, prevBounds.y1) || y >= Math.min(prevBounds.y2, this.buffer.length)) continue;
      for (let x = bounds.x; x < bounds.x2; x++) {
        if (x < Math.max(0, prevBounds.x1) || x >= Math.min(prevBounds.x2, this.buffer[y].length)) continue;
        this.buffer[y][x] = [" ", modifiers];
      }
    }
  }
  put(text, bounds, modifiers) {
    const { x, y } = bounds;
    let i;
    for (i = 0; i < text.length; i++) {
      if (y < Math.max(0, bounds.y1) || y >= Math.min(this.buffer.length, bounds.y2)) break;
      if (x + i < Math.max(0, bounds.x1) || x + i >= Math.min(this.buffer[y].length, bounds.x2)) continue;
      this.buffer[y][x + i] = [text[i], modifiers];
    }
    return x + i;
  }
  carret(bounds) {
    this.cursor.x = bounds.x ?? 0;
    this.cursor.y++;
  }
};
var screen_default = Screen;

// term.ts
var ESC = "\x1B";
var Term = class {
  fullscreen = true;
  print = false;
  isResized = false;
  isMouseEnabled = false;
  prevBuffer;
  prevModifier = {};
  nextWritePrefix = "";
  size = { width: process.stdout.columns, height: process.stdout.rows };
  offset = { x: 0, y: 0 };
  cursor = { x: 0, y: 0 };
  maxCursor = { x: 0, y: 0 };
  result;
  async init(fullscreen, print) {
    this.fullscreen = fullscreen;
    this.print = print;
    process.stdout.on("resize", () => {
      this.isResized = true;
      this.size = { width: process.stdout.columns, height: process.stdout.rows };
    });
    process.on("exit", this.onExit);
    if (fullscreen) {
      this.append(`${ESC}[?1049h`);
      this.append(`${ESC}c`);
    } else {
      const cursor = await this.termGetCursor();
      this.offset = cursor;
    }
    this.append(`${ESC}[?25l`);
  }
  reinit() {
    this.prevModifier = {};
    this.prevBuffer = void 0;
    this.append(`${ESC}[?1049h${ESC}c${ESC}[?25l`);
  }
  onExit = (code) => {
    if (code !== 0) return;
    process.stdout.write(this.terminate());
    process.exit(0);
  };
  terminate() {
    process.off("exit", this.onExit);
    const sequence = [];
    if (this.fullscreen) {
      sequence.push(`${ESC}[?1049l`);
    } else {
      const y = this.maxCursor.y - this.cursor.y;
      if (y > 0) sequence.push(`${ESC}[${y}B`);
      const x = this.maxCursor.x - this.cursor.x + 1;
      if (x > 0) sequence.push(`${ESC}[${x}C`);
      sequence.push(`
`);
    }
    sequence.push(`${ESC}[?25h`);
    if (this.isMouseEnabled) sequence.push(`${ESC}[?1000l`);
    return sequence.join("");
  }
  append(value) {
    this.nextWritePrefix += value;
  }
  setResult(result) {
    this.result = result;
  }
  enableMouse() {
    this.append(`${ESC}[?1000h${ESC}[?1005h`);
    this.isMouseEnabled = true;
  }
  async termGetCursor() {
    process.stdin.setRawMode(true);
    process.stdout.write("\x1B[6n");
    return await new Promise((resolve) => {
      process.stdin.once("data", (data) => {
        const [x, y] = data.toString().slice(2, -1).split(";").reverse().map((i) => parseInt(i) - 1);
        resolve({ x, y });
      });
    });
  }
  parseHexColor(color) {
    if (!color.match(/^([\da-f]{6})|([\da-f]{3})$/i)) return;
    return (color.length === 4 ? color.substring(1, 4).split("").map((i) => i + i) : color.substring(1, 7).match(/.{2}/g)).map((i) => parseInt(i, 16));
  }
  parseColor(color, offset = 0) {
    if (typeof color === "number") {
      if (color < 0 || color > 255) throw new Error("color not found");
      return `${38 + offset};5;${color}`;
    }
    if (color.startsWith("#")) {
      const [r, g, b] = this.parseHexColor(color);
      return `${38 + offset};2;${r};${g};${b}`;
    }
    const names = {
      black: 30,
      red: 31,
      green: 32,
      yellow: 33,
      blue: 34,
      magenta: 35,
      cyan: 36,
      white: 37,
      brightblack: 90,
      brightred: 91,
      brightgreen: 92,
      brightyellow: 93,
      brightblue: 94,
      brightmagenta: 95,
      brightcyan: 96,
      brightwhite: 97
    };
    const colorFromName = names[color.toLowerCase()];
    if (colorFromName === void 0) throw new Error("color not found");
    return colorFromName + offset;
  }
  createModifierSequence(modifier) {
    if (JSON.stringify(modifier) === "{}") return "0";
    const { prevModifier } = this;
    const sequence = [];
    if (modifier.color !== prevModifier.color) sequence.push(modifier.color ? this.parseColor(modifier.color) : 39);
    if (modifier.background !== prevModifier.background)
      sequence.push(modifier.background ? this.parseColor(modifier.background, 10) : 49);
    if (modifier.bold !== prevModifier.bold) sequence.push(modifier.bold ? 1 : modifier.dim ? "22;2" : 22);
    if (modifier.dim !== prevModifier.dim) sequence.push(modifier.dim ? 2 : modifier.bold ? "22;1" : 22);
    if (modifier.italic !== prevModifier.italic) sequence.push(modifier.italic ? 3 : 23);
    if (modifier.underline !== prevModifier.underline) sequence.push(modifier.underline ? 4 : 24);
    if (modifier.blinking !== prevModifier.blinking) sequence.push(modifier.blinking ? 5 : 25);
    if (modifier.inverse !== prevModifier.inverse) sequence.push(modifier.inverse ? 7 : 27);
    if (modifier.strikethrough !== prevModifier.strikethrough) sequence.push(modifier.strikethrough ? 9 : 29);
    return sequence.join(";");
  }
  isIcon(char) {
    const code = char.charCodeAt(0);
    return code >= 9211 && code <= 9214 || [9829, 9889, 11096].includes(code) || code >= 57344 && code <= 64838;
  }
  render(buffer) {
    let full = false;
    let result = "";
    if (this.isResized) {
      if (this.fullscreen) {
        result += `${ESC}[H`;
        this.cursor = { x: 0, y: 0 };
        full = true;
      }
      this.isResized = false;
    }
    for (let y = 0; y < buffer.length; y++) {
      const line = buffer[y];
      const prevLine = this.prevBuffer?.[y];
      let includesEmoji = false;
      let includesIcon = false;
      const diffLine = full ? line : line.map((i, x) => {
        const [prevChar, prevModifier] = prevLine && prevLine[x] ? prevLine[x] : [" ", {}];
        const [char, modifier] = i;
        return prevChar !== char || JSON.stringify(prevModifier) !== JSON.stringify(modifier) ? i : null;
      }).filter((i) => i !== void 0);
      const chunks = {};
      let chunksAt = 0;
      diffLine.forEach((value, x) => {
        if (value === null) {
          chunksAt = x + 1;
          return;
        }
        const [char, modifier] = value;
        if (chunks[chunksAt] === void 0) chunks[chunksAt] = ["", ""];
        if (JSON.stringify(modifier) !== JSON.stringify(this.prevModifier)) {
          chunks[chunksAt][1] += `\x1B[${this.createModifierSequence(modifier)}m`;
          this.prevModifier = modifier;
        }
        chunks[chunksAt][0] += char;
        chunks[chunksAt][1] += char;
      });
      Object.entries(chunks).map(([index, value]) => {
        const [str, strWithModifiers] = value;
        const x = parseInt(index);
        if (/\p{Emoji}/u.test(str)) includesEmoji = true;
        if (!includesIcon && str.split("").find((i) => this.isIcon(i))) includesIcon = true;
        if (x === 0 && y === this.cursor.y + 1) {
          if (!this.fullscreen && y > this.maxCursor.y) {
            this.offset.y -= 1;
          }
          result += "\n";
        } else {
          if (!this.fullscreen && y > this.cursor.y && y > this.maxCursor.y) {
            const diff = y - this.maxCursor.y;
            result += "\n".repeat(diff);
            this.cursor = { y: this.cursor.y + diff, x: 0 };
            const rows = this.offset.y + y - (process.stdout.rows - 1);
            if (rows > 0) this.offset.y -= rows;
          }
          if (y !== this.cursor.y && x !== this.cursor.x) {
            result += `${ESC}[${y + 1 + this.offset.y};${x + 1}H`;
          } else if (y > this.cursor.y) {
            const diff = y - this.cursor.y;
            result += `${ESC}[${diff > 1 ? diff : ""}B`;
          } else if (y < this.cursor.y) {
            const diff = this.cursor.y - y;
            result += `${ESC}[${diff > 1 ? diff : ""}A`;
          } else if (x > this.cursor.x) {
            if (includesEmoji || includesIcon) {
              result += `${ESC}[G${ESC}[${x > 1 ? x : ""}C`;
            } else {
              const diff = x - this.cursor.x;
              result += `${ESC}[${diff > 1 ? diff : ""}C`;
            }
          } else if (x < this.cursor.x) {
            if (includesEmoji) {
              result += `${ESC}[G${ESC}[${x > 1 ? x : ""}C`;
            } else {
              const diff = this.cursor.x - x;
              result += `${ESC}[${diff > 1 ? diff : ""}D`;
            }
          }
        }
        result += strWithModifiers;
        this.cursor = { x: x + str.length, y };
      });
      if (this.cursor.x > this.maxCursor.x) this.maxCursor.x = this.cursor.x;
      if (this.cursor.y > this.maxCursor.y) this.maxCursor.y = this.cursor.y;
    }
    this.prevBuffer = buffer;
    if (this.nextWritePrefix) {
      result = this.nextWritePrefix + result;
      this.nextWritePrefix = "";
    }
    if (this.result !== void 0 || this.print) {
      result += this.terminate();
    }
    if (result) {
      if (this.print) return renderer_default.terminate(result);
      process.stdout.write(result);
    }
    if (this.result !== void 0) {
      renderer_default.terminate(this.result);
    }
  }
};
var term_default = Term;

// renderer.ts
import { spawnSync } from "child_process";
// 将 computeLayout 的结果应用到节点 props（使用绝对坐标）
function applyLayoutToProps(node) {
  if (!node || !node.children) return
  for (const child of node.children) {
    if (child.layout) {
      child.props = child.props || {}
      // Preserve explicit coordinates/flags set by user; otherwise write computed layout
      child.props.absolute = child.props.absolute ?? true
      if (child.props.x === undefined) child.props.x = child.layout.x
      if (child.props.y === undefined) child.props.y = child.layout.y
      if (child.props.width === undefined) child.props.width = child.layout.width
      if (child.props.height === undefined) child.props.height = child.layout.height
    }
    applyLayoutToProps(child)
  }
}

var Renderer = class {
  container;
  screen;
  input;
  term;
  reconciler;
  callback;
  throttleAt = 0;
  throttleTimeout;
  constructor() {
    this.container = new TextElement();
    this.screen = new screen_default();
    this.input = new Input();
    this.reconciler = null
    this.term = new term_default();
  }
  render(reactElement, options = { fullscreen: true, print: false }) {
    this.term = new term_default();
    this.term.init(options.fullscreen, options.print).then(() => {
      // If passed a fre vnode, prefer using fre.render to mount it to our container
      if (reactElement) {
        // Accept a prebuilt TUI node or array and mount to container
        this.container.children = Array.isArray(reactElement) ? reactElement : [reactElement]
        // Trigger immediate render
        this.throttle()
      }
    });
  }
  inline(reactElement, options = { fullscreen: false, print: false }) {
    this.render(reactElement, options);
  }
  prompt(reactElement, options = { fullscreen: false, print: false }) {
    this.render(reactElement, options);
    return new Promise((resolve) => {
      this.callback = resolve;
    });
  }
  print(reactElement, options = { fullscreen: false, print: true }) {
    this.render(reactElement, options);
    return new Promise((resolve) => {
      this.callback = resolve;
    });
  }
  frame(reactElement, options = { fullscreen: false, print: true }) {
    this.render(reactElement, options);
    return new Promise((resolve) => {
      this.callback = (value) => {
        process.stdout.write(value);
        resolve(value);
      };
    });
  }
  terminate(value) {
    this.container.terminate();
    this.input.terminate();
    if (this.term) {
      this.term.terminate();
    }
    this.callback?.(value);
  }
  spawnSync(command, args, options) {
    const res = spawnSync(command, args, options);
    this.term?.reinit();
    this.term?.render(this.screen.buffer);
    return res;
  }
  bell() {
    process.stdout.write("\x07");
  }
  exit(code = 0) {
    if (typeof code === "number") process.exit(code);
    this.term?.setResult(code);
  }
  throttle = () => {
    const at = Date.now();
    const nextAt = Math.max(0, 1e3 / 60 - (at - this.throttleAt));
    clearTimeout(this.throttleTimeout);
    this.throttleTimeout = setTimeout(() => {
      this.throttleAt = at;
      try {
        // 先计算布局，然后把布局写回 props，最后渲染
        const w = this.screen.buffer[0].length
        const h = this.screen.buffer.length
        // 初始化 root layout
        this.container.layout = this.container.layout || { x: 0, y: 0 }
        computeLayout(this.container, 0, 0, w, h)
        applyLayoutToProps(this.container)
      } catch (e) {
        // 若布局计算失败，回退到默认渲染
      }
      this.screen.render(this.container.children);
      this.term?.render(this.screen.buffer);
      this.input.render();
    }, nextAt);
  };
};
var renderer_default = new Renderer();

// utils/chunk.ts
function chunk(arr, size, cache = []) {
  const tmp = [...arr];
  while (tmp.length) cache.push(tmp.splice(0, size));
  return cache;
}

import { createConnection } from "net";
import { tmpdir } from "os";
import { join } from "path";
import { inspect } from "util";
var socket;
var once = false;
var connect = () => {
  return new Promise((resolve, reject) => {
    socket = createConnection(join(tmpdir(), "node-log.sock")).on("connect", function () {
      socket.write("\0");
      resolve(socket);
    }).on("error", () => {
      reject(void 0);
    });
  });
};
var toString = (data) => data.map((i) => inspect(i, void 0, null, true)).join(" ");
async function log(...rest) {
  if (once && socket === void 0) return;
  try {
    once = true;
    if (socket === void 0) socket = await connect();
    socket.write(toString(rest) + "\n");
  } catch {
    socket = void 0;
  }
}
export default renderer_default;