import { h } from './h'
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

const fre = {
  h,
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

export default fre
