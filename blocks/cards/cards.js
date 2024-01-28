import { createOptimizedPicture } from '../../scripts/lib-franklin.js';
import { render } from '../../scripts/libs/vendor/preact/preact.js';
import html from '../../scripts/libs/vendor/preact/html.js';
import { $readNotification, $user } from '../../scripts/stores/user.js';
import { useStore } from '../../scripts/libs/vendor/nanostores/nanostores-preact.js';
import { useCounter, useGlobalCounter } from '../../scripts/hooks/UseCounter.js';

function GlobalCounter() {
  const [count, { increment, decrement, reset }] = useGlobalCounter();
  const user = useStore($user);

  return html`
    <li class="flex flex-col gap-1">
      <div>User: ${user.name} ${user.surname} | ${user.notifications}</div>
      <div class="flex gap-2 items-center">
        <button type="button" className="p-4 bg-red-600" onClick=${decrement}>-</button>
        <span class="font-semibold">Global counter ${count}</span>
        <button type="button" class="p-4 bg-green-500" onClick=${increment}>+</button>
      </div>
      <button type="button" class="w-fit p-4 bg-cyan-600" onClick=${reset}>Reset counter</button>
      <button type="button" class="w-fit p-4 bg-yellow-400" onClick=${$readNotification}>Read notification</button>
    </li>
  `;
}

function Counter() {
  const [count, { increment, decrement, reset }] = useCounter();
  const user = useStore($user);

  return html`
    <li class="flex flex-col gap-1">
      <div>User: ${user.name} ${user.surname} | ${user.notifications}</div>
      <div class="flex gap-2 items-center">
        <button type="button" className="p-4 bg-red-600" onClick=${decrement}>-</button>
        <span class="font-semibold">Count value is ${count.value}</span>
        <button type="button" class="p-4 bg-green-500" onClick=${increment}>+</button>
      </div>
      <button type="button" class="w-fit p-4 bg-cyan-600" onClick=${reset}>Reset counter</button>
      <button type="button" class="w-fit p-4 bg-yellow-400" onClick=${$readNotification}>Read notification</button>
    </li>
  `;
}

export default async function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    li.innerHTML = row.innerHTML;
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-card-image';
      else div.className = 'cards-card-body';
    });
    ul.append(li);
  });
  ul.querySelectorAll('img').forEach((img) => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));
  block.textContent = '';
  block.append(ul);
  setTimeout(() => {
    // after logging in, read user information and populate the user store
    $user.setKey('name', 'Mario');
    $user.setKey('surname', 'Rossi');
    $user.setKey('notifications', 5);
  }, 2000);
  render(html`<${Counter} /><${GlobalCounter} /><${GlobalCounter} />`, ul);
}
