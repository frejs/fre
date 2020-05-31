import { h, Fragment } from './h'
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
export * from './type'

export {
  h,
  h as createElement,
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
  getCurrentFiber,
  options
}
const Fre = {
  h,
  createElement: h,
  render,
  scheduleWork,
  useState,
  useReducer,
  useEffect,
  useMemo,
  useCallback,
  useRef,
  Fragment,
  getCurrentFiber,
  options
}

export default Fre
