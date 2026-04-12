/**
 * Search Block module
 *
 * Работает с разметкой:
 *   .search-block.form-wrap[.active]
 *     form > .form-del-wrap
 *       input.input--js
 *       button.search-block__search
 *       button.search-block__del.search-del--js
 *     button.search-block__cross.search-toggle--js
 *     ul.search-block__result
 *       li > a > span
 *
 * Использование:
 *   import { initSearchBlock } from './modules/searchBlock.js';
 *
 *   initSearchBlock({
 *     suggestions: ['Фасады МДФ', 'Шпон натуральный', 'Покраска'],
 *     onSearch: (query) => fetch(`/search?q=${query}`),
 *   });
 */

const KEYS = { ENTER: 'Enter', ESC: 'Escape', UP: 'ArrowUp', DOWN: 'ArrowDown' };

/**
 * Экранирует спецсимволы RegExp
 * @param {string} s
 */
function escRe(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Создаёт <li><a href="#"><span>query</span>…text…</a></li>
 * Выделенная часть — совпадение с запросом.
 *
 * @param {string} text      — полный текст подсказки
 * @param {string} query     — введённый запрос
 * @param {string} [href='#']
 */
function buildItem(text, query, href = '#') {
    const li = document.createElement('li');
    const a  = document.createElement('a');
    a.href = href;

    if (query) {
        const re  = new RegExp(`(${escRe(query)})`, 'gi');
        // Первое совпадение кладём в <span>, остаток — plain text
        const parts = text.split(re);
        parts.forEach(part => {
            if (re.test(part)) {
                re.lastIndex = 0; // сбрасываем после test
                const span = document.createElement('span');
                span.textContent = part;
                a.appendChild(span);
            } else {
                a.appendChild(document.createTextNode(part));
            }
        });
        re.lastIndex = 0;
    } else {
        a.textContent = text;
    }

    li.appendChild(a);
    return li;
}

/**
 * Инициализирует один экземпляр .search-block
 *
 * @param {HTMLElement} root
 * @param {object}      cfg
 */
function createSearchBlock(root, cfg) {
    const {
        suggestions  = [],   // статические подсказки
        minChars     = 1,    // минимум символов для показа
        maxResults   = 6,    // максимум подсказок
        onSearch     = null, // (query: string) => void
        onSelect     = null, // (text: string, el: HTMLAnchorElement) => void
        filterPage   = true, // фильтровать .card на странице
    } = cfg;

    const input     = root.querySelector('.input--js');
    const delBtn    = root.querySelector('.search-del--js');
    const submitBtn = root.querySelector('.search-block__search');
    const crossBtn  = root.querySelector('.search-toggle--js');
    const resultUl  = root.querySelector('.search-block__result');

    if (!input) return;

    // ── Утилиты ─────────────────────────────────────────────────────────────

    const open = () => {
        root.classList.add('active');
        // фокус после старта CSS-перехода
        setTimeout(() => input.focus(), 50);
    };

    const close = () => {
        root.classList.remove('active');
        hideResults();
    };

    function showResults() {
        resultUl?.classList.add('is-open');
    }

    function hideResults() {
        resultUl?.classList.remove('is-open');
        activeIdx = -1;
    }

    function showDel() { delBtn?.classList.add('is-visible'); }
    function hideDel() { delBtn?.classList.remove('is-visible'); }

    // ── Фильтрация карточек на странице ────────────────────────────────────

    function filterCards(q) {
        if (!filterPage) return;
        document.querySelectorAll('.card, [data-searchable]').forEach(card => {
            card.style.display = (!q || card.textContent.toLowerCase().includes(q.toLowerCase())) ? '' : 'none';
        });
    }

    // ── Рендер подсказок ────────────────────────────────────────────────────

    let activeIdx = -1;

    function renderResults(query) {
        if (!resultUl) return;
        resultUl.innerHTML = '';
        activeIdx = -1;

        const q = query.trim();

        if (q.length < minChars) {
            hideResults();
            return;
        }

        // Статические подсказки
        const matches = suggestions
            .filter(s => s.toLowerCase().includes(q.toLowerCase()))
            .slice(0, maxResults);

        // Текст из карточек страницы
        if (filterPage) {
            document
                .querySelectorAll('.card__title, .card__name, [data-search-title]')
                .forEach(el => {
                    const t = el.textContent.trim();
                    if (
                        t.toLowerCase().includes(q.toLowerCase()) &&
                        !matches.includes(t) &&
                        matches.length < maxResults
                    ) {
                        matches.push(t);
                    }
                });
        }

        if (!matches.length) {
            const li = document.createElement('li');
            li.style.cssText = 'padding:10px 20px;font-size:.875rem;color:#6b7280;';
            li.textContent = 'Ничего не найдено';
            resultUl.appendChild(li);
            showResults();
            return;
        }

        matches.forEach(text => {
            const li = buildItem(text, q);

            li.querySelector('a').addEventListener('click', e => {
                e.preventDefault();
                input.value = text;
                showDel();
                hideResults();
                filterCards(text);
                if (typeof onSelect === 'function') onSelect(text, e.currentTarget);
                input.focus();
            });

            resultUl.appendChild(li);
        });

        showResults();
    }

    // ── Навигация стрелками ─────────────────────────────────────────────────

    function getLinks() {
        return resultUl ? [...resultUl.querySelectorAll('a')] : [];
    }

    function highlight(idx) {
        getLinks().forEach((a, i) => {
            a.parentElement.classList.toggle('is-active', i === idx);
            if (i === idx) a.setAttribute('aria-current', 'true');
            else a.removeAttribute('aria-current');
        });
    }

    function moveActive(dir) {
        const links = getLinks();
        if (!links.length) return;
        activeIdx = Math.max(0, Math.min(activeIdx + dir, links.length - 1));
        highlight(activeIdx);
        links[activeIdx].scrollIntoView({ block: 'nearest' });
    }

    // ── Выполнить поиск ─────────────────────────────────────────────────────

    function doSearch() {
        const q = input.value.trim();
        hideResults();
        filterCards(q);
        if (typeof onSearch === 'function') onSearch(q);
    }

    // ── Слушатели ───────────────────────────────────────────────────────────

    input.addEventListener('input', () => {
        const val = input.value;
        val ? showDel() : hideDel();
        renderResults(val);
        open();
    });

    input.addEventListener('focus', () => {
        if (input.value.length >= minChars) renderResults(input.value);
        open();
    });

    input.addEventListener('keydown', e => {
        const isOpen = resultUl?.classList.contains('is-open');

        switch (e.key) {
            case KEYS.DOWN:
                if (isOpen) { e.preventDefault(); moveActive(1); }
                break;
            case KEYS.UP:
                if (isOpen) { e.preventDefault(); moveActive(-1); }
                break;
            case KEYS.ENTER: {
                const links = getLinks();
                if (isOpen && activeIdx >= 0 && links[activeIdx]) {
                    e.preventDefault();
                    links[activeIdx].click();
                } else {
                    doSearch();
                }
                break;
            }
            case KEYS.ESC:
                hideResults();
                input.blur();
                break;
        }
    });

    // кнопка ×  — очистить поле
    delBtn?.addEventListener('click', () => {
        input.value = '';
        hideDel();
        hideResults();
        filterCards('');
        input.focus();
    });

    // кнопка лупы — поиск
    submitBtn?.addEventListener('click', e => {
        e.preventDefault();
        doSearch();
    });

    // кнопка закрытия блока
    crossBtn?.addEventListener('click', () => close());

    // клик вне блока — закрыть весь блок
    document.addEventListener('click', e => {
        if (!root.contains(e.target)) close();
    });

    // фокус вне блока — закрыть подсказки
    document.addEventListener('focusin', e => {
        if (!root.contains(e.target)) hideResults();
    });

    return {
        open,
        close,
        clear() { input.value = ''; hideDel(); hideResults(); filterCards(''); },
        setValue(val) { input.value = val; val ? showDel() : hideDel(); },
    };
}

/**
 * Инициализирует все .search-block на странице.
 *
 * @param {object} cfg
 * @param {string} [cfg.openSelector='.header__search_btn'] — селектор внешней кнопки открытия
 */
export function initSearchBlock(cfg = {}) {
    const { openSelector = '.header__search_btn', ...rest } = cfg;

    document.querySelectorAll('.search-block').forEach(root => {
        const api = createSearchBlock(root, rest);
        if (!api) return;

        // Внешние кнопки-триггеры (например .header__search_btn)
        document.querySelectorAll(openSelector).forEach(btn => {
            btn.addEventListener('click', e => {
                e.stopPropagation(); // не даём document.click сразу закрыть блок
                root.classList.contains('active') ? api.close() : api.open();
            });
        });
    });
}
