// Site chrome shared by the homepage, research pages, and publications page:
// theme toggle, mobile menu, and hide-on-scroll header. Content never depends
// on this file — every page is fully rendered at build time.
(function () {
    function init() {
        var themeToggle = document.getElementById('theme-toggle');
        var menuBtn = document.getElementById('mobile-menu-btn');
        var menu = document.getElementById('mobile-menu');
        var header = document.getElementById('header');

        function setIcon(theme) {
            var icon = themeToggle && themeToggle.querySelector('i');
            if (icon) icon.className = theme === 'dark' ? 'fas fa-sun text-yellow-500' : 'fas fa-moon text-gray-600 dark:text-gray-300';
            if (themeToggle) {
                themeToggle.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
                themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
            }
        }

        var saved = 'light';
        try { saved = localStorage.getItem('theme') || 'light'; } catch (e) {}
        document.documentElement.classList.toggle('dark', saved === 'dark');
        setIcon(saved);

        if (themeToggle) {
            themeToggle.addEventListener('click', function () {
                var theme = document.documentElement.classList.toggle('dark') ? 'dark' : 'light';
                try { localStorage.setItem('theme', theme); } catch (e) {}
                setIcon(theme);
            });
        }

        function closeMenu(restoreFocus) {
            if (!menu) return;
            var wasOpen = !menu.classList.contains('hidden');
            menu.classList.add('hidden');
            if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false');
            if (wasOpen && restoreFocus && menuBtn) menuBtn.focus();
        }

        if (menuBtn && menu) {
            menuBtn.addEventListener('click', function (e) {
                e.stopPropagation();
                var open = menu.classList.toggle('hidden') === false;
                menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
            });
            menu.addEventListener('click', function (e) {
                if (e.target.closest('a')) closeMenu();
            });
            document.addEventListener('click', function (e) {
                if (!menu.contains(e.target) && !menuBtn.contains(e.target)) closeMenu();
            });
            document.addEventListener('keydown', function (e) {
                if (e.key === 'Escape' && !menu.classList.contains('hidden')) {
                    closeMenu(true);
                    e.preventDefault();
                }
            });
            window.addEventListener('resize', function () {
                if (window.innerWidth >= 1024) {
                    var focusWasInMenu = menu.contains(document.activeElement);
                    closeMenu();
                    var homeLink = header && header.querySelector('a');
                    if (focusWasInMenu && homeLink) homeLink.focus();
                }
            });
        }

        if (header) {
            var last = 0;
            window.addEventListener('scroll', function () {
                var cur = window.pageYOffset;
                var interacting = header.contains(document.activeElement) || (menu && !menu.classList.contains('hidden'));
                header.style.transform = (!interacting && cur > last && cur > 100) ? 'translateY(-100%)' : 'translateY(0)';
                last = cur;
            }, { passive: true });
        }
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();
