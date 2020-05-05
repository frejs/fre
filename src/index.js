import { h, Fragment, memo } from './h'
import { render, scheduleWork, options } from './reconciler'
import {
  useState,
  useReducer,
  useEffect,
  useMemo,
  useCallback,
  useRef,
  useLayout,
} from './hooks'

export {
  h,
  h as createElement,
  Fragment,
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
  memo,
  options
}

const Fre = {
  h,
  Fragment,
  render,
  scheduleWork,
  useState,
  useReducer,
  useEffect,
  useMemo,
  useCallback,
  useRef,
  memo,
  options
}

export default Fre
