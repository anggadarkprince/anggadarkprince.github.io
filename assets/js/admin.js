/*---------- ACCORDION ----------*/
const actionToggles = document.querySelectorAll(".action-toggle");
actionToggles.forEach(item => item.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(item.getAttribute('href'));
    if (target) {
        if (target.classList.contains('collapse')) {
            target.classList.remove('collapse');
            item.classList.remove('collapsed');
        } else {
            target.classList.add('collapse');
            item.classList.add('collapsed');
        }
    }
}));

/*---------- MENU TOGGLE ----------*/
const menuToggle = document.querySelector('.button__menu-toggle');
const sidebar = document.querySelector('.sidebar');
menuToggle.addEventListener('click', e => {
    e.preventDefault();
    sidebar.classList.toggle('sidebar-collapse');
    localStorage.setItem('sidebar-collapse', sidebar.classList.contains('sidebar-collapse') ? '1' : '0');
});

/*---------- TABLE RESPONSIVE ----------*/
const setViewport = function() {
    if (window.innerWidth > 991) {
        if (localStorage.getItem('sidebar-collapse') === '0') {
            sidebar.classList.remove('sidebar-collapse');
        }
    } else {
        sidebar.classList.add('sidebar-collapse');
    }

    const tables = document.querySelectorAll('.table__responsive');
    if (window.innerWidth >= 768 ) {
        Array.from(tables).forEach(table => {
            table.querySelectorAll('.responsive-label').forEach(label => label.remove());
            table.querySelectorAll('td').forEach(td => td.style.removeProperty('text-align'));
        });
    }
    else {
        Array.from(tables).forEach((table, i) => {
            const head = Array.from(table.querySelectorAll('thead th')).map(item => {
                return item.innerText;
            });
            table.querySelectorAll('tbody tr').forEach(tr => {
                if (tr.querySelectorAll('.responsive-label').length === 0) {
                    if (tr.querySelectorAll('td').length === head.length) {
                        tr.querySelectorAll('td').forEach((td, i) => {
                            const titleEl = document.createElement('span');
                            titleEl.innerText = head[i];
                            titleEl.classList.add('responsive-label');
                            td.prepend(titleEl);
                            td.style.removeProperty('max-width');
                            td.style.textAlign = 'left';
                            td.querySelectorAll('input').forEach(input => {
                                input.style.removeProperty('max-width');
                            });
                        })
                    }
                }
            });
        });
    }
};
setViewport();
window.onresize = function() {
    setViewport();
};

/*---------- DROPDOWN ----------*/
function toggleDropdown(dropdown) {
    if (dropdown) {
        const dropdownMenu = dropdown.querySelector('.dropdown__menu');
        dropdown.classList.toggle('open')
        dropdownMenu.classList.toggle('open');
    }
}
function closeAllDropdowns(exceptElement = null) {
    const openDropdownMenus = document.querySelectorAll('.dropdown__menu.open');
    openDropdownMenus.forEach(dropdownMenu => {
        const dropdown = dropdownMenu.closest('.dropdown');
        if (exceptElement !== dropdown) {
            toggleDropdown(dropdown);
        }
    });
}
const dropdownToggles = document.querySelectorAll('.dropdown__toggle');
dropdownToggles.forEach(dropdownToggle => dropdownToggle.addEventListener('click', e => {
    e.stopPropagation();
    closeAllDropdowns(e.currentTarget.closest('.dropdown'));
    toggleDropdown(dropdownToggle.closest('.dropdown'));
}));

document.documentElement.addEventListener("click", function () {
    closeAllDropdowns();
});

/*---------- DARK THEME ----------*/
const themeButton = document.getElementById("theme-button");
const themeIcon = themeButton.getElementsByTagName("i").item(0);
const themeText = themeButton.getElementsByTagName("span").item(0);
const darkTheme = "dark-theme";
const iconTheme = "uil-sun";

// Previously selected topic (if user selected)
const selectedTheme = localStorage.getItem("selected-theme");

// We obtain the current theme that the interface has by validating the dark-theme class
const getCurrentTheme = () => document.body.classList.contains(darkTheme) ? "dark" : "light";
const setTheme = (theme, rememberSelection) => {
    document.body.classList[theme === "dark" ? "add" : "remove"](darkTheme);
    themeIcon.classList[theme === "dark" ? "add" : "remove"](iconTheme);
    themeText.innerText = theme === "dark" ? "Light Theme" : "Dark Theme";
    if (rememberSelection) {
        localStorage.setItem("selected-theme", theme);
    } else {
        localStorage.removeItem("selected-theme");
    }
}

// We validate if the user previously chose a theme
if (selectedTheme) {
    setTheme(selectedTheme, true);
}

// Activate / deactivate the theme manually with the button
themeButton.addEventListener("click", () => {
    const newTheme = getCurrentTheme() === 'dark' ? 'light' : 'dark';
    console.log(`Toggle theme from ${getCurrentTheme()} to ${newTheme} and remember`);
    setTheme(newTheme, true);
});

// Use prefers-color-scheme if stored theme is not available
if (!selectedTheme) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
        const newColorScheme = event.matches ? "dark" : "light";
        console.log(`Switch to ${newColorScheme} theme`);
        setTheme(newColorScheme);
    });

    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        console.log('Prefer to dark theme');
        setTheme('dark');
    }

    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        console.log('Prefer to light theme');
        setTheme('light');
    }
}