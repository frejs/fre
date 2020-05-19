import { jsx, Fragment, memo } from './jsx'
import { render, scheduleWork, getCurrentFiber, options } from './reconciler'
import {
  useState,
  useReducer,
  useEffect,
  useMemo,
  useCallback,
  useRef,
  useLayout
} from './hooks'

export {
  jsx,
  jsx as createElement,
  jsx as h,
  render,
  scheduleWork,
  useState,
  useReducer,
  useEffect,
  useMemo,
  useCallback,
  useRef,
  useLayout,
  useLayout as useLayoutEffect,
  Fragment,
  memo,
  getCurrentFiber,
  options
}

const Fre = {
  jsx,
  h: jsx,
  createElement: jsx,
  render,
  scheduleWork,
  useState,
  useReducer,
  useEffect,
  useMemo,
  useCallback,
  useRef,
  Fragment,
  memo,
  getCurrentFiber,
  options
}

export default Fre
