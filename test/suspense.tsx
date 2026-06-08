import { h, useState, Suspense, useEffect, Fragment, lazy } from "../src/index"
import { testRender } from "./test-util"

export const suspense = async (t) => {
  // Test 1: Basic suspense with lazy component
  await t.test('suspense: show fallback while loading', async (t) => {
    let resolveFactory: any
    const factoryPromise = new Promise(resolve => {
      resolveFactory = resolve
    })

    const LazyContent = lazy(() => 
      factoryPromise.then(() => ({
        default: () => <div>Loaded content</div>
      }))
    )

    const Component = () => {
      return (
        <Suspense fallback={<div>Loading...</div>}>
          <LazyContent />
        </Suspense>
      )
    }

    const result = await testRender(<Component />)
    // Should show fallback
    t.eq(result[0].textContent, 'Loading...')

    // Resolve factory
    resolveFactory()
    // Need to wait for re-render
    await new Promise(resolve => setTimeout(resolve, 50))
  })

  // Test 2: Suspense with multiple lazy components
  await t.test('suspense: multiple lazy children', async (t) => {
    let resolveFactory: any
    const factoryPromise = new Promise(resolve => {
      resolveFactory = resolve
    })

    const LazyItem = lazy(() =>
      factoryPromise.then(() => ({
        default: ({ text }: any) => <span>{text}</span>
      }))
    )

    const Component = () => {
      return (
        <Suspense fallback={<div>Loading items...</div>}>
          <div id="container">
            <LazyItem text="Item 1" />
            <LazyItem text="Item 2" />
            <LazyItem text="Item 3" />
          </div>
        </Suspense>
      )
    }

    const result = await testRender(<Component />)
    // Should show fallback for all children
    t.eq(result[0].textContent, 'Loading items...')

    // Resolve factory
    resolveFactory()
    await new Promise(resolve => setTimeout(resolve, 50))
  })

  // Test 3: Nested Suspense with lazy components
  await t.test('suspense: nested lazy boundaries', async (t) => {
    let resolveOuter: any
    let resolveInner: any
    const outerPromise = new Promise(resolve => {
      resolveOuter = resolve
    })
    const innerPromise = new Promise(resolve => {
      resolveInner = resolve
    })

    const LazyOuter = lazy(() =>
      outerPromise.then(() => ({
        default: () => <div>Outer content</div>
      }))
    )

    const LazyInner = lazy(() =>
      innerPromise.then(() => ({
        default: () => <div>Inner content</div>
      }))
    )

    const Component = () => {
      return (
        <Suspense fallback={<div>Outer loading...</div>}>
          <LazyOuter />
          <Suspense fallback={<div>Inner loading...</div>}>
            <LazyInner />
          </Suspense>
        </Suspense>
      )
    }

    const result = await testRender(<Component />)
    // Should show outer fallback
    t.eq(result[0].textContent, 'Outer loading...')

    resolveOuter()
    await new Promise(resolve => setTimeout(resolve, 50))
  })

  // Test 4: Lazy component with state changes
  await t.test('suspense: lazy with state updates', async (t) => {
    let resolveFactory: any
    const factoryPromise = new Promise(resolve => {
      resolveFactory = resolve
    })

    const LazyCounter = lazy(() =>
      factoryPromise.then(() => ({
        default: ({ count }: any) => <div>{count}</div>
      }))
    )

    const Component = () => {
      const [count, setCount] = useState(0)

      const increment = () => setCount(count + 1)

      return (
        <>
          <button onClick={increment}>Increment</button>
          <Suspense fallback={<div>Loading counter...</div>}>
            <LazyCounter count={count} />
          </Suspense>
        </>
      )
    }

    const result = await testRender(<Component />)
    const [button, fallback] = result

    // Initially show fallback
    t.eq(fallback.textContent, 'Loading counter...')

    // Resolve factory
    resolveFactory()
    await new Promise(resolve => setTimeout(resolve, 50))

    // Click button - component should update
    button.click()
    await new Promise(resolve => setTimeout(resolve, 50))
  })

  // Test 5: Multiple lazy components with different timings
  await t.test('suspense: multiple lazy with sequential resolves', async (t) => {
    let resolveFirst: any
    let resolveSecond: any
    const firstPromise = new Promise(resolve => {
      resolveFirst = resolve
    })
    const secondPromise = new Promise(resolve => {
      resolveSecond = resolve
    })

    const LazyFirst = lazy(() =>
      firstPromise.then(() => ({
        default: () => <span>First</span>
      }))
    )

    const LazySecond = lazy(() =>
      secondPromise.then(() => ({
        default: () => <span>Second</span>
      }))
    )

    const Component = () => {
      return (
        <Suspense fallback={<div>Loading...</div>}>
          <LazyFirst />
          <LazySecond />
        </Suspense>
      )
    }

    const result = await testRender(<Component />)
    // Should show fallback while any component is loading
    t.eq(result[0].textContent, 'Loading...')

    // Resolve first - still loading second
    resolveFirst()
    await new Promise(resolve => setTimeout(resolve, 50))

    // Resolve second
    resolveSecond()
    await new Promise(resolve => setTimeout(resolve, 50))
  })
}
