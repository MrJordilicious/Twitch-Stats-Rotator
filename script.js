/* 
AUTHOR: MRJORDILICIOUS
URL:    HTTPS://MRJORDILICIOUS.COM
TWITCH: HTTPS://TWITCH.TV/MRJORDILICIOUS
KOFI:   HTTPS://KO-FI.COM/MRJORDILICIOUS
LINKS:  HTTPS://LINKS.MRJORDILICIOUS.COM 
*/

//////////////// 
// PARAMETERS //
////////////////

const containerEl = document.getElementById('stat-widget');
const headerEl = document.getElementById('stat-header');
const valueEl = document.getElementById('stat-value');

const urlParams = new URLSearchParams(window.location.search);
const username = urlParams.get("username") || ""; // fallback if not provided
const fontName = params.get("font") || "Passion One"; // Default to Passion One if not specified
const fontColor = urlParams.get("color") || "FFFFFF"; // set font color, default is white
const textAlign = urlParams.get("direction") || "left"; // set alignment, default is left

//////////
// CODE //
//////////

// CSS variable font-family
document.documentElement.style.setProperty(
    "--font-family",
    `"${fontName}"`
);

// Google Fonts loader
const link = document.createElement("link");
link.rel = "stylesheet";
link.href =
    "https://fonts.googleapis.com/css2?family=" +
    encodeURIComponent(fontName).replace(/%20/g, "+") +
    "&display=swap";

document.head.appendChild(link);

// Color hex selector
let cssColor = fontColor.replace(/^%23|^#/, "");

  // If it's 3 or 6 hex digits, prepend #
  if (/^[0-9A-Fa-f]{3}$/.test(cssColor) || /^[0-9A-Fa-f]{6}$/.test(cssColor)) {
      cssColor = "#" + cssColor;
  }

// CSS variable font-color
document.documentElement.style.setProperty(
    "--color",
    cssColor
);

// CSS variable text-align
document.documentElement.style.setProperty(
    "--text-align",
    textAlign
);

// Fallback values to display while loading/fetching
let currentStats = {
  viewers: "Loading...",
  followers: "Loading...",
  subs: "Loading...",
  uptime: "Loading...",
  game: "Loading..."
};

// Fetch stats from Decapi.me
async function fetchStats() {
  try {
    const [viewers, followers, subs, uptime, game] = await Promise.all([
      fetchText(`https://decapi.me/twitch/viewercount/${username}`),
      fetchText(`https://decapi.me/twitch/followcount/${username}`),
      fetchText(`https://decapi.me/twitch/subcount/${username}`),
      fetchText(`https://decapi.me/twitch/uptime/${username}?precision=2`),
      fetchText(`https://decapi.me/twitch/game/${username}`)
    ]);

    currentStats.viewers = viewers;
    currentStats.followers = followers;
    currentStats.subs = subs;
    currentStats.uptime = uptime;
    currentStats.game = game;
  } catch (err) {
    console.error("Error fetching stats:", err);
  }
}

// Helper function to fetch plain text
async function fetchText(url) {
  const res = await fetch(url);
  return await res.text();
}

// Function to truncate game if it's longer than 16 characters
game_truncate = function(str, length, ending) {
    // If the length parameter is not provided, set it to 100 characters
    if (length == null) {
      length = 10;
    }
    // If the ending parameter is not provided, set it to '...'
    if (ending == null) {
      ending = '...';
    }
    // Check if the length of the input string exceeds the specified length
    if (str.length > length) {
      // If yes, truncate the string to length - ending.length characters and append the ending
      return str.substring(0, length - ending.length) + ending;
    } else {
      // If no, return the original string
      return str;
    }
  };

// Stats list to rotate through
const stats = [
  {
    header: "TIME",
    getValue: () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  },
  {
    header: "DATE",
    getValue: () => new Date().toLocaleDateString('default', { day: 'numeric', month: 'long', year: 'numeric'})
  },
  {
    header: "VIEWERS",
    getValue: () => `👤 ${currentStats.viewers}`
  },
  {
    header: "FOLLOWERS",
    getValue: () => `🖤 ${currentStats.followers}`
  },
  {
    header: "SUBS",
    getValue: () => `⭐️ ${currentStats.subs}`
  },
  {
    header: "LIVE FOR",
    getValue: () => currentStats.uptime
  },
  {
    header: "NOW PLAYING",
    getValue: () => (game_truncate(currentStats.game,20))
  }
];

let currentIndex = 0;

function resetAnimation(el, animationClass) {
  el.classList.remove(animationClass, 'slide-out');
  void el.offsetWidth; // Force reflow
  el.classList.add(animationClass);
}

function showNextStat() {
  const stat = stats[currentIndex];

  // Update content
  headerEl.textContent = stat.header;
  valueEl.textContent = stat.getValue();

  // Animate IN
  resetAnimation(headerEl, 'slide-in');
  setTimeout(() => {
    resetAnimation(valueEl, 'slide-in-delayed');
  }, 50);

  // Animate OUT after 12s
  setTimeout(() => {
    headerEl.classList.remove('slide-in', 'slide-in-delayed');
    valueEl.classList.remove('slide-in', 'slide-in-delayed');
    headerEl.classList.add('slide-out');
    valueEl.classList.add('slide-out');
  }, 5000); //visible for 5 seconds

  // Next stat after 14s total
  setTimeout(() => {
    currentIndex = (currentIndex + 1) % stats.length;
    showNextStat();
  }, 5500); //delay of .5 second before next stat
}

// Initial load
fetchStats();
setInterval(fetchStats, 30000); // Update every 30s
showNextStat(); 