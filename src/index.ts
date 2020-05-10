import { jsx } from './jsx'
import { render, scheduleWork } from './reconciler'
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
  useLayout as useLayoutEffect
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
  useRef
}

export default Fre
