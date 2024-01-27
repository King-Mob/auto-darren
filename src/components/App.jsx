import { useState } from "react";

export default function App() {
  const [counter, setCounter] = useState(0);

  return (
    <div>
      <h1>I am Darren, and I'm reacting!</h1>
      <h1>You've made me react {counter} times</h1>
      <button onClick={() => setCounter(counter + 1)}>Increase</button>
    </div>
  );
}
