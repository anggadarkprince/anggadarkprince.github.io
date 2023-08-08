/*---------- MOBILE MENU ----------*/
const navMenu = document.getElementById("nav-menu");
const navToggle = document.getElementById("nav-toggle");
const navClose = document.getElementById("nav-close");
if (navToggle) {
    navToggle.addEventListener("click", () => {
        navMenu.classList.add("show-menu");
    });
}
if (navClose) {
    navClose.addEventListener("click", () => {
        navMenu.classList.remove("show-menu");
    });
}
const navLink = document.querySelectorAll(".nav__link");
navLink.forEach((n) => n.addEventListener("click", () => {
    const navMenu = document.getElementById("nav-menu");
    navMenu.classList.remove("show-menu");
}));


/*---------- ACTIVE MENU ----------*/
const sections = document.querySelectorAll("section[id]");

function scrollActive() {
    const scrollY = window.scrollY;

    sections.forEach((current) => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 50;
        const sectionId = current.getAttribute("id");

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document
                .querySelector(".nav__menu a[href*=" + sectionId + "]")
                .classList.add("active-link");
        } else {
            document
                .querySelector(".nav__menu a[href*=" + sectionId + "]")
                .classList.remove("active-link");
        }
    });
}
window.addEventListener("scroll", scrollActive);

/*---------- SCROLL UP ----------*/
function scrollUp() {
    const scrollUp = document.getElementById("scroll-up");
    // When the scroll is higher than 560 viewport height, add the show-scroll class to the a tag with the scroll-top class
    if (this.scrollY >= 560) {
        scrollUp.classList.add("show-scroll-up");
    } else {
        scrollUp.classList.remove("show-scroll-up");
    }
}
window.addEventListener("scroll", scrollUp);


/*---------- DARK THEME ----------*/
const themeButton = document.getElementById("theme-button");
const darkTheme = "dark-theme";
const iconTheme = "uil-sun";

// Previously selected topic (if user selected)
const selectedTheme = localStorage.getItem("selected-theme");

// We obtain the current theme that the interface has by validating the dark-theme class
const getCurrentTheme = () => document.body.classList.contains(darkTheme) ? "dark" : "light";
const setTheme = (theme, rememberSelection) => {
    document.body.classList[theme === "dark" ? "add" : "remove"](darkTheme);
    themeButton.classList[theme === "dark" ? "add" : "remove"](iconTheme);
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