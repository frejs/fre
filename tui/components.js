import { jsx as jsx12 } from "../node_modules/fre/jsx-runtime.js";
function Spinner({ children, ...props }) {
  const frames = children ? children.split("") : ["\u280B", "\u2819", "\u2839", "\u2838", "\u283C", "\u2834", "\u2826", "\u2827", "\u2807", "\u280F"];
  const { ms, interpolate: interpolate2 } = useAnimation_default(Infinity);
  const frame = Math.floor(interpolate2(0, frames.length, 0, 500, ms % 500));
  const color = 255 - Math.abs(Math.floor(interpolate2(-16, 16, 0, 1500, ms % 1500)));
  return /* @__PURE__ */ jsx12(Text, { color, ...props, children: frames[frame] });
}

// components/View.tsx
import { useState as useState7 } from "../node_modules/fre/dist/fre.js";
import { jsx as jsx13, jsxs as jsxs7 } from "../node_modules/fre/jsx-runtime.js";
function View({ focus = true, height: _height, scrollbar, vi = true, children, ...props }) {
  const height = _height ?? useSize_default().height;
  const [yo, setYo] = useState7(0);
  const { height: length } = useChildrenSize_default(children);
  useInput_default(
    (input) => {
      if (!focus) return;
      if ((vi && input === "k" || input === "\x1B[A") && yo > 0) setYo(yo - 1);
      if ((vi && input === "j" || input === "\x1B[B") && yo < length - height) setYo(yo + 1);
      if ((vi && input === "" || input === "\x1B[5~") && yo > 0)
        setYo(Math.max(0, yo - height));
      if ((vi && input === "" || input === "\x1B[6~") && yo < length - height)
        setYo(Math.min(length - height, yo + height));
      if (vi && input === "" && yo > 0) setYo(Math.max(0, yo - Math.floor(height / 2)));
      if (vi && input === "" && yo < length - height)
        setYo(Math.min(length - height, yo + Math.floor(height / 2)));
      if ((vi && input === "g" || input === "\x1B[1~") && yo > 0) setYo(0);
      if ((vi && input === "G" || input === "\x1B[4~") && yo < length - height)
        setYo(length - height);
    },
    [focus, yo, length, height]
  );
  const isScrollbarRequired = scrollbar === void 0 ? length > height : scrollbar;
  return /* @__PURE__ */ jsxs7(Text, { height, ...props, children: [
    /* @__PURE__ */ jsx13(Text, { y: -yo, children }),
    isScrollbarRequired && /* @__PURE__ */ jsx13(Text, { y: 0, x: "100%-1", children: /* @__PURE__ */ jsx13(Scrollbar, { offset: yo, limit: height, length }) })
  ] });
}


// components/ListTable.tsx
import { useEffect as useEffect7, useMemo as useMemo5, useState as useState5 } from "../node_modules/fre/dist/fre.js";
import { jsx as jsx10, jsxs as jsxs5 } from "../node_modules/fre/jsx-runtime.js";
var getX = (index, widths) => {
  const [x1, x2] = widths.reduce((acc, i, k) => [acc[0] + (k < index ? i : 0), acc[1] + (k <= index ? i : 0)], [0, 0]);
  return { x1, x2 };
};
var getXO = (offsetX, limit, x1, x2) => {
  if (x1 <= offsetX) return x1;
  if (x2 >= offsetX + limit) return x2 - limit + 1;
  return offsetX;
};
function List2({
  mode = "cell",
  focus = true,
  initialPos = { y: 0, x: 0, yo: 0, xo: 0, x1: 0, x2: 0 },
  height: _height = void 0,
  width: _width = void 0,
  head = [""],
  renderHead = (_) => /* @__PURE__ */ jsx10(Text, {}),
  data = [[""]],
  renderItem = (_) => /* @__PURE__ */ jsx10(Text, {}),
  scrollbar = void 0,
  scrollbarBackground = void 0,
  scrollbarColor = void 0,
  vi = true,
  pass = void 0,
  onChange = (_pos) => {
  },
  onSubmit = (_pos) => {
  }
}) {
  const size = _height === void 0 || _width === void 0 ? useSize_default() : void 0;
  const height = _height ?? size.height;
  const width = _width ?? size.width;
  const [pos, setPos] = useState5({ ...{ y: 0, x: 0, yo: 0, xo: 0, x1: 0, x2: 0 }, ...initialPos });
  const isScrollbarRequired = useMemo5(() => {
    return scrollbar === void 0 ? data.length > height - 1 : scrollbar;
  }, [scrollbar, data.length, height]);
  const widths = useMemo5(() => {
    const widths2 = data.reduce(
      (acc, row) => {
        row.forEach((i, k) => acc[k] = Math.max(acc[k], (i?.toString() || "null").length));
        return acc;
      },
      head.map((i) => i.toString().length)
    ).map((i, index) => i + (index <= head.length - 2 ? 2 : 0));
    const sum = widths2.reduce((acc, i) => acc + i, 0);
    if (sum >= width - 1) return widths2.map((i) => Math.min(32, i));
    return widths2;
  }, [data, head, width]);
  const isCropped = useMemo5(() => {
    const sum = widths.reduce((acc, i) => acc + i, 0);
    return sum - pos.xo >= width + (isScrollbarRequired ? -1 : 0);
  }, [widths, pos.xo, width, isScrollbarRequired]);
  const dataFiltered = useMemo5(() => {
    return data.filter((_, index) => index >= pos.yo && index < height + pos.yo);
  }, [data, pos.yo, height]);
  useEffect7(() => {
    let newPos;
    let { y, x } = initialPos;
    if (y > 0 && y >= data.length) {
      y = data.length - 1;
      onChange({ ...pos, y });
    }
    if (y !== pos.y) {
      y = Math.max(0, y);
      newPos = { ...newPos || pos, y, yo: getYO(pos.yo, height - 1, y) };
    }
    if (initialPos.xm) {
      let acc = 0;
      x = widths.map((i) => acc += i).findIndex((i) => i >= Math.min(acc, (initialPos.xm ?? 0) + pos.xo));
    }
    if (x > 0 && x >= head.length) {
      x = head.length - 1;
      onChange({ ...pos, x });
    }
    if (x !== pos.x) {
      const { x1, x2 } = getX(x, widths);
      newPos = { ...newPos || pos, x, xo: getXO(pos.xo, width + (isScrollbarRequired ? -1 : 0), x1, x2) };
    }
    if (newPos) {
      setPos(newPos);
      onChange(newPos);
    }
  }, [initialPos.y, initialPos.x, initialPos.xm]);
  useEffect7(() => {
    if (pos.y > 0 && head.length > 0 && pos.y > data.length - 1) {
      const y = Math.max(0, data.length - 1);
      const newPos = { ...pos, y, yo: getYO(pos.yo, data.length, y) };
      setPos(newPos);
      onChange(newPos);
    }
    if (pos.x > 0 && head.length > 0 && pos.x > head.length - 1) {
      const newPos = { ...pos, x: head.length - 1 };
      setPos(newPos);
      onChange(newPos);
    }
  }, [head, data]);
  useInput_default(
    (input) => {
      if (!focus) return;
      inputHandler(vi, pos, setPos, height - 1, data.length, onChange)(input);
      let x;
      switch (mode) {
        case "cell":
          if ((vi && input === "h" || input === "\x1B[D") && pos.x > 0) x = pos.x - 1;
          if ((vi && input === "l" || input === "\x1B[C") && pos.x < head.length - 1) x = pos.x + 1;
          if (vi && input === "^" && pos.x > 0) x = 0;
          if (vi && input === "$" && pos.x < head.length - 1) x = head.length - 1;
          if (x !== void 0) {
            const { x1, x2 } = getX(x, widths);
            const xo = getXO(pos.xo, width + (isScrollbarRequired ? -1 : 0), x1, x2);
            const newPos = { ...pos, x, xo, x1, x2 };
            setPos(newPos);
            onChange(newPos);
          }
          break;
        case "row":
          if ((vi && input === "h" || input === "\x1B[D") && pos.x > 0) x = pos.x - 1;
          if ((vi && input === "l" || input === "\x1B[C") && pos.x < head.length - 1) x = pos.x + 1;
          if (x !== void 0) {
            const { x1, x2 } = getX(x, widths);
            const newPos = { ...pos, x, xo: x1, x1, x2 };
            setPos(newPos);
            onChange(newPos);
          }
          break;
      }
      if (input === "\r") onSubmit({ ...pos, ...getX(pos.x, widths) });
    },
    [focus, vi, pos, width, height, head, data, widths, isScrollbarRequired, setPos, onChange, onSubmit]
  );
  return /* @__PURE__ */ jsxs5(Text, { width, height, children: [
    /* @__PURE__ */ jsx10(Text, { x: -pos.xo, height: 1, children: renderHead({
      focus,
      item: head,
      widths,
      pass
    }) }),
    /* @__PURE__ */ jsx10(Text, { y: 1, x: -pos.xo, children: dataFiltered.map((item, index) => /* @__PURE__ */ jsx10(Text, { height: 1, block: true, children: renderItem({
      mode,
      focus,
      item,
      y: pos.y,
      x: pos.x,
      widths,
      index: index + pos.yo,
      pass
    }) }, index)) }),
    isCropped && /* @__PURE__ */ jsx10(Text, { y: 0, x: "100%-1", dim: true, children: "~" }),
    isScrollbarRequired && /* @__PURE__ */ jsx10(Text, { y: 1, x: "100%-1", children: /* @__PURE__ */ jsx10(
      Scrollbar,
      {
        offset: pos.yo,
        limit: height - 1,
        length: data.length,
        background: scrollbarBackground,
        color: scrollbarColor
      }
    ) })
  ] });
}

// components/Separator.tsx
import { jsx as jsx11, jsxs as jsxs6 } from "../node_modules/fre/jsx-runtime.js";
function Separator({ type = "vertical", height: _height, width: _width, ...props }) {
  const size = _height === void 0 || _width === void 0 ? useSize_default() : void 0;
  const height = _height ?? size.height;
  const width = _width ?? size.width;
  if (type === "vertical" && height < 1) return null;
  if (type === "horizontal" && width < 1) return null;
  return /* @__PURE__ */ jsxs6(Text, { height: type === "horizontal" ? 1 : void 0, width: type === "vertical" ? 1 : void 0, ...props, children: [
    type === "vertical" && [...Array(height)].map((_, key) => /* @__PURE__ */ jsx11(Text, { block: true, children: "\u2502" }, key)),
    type === "horizontal" && "\u2500".repeat(width)
  ] });
}

// components/Frame.tsx
import { jsx as jsx6, jsxs as jsxs2 } from "../node_modules/fre/jsx-runtime.js";
var FRAMES = {
  single: "\u250C\u2500\u2510\u2502\u2514\u2518",
  double: "\u2554\u2550\u2557\u2551\u255A\u255D",
  rounded: "\u256D\u2500\u256E\u2502\u2570\u256F"
};
function Frame({ type = "single", height: _height, width: _width, children, ...props }) {
  const frames = FRAMES[type];
  const size = _height === void 0 || _width === void 0 ? useChildrenSize_default(children) : void 0;
  const height = _height ?? size.height;
  const width = _width ?? size.width;
  const { color } = props;
  return /* @__PURE__ */ jsxs2(Text, { ...props, children: [
    /* @__PURE__ */ jsxs2(Text, { color, block: true, children: [
      frames[0],
      frames[1].repeat(width),
      frames[2]
    ] }),
    [...Array(height)].map((_, key) => /* @__PURE__ */ jsxs2(Text, { block: true, children: [
      /* @__PURE__ */ jsx6(Text, { color, children: frames[3] }),
      " ".repeat(width),
      /* @__PURE__ */ jsx6(Text, { color, children: frames[3] })
    ] }, key)),
    /* @__PURE__ */ jsx6(Text, { y: 1, x: 1, block: true, children }),
    /* @__PURE__ */ jsxs2(Text, { y: height + 1, color, children: [
      frames[4],
      frames[1].repeat(width),
      frames[5]
    ] })
  ] });
}

// components/Input.tsx
import { useEffect as useEffect5, useMemo as useMemo3, useRef as useRef2, useState as useState3 } from "../node_modules/fre/dist/fre.js";
import { Fragment as Fragment3, jsx as jsx7, jsxs as jsxs3 } from "../node_modules/fre/jsx-runtime.js";
var mutate = (value, pos, str, multiline) => {
  const edit = (value2, pos2, callback) => {
    const left = callback(value2.substring(0, pos2));
    const right = value2.substring(pos2);
    return [left, right].join("");
  };
  const arr = renderer_default.input.parse(str);
  for (const input of arr) {
    switch (input) {
      case "":
      // C-a
      case "\x1B[1~": {
        if (pos > 0) pos = 0;
        break;
      }
      case "":
      // C-e
      case "\x1B[4~": {
        if (pos < value.length) pos = value.length;
        break;
      }
      case "":
      // C-b
      case "\x1B[D": {
        if (pos > 0) pos -= 1;
        break;
      }
      case "":
      // C-f
      case "\x1B[C": {
        if (pos < value.length) pos += 1;
        break;
      }
      case "\x1B": {
        return [value, pos, "cancel"];
      }
      case "":
      // C-d
      case "\r": {
        if (input === "\r" && multiline) {
          value = edit(value, pos, (i) => i + "\n");
          pos += 1;
          break;
        }
        return [value, pos, "submit"];
      }
      case "\b":
      // C-h
      case "\x7F": {
        if (pos < 1) break;
        value = edit(value, pos, (i) => i.substring(0, i.length - 1));
        pos -= 1;
        break;
      }
      case "": {
        if (pos < 1) break;
        value = edit(value, pos, () => "");
        pos = 0;
        break;
      }
      case "\v": {
        if (pos > value.length - 1) break;
        value = value.substring(0, pos);
        break;
      }
      case "\x1Bb":
      // M-b
      case "": {
        if (pos < 1) break;
        const index = value.substring(0, pos).trimEnd().lastIndexOf(" ");
        if (input === "") value = edit(value, pos, (i) => index !== -1 ? i.substring(0, index + 1) : "");
        pos = Math.max(0, index + 1);
        break;
      }
      case "\x1Bf": {
        if (pos > value.length - 1) break;
        const nextWordIndex = value.substring(pos).match(/\s(\w)/)?.index ?? -1;
        pos = nextWordIndex === -1 ? value.length : pos + nextWordIndex + 1;
        break;
      }
      case "\x1Bd": {
        const nextEndIndex = value.substring(pos).match(/\w(\b)/)?.index ?? -1;
        value = value.substring(0, pos) + (nextEndIndex !== -1 ? value.substring(pos + nextEndIndex + 1) : "");
        break;
      }
      case "\x1B[A": {
        if (!multiline) break;
        const currentLine = value.substring(0, pos).lastIndexOf("\n");
        if (currentLine === -1) break;
        const targetLine = value.substring(0, currentLine).lastIndexOf("\n");
        pos = targetLine + Math.min(pos - currentLine, currentLine - targetLine);
        break;
      }
      case "\x1B[B": {
        if (!multiline) break;
        let targetLine_ = value.substring(pos).indexOf("\n");
        if (targetLine_ === -1) break;
        targetLine_ += pos + 1;
        let nextLine = value.substring(targetLine_).indexOf("\n");
        nextLine = (nextLine !== -1 ? targetLine_ + nextLine : value.length) + 1;
        const currentLine_ = value.substring(0, pos).lastIndexOf("\n");
        pos = targetLine_ + Math.min(pos - currentLine_ - 1, nextLine - targetLine_ - 1);
        break;
      }
      default: {
        if (input.charCodeAt(0) < 32) break;
        value = edit(value, pos, (i) => i + input);
        pos += 1;
      }
    }
  }
  return [value, pos, null];
};
function Input2({
  focus = true,
  type = "text",
  initialValue = "",
  cursorBackground = void 0,
  onCancel = () => {
  },
  onChange = (_) => {
  },
  onSubmit = (_) => {
  },
  width = void 0,
  height = void 0,
  ...props
}) {
  const [value, setValue] = useState3(initialValue);
  const [pos, setPos] = useState3(initialValue.length);
  const offset = useRef2({ y: 0, x: 0 });
  const multiline = useMemo3(() => {
    return typeof height === "number" && height > 1;
  }, [height]);
  useInput_default(
    (_, raw) => {
      if (raw === void 0) return;
      if (!focus) return;
      const [valueNew, posNew, action] = mutate(value, pos, raw(), multiline);
      switch (action) {
        case "cancel":
          onCancel();
          break;
        case "submit":
          onSubmit(valueNew);
          setValue("");
          setPos(0);
          break;
        default:
          setValue(valueNew);
          setPos(posNew);
      }
    },
    [focus, value, pos, onCancel, onSubmit]
  );
  useEffect5(() => {
    onChange(value);
  }, [value]);
  if (type === "hidden") return null;
  const text = useMemo3(() => {
    if (type === "password") return "*".repeat(value.length);
    return value;
  }, [value, type]);
  const { y: yo, x: xo } = useMemo3(() => {
    if (typeof width !== "number") return offset.current;
    let posLine = pos;
    let valueLine = value;
    if (multiline && typeof height === "number") {
      const line = value.substring(0, pos).split("\n").length - 1;
      if (offset.current.y < line - height + 1) offset.current.y = line - height + 1;
      if (offset.current.y > line) offset.current.y = line;
      const currentLine = value.substring(0, pos).lastIndexOf("\n");
      posLine = pos - (currentLine !== -1 ? currentLine + 1 : 0);
      const nextLine = value.substring(pos).indexOf("\n");
      valueLine = value.substring(currentLine + 1, nextLine !== -1 ? pos + nextLine : value.length);
    }
    if (!multiline && offset.current.x + valueLine.length + 1 > width)
      offset.current.x = Math.max(0, valueLine.length - width + 1);
    if (offset.current.x < posLine - width + 1) offset.current.x = posLine - width + 1;
    if (offset.current.x > posLine) offset.current.x = posLine;
    return offset.current;
  }, [value, pos, width]);
  return /* @__PURE__ */ jsx7(Text, { height, width, ...props, children: /* @__PURE__ */ jsxs3(Text, { y: -yo, x: -xo, children: [
    text.substring(0, pos),
    focus && /* @__PURE__ */ jsxs3(Fragment3, { children: [
      /* @__PURE__ */ jsx7(Text, { inverse: cursorBackground === void 0, background: cursorBackground, children: text[pos] !== "\n" && text[pos] || " " }),
      text[pos] === "\n" && "\n"
    ] }),
    text.length > pos && text.substring(pos + (focus ? 1 : 0))
  ] }) });
}

// components/Scrollbar.tsx
import { jsx as jsx8 } from "../node_modules/fre/jsx-runtime.js";
function Scrollbar({ type = "vertical", offset, limit, length, background, color }) {
  length ||= limit;
  offset = limit / length * offset;
  let size = limit / (length / limit);
  if (size < 1) {
    offset *= (length - limit / size) / (length - limit);
    size = 1;
  }
  return /* @__PURE__ */ jsx8(Text, { background, height: type === "vertical" ? limit : 1, width: type === "horizontal" ? limit : 1, children: /* @__PURE__ */ jsx8(
    Bar,
    {
      type,
      y: type === "vertical" ? offset : void 0,
      x: type === "horizontal" ? offset : void 0,
      height: type === "vertical" ? size : void 0,
      width: type === "horizontal" ? size : void 0,
      color
    }
  ) });
}

// components/List.tsx
import { useEffect as useEffect6, useMemo as useMemo4, useState as useState4 } from "../node_modules/fre/dist/fre.js";
import { jsx as jsx9, jsxs as jsxs4 } from "../node_modules/fre/jsx-runtime.js";
var getYO = (offset, limit, y) => {
  if (offset <= y - limit) return y - limit + 1;
  if (offset > y) return y;
  return offset;
};
var inputHandler = (vi, pos, setPos, height, dataLength, onChange) => (input) => {
  let y;
  let yo;
  if ((vi && input === "k" || input === "\x1B[A") && pos.y > 0) y = pos.y - 1;
  if ((vi && input === "j" || input === "\x1B[B") && pos.y < dataLength - 1) y = pos.y + 1;
  if ((vi && input === "" || input === "\x1B[5~") && pos.y > 0)
    y = Math.max(0, pos.y - height);
  if ((vi && input === "" || input === "\x1B[6~") && pos.y < dataLength - 1)
    y = Math.min(dataLength - 1, pos.y + height);
  if (vi && input === "" && pos.y > 0) y = Math.max(0, pos.y - Math.floor(height / 2));
  if (vi && input === "" && pos.y < dataLength - 1)
    y = Math.min(dataLength - 1, pos.y + Math.floor(height / 2));
  if ((vi && input === "g" || input === "\x1B[1~") && pos.y > 0) y = 0;
  if ((vi && input === "G" || input === "\x1B[4~") && pos.y < dataLength - 1) y = dataLength - 1;
  if (y !== void 0) yo = getYO(pos.yo, height, y);
  if (vi && input === "H") y = pos.yo;
  if (vi && input === "M") y = pos.yo + Math.floor(height / 2);
  if (vi && input === "L") y = pos.yo + height - 1;
  if (y !== void 0) {
    let newPos = { ...pos, y };
    if (yo !== void 0) newPos = { ...newPos, yo };
    setPos(newPos);
    onChange(newPos);
  }
};
function List({
  focus = true,
  initialPos = { y: 0, x: 0, yo: 0, xo: 0, x1: 0, x2: 0 },
  data = [""],
  renderItem = (_) => /* @__PURE__ */ jsx9(Text, {}),
  height: _height = void 0,
  width: _width = void 0,
  scrollbar = void 0,
  scrollbarBackground = void 0,
  scrollbarColor = void 0,
  vi = true,
  pass = void 0,
  onChange = (_) => {
  },
  onSubmit = (_) => {
  }
}) {
  const size = _height === void 0 || _width === void 0 ? useSize_default() : void 0;
  const height = _height ?? size.height;
  const width = _width ?? size.width;
  const [pos, setPos] = useState4({ ...{ y: 0, x: 0, yo: 0, xo: 0, x1: 0, x2: 0 }, ...initialPos });
  const isScrollbarRequired = useMemo4(() => {
    return scrollbar === void 0 ? data.length > height : scrollbar;
  }, [scrollbar, data.length, height]);
  useEffect6(() => {
    let newPos;
    let { y } = initialPos;
    if (y > 0 && y >= data.length) {
      y = data.length - 1;
      onChange({ ...pos, y });
    }
    if (y !== pos.y) {
      y = Math.max(0, y);
      newPos = { ...newPos || pos, y, yo: getYO(pos.yo, height - 1, y) };
    }
    if (newPos) {
      setPos(newPos);
      onChange(newPos);
    }
  }, [initialPos.y]);
  useEffect6(() => {
    if (pos.y > 0 && pos.y > data.length - 1) {
      const y = Math.max(0, data.length - 1);
      const newPos = { ...pos, y, yo: getYO(pos.yo, data.length, y) };
      setPos(newPos);
      onChange(newPos);
    }
  }, [data]);
  useInput_default(
    (input) => {
      if (!focus) return;
      inputHandler(vi, pos, setPos, height, data.length, onChange)(input);
      if (input === "\r") onSubmit(pos);
    },
    [focus, vi, pos, setPos, height, data, onChange, onSubmit]
  );
  return /* @__PURE__ */ jsxs4(Text, { width, height, children: [
    data.filter((_, index) => index >= pos.yo && index < height + pos.yo).map((row, index) => /* @__PURE__ */ jsx9(Text, { height: 1, block: true, children: renderItem({
      focus,
      item: row,
      selected: index + pos.yo === pos.y,
      pass
    }) }, index)),
    isScrollbarRequired && /* @__PURE__ */ jsx9(Text, { y: 0, x: "100%-1", children: /* @__PURE__ */ jsx9(
      Scrollbar,
      {
        offset: pos.yo,
        limit: height,
        length: data.length,
        background: scrollbarBackground,
        color: scrollbarColor
      }
    ) })
  ] });
}


// components/Text.tsx
import { jsx } from "../node_modules/fre/jsx-runtime.js";
function Text({ children, ...props }) {
  return /* @__PURE__ */ jsx("text", { ...props, children });
}

// components/Banner.tsx
import { useMemo } from "../node_modules/fre/dist/fre.js";
import { Fragment, jsx as jsx2 } from "../node_modules/fre/jsx-runtime.js";
var FONT = "BAQEAAQAqq4KDgoA6oLkKOpAZIRAoOAAKERERCgAAETuRKAAAAAOAECAAgQEBEgA5KykpO4A7iLugu4ArqjuIi4A7oLiouIA7qruou4AAEQAAEQIIE6ATiAAjkIkQIQATqqO6koA7qjIqO4AzqisqM4A7ojIio4ArqTkpK4A6iosquoAio6KiuoAzqqqqq4A7qrqio4C7qjOoq4A6kpKSk4AqqqqrkoAqqpEpKQA5iREhOYAjERERCwAQKAAAA4AhkQIBAYATERCREwAUKAAAAAA";
var letters = chunk(Buffer.from(FONT, "base64"), 6);
var Letter = ({ children }) => {
  const text = useMemo(() => {
    let code = children.toUpperCase().charCodeAt(0);
    if (code >= 123 && code <= 126) code -= 26;
    const font = letters[Math.floor((code - 32) / 2)];
    if (!font) return;
    const bits = code % 2 === 0 ? 4 : 0;
    return chunk(font, 2).map(([top, bot]) => {
      return [3, 2, 1, 0].map((i) => {
        const b = Math.pow(2, i + bits);
        const code2 = 0 | (top & b && 4) | (bot & b && 8);
        return code2 ? String.fromCharCode(9596 + code2) : " ";
      }).join("");
    }).join("\n");
  }, [children]);
  return /* @__PURE__ */ jsx2(Fragment, { children: text });
};
function Banner({ children, ...props }) {
  if (children === void 0 || children === null) return null;
  const lines = children.toString().split("\n");
  const length = Math.max(...lines.map((i) => i.length));
  return /* @__PURE__ */ jsx2(Text, { ...props, height: lines.length * 3, width: length * 4, children: lines.map((line, key) => /* @__PURE__ */ jsx2(Text, { x: 0, y: key * 3, children: line.split("").map((char, key2) => /* @__PURE__ */ jsx2(Text, { x: key2 * 4, y: 0, children: /* @__PURE__ */ jsx2(Letter, { children: char }) }, key2)) }, key)) });
}

// components/Bar.tsx
import { jsx as jsx3, jsxs } from "../node_modules/fre/jsx-runtime.js";
var getSize = (offset, size) => {
  offset = Math.round(offset * 8);
  size = Math.round(size * 8);
  if (offset < 0) {
    size += offset;
    offset = 0;
  }
  size = Math.max(0, size);
  return [offset, size];
};
var getSections = (offset, size) => [
  size >= 8 || (offset + size) % 8 === 0 && size > 0 && size < 8,
  size >= 8,
  (size >= 8 || offset % 8 === 0 && size < 8) && (offset + size) % 8 !== 0
];
var Vertical = (y, height, props) => {
  const [offset, size] = getSize(y, height);
  const sections = getSections(offset, size);
  const char = (value) => {
    if (value > 7) return String.fromCharCode(9608);
    return String.fromCharCode(9608 - Math.min(8, value));
  };
  return /* @__PURE__ */ jsxs(Text, { ...props, y: Math.floor(offset / 8), children: [
    sections[0] && /* @__PURE__ */ jsx3(Text, { block: true, children: char(offset % 8) }),
    sections[1] && [...Array(Math.floor((offset % 8 + size) / 8) - 1)].map((_, key) => /* @__PURE__ */ jsx3(Text, { block: true, children: char(8) }, key)),
    sections[2] && /* @__PURE__ */ jsx3(Text, { inverse: true, children: char((offset + size) % 8) })
  ] });
};
var Horizontal = (x, width, props) => {
  const [offset, size] = getSize(x, width);
  const sections = getSections(offset, size);
  const char = (value) => {
    if (value <= 0) return " ";
    return String.fromCharCode(9616 - Math.min(8, value));
  };
  return /* @__PURE__ */ jsxs(Text, { ...props, x: Math.floor(offset / 8), children: [
    sections[0] && /* @__PURE__ */ jsx3(Text, { inverse: true, children: char(offset % 8) }),
    sections[1] && /* @__PURE__ */ jsx3(Text, { children: char(8).repeat(Math.floor((offset % 8 + size) / 8) - 1) }),
    sections[2] && /* @__PURE__ */ jsx3(Text, { children: char((offset + size) % 8) })
  ] });
};
function Bar({ type = "vertical", y, x, height, width, ...props }) {
  if (type === "vertical") return Vertical(y || 0, height || 0, { x, width, ...props });
  if (type === "horizontal") return Horizontal(x || 0, width || 0, { y, height, ...props });
  return null;
}


import { jsx as jsx4 } from "../node_modules/fre/jsx-runtime.js";
import { jsx } from "../node_modules/fre/jsx-runtime.js";
function Block({ width = void 0, align = "left", children, ...props }) {
  const handle = (line, key = void 0) => {
    if (typeof line === "object") return line;
    if (line === "\n") return;
    let x = 0;
    switch (align) {
      case "center":
        width ??= useSize_default().width;
        x = Math.round(width / 2 - line.length / 2);
        break;
      case "right":
        x = `100%-${line.length}`;
        break;
    }
    return /* @__PURE__ */ jsx4(Text, { x, ...props, block: true, children: line }, key);
  };
  if (Array.isArray(children)) return children.map(handle);
  return handle(children);
}

// components/Canvas.tsx
import { useEffect as useEffect2, useMemo as useMemo2, useRef } from "../node_modules/fre/dist/fre.js";
const Children = {
  forEach(children, fn) {
    if (children == null) return
    if (Array.isArray(children)) children.forEach(fn)
    else fn(children)
  },
  map(children, fn) {
    if (children == null) return []
    return Array.isArray(children) ? children.map(fn) : [fn(children)]
  }
}
import { Fragment as Fragment2, jsx as jsx5 } from "../node_modules/fre/jsx-runtime.js";
var CanvasClass = class {
  // prettier-ignore
  MODES = {
    "1x1": { map: [[1]], table: [32, 136] },
    "1x2": { map: [[1], [2]], table: [32, 128, 132, 136] },
    "2x2": { map: [[1, 4], [2, 8]], table: [32, 152, 150, 140, 157, 128, 158, 155, 151, 154, 132, 153, 144, 156, 159, 136] },
    "2x4": { map: [[1, 8], [2, 16], [4, 32], [64, 128]] }
  };
  mode;
  multicolor;
  w;
  h;
  buffer;
  colors;
  constructor(width, height, mode = { w: 1, h: 2 }) {
    this.mode = mode;
    this.multicolor = mode.w === 1 && mode.h === 2;
    this.w = Math.ceil(width / this.mode.w) * this.mode.w;
    this.h = Math.ceil(height / this.mode.h) * this.mode.h;
    const size = this.w / this.mode.w * this.h / this.mode.h;
    this.buffer = Buffer.alloc(size);
    this.colors = [...Array(size * (this.multicolor ? 2 : 1))];
  }
  clear() {
    this.buffer.fill(0);
    this.colors.fill(0);
  }
  set(x, y, color) {
    if (x < 0 || x >= this.w || y < 0 || y >= this.h) return;
    const index = this.w / this.mode.w * Math.floor(y / this.mode.h) + Math.floor(x / this.mode.w);
    this.buffer[index] |= this.MODES[`${this.mode.w}x${this.mode.h}`].map[y % this.mode.h][x % this.mode.w];
    if (color) this.colors[this.multicolor ? this.w * y + x : index] = color;
  }
  line(x0, y0, x1, y1, color) {
    const dx = x1 - x0;
    const dy = y1 - y0;
    const adx = Math.abs(dx);
    const ady = Math.abs(dy);
    let eps = 0;
    const sx = dx > 0 ? 1 : -1;
    const sy = dy > 0 ? 1 : -1;
    if (adx > ady) {
      for (let x = x0, y = y0; sx < 0 ? x >= x1 : x <= x1; x += sx) {
        this.set(x, y, color);
        eps += ady;
        if (eps << 1 >= adx) {
          y += sy;
          eps -= adx;
        }
      }
    } else {
      for (let x = x0, y = y0; sy < 0 ? y >= y1 : y <= y1; y += sy) {
        this.set(x, y, color);
        eps += adx;
        if (eps << 1 >= ady) {
          x += sx;
          eps -= ady;
        }
      }
    }
  }
  render() {
    return [...this.buffer].map((i, index) => {
      const table = this.MODES[`${this.mode.w}x${this.mode.h}`].table;
      let res = String.fromCharCode(table ? (i && 9472) + table[i] : 10240 + i);
      let colors = [];
      if (res !== " ") {
        if (this.multicolor) {
          const y = Math.floor(index / this.w) * this.mode.h;
          const x = index % this.w * this.mode.w;
          const color1 = this.colors[this.w * y + x];
          const color2 = this.colors[this.w * (y + 1) + x];
          if (res === "\u2588" && color1 !== color2) {
            res = "\u2580";
            colors = [color1, color2];
          } else {
            colors = [color1 || color2];
          }
        } else {
          colors = [this.colors[index]];
        }
      }
      return [res, colors];
    });
  }
};
var Point = (_props) => /* @__PURE__ */ jsx5(Fragment2, {});
var Line = (_props) => /* @__PURE__ */ jsx5(Fragment2, {});
function Canvas({ mode = { w: 1, h: 2 }, width, height, children, ...props }) {
  const canvas = useRef(new CanvasClass(width, height, mode));
  useEffect2(() => {
    canvas.current = new CanvasClass(width, height, mode);
  }, [width, height, mode]);
  const text = useMemo2(() => {
    canvas.current.clear();
    Children.forEach(children, (i) => {
      if (i.type === Point) {
        const { x, y, color } = i.props;
        canvas.current.set(x, y, color);
      } else if (i.type === Line) {
        const { x, y, dx, dy, color } = i.props;
        canvas.current.line(x, y, dx, dy, color);
      }
    });
    return canvas.current.render();
  }, [children]);
  return /* @__PURE__ */ jsx5(Text, { ...props, children: chunk(text, canvas.current.w / canvas.current.mode.w).map((line, y) => /* @__PURE__ */ jsx5(Text, { x: 0, y, children: line.map(
    ([char, [color, background]], x) => char !== " " && /* @__PURE__ */ jsx5(
      Text,
      {
        x,
        y: 0,
        color: color ? color : void 0,
        background: background ? background : void 0,
        children: char
      },
      x
    )
  ) }, y)) });
}
