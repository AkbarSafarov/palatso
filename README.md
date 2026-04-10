# Палаццо

Многостраничный статический сайт на Vite + Nunjucks + SCSS.

## Стек

| Инструмент | Для чего |
|---|---|
| [Vite 5](https://vitejs.dev/) | сборщик, дев-сервер |
| [Nunjucks](https://mozilla.github.io/nunjucks/) | шаблонизатор HTML |
| [SCSS / Sass](https://sass-lang.com/) | стили |
| ESLint + Stylelint + Prettier | линтинг и форматирование |

## Структура проекта

```
palatso/
├── public/             # статика, копируется в dist/ как есть
│   └── favicon.svg
├── scripts/
│   └── build-sprite.js # сборщик SVG-спрайта
├── src/
│   ├── assets/
│   │   ├── images/
│   │   └── svg/        # отдельные иконки + собранный sprite.svg
│   ├── pages/          # точки входа Vite (каждый index.html = страница)
│   │   ├── index.html
│   │   ├── catalog/
│   │   ├── about/
│   │   └── ...
│   ├── scripts/
│   │   ├── main.js
│   │   ├── modules/    # navigation, lazyImages, svgSprite
│   │   └── utils/      # a11y, dom
│   ├── styles/
│   │   ├── abstracts/  # переменные, миксины, функции, брейкпоинты
│   │   ├── base/
│   │   ├── components/ # button, card, hero, form, nav…
│   │   ├── layout/
│   │   └── main.scss
│   └── templates/
│       ├── layouts/    # base.njk
│       ├── partials/   # header.njk, footer.njk
│       └── blocks/     # переиспользуемые блоки
└── vite.config.js
```

## Команды

```bash
npm run dev        # дев-сервер на http://localhost:3000
npm run build      # продакшн-сборка → dist/
npm run preview    # превью собранного dist/
npm run sprite     # пересборка SVG-спрайта
npm run lint       # ESLint + Stylelint
npm run format     # Prettier
```

## Страницы

| Маршрут | Описание |
|---|---|
| `/` | Главная |
| `/catalog/` | Каталог |
| `/apartments/` | Квартиры |
| `/storage/` | Кладовые |
| `/purchase/` | Способы покупки |
| `/promotions/` | Акции |
| `/faq/` | Вопросы и ответы |
| `/favorites/` | Избранное |
| `/documents/` | Документы |
| `/news/` | Новости |
| `/news-item/` | Статья |
| `/projects/` | Проекты |
| `/about/` | О компании |
| `/contacts/` | Контакты |
| `/privacy/` | Политика конфиденциальности |
| `/404/` | Страница ошибки |

## SVG-спрайт

Подробнее — в разделе ниже.

## Шаблонизация

Страницы наследуют `layouts/base.njk`, переопределяя блок `{% block content %}`.
Переменные страницы (`title`, `description`, `canonical`) задаются через `{% set %}`.

```nunjucks
{% extends "layouts/base.njk" %}
{% set title = "Каталог квартир" %}

{% block content %}
  ...
{% endblock %}
```

## Алиас `@`

В JS и SCSS доступен алиас `@` → `src/`:

```js
import something from '@/scripts/utils/dom.js';
```

## Сборка

`crossorigin` убирается из тегов скриптов/стилей при билде (`removeCrossOriginPlugin`),
чтобы файлы можно было открывать через `file://`.
