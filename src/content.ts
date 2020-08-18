const manifestData = chrome.runtime.getManifest();
const targets = manifestData.web_accessible_resources || [];

targets.forEach((target) => {
  const scriptElement = document.createElement('script');
  scriptElement.setAttribute('src', chrome.extension.getURL(target));
  document.documentElement.appendChild(scriptElement);
});
