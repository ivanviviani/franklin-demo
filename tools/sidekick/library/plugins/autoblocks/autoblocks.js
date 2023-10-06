import {
  loadBlock,
  loadTemplate,
  onBlockListCopyButtonClicked,
  renderScaffolding,
} from "../utils/blocks.js";
import { createTag } from "../utils/dom.js";

/**
 * Called when a user tries to load the plugin
 * @param {HTMLElement} container The container to render the plugin in
 * @param {Object} data The data contained in the plugin sheet
 * @param {string} query If search is active, the current search query
 */
export async function decorate(container, data, query) {
  container.dispatchEvent(new CustomEvent("ShowLoader"));

  const content = createTag(
    "div",
    { class: "block-library" },
    renderScaffolding()
  );
  container.append(content);
  const listContainer = content.querySelector(".list-container");

  const blockList = createTag("block-list");
  listContainer.append(blockList);

  blockList.addEventListener("PreviewBlock", (e) => {
    window.open(e.details.path, "_blockpreview");
  });

  // Handle LoadTemplate events
  blockList.addEventListener("LoadTemplate", (loadPageEvent) =>
    loadTemplate(loadPageEvent, container)
  );

  // Handle LoadBlock events
  blockList.addEventListener("LoadBlock", (loadBlockEvent) =>
    loadBlock(loadBlockEvent, container)
  );

  // Handle CopyBlock events from the block list
  blockList.addEventListener("CopyBlock", (blockListCopyEvent) =>
    onBlockListCopyButtonClicked(blockListCopyEvent, container)
  );

  const search = content.querySelector("sp-search");
  search.addEventListener("input", (e) => {
    blockList.filterBlocks(e.target.value);
  });

  await blockList.loadBlocks(data, container);

  // Show blocks and hide loader
  container.dispatchEvent(new CustomEvent("HideLoader"));
}

export default {
  title: "Autoblocks",
  searchEnabled: false, // search handled internally
};
