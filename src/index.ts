import { jsx, Fragment, memo } from './jsx'
import { lazy, Suspense } from './Suspense'
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
  useLayout as useLayoutEffect,
  Fragment,
  memo,
  lazy,
  Suspense
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
  lazy,
  Suspense
}

export default Fre
