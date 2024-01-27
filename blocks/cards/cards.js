import { createSignal, onCleanup } from 'solid-js';
import html from 'solid-js/html';
import { render } from 'solid-js/web';
import { createOptimizedPicture } from '../../scripts/lib-franklin.js';
import { waitForDependency } from '../../scripts/scripts.js';

const Counter = (init) => {
  const [count, setCount] = createSignal(init ?? 0);
  return html`
    <li>
      <button type="button" class="p-4 bg-red" onclick="${() => setCount((c) => c - 1)}">-</button>
      <span class="font-semibold">Count value is ${() => count()}</span>
      <button type="button" class="p-4 bg-green" onclick="${() => setCount((c) => c + 1)}">+</button>
    </li>
  `;
};

export default async function decorate(block) {
  await waitForDependency('solid-js');
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
  render(() => [Counter, Counter(120)], ul);
}
