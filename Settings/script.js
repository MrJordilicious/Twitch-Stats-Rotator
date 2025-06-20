/* 
AUTHOR: MRJORDILICIOUS
URL:    HTTPS://MRJORDILICIOUS.COM
TWITCH: HTTPS://TWITCH.TV/MRJORDILICIOUS
KOFI:   HTTPS://KO-FI.COM/MRJORDILICIOUS
LINKS:  HTTPS://LINKS.MRJORDILICIOUS.COM  
*/

const BASE_URL = "https://widgets.mrjordilicious.com/Twitch-Stats-Rotator"; // Replace with your actual widget base URL

const param1El = document.getElementById("param1");
const param2El = document.getElementById("param2");
const resultEl = document.getElementById("result");
const copyBtn = document.getElementById("copyBtn");
const copyMsg = document.getElementById("copyMsg");
const iframeEl = document.getElementById("widgetPreview");

function updateURL() {
  // Clear form values on page load
window.addEventListener("load", () => {
  param1El.value = "";
  param2El.value = "";
  updateURL(); // trigger update for iframe + URL
});
  
    const params = [];

  if (param1El.value.trim()) {
    params.push("username=" + encodeURIComponent(param1El.value.trim()));
  }
  if (param2El.value.trim()) {
    params.push("color=" + encodeURIComponent(param2El.value.trim()));
  }

  const fullURL = BASE_URL + (params.length ? "?" + params.join("&") : "");

  resultEl.textContent = fullURL;
  iframeEl.src = fullURL;
}

// Update on load and whenever any input changes
[param1El, param2El].forEach(el => {
  el.addEventListener("input", updateURL);
});

copyBtn.addEventListener("click", () => {
  navigator.clipboard.writeText(resultEl.textContent).then(() => {
    copyMsg.style.display = "inline";
    setTimeout(() => copyMsg.style.display = "none", 1500);
  });
});

// Initial run
updateURL();
