// eslint-disable-next-line import/no-unresolved
import { PLUGIN_EVENTS } from "https://www.hlx.live/tools/sidekick/library/events/events.js";

const PROPS = {
  AUTHOR_ID: "id",
  AUTHOR_FULL_NAME: "fullName",
  AUTHOR_SHORT_NAME: "shortName",
};

function getFilteredAuthors(data, query) {
  if (!query) {
    return data;
  }

  const searchString = query.trim().toLowerCase();

  return data.filter(
    (item) =>
      item[PROPS.AUTHOR_FULL_NAME].toLowerCase().includes(searchString)
      || item[PROPS.AUTHOR_ID].toLowerCase().includes(searchString)
  );
}

/**
 * Called when a user tries to load the plugin
 * @param {HTMLElement} container The container to render the plugin in
 * @param {Object} data The data contained in the plugin sheet
 * @param {string} query If search is active, the current search query
 */
export async function decorate(container, data, query) {

  const createMenuItems = () => {
    const filteredAuthors = getFilteredAuthors(data, query);
    return filteredAuthors
      .map(
        (item) => `
          <sp-menu-item value="${item[PROPS.AUTHOR_FULL_NAME]} (${item[PROPS.AUTHOR_ID]})" data-clipboard-value="${item[PROPS.AUTHOR_FULL_NAME]}">
            ${item[PROPS.AUTHOR_FULL_NAME]} <span class="author-id">(${item[PROPS.AUTHOR_ID]})</span>
          </sp-menu-item>
        `
      )
      .join("");
  };

  const handleCopyButtonClick = (e) => {
    const { clipboardValue } = e.target.dataset;
    navigator.clipboard.writeText(clipboardValue);
    container.dispatchEvent(
      new CustomEvent(PLUGIN_EVENTS.TOAST, {
        detail: { message: "Copied Author" },
      })
    );
  };

  const spContainer = document.createElement("div");
  spContainer.classList.add("container");
  spContainer.innerHTML = `
      <sp-menu>
        ${createMenuItems()}
      </sp-menu> `;
  container.append(spContainer);

  spContainer.querySelectorAll("sp-menu-item").forEach((item) => {
    item.addEventListener("click", handleCopyButtonClick);
  });
}

export default {
  title: "Authors",
  searchEnabled: true,
};
