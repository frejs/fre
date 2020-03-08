import { h,Fragment } from './h'
import { render, scheduleWork, options } from './reconciler'
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
  h,
  h as createElement,
  Fragment,
  render,
  scheduleWork,
  options,
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
  h,
  Fragment,
  render,
  scheduleWork,
  options,
  useState,
  useReducer,
  useEffect,
  useMemo,
  useCallback,
  useRef
}

export default Fre
