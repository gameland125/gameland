const body = document.body;
const message = document.getElementById('message');
const errorControls = document.getElementById('error-controls');

const STATES = {
    PREPARING: 'state-preparing',
    SUCCESS: 'state-success',
    ERROR: 'state-error'
};

function setState(state, text) {
    body.classList.remove(STATES.PREPARING, STATES.SUCCESS, STATES.ERROR);
    body.classList.add(state);
    message.textContent = text;

    if (state === STATES.ERROR) {
        errorControls.classList.remove('hidden');
    } else {
        errorControls.classList.add('hidden');
    }
}

function goToMenu() {
    window.location.href = 'about:blank';
}

function handleSuccess() {
    localStorage.setItem('gameland-ready', 'true');
    setState(STATES.SUCCESS, 'آماده شد');
    setTimeout(goToMenu, 2000);
}

function handleError() {
    setState(STATES.ERROR, 'خطا در آماده‌سازی');
}

async function prepareApp() {
    try {
        setState(STATES.PREPARING, 'در حال آماده‌سازی...');

        if (!('serviceWorker' in navigator)) {
            throw new Error('Service Worker not supported');
        }

        const registration = await navigator.serviceWorker.ready;

        if (!registration) {
            throw new Error('Service Worker registration failed');
        }

        handleSuccess();
    } catch (error) {
        console.error('gameland prepare error:', error);
        handleError();
    }
}

window.addEventListener('load', () => {
    const alreadyReady = localStorage.getItem('gameland-ready') === 'true';

    if (alreadyReady) {
        goToMenu();
        return;
    }

    prepareApp();
});
