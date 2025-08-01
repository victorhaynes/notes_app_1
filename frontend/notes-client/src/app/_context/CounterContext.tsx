"use client"
import { createContext, useState, useContext } from "react"

// Defining the context type
interface CounterContextType {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
}

// Creating the context
const CounterContext = createContext<CounterContextType | undefined>(undefined);

// Provider component
export function CounterProvider({children}: {children: React.ReactNode}){
  const [count, setCount] = useState(0);

  const increment = () => setCount(prevCount => prevCount + 1);
  const decrement = () => setCount(prevCount => prevCount - 1);
  const reset = () => setCount(0);

  const value = {
    count,
    increment,
    decrement,
    reset
  }

  return (
    <CounterContext.Provider value={value}>
      {children}
    </CounterContext.Provider>
  );

}

// Context will only be undefined if it is used outside of the provider
// React will not throw an error in this scenario and state will not work correctly
// So we check if context is accessed appropriately and throw an error if it is not
export default function useCounter(){
  const context = useContext(CounterContext);
  if (context === undefined){
    throw new Error("useCounter() must be used within a CounterProvider child.")
  }
  return context;
}
