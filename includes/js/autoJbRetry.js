// add near the top of includes/js/autoJbRetry.js

const RETRY_COUNT_KEY = 'retryCount';
const JAILBREAK_NOW_KEY = 'jailbreakNow';
const MAX_RETRY_COUNT = 3;

function getRetryCount() {
    return parseInt(sessionStorage.getItem(RETRY_COUNT_KEY) || '0', 10) || 0;
}

function setRetryCount(count) {
    sessionStorage.setItem(RETRY_COUNT_KEY, String(count));
}

function incrementRetryCount() {
    const nextCount = getRetryCount() + 1;
    setRetryCount(nextCount);
    return nextCount;
}

function clearRetryState() {
    sessionStorage.removeItem(RETRY_COUNT_KEY);
    sessionStorage.removeItem(JAILBREAK_NOW_KEY);
}

function showJbRetryModal(options = {}) {
    const modal = document.getElementById('jb-retry-modal');
    const title = document.getElementById('jb-retry-title');
    const text = document.getElementById('jb-retry-text');
    const retryBtn = document.getElementById('jb-retry-now-button');
    const restartBtn = document.getElementById('jb-restart-button');
    const continueBtn = document.getElementById('jb-continue-button');

    if (!modal) return;

    if (title) title.textContent = options.title || 'Jailbreak failed';
    if (text) text.textContent = options.text || 'What would you like to do next?';

    if (retryBtn) {
        retryBtn.style.display = options.showRetryNow === false ? 'none' : '';
    }

    modal.classList.add('is-visible');
}

function hideJbRetryModal() {
    const modal = document.getElementById('jb-retry-modal');
    if (!modal) return;
    modal.classList.remove('is-visible');
}
