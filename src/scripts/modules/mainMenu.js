/**
 * Main menu — десктопное меню шапки с выпадающими подменю (2 уровня).
 *
 * Открытие: hover (CSS, только @media (hover: hover)) или модификатор --open из JS.
 * JS отвечает за:
 * - кнопку «+» (клик, Enter/Space): --open и aria-expanded, закрытие соседей того же уровня;
 * - Escape: закрывает самый вложенный открытый пункт с фокусом и возвращает фокус на его «+»;
 * - уход фокуса из пункта и клик вне меню: закрывают открытые подменю.
 *
 * Хуки: [data-main-menu];
 * пункт с подменю — [data-entity="main-menu-item"][data-id][data-level="top|sub"],
 * его кнопка — [data-entity="main-menu-toggle"][data-id] (тот же id).
 */

// БЭМ-элементы пунктов по уровню — для переключения модификаторов состояния
const ITEM_CLASS = {
    top: 'main-menu__item',
    sub: 'main-menu__subitem',
};

export const initMainMenu = () => {
    const menu = document.querySelector('[data-main-menu]');
    if (!menu) {
        return;
    }

    const toggles = [...menu.querySelectorAll('[data-entity="main-menu-toggle"]')];
    if (!toggles.length) {
        return;
    }

    const getItem = (toggle) =>
        menu.querySelector(`[data-entity="main-menu-item"][data-id="${toggle.dataset.id}"]`);

    const getToggle = (item) =>
        menu.querySelector(`[data-entity="main-menu-toggle"][data-id="${item.dataset.id}"]`);

    const modClass = (item, mod) => `${ITEM_CLASS[item.dataset.level]}--${mod}`;

    const isOpen = (item) => item.classList.contains(modClass(item, 'open'));

    const setOpen = (item, open) => {
        const toggle = getToggle(item);
        item.classList.toggle(modClass(item, 'open'), open);
        if (toggle) {
            toggle.setAttribute('aria-expanded', String(open));
            toggle.setAttribute(
                'aria-label',
                toggle.getAttribute('aria-label').replace(/^(Открыть|Закрыть)/, open ? 'Закрыть' : 'Открыть'),
            );
        }
    };

    const items = toggles.map(getItem).filter(Boolean);

    const closeAll = () => {
        items.forEach((item) => {
            if (isOpen(item)) {
                setOpen(item, false);
            }
        });
    };

    toggles.forEach((toggle) => {
        const item = getItem(toggle);
        if (!item) {
            return;
        }

        toggle.addEventListener('click', () => {
            const open = !isOpen(item);

            if (open) {
                // Закрываем соседние подменю того же уровня
                items
                    .filter((other) => other !== item && other.dataset.level === item.dataset.level)
                    .forEach((other) => setOpen(other, false));
            }

            setOpen(item, open);
        });

        // Фокус ушёл за пределы пункта (Tab дальше) — закрываем его подменю
        item.addEventListener('focusout', (e) => {
            if (!item.contains(e.relatedTarget) && isOpen(item)) {
                setOpen(item, false);
            }
        });
    });

    menu.addEventListener('keydown', (e) => {
        if (e.key !== 'Escape') {
            return;
        }

        // Самый вложенный открытый пункт, внутри которого фокус
        // (повторный Escape поднимается уровнем выше)
        const current = items
            .filter((item) => isOpen(item) && item.contains(document.activeElement))
            .pop();

        if (!current) {
            return;
        }

        setOpen(current, false);
        getToggle(current)?.focus();
    });

    document.addEventListener('click', (e) => {
        if (!menu.contains(e.target)) {
            closeAll();
        }
    });
};
