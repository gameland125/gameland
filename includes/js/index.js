// @ts-nocheck
var user = {
  currentLanguage: localStorage.getItem('language') || 'en',
  currentJbFlavor: localStorage.getItem('jailbreakFlavor') || 'GoldHEN',
  platform: "PS4",
  lastTab: localStorage.getItem('lastTab') || 'tools',
  advancedPayloads: localStorage.getItem('advancedPayloads') || false,
  ip: localStorage.getItem('PayLoaderIp') || window.location.hostname,
  ps4Fw: localStorage.getItem('ps4Fw'),
  clearLog: true,
  bareboneJB: localStorage.getItem('bareboneJB') === 'true',
  lapseChain: localStorage.getItem('lapseChain') === "true",
  blockJailbreak: false,
}

var autoJbInterval;
let lastScrollY = 0;
let lastSection = "initial";
var devMode = false;
var rtlLangs = ["ar", "fa"];

// Helper for Retry Logic
function checkRetryCount() {
    let attempts = parseInt(sessionStorage.getItem('jbAttempts') || '0');
    attempts++;
    sessionStorage.setItem('jbAttempts', attempts.toString());
    
    if (attempts >= 3) {
        log("تعداد تلاش‌های ناموفق به ۳ رسید. لطفا کنسول را ریستارت کنید.", "red");
        alert("تعداد تلاش‌های ناموفق زیاد بود. پیشنهاد می‌شود کنسول را یک بار خاموش و روشن کنید.");
        // در اینجا می‌توانید متد Retry/Restart را فراخوانی کنید
        return false;
    }
    return true;
}

const ui = {
  mainContainer: document.querySelector('.mainContainer'),
  initialScreen: document.getElementById('initial-screen'),
  exploitScreen: document.getElementById('exploit-main-screen'),
  settingsBtn: document.getElementById("settings-btn"),
  aboutBtn: document.getElementById("about-btn"),
  psLogoContainer: document.getElementById('ps-logo-container'),
  clickToStartText: document.getElementById('click-to-start-text'),
  ps4FwStatus: document.getElementById('PS4FW'),
  stopAutoJbBtn: document.getElementById('stopAutoJb'),
  consoleElement: document.getElementById('console'),
  toolsSection: document.getElementById('tools'),
  toolsTab: document.getElementById('tools-tab'),
  linuxSection: document.getElementById('linux'),
  linuxTab: document.getElementById('linux-tab'),
  advancedPayloadsSection: document.getElementById('advanced'),
  advancedPayloadsTab: document.getElementById('advanced-tab'),
  advancedPayloadsContainer: document.querySelector('.advancedPayloadsTab'),
  advancedPayloadsInput: document.getElementById('advancedPayloadsInput'),
  customPayloadsSection: document.getElementById('custom'),
  customPayloadsTab: document.getElementById('custom-tab'),
  customPayloadInput: document.getElementById('customPayloadInput'),
  sendCustomPayloadBtn: document.getElementById('sendCustomPayloadBtn'),
  successRateText: document.getElementById('successRate'),
  payloadsSection: document.getElementById('payloadsSection'),
  payloadsList: document.getElementById("payloadsGrid"),
  payloadsSectionTitle: document.getElementById('payloads-section-title'),
  exploitRunBtn: document.getElementById('exploitRun'),
  secondHostBtn: document.querySelectorAll('.secondHostBtn'),
  ps4IpInput: document.getElementById('ps4IpInput'),
  ps4FwSelect: document.getElementById('ps4FwSelect'),
  aboutPopupOverlay: document.getElementById('about-popup-overlay'),
  aboutPopup: document.getElementById('about-popup'),
  settingsPopupOverlay: document.getElementById('settings-popup-overlay'),
  settingsPopup: document.getElementById('settings-popup'),
  chooseFanThresholdOverlay: document.getElementById('choose-fanThreshold-overlay'),
  chooseFanThreshold: document.getElementById('choose-fanThreshold'),
  scanGoldHENPayLoader: document.getElementById('scanPayLoader'),
  shutdownServerBtn: document.getElementById('shutdownServerBtn'),
  autoJbRetry: document.getElementById('autoJbRetry'),
  bareboneJbBtn: document.getElementById('bareboneJB'),
  bareboneJBInput: document.getElementById('bareboneJBInput'),
  exploitChainTitle: document.getElementById('exploitChainTitle'),
  userlandOnlyOnJB67x: document.getElementById('userlandOnlyOnJB67xInput'),
  langRadios: document.querySelectorAll('#chooselang input[name="language"]'),
};

function loadLastTab() {
  if (user.lastTab == "advanced" && user.advancedPayloads != "true") {
    user.lastTab = "tools";
    ui.toolsSection.click();
  }
  if(document.getElementById(user.lastTab)) {
      document.getElementById(user.lastTab).classList.remove('hidden');
      document.getElementById(user.lastTab + '-tab').setAttribute("aria-selected", "true");
  }
}

function saveLastTab(tab) {
  user.lastTab = tab;
  localStorage.setItem('lastTab', tab);
  const sections = {
    'tools': ui.toolsSection,
    'linux': ui.linuxSection,
    'advanced': ui.advancedPayloadsSection,
    'custom': ui.customPayloadsSection
  };
  Object.keys(sections).forEach(key => {
    if (key !== tab && sections[key] && key != 'custom') {
      sections[key].innerHTML = '';
    }
  });
}

function aboutPopup() { ui.aboutPopupOverlay.classList.toggle('hidden'); }
function settingsPopup() { ui.settingsPopupOverlay.classList.toggle('hidden'); }
function chooseFanThreshold() { ui.chooseFanThresholdOverlay.classList.toggle('hidden'); }

if (localStorage.getItem("NewUser") != "0") { settingsPopup(); }

function updateUserlandOnlyOnJB67x(checked) { localStorage.setItem('userlandOnlyOnJB67x', checked); }
function userlandOnlyOnJB67x() {
  var value = localStorage.getItem('userlandOnlyOnJB67x') == "true";
  if(ui.userlandOnlyOnJB67x) ui.userlandOnlyOnJB67x.checked = value;
}

function sleep(ms = 0) { return new Promise(resolve => setTimeout(resolve, ms)); }

async function jailbreak() {
  if (user.platform !== "PS4") return;
  ui.consoleElement.textContent = '';
  if (autoJbInterval) clearInterval(autoJbInterval);
  sessionStorage.setItem('autoJbRetry', 'true');

  if (sessionStorage.getItem('payload_path') == null) {
    chooseHEN();
  }

  cleanUp();

  if (user.bareboneJB) {
    location.href = "./exploit.html";
    return;
  }
  let fwVersion = Number(user.ps4Fw);

  switch (true) {
    case (fwVersion >= 6.70 && fwVersion <= 6.72):
      log("Initializing Exploit...");
      var value = localStorage.getItem('userlandOnlyOnJB67x') == "true";
      if (value) {
        localStorage.setItem('userlandOnlyOnJB67x', "false");
        sessionStorage.setItem("jailbreakNow", 'true');
        location.reload();
      }
      badHoistJailbreak();
      break;
    case (fwVersion >= 7.00 && fwVersion <= 9.60):
      psfreeLapse();
      break;
  }
  updateJbStats(1, 0);
}

async function psfreeLapse() {
  if (user.lapseChain) {
    try { await loadScript('./src/alert.mjs'); } catch (e) { log("alert.mjs is not defined", "red"); }
  } else {
    log("Loading Feyzee61's PSFree Lapse implementation..");
    try {
      await loadScript('./includes/js/exploits/bundle.js');
      if (typeof doJailBreak === "function") { doJailBreak(); } 
      else { log("Error: doJailBreak is not defined", "red"); }
    } catch (e) { log("Failed to load bundle script: " + e.message, "red"); }
  }
}

async function badHoistJailbreak() {
  if (window.entrypoint672_result < 1) {
    log("An error occured during Bad Hoist Entrypoint\nRetrying..", "orange");
    await sleep(2000);
    if(checkRetryCount()) location.reload();
    return;
  }
  else log("Bad Hoist Entrypoint succeeded");
  
  if (window.exploitsetup672_result < 1) {
    log("An error occured during Exploit Setup\nPlease refresh page...", "red");
    return;
  }
  else log("Exploit Setup complete\n");
  
  log("Starting Kernel Exploit...");
  await sleep(200);

  await loadScript('./includes/js/exploits/672kexploit.js');
  var result = KernelExploit672();

  if (result === 0 || result === 91) {
    log("\nKernel exploit succeeded", "green");
    getPayload672(sessionStorage.getItem('payload_path'));
    jailbreakSuccess();
  } else if (result === 179) {
    getPayload672(sessionStorage.getItem('payload_path'));
    log("\nAlready jailbroken, skipping..", "green");
    jailbreakSuccess();
  } else {
    log("\nAn error occured. Please restart console.", "red");
  }
}

function jailbreakSuccess() {
  // Clear retry counter on success
  sessionStorage.removeItem('jbAttempts');
  
  if (sessionStorage.getItem('jailbreakNow') == "true" && user.ps4Fw >= 6.70 && user.ps4Fw <= 6.72) {
    sessionStorage.removeItem('jailbreakNow');
    localStorage.setItem("userlandOnlyOnJB67x", "false");
  }
  sessionStorage.setItem('autoJbRetry', 'false');
  updateJbStats(0, 1);
  
  // Custom: UI Feedback
  log("GoldHEN loaded successfully! Closing...", "green");
  
  // Custom: Hide UI
  setTimeout(() => { 
      window.location.replace("about:blank"); 
  }, 2000);
}

function getScript(source) {
  return new Promise((resolve, reject) => {
    const gs = document.createElement('script');
    gs.src = source;
    gs.async = false;
    gs.onload = () => resolve();
    gs.onerror = () => reject(new Error("Script load failed: " + source));
    document.body.appendChild(gs);
  });
}

async function loadScript(script_js) {
  window.script_loaded = 0;
  await getScript(script_js);
  while (window.script_loaded < 1) { await sleep(50); }
}

async function Loadpayloads(payload, name, payloadId) {
  // ... (کد فعلی شما)
}

async function loadSettings() {
  try {
    CheckFW();
    loadJbFlavor();
    await initLanguage();
    loadTheme();
    loadColor();
    renderPayloads(payloadsList);
    loadAdvancedPayloads();
    loadLastTab();
    loadGoldHENVer();
    autoJailbreak();
    updateBareboneJB();
    loadLapseChain();
    userlandOnlyOnJB67x();
  } catch (e) { console.error("Error in loadSettings: " + e.message); }
}

// ... باقی توابع بدون تغییر (renderPayloads, DLProgress, و غیره)
