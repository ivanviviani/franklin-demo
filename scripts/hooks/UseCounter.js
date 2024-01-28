import { useStore } from '../libs/vendor/nanostores/nanostores-preact.js';
import { action, atom } from '../libs/vendor/nanostores/nanostores.js';
import { useSignal } from '../libs/vendor/preact/preact.js';

const $counter = atom(0);
const $increment = action($counter, 'increment', (store) => {
  store.set(store.get() + 1);
});
const $decrement = action($counter, 'decrement', (store) => {
  store.set(store.get() - 1);
});
const $reset = action($counter, 'reset', (store) => {
  store.set(0);
});

const useGlobalCounter = () => [
  useStore($counter), { increment: $increment, decrement: $decrement, reset: $reset },
];

const useCounter = () => {
  const counter = useSignal(0);
  const increment = () => { counter.value += 1; };
  const decrement = () => { counter.value -= 1; };
  const reset = () => { counter.value *= 0; };

  return [counter, { increment, decrement, reset }];
};

export { useCounter, useGlobalCounter };
