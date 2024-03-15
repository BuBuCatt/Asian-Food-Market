

const button = document.querySelector('#switch');
const container = document.documentElement;
const userTheme = sessionStorage.getItem('theme');

// loading page
document.addEventListener('DOMContentLoaded', () => {
    if (userTheme === 'dark-mode') {
        clickDarkMode();
    } else if (userTheme === '') {
        clickLightMode();
    }
})

// change event
button.addEventListener('change', (e) => {
    if (e.target.checked) {
        clickDarkMode();
    } else {
        clickLightMode();
    }
})

// dark mode / light mode change event
function clickDarkMode() {
    sessionStorage.setItem("theme", "dark-mode");
    container.setAttribute('theme', 'dark-mode');
    button.checked = true;
}
function clickLightMode() {
    sessionStorage.setItem("theme", "");
    container.setAttribute('theme', '');
    button.checked = false;
}

