/**
 * Mobile menu — аккордеон в мобильной панели (mobile-nav).
 *
 * Кнопка «+» у пункта с подменю переключает модификатор --open и aria-expanded.
 * На каждом уровне открыт только один пункт: при открытии соседи того же уровня закрываются.
 * При закрытии пункта закрываются и вложенные в него открытые пункты.
 *
 * Хуки: [data-mobile-menu];
 * пункт с подменю — [data-entity="mobile-menu-item"][data-id][data-level="1|2"],
 * его кнопка — [data-entity="mobile-menu-toggle"][data-id] (тот же id).
 */

// БЭМ-элементы пунктов по уровню — для переключения модификатора состояния
const ITEM_CLASS = {
    1: 'mobile-menu__item',
    2: 'mobile-menu__subitem',
};

export const initMobileMenu = () => {
    const menu = document.querySelector('[data-mobile-menu]');
    if (!menu) {
        return;
    }

    const toggles = [...menu.querySelectorAll('[data-entity="mobile-menu-toggle"]')];
    if (!toggles.length) {
        return;
    }

    const getItem = (toggle) =>
        menu.querySelector(`[data-entity="mobile-menu-item"][data-id="${toggle.dataset.id}"]`);

    const getToggle = (item) =>
        menu.querySelector(`[data-entity="mobile-menu-toggle"][data-id="${item.dataset.id}"]`);

    const openClass = (item) => `${ITEM_CLASS[item.dataset.level]}--open`;

    const isOpen = (item) => item.classList.contains(openClass(item));

    const items = toggles.map(getItem).filter(Boolean);

    const setOpen = (item, open) => {
        item.classList.toggle(openClass(item), open);

        const toggle = getToggle(item);
        if (toggle) {
            toggle.setAttribute('aria-expanded', String(open));
            toggle.setAttribute(
                'aria-label',
                toggle.getAttribute('aria-label').replace(/^(Открыть|Закрыть)/, open ? 'Закрыть' : 'Открыть'),
            );
        }

        if (!open) {
            // Закрываем вложенные открытые пункты
            items
                .filter((child) => child !== item && item.contains(child) && isOpen(child))
                .forEach((child) => setOpen(child, false));
        }
    };

    toggles.forEach((toggle) => {
        const item = getItem(toggle);
        if (!item) {
            return;
        }

        toggle.addEventListener('click', () => {
            const open = !isOpen(item);

            if (open) {
                // Только один открытый пункт на уровне
                items
                    .filter((other) => other !== item && other.dataset.level === item.dataset.level && isOpen(other))
                    .forEach((other) => setOpen(other, false));
            }

            setOpen(item, open);
        });
    });
};
