import "./index.css";

import worker from "./test.worker.ts";

console.log(worker);
console.log(import.meta);

worker.test();

import { createSignal, onCleanup } from "solid-js";
import { render } from "solid-js/web";

const App = () => {
  const [count, setCount] = createSignal(0),
    timer = setInterval(() => setCount(count() + 1), 1000);
  onCleanup(() => clearInterval(timer));
  return <div>${count}</div>;
};

render(App, main);

console.log("Hello via Bun!");
