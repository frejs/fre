import { h, Fragment, memo } from './h'
import { render, scheduleWork } from './reconciler'
import { createContext, useContext } from './context'
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
  useState,
  useReducer,
  useEffect,
  useMemo,
  useCallback,
  useRef,
  useLayout,
  useLayout as useLayoutEffect,
  memo,
  createContext,
  useContext
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
  createContext,
  useContext
}

export default Fre
