import { useEffect, useState, useRef } from "../node_modules/fre/dist/fre.js";
import { spawnSync as spawnSync2 } from "child_process";
import process2 from "process";

export const useBell = () => {
    process.stdout.write("\x07");
};

export const useClipboard = () => {
    const getClipboard = () => {
        switch (process.platform) {
            case "darwin":
                return spawnSync2("pbpaste", [], { encoding: "utf8" }).stdout;
        }
        return "";
    };
    const setClipboard = (input) => {
        if (typeof input !== "string") input = input.toString();
        switch (process.platform) {
            case "darwin":
                spawnSync2("pbcopy", [], { input });
                break;
            default:
                input = "";
        }
        return input;
    };
    return [getClipboard, setClipboard];
};

const useExit = (code = 0) => {
    if (typeof code === "number") process2.exit(code);
    renderer.term.setResult(code);
};

export const useMouse = (callback, deps = []) => {
    useEffect(() => {
        if (!process.stdin.isRaw) process.stdin.setRawMode?.(true);
        renderer.term.enableMouse();
    }, []);
    useEffect(() => {
        const handler = (input) => {
            if (!input.startsWith("\x1B[M")) return;
            const b = input.charCodeAt(3);
            const type = 1 << 6 & b ? 1 & b ? "wheelup" : "wheeldown" : (3 & b) === 3 ? "mouseup" : "mousedown";
            const x = input.charCodeAt(4) - 33;
            const y = input.charCodeAt(5) - 33;
            callback({ type, x, y });
        };
        renderer.input.on(handler);
        return () => {
            renderer.input.off(handler);
        };
    }, deps);
};

export const useWordWrap = (text, _width = void 0) => {
    const width = _width ?? useSize().width;
    return text.split("\n").map((line) => {
        if (line.length <= width) return line;
        return line.split(" ").reduce(
            (acc, i) => {
                if (acc[acc.length - 1].length + i.length > width) acc.push("");
                acc[acc.length - 1] += `${i} `;
                return acc;
            },
            [""]
        ).map((i) => i.trimEnd()).join("\n");
    }).join("\n");
};

const subscribers = new Set();
const getSize = () => {
    const { columns: width, rows: height } = process.stdout;
    return { width, height };
};
process.stdout.on("resize", () => {
    const size = getSize();
    subscribers.forEach((_, fn) => fn(size));
});
export const useSize = () => {
    const [size, setSize] = useState(getSize());
    useEffect(() => {
        subscribers.add(setSize);
        return () => {
            subscribers.delete(setSize);
        };
    }, []);
    return size;
};

export const useInput = (callback = () => {
}, deps = []) => {
    useEffect4(() => {
        if (!process.stdin.isRaw) process.stdin.setRawMode?.(true);
    }, []);
    useEffect4(() => {
        const handler = (input, raw) => {
            if (input === "") process.exit();
            if (input.startsWith("\x1B[M")) return;
            callback(input, raw);
        };
        renderer_default.input.on(handler);
        return () => {
            renderer_default.input.off(handler);
        };
    }, deps);
};

var interpolate = (toLow, toHigh, fromLow, fromHigh, value) => {
    const res = toLow + (toHigh - toLow) / 100 * 100 / (fromHigh - fromLow) * (value - fromLow);
    return Math.max(Math.min(toLow, toHigh), Math.min(Math.max(toLow, toHigh), res));
};
var interpolateColor = (toLow, toHigh, fromLow, fromHigh, value) => {
    if (!toLow.startsWith("#")) return toHigh;
    if (!toHigh.startsWith("#")) return toHigh;
    const toLowColor = renderer_default.term.parseHexColor(toLow);
    return "#" + Buffer.from(
        renderer_default.term.parseHexColor(toHigh).map((i, index) => {
            return Math.round(interpolate(toLowColor[index], i, fromLow, fromHigh, value));
        })
    ).toString("hex");
};
var Trail = ({ delay, children }) => {
    return useTrail(delay, children);
};
var useTrail = (delay, children, key = "key") => {
    const ms = useRef3(0);
    const timeout = useRef3(void 0);
    const [keys, setKeys] = useState6([]);
    useEffect8(() => {
        const keysNew = children.map((i) => i[key]);
        const keyOld = keys.find((key2) => !keysNew.includes(key2));
        if (keyOld) {
            setKeys(keys.filter((i) => i !== keyOld));
            return;
        }
        const keyNew = keysNew.find((i) => !keys.includes(i));
        if (!keyNew) return;
        const at = Date.now();
        const nextAt = Math.max(0, delay - (at - ms.current));
        clearTimeout(timeout.current);
        timeout.current = setTimeout(() => {
            ms.current = Date.now();
            setKeys([...keys, keyNew]);
        }, nextAt);
    }, [children.map((i) => i[key]).join("\n"), keys]);
    return children.filter((i) => keys.includes(i[key]));
};
var useAnimation_default = (time = Infinity, fps = 60) => {
    if (time <= 0 || fps <= 0) return { ms: 0, interpolate: (i) => i, interpolateColor: (i) => i };
    const at = useRef3(Date.now());
    const interval = useRef3(void 0);
    const [ms, setMs] = useState6(0);
    useEffect8(() => {
        const frameMs = 1e3 / Math.min(60, fps);
        interval.current = setInterval(() => {
            const msNew = Date.now() - at.current;
            if (msNew >= time) clearInterval(interval.current);
            setMs(Math.min(msNew, time));
        }, frameMs);
        return () => {
            clearInterval(interval.current);
        };
    }, []);
    return {
        ms,
        interpolate: (toLow, toHigh, fromLow = 0, fromHigh = time, value = ms) => {
            return interpolate(toLow, toHigh, fromLow, fromHigh, value);
        },
        interpolateColor: (toLow, toHigh, fromLow = 0, fromHigh = time, value = ms) => {
            return interpolateColor(toLow, toHigh, fromLow, fromHigh, value);
        }
    };
};

// hooks/useChildrenSize.ts
import { useEffect as useEffect3, useState as useState2 } from "../node_modules/fre/dist/fre.js";
var render = (element) => {
    if (Array.isArray(element)) return element.map((i) => render(i)).join("");
    const { children } = element.props ?? { children: element };
    if (Array.isArray(children) || children?.props) return render(children);
    return children.toString();
};
var getSize3 = (children) => {
    const string = render(children).split("\n");
    const width = string.reduce((acc, i) => Math.max(acc, i.length), 0);
    const height = string.length;
    return { width, height };
};
var useChildrenSize_default = (children) => {
    const [size, setSize] = useState2(getSize3(children));
    useEffect3(() => {
        setSize(getSize3(children));
    }, [children]);
    return size;
};