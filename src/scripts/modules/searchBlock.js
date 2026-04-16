export function initSearchBlock({ openSelector = '.header__search_btn' } = {}) {
    document.querySelectorAll('.search-block').forEach(root => {
        const input    = root.querySelector('.input--js');
        const delBtn   = root.querySelector('.search-del--js');
        const crossBtn = root.querySelector('.search-toggle--js');
        const resultUl = root.querySelector('.search-block__result');

        if (!input || !resultUl) return;

        const allItems = [...resultUl.querySelectorAll('li')];

        const open  = () => root.classList.add('active');
        const close = () => { root.classList.remove('active'); hideResults(); };
        const showResults = () => resultUl.classList.add('is-open');
        const hideResults = () => resultUl.classList.remove('is-open');

        function filter(query) {
            const q = query.trim().toLowerCase();
            let hasVisible = false;

            allItems.forEach(li => {
                const text = li.textContent.toLowerCase();
                const show = !q || text.includes(q);
                li.hidden = !show;
                if (show) hasVisible = true;
            });

            hasVisible ? showResults() : hideResults();
        }

        input.addEventListener('input', () => {
            const val = input.value;
            delBtn?.classList.toggle('is-visible', val.length > 0);
            if (val.length > 0) { open(); filter(val); }
            else hideResults();
        });

        input.addEventListener('focus', () => {
            if (input.value.length > 0) { open(); filter(input.value); }
        });

        input.addEventListener('keydown', e => {
            if (e.key === 'Escape') { hideResults(); input.blur(); }
        });

        delBtn?.addEventListener('click', () => {
            input.value = '';
            delBtn.classList.remove('is-visible');
            allItems.forEach(li => li.hidden = false);
            hideResults();
            input.focus();
        });

        crossBtn?.addEventListener('click', () => close());

        document.addEventListener('click', e => {
            if (!root.contains(e.target)) close();
        });

        // Внешние кнопки открытия
        document.querySelectorAll(openSelector).forEach(btn => {
            btn.addEventListener('click', e => {
                e.stopPropagation();
                root.classList.contains('active') ? close() : open();
            });
        });
    });
}
