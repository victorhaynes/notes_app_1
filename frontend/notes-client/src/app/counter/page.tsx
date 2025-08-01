'use client'

import React from 'react'
import useCounter from '../_context/CounterContext'

const CounterPage = () => {
  const { count, increment, decrement, reset} = useCounter();

  return (
    <>
      <h2>Count: {count}</h2>
      <div className='flex gap-2'>
        <button onClick={increment}>increment</button>
        <button onClick={decrement}>decrement</button>
        <button onClick={reset}>reset</button>
      </div>
    </>
  )
}

export default CounterPage