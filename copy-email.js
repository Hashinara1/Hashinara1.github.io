(function () {
    'use strict';

    var EMAIL = 'lsimon@gaming.tech';
    var TOAST_DURATION = 2500;

    /* Toast */
    var toast = null;
    var toastTimer = null;

    function ensureToast() {
        if (toast) return toast;

        toast = document.createElement('div');
        toast.className = 'copy-toast';
        toast.setAttribute('role', 'status');
        toast.setAttribute('aria-live', 'polite');
        document.body.appendChild(toast);
        return toast;
    }

    function showToast(message) {
        var el = ensureToast();
        el.textContent = message;

        el.classList.remove('visible');
        void el.offsetWidth;
        el.classList.add('visible');

        clearTimeout(toastTimer);
        toastTimer = setTimeout(function () {
            el.classList.remove('visible');
        }, TOAST_DURATION);
    }

    /* Copie presse-papier */
    function copyEmail() {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            return navigator.clipboard.writeText(EMAIL);
        }

        return new Promise(function (resolve, reject) {
            var textarea = document.createElement('textarea');
            textarea.value = EMAIL;
            textarea.setAttribute('readonly', '');
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            textarea.style.pointerEvents = 'none';
            document.body.appendChild(textarea);
            textarea.select();

            try {
                var ok = document.execCommand('copy');
                document.body.removeChild(textarea);
                ok ? resolve() : reject(new Error('execCommand failed'));
            } catch (err) {
                document.body.removeChild(textarea);
                reject(err);
            }
        });
    }

    function onMailtoClick(event) {
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

        event.preventDefault();

        copyEmail()
            .then(function () { showToast('Adresse copiée : ' + EMAIL); })
            .catch(function () {
                window.location.href = event.currentTarget.getAttribute('href');
            });
    }

    document.querySelectorAll('a[href^="mailto:"]').forEach(function (link) {
        link.addEventListener('click', onMailtoClick);
    });
})();
