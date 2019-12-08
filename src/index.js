import { h } from './h'
import { render, scheduleWork, options } from './reconciler'
import {
  useState,
  useReducer,
  useEffect,
  useMemo,
  useCallback,
  useRef
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
  useRef
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
  useRef,
  lazy
}

export default fre
