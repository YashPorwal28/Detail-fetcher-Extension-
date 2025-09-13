function getText() {
  const el = document.querySelector(
    ".clxbNyEgAwmoRyXgsJxSwGUmWKswenYcQ.inline-show-more-text--is-collapsed.inline-show-more-text--is-collapsed-with-line-clamp"
  );
  return el ? el.innerText.trim() : "Not found";
}

function getName() {
  const el = document.querySelector(
    ".MeqKQnqqVbSRybNmNRQbtkuaVZtSjLcjQQgE.inline.t-24.v-align-middle.break-words"
  );
  return el ? el.innerText.trim() : "Not found";
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "fetchText") {
    sendResponse({ text: getText() });
  }
  if (msg.action === "fetchName") {
    sendResponse({ name: getName() });
  }
});
