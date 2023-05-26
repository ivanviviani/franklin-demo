export default function decorate(block) {
    const [rawQuote] = [...block.firstElementChild.children];
    const blockquote = document.createElement('blockquote');
    blockquote.classList.add('quote');
    blockquote.innerText = rawQuote.textContent;
    block.replaceWith(blockquote);
}