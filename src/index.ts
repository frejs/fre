import { h, Fragment } from './h'
import { render } from './reconciler'
import { useState, useReducer, useEffect, useMemo, useCallback, useRef, useLayout } from './hooks'
export * from './type'

const options: Record<string,Function> = {}


export {
  h,
  h as jsx,
  h as jsxs,
  h as jsxDEV,
  render,
  useState,
  useReducer,
  useEffect,
  useMemo,
  useCallback,
  useRef,
  useLayout,
  useLayout as useLayoutEffect,
  Fragment,
  options,
}
