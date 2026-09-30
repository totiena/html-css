/* ============================================
   Шпаргалка юного веб-мастера — интерактив
   Этот файл оживляет примеры. Для своего сайта
   JavaScript пока не нужен — достаточно HTML и CSS.
   ============================================ */

(function () {
    "use strict";

    /* ---------- помощники ---------- */
    function esc(s) {
        return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }

    // убирает общий отступ слева у кусков кода
    function dedent(text) {
        var lines = text.replace(/^\s*\n/, "").replace(/\s+$/, "").split("\n");
        var min = Infinity;
        lines.forEach(function (l) {
            if (l.trim()) min = Math.min(min, l.match(/^ */)[0].length);
        });
        if (!isFinite(min)) min = 0;
        return lines.map(function (l) { return l.slice(min); }).join("\n");
    }

    /* ---------- СЛОВАРЬ ----------
       Здесь все слова HTML и CSS с полным английским названием и переводом.
       Формат: "слово": ["полное название по-английски", "перевод", "пояснение (можно не писать)"].
       Если полное название совпадает с самим словом, первое поле пустое: "".
       Добавить слово или поправить перевод — это одна строчка здесь. */
    var DICT = {
        /* язык */
        "HTML": ["HyperText Markup Language", "язык гипертекстовой разметки"],
        "CSS": ["Cascading Style Sheets", "каскадные таблицы стилей"],

        /* каркас страницы */
        "!DOCTYPE": ["document type", "тип документа", "говорит браузеру: это страница HTML"],
        "html": ["HyperText Markup Language", "язык гипертекстовой разметки", "тег-коробка для всей страницы"],
        "head": ["", "голова", "служебная часть страницы, на сайте её не видно"],
        "body": ["", "тело", "всё, что видно на странице"],
        "header": ["", "шапка, верхняя часть"],
        "main": ["", "главный, основной"],
        "footer": ["", "подвал, нижняя часть", "от foot — нога, низ"],
        "title": ["", "название, заглавие", "текст на вкладке браузера"],
        "meta": ["metadata", "метаданные — сведения о странице"],
        "charset": ["character set", "набор символов"],
        "viewport": ["", "окно просмотра", "view — вид, port — окошко"],
        "link": ["", "связь, ссылка"],
        "rel": ["relationship", "отношение, связь", "кем подключённый файл приходится странице"],
        "stylesheet": ["style sheet", "лист стилей"],
        "lang": ["language", "язык"],
        "UTF-8": ["Unicode Transformation Format", "формат Юникода", "способ записать буквы всех языков мира"],

        /* текст, картинки, ссылки */
        "h1": ["heading 1", "заголовок 1-го уровня", "самый крупный; бывают до h6"],
        "h2": ["heading 2", "заголовок 2-го уровня"],
        "h3": ["heading 3", "заголовок 3-го уровня"],
        "h6": ["heading 6", "заголовок 6-го уровня", "самый мелкий"],
        "p": ["paragraph", "абзац"],
        "b": ["bold", "жирный"],
        "i": ["italic", "курсив"],
        "u": ["underline", "подчёркнутый"],
        "br": ["line break", "разрыв строки", "перенос на новую строку"],
        "img": ["image", "изображение, картинка"],
        "src": ["source", "источник", "откуда взять картинку или видео"],
        "alt": ["alternative text", "запасной текст", "виден, если картинка не загрузилась"],
        "a": ["anchor", "якорь", "тег ссылки"],
        "href": ["hypertext reference", "гипертекстовая ссылка", "куда ведёт ссылка"],
        "id": ["identifier", "идентификатор", "уникальное имя элемента"],
        "target": ["", "цель", "где открыть ссылку"],
        "_blank": ["blank", "пустой", "открыть в новой, пустой вкладке"],
        "width": ["", "ширина"],
        "height": ["", "высота"],

        /* картинки */
        "jpg": ["Joint Photographic Experts Group", "объединённая группа экспертов по фотографии", "формат для фотографий"],
        "png": ["Portable Network Graphics", "переносимая сетевая графика"],
        "gif": ["Graphics Interchange Format", "формат обмена картинками"],
        "svg": ["Scalable Vector Graphics", "масштабируемая векторная графика"],
        "webp": ["web picture", "картинка для интернета"],
        "img/": ["image folder", "папка с картинками"],

        /* таблицы */
        "table": ["", "таблица"],
        "tr": ["table row", "строка таблицы"],
        "td": ["table data", "данные таблицы — обычная клеточка"],
        "th": ["table header", "заголовок таблицы — клеточка-заголовок"],
        "colspan": ["column span", "охват столбцов"],
        "rowspan": ["row span", "охват строк"],
        "border-collapse": ["", "схлопывание рамок", "collapse — схлопнуть"],

        /* списки */
        "ul": ["unordered list", "неупорядоченный список"],
        "ol": ["ordered list", "упорядоченный список"],
        "li": ["list item", "элемент (пункт) списка"],

        /* формы */
        "form": ["", "форма, бланк"],
        "input": ["", "ввод", "поле, куда что-то вводят"],
        "type": ["", "тип"],
        "text": ["", "текст"],
        "email": ["electronic mail", "электронная почта"],
        "radio": ["radio button", "радиокнопка", "как кнопки старого радиоприёмника: нажата только одна"],
        "checkbox": ["check box", "квадратик для отметки", "check — отметить, box — коробочка"],
        "textarea": ["text area", "текстовая область"],
        "select": ["", "выбрать"],
        "option": ["", "вариант"],
        "button": ["", "кнопка"],
        "label": ["", "ярлык, подпись"],
        "for": ["", "для", "для какого поля эта подпись"],
        "placeholder": ["", "заполнитель", "серая подсказка, пока поле пустое"],
        "name": ["", "имя"],
        "value": ["", "значение"],
        "rows": ["", "строки"],
        "action": ["", "действие", "куда отправить данные формы"],
        "method": ["", "способ", "как отправить данные"],
        "POST": ["", "отправить почтой", "данные идут «в конверте», их не видно в адресной строке"],
        "submit": ["", "отправить"],
        "novalidate": ["no validate", "не проверять"],

        /* разметка: контейнеры */
        "div": ["division", "раздел, деление", "главная «коробка» для других элементов"],
        "span": ["", "промежуток, охват", "строчная коробка для кусочка текста"],
        "class": ["", "класс, группа"],
        "nav": ["navigation", "навигация, меню"],
        "section": ["", "раздел"],
        "article": ["", "статья"],
        "aside": ["", "в стороне, сбоку"],
        "display": ["", "отображение, показ"],
        "block": ["", "блок"],
        "inline": ["", "в строке"],
        "inline-block": ["", "блок в строке"],
        "none": ["", "ничего, нет"],
        "grid": ["", "сетка"],

        /* flexbox */
        "flex": ["flexible box", "гибкая коробка"],
        "flex-direction": ["", "направление", "direction — направление"],
        "row": ["", "ряд"],
        "column": ["", "колонка, столбик"],
        "row-reverse": ["", "ряд наоборот"],
        "column-reverse": ["", "столбик наоборот"],
        "justify-content": ["", "выровнять содержимое", "justify — выровнять, content — содержимое"],
        "align-items": ["", "выровнять элементы", "align — выровнять, items — элементы"],
        "flex-wrap": ["", "перенос", "wrap — заворачивать"],
        "wrap": ["", "переносить, заворачивать"],
        "nowrap": ["no wrap", "без переноса"],
        "gap": ["", "промежуток, щель"],
        "flex-grow": ["", "расти"],
        "flex-shrink": ["", "сжиматься"],
        "flex-basis": ["", "основа, исходный размер"],
        "order": ["", "порядок"],
        "flex-start": ["", "начало"],
        "flex-end": ["", "конец"],
        "center": ["", "центр"],
        "space-between": ["", "место между"],
        "space-around": ["", "место вокруг"],
        "space-evenly": ["", "место поровну"],
        "stretch": ["", "растянуть"],
        "align-self": ["", "выровнять себя"],

        /* позиционирование */
        "position": ["", "позиция, положение"],
        "static": ["", "неподвижный, обычный"],
        "relative": ["", "относительный"],
        "absolute": ["", "абсолютный"],
        "fixed": ["", "закреплённый"],
        "sticky": ["", "липкий"],
        "top": ["", "верх"],
        "bottom": ["", "низ"],
        "left": ["", "лево, слева"],
        "right": ["", "право, справа"],
        "z-index": ["", "номер слоя", "ось Z идёт «в глубину» экрана: у кого больше — тот сверху"],

        /* правило CSS */
        "selector": ["", "селектор — «выбиратель»", "от select — выбрать"],
        "property": ["", "свойство"],
        ".class": ["class selector", "селектор класса", "точка = класс"],
        "#id": ["id selector", "селектор по id", "решётка = id"],

        /* цвет, шрифт, текст */
        "color": ["", "цвет"],
        "background-color": ["", "цвет фона", "background — задний план, фон"],
        "font-family": ["", "семейство шрифтов", "font — шрифт"],
        "font-size": ["", "размер шрифта"],
        "font-weight": ["", "вес (толщина) шрифта"],
        "font-style": ["", "начертание шрифта"],
        "text-align": ["", "выравнивание текста"],
        "text-decoration": ["", "украшение текста", "линии: подчёркивание, зачёркивание"],
        "line-height": ["", "высота строки"],
        "bold": ["", "жирный"],
        "italic": ["", "курсив"],
        "underline": ["", "подчёркивание"],
        "justify": ["", "выровнять по ширине"],
        "rgb": ["red, green, blue", "красный, зелёный, синий"],
        "rgba": ["red, green, blue, alpha", "красный, зелёный, синий и прозрачность"],

        /* рамки и отступы */
        "border": ["", "граница, рамка"],
        "border-radius": ["", "радиус рамки", "скругление углов"],
        "border-top": ["", "рамка сверху"],
        "solid": ["", "сплошной"],
        "dashed": ["", "штриховой", "dash — чёрточка"],
        "dotted": ["", "точечный", "dot — точка"],
        "double": ["", "двойной"],
        "groove": ["", "канавка, желобок"],
        "ridge": ["", "гребень"],
        "inset": ["", "вдавленный, внутрь"],
        "outset": ["", "выпуклый, наружу"],
        "px": ["pixel", "пиксель", "picture element — точка на экране"],
        "padding": ["", "внутренний отступ", "дословно — набивка, мягкая прокладка"],
        "margin": ["", "внешний отступ", "дословно — поле, край"],
        "auto": ["automatic", "автоматически"],

        /* маркеры списков */
        "list-style-type": ["", "тип маркера списка"],
        "list-style-image": ["", "картинка-маркер списка"],
        "list-style-position": ["", "положение маркера"],
        "disc": ["", "диск, закрашенный кружок"],
        "circle": ["", "круг, окружность"],
        "square": ["", "квадрат"],
        "decimal": ["", "десятичный — цифры 1, 2, 3"],
        "upper-roman": ["", "заглавные римские цифры"],
        "lower-alpha": ["", "строчные латинские буквы", "alpha — альфа, первая буква"],
        "inside": ["", "внутри"],
        "outside": ["", "снаружи"],
        "url": ["Uniform Resource Locator", "адрес в интернете или путь к файлу"],

        /* псевдоклассы */
        "pseudo-class": ["", "псевдокласс", "pseudo — ненастоящий: это не класс, а состояние"],
        ":hover": ["", "навести, зависнуть над", "мышка над элементом"],
        ":active": ["", "активный", "в момент нажатия"],
        ":focus": ["", "фокус", "элемент выбран, в поле мигает курсор"],
        ":visited": ["", "посещённый"],
        ":link": ["", "ссылка, ещё не посещённая"],
        ":first-child": ["", "первый ребёнок"],
        ":last-child": ["", "последний ребёнок"],
        ":nth-child": ["", "n-й ребёнок"],
        ":nth-last-child": ["", "n-й ребёнок с конца"],
        ":first-of-type": ["", "первый такого типа", "первый элемент с таким тегом"],
        ":last-of-type": ["", "последний такого типа", "последний элемент с таким тегом"],
        "odd": ["", "нечётный"],
        "even": ["", "чётный"],
        ":checked": ["", "отмеченный"],
        ":not": ["", "не", "все, кроме"],
        "transition": ["", "переход", "плавное изменение"],

        /* псевдоэлементы */
        "pseudo-element": ["", "псевдоэлемент", "ненастоящий элемент: его нет в HTML"],
        "::before": ["", "перед"],
        "::after": ["", "после"],
        "::first-letter": ["", "первая буква"],
        "::first-line": ["", "первая строка"],
        "::selection": ["", "выделение"],
        "::placeholder": ["", "заполнитель, подсказка в пустом поле"],
        "::marker": ["", "маркер пункта списка"],
        "content": ["", "содержимое"],

        /* градиенты и тени */
        "gradient": ["", "градиент — плавный переход цветов"],
        "linear-gradient": ["", "линейный градиент"],
        "radial-gradient": ["", "радиальный градиент", "от радиуса: из центра во все стороны"],
        "conic-gradient": ["", "конический градиент", "cone — конус: цвета идут по кругу"],
        "repeating-linear-gradient": ["", "повторяющийся линейный градиент"],
        "repeating-radial-gradient": ["", "повторяющийся радиальный градиент"],
        "background-image": ["", "фоновая картинка"],
        "background": ["", "фон"],
        "background-size": ["", "размер фона"],
        "cover": ["", "покрыть целиком"],
        "deg": ["degree", "градус"],
        "to": ["", "к, в сторону"],
        "at": ["", "в точке"],
        "ellipse": ["", "эллипс, овал"],
        "box-shadow": ["", "тень блока", "box — коробка, shadow — тень"],

        /* трансформации */
        "transform": ["", "преобразовать"],
        "translate": ["", "переместить", "дословно — перевести на другое место"],
        "rotate": ["", "повернуть"],
        "scale": ["", "масштаб"],
        "skew": ["", "перекосить, наклонить"],
        "transform-origin": ["", "точка преобразования", "origin — начало, исходная точка"],

        /* видео и аудио */
        "video": ["", "видео"],
        "audio": ["", "звук"],
        "controls": ["", "управление", "кнопки плеера"],
        "autoplay": ["automatic play", "автозапуск"],
        "muted": ["", "без звука", "mute — немой"],
        "loop": ["", "петля — повтор по кругу"],
        "poster": ["", "постер, обложка"],
        "iframe": ["inline frame", "встроенная рамка", "окошко с другой страницей внутри твоей"],
        "embed": ["", "встроить"],
        "allowfullscreen": ["allow full screen", "разрешить полный экран"],

        /* GitHub и публикация */
        "GitHub": ["", "Git — программа для хранения версий кода, hub — центр"],
        "repository": ["", "репозиторий — хранилище", "папка проекта на GitHub"],
        "New repository": ["", "новый репозиторий"],
        "Public": ["", "публичный, открытый для всех"],
        "Create repository": ["", "создать репозиторий"],
        "Upload files": ["", "загрузить файлы"],
        "Add file": ["", "добавить файл"],
        "Commit changes": ["", "зафиксировать изменения", "сохранить загрузку в репозитории"],
        "Settings": ["", "настройки"],
        "Pages": ["", "страницы", "сервис GitHub, который показывает сайт в интернете"],
        "Deploy from a branch": ["", "развернуть из ветки", "опубликовать сайт из файлов репозитория"],
        "Branch": ["", "ветка", "версия файлов в репозитории; основная называется main"],
        "root": ["", "корень", "самый верхний уровень репозитория"],
        "Save": ["", "сохранить"],
        "claim": ["", "забрать, заявить права"],
        "Dashboard": ["", "панель управления"],
        "Create my site": ["", "создать мой сайт"]
    };

    function dictEntry(key) {
        return Object.prototype.hasOwnProperty.call(DICT, key) ? DICT[key] : null;
    }
    // текст подсказки: «unordered list — неупорядоченный список»
    function dictTip(key) {
        var e = dictEntry(key);
        if (!e) return "";
        var t = (e[0] ? e[0] + " — " : "") + e[1];
        if (e[2]) t += " (" + e[2] + ")";
        return t;
    }
    // как слово показывается: теги — в уголках
    var TAG_WORDS = "!DOCTYPE html head body header main footer title meta link h1 h2 h3 h6 p b i u br img a table tr td th ul ol li form input textarea select option button label div span nav section article aside video audio iframe".split(" ");
    function dictLabel(key) {
        return TAG_WORDS.indexOf(key) !== -1 ? "<" + key + ">" : key;
    }

    // превращает текст в HTML с цветными кусочками
    function tokenize(raw, re, pick) {
        var out = "", last = 0, m;
        re.lastIndex = 0;
        while ((m = re.exec(raw))) {
            if (m[0] === "") { re.lastIndex++; continue; }
            out += esc(raw.slice(last, m.index));
            out += pick(m);
            last = m.index + m[0].length;
        }
        return out + esc(raw.slice(last));
    }
    function span(cls, text) { return '<span class="' + cls + '">' + esc(text) + "</span>"; }
    // кусочек кода с подсказкой-переводом, если слово есть в словаре
    function tipSpan(cls, text, key) {
        var tip = dictTip(key);
        if (!tip) return span(cls, text);
        return '<span class="' + cls + ' has-tip" tabindex="0" data-tip="' + esc(dictLabel(key)) + " — " + esc(tip).replace(/"/g, "&quot;") + '">' + esc(text) + "</span>";
    }

    function hlTag(tag) {
        return tokenize(tag, /("[^"]*")|(^<\/?!?[\w-]+)|([\w:-]+)(?==)/g, function (m) {
            if (m[1]) return span("t-str", m[1]);
            if (m[2]) {
                var open = m[2].match(/^<\/?!?/)[0];
                var name = m[2].slice(open.length);
                var key = open.indexOf("!") !== -1 ? "!" + name : name.toLowerCase();
                return esc(open) + tipSpan("t-tag", name, key);
            }
            return tipSpan("t-attr", m[3], m[3]);
        });
    }

    function highlight(code, lang) {
        if (lang === "html") {
            return tokenize(code, /<!--[\s\S]*?-->|<[^>]*>/g, function (m) {
                if (m[0].indexOf("<!--") === 0) return span("t-com", m[0]);
                return hlTag(m[0]);
            });
        }
        var cssRe = /(\/\*[\s\S]*?\*\/)|("[^"]*")|([^{}\n;]+?)(?=\s*\{)|([\w-]+)(?=\s*:[^:])|(#[0-9a-fA-F]{3,8}\b)|(-?\b\d+(?:\.\d+)?(?:px|%|deg|em|rem|s|vh|vw)?\b)/g;
        return tokenize(code, cssRe, function (m) {
            if (m[1]) return span("t-com", m[1]);
            if (m[2]) return span("t-str", m[2]);
            if (m[3]) return tipSpan("t-sel", m[3], m[3].trim());
            if (m[4]) return tipSpan("t-prop", m[4], m[4]);
            if (m[5]) return span("t-hex", m[5]);
            return span("t-num", m[6]);
        });
    }

    function cssRule(selector, props) {
        var body = Object.keys(props).map(function (k) {
            return "    " + k + ": " + props[k] + ";";
        }).join("\n");
        return selector + " {\n" + body + "\n}";
    }

    function applyStyles(el, props) {
        el.removeAttribute("style");
        Object.keys(props).forEach(function (k) { el.style.setProperty(k, props[k]); });
    }

    function showCode(root, code, lang) {
        var out = root.querySelector(".out code");
        if (out) out.innerHTML = highlight(code, lang || "css");
    }

    function copyText(text, btn) {
        var done = function () {
            btn.textContent = "Скопировано ✓";
            setTimeout(function () { btn.textContent = "Копировать"; }, 1500);
        };
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).then(done, fallback);
        } else { fallback(); }
        function fallback() {
            var ta = document.createElement("textarea");
            ta.value = text;
            document.body.appendChild(ta);
            ta.select();
            try { document.execCommand("copy"); done(); } catch (e) { btn.textContent = "Не вышло"; }
            ta.remove();
        }
    }

    /* ---------- 1. Блоки с кодом ---------- */
    document.querySelectorAll("script.code").forEach(function (s) {
        var lang = s.dataset.lang || "html";
        var code = dedent(s.textContent);
        var box = document.createElement("div");
        box.className = "codebox";
        box.innerHTML =
            '<div class="codebox-bar"><span>' + lang + '</span><button type="button" class="copy-btn">Копировать</button></div>' +
            "<pre><code>" + highlight(code, lang) + "</code></pre>";
        box.querySelector(".copy-btn").addEventListener("click", function (e) { copyText(code, e.currentTarget); });
        s.replaceWith(box);
    });

    /* ---------- 2. Редакторы «Попробуй сам» ---------- */
    document.querySelectorAll(".play").forEach(function (play) {
        var areas = play.querySelectorAll("textarea");
        var frame = play.querySelector("iframe");
        var timer;
        areas.forEach(function (ta) {
            ta.value = dedent(ta.value);
            ta.dataset.start = ta.value;
            ta.rows = ta.value.split("\n").length + 1;
            // клавиша Tab ставит отступ, а не уходит из поля
            ta.addEventListener("keydown", function (e) {
                if (e.key !== "Tab" || e.shiftKey) return;
                e.preventDefault();
                var a = ta.selectionStart, b = ta.selectionEnd;
                ta.value = ta.value.slice(0, a) + "  " + ta.value.slice(b);
                ta.selectionStart = ta.selectionEnd = a + 2;
                update();
            });
            ta.addEventListener("input", function () {
                clearTimeout(timer);
                timer = setTimeout(update, 250);
            });
        });
        function update() {
            var html = "", css = "";
            areas.forEach(function (ta) {
                if (ta.dataset.lang === "css") css += ta.value; else html += ta.value;
            });
            frame.srcdoc =
                '<!DOCTYPE html><html><head><meta charset="utf-8"><base target="_blank">' +
                "<style>body{font-family:Arial,sans-serif;margin:12px;color:#24213b;font-size:16px}</style>" +
                "<style>" + css + "</style></head><body>" + html + "</body></html>";
        }
        var reset = play.querySelector(".btn-reset");
        if (reset) reset.addEventListener("click", function () {
            areas.forEach(function (ta) { ta.value = ta.dataset.start; });
            update();
        });
        update();
    });

    /* ---------- 3. Мини-тесты ---------- */
    document.querySelectorAll(".quiz").forEach(function (quiz) {
        var fb = quiz.querySelector(".fb");
        quiz.querySelectorAll(".opts button").forEach(function (btn) {
            btn.addEventListener("click", function () {
                quiz.querySelectorAll(".opts button").forEach(function (b) { b.classList.remove("right", "wrong"); });
                if (btn.hasAttribute("data-ok")) {
                    btn.classList.add("right");
                    fb.textContent = "🎉 " + fb.dataset.okText;
                } else {
                    void btn.offsetWidth;
                    btn.classList.add("wrong");
                    fb.textContent = "🤔 " + fb.dataset.noText;
                }
            });
        });
    });

    /* ---------- 4. Движок лабораторий с ползунками ---------- */
    function lab(id, render) {
        var root = document.getElementById(id);
        if (!root) return;
        function values() {
            var v = {};
            root.querySelectorAll("[data-k]").forEach(function (el) {
                var k = el.dataset.k;
                if (el.classList.contains("chips")) {
                    var on = el.querySelector(".on");
                    v[k] = on ? on.dataset.v : "";
                } else if (el.type === "checkbox") {
                    v[k] = el.checked;
                } else {
                    v[k] = el.value;
                }
            });
            root.querySelectorAll("[data-show]").forEach(function (s) { s.textContent = v[s.dataset.show]; });
            return v;
        }
        function update() { render(values(), root); }
        root.addEventListener("input", update);
        root.addEventListener("change", update);
        root.addEventListener("click", function (e) {
            var chip = e.target.closest(".chips button");
            if (chip) {
                chip.parentElement.querySelectorAll("button").forEach(function (b) { b.classList.toggle("on", b === chip); });
                update();
            }
            if (e.target.closest("[data-lab-reset]")) {
                root.querySelectorAll("input").forEach(function (inp) {
                    if (inp.type === "checkbox") inp.checked = inp.defaultChecked; else inp.value = inp.defaultValue;
                });
                root.querySelectorAll(".chips").forEach(function (c) {
                    var def = c.querySelector("[data-default]") || c.querySelector("button");
                    c.querySelectorAll("button").forEach(function (b) { b.classList.toggle("on", b === def); });
                });
                update();
            }
        });
        update();
    }

    function note(root, text) {
        var n = root.querySelector("[data-note]");
        if (n) n.innerHTML = text;
    }

    /* Каркас страницы */
    (function () {
        var root = document.getElementById("lab-skeleton");
        if (!root) return;
        var info = {
            head: ["&lt;head&gt; — голова страницы", "Её не видно на сайте. Тут лежат кодировка <code>&lt;meta charset&gt;</code>, настройка для телефонов <code>&lt;meta viewport&gt;</code>, название вкладки <code>&lt;title&gt;</code> и подключение CSS через <code>&lt;link&gt;</code>. Подробнее — ниже, в «Что лежит в &lt;head&gt;»."],
            header: ["&lt;header&gt; — шапка", "Верх сайта. Обычно здесь логотип, название и меню."],
            main: ["&lt;main&gt; — основное", "Всё самое главное: заголовки <code>&lt;h1&gt;</code>, абзацы <code>&lt;p&gt;</code>, картинки, ссылки, таблицы, формы. Такой тег на странице только один."],
            footer: ["&lt;footer&gt; — подвал", "Низ сайта: адрес, телефон, почта, соцсети."]
        };
        var box = root.querySelector(".sk-info");
        function show(part) {
            root.querySelectorAll(".sk-part").forEach(function (b) { b.classList.toggle("on", b.dataset.part === part); });
            box.innerHTML = "<h4>" + info[part][0] + "</h4><p>" + info[part][1] + "</p>";
        }
        root.addEventListener("click", function (e) {
            var b = e.target.closest(".sk-part");
            if (b) show(b.dataset.part);
        });
        show("head");
    })();

    /* Пути к картинкам */
    lab("lab-path", function (v, root) {
        var info = {
            same: ["cat.jpg", "Картинка лежит <b>рядом</b> с <code>index.html</code> — пишем просто её имя."],
            img: ["img/dog.png", "Картинка в папке <code>img</code> — пишем <b>имя папки</b>, косую черту <code>/</code> и имя картинки."],
            deep: ["img/animals/fox.jpg", "Папка в папке — пишем все папки по порядку через <code>/</code>, как адрес: улица, дом, квартира."],
            web: ["https://site.ru/parrot.jpg", "Картинка в интернете — пишем полную ссылку. Работает, пока чужой сайт её не удалил. Надёжнее сохранить к себе!"]
        };
        root.querySelectorAll("[data-node]").forEach(function (n) {
            n.classList.toggle("hl", n.dataset.node === v.where);
            n.classList.toggle("from", n.dataset.node === "index");
        });
        note(root, info[v.where][1]);
        showCode(root, '<img src="' + info[v.where][0] + '" alt="Картинка">', "html");
    });

    /* Что лежит в head: убираем строчки и смотрим, что сломается */
    lab("lab-head", function (v, root) {
        var ok = { head: "Мой сайт про котиков", h1: "Привет!", p: "Здесь я расскажу про своего кота." };
        var broken = {
            head: "РњРѕР№ СЃР°Р№С‚ РїСЂРѕ РєРѕС‚РёРєРѕРІ",
            h1: "РџСЂРёРІРµС‚!",
            p: "Р—РґРµСЃСЊ СЏ СЂР°СЃСЃРєР°Р¶Сѓ РїСЂРѕ СЃРІРѕРµРіРѕ РєРѕС‚Р°."
        };
        var text = v.charset ? ok : broken;
        root.querySelectorAll("[data-t]").forEach(function (el) { el.textContent = text[el.dataset.t]; });
        root.querySelector(".fb-tab").textContent = v.title ? "Мой сайт" : "index.html";
        root.querySelector(".fake-wrap").classList.toggle("no-css", !v.link);
        root.querySelector(".fake-phone").classList.toggle("no-viewport", !v.viewport);

        var notes = [];
        if (!v.charset) notes.push("Без <code>charset</code> браузер не понял, как читать буквы, — русский текст превратился в «кракозябры».");
        if (!v.viewport) notes.push("Без <code>viewport</code> телефон показывает страницу как на большом экране — всё мелкое, приходится увеличивать пальцами.");
        if (!v.title) notes.push("Без <code>&lt;title&gt;</code> на вкладке видно просто имя файла.");
        if (!v.link) notes.push("Без <code>&lt;link&gt;</code> файл <code>style.css</code> не подключён — пропали все цвета и оформление.");
        if (!notes.length) notes.push("Все строчки на месте — сайт выглядит как надо. Сними любую галочку!");
        note(root, notes.join("<br><br>"));

        var lines = ["<head>"];
        if (v.charset) lines.push('    <meta charset="UTF-8">');
        if (v.viewport) lines.push('    <meta name="viewport" content="width=device-width, initial-scale=1">');
        if (v.title) lines.push("    <title>Мой сайт</title>");
        if (v.link) lines.push('    <link rel="stylesheet" href="style.css">');
        lines.push("</head>");
        showCode(root, lines.join("\n"), "html");
    });

    /* Формы: что отправила бы форма */
    (function () {
        var root = document.getElementById("lab-send");
        if (!root) return;
        var form = root.querySelector(".send-form");
        var msg = form.querySelector('[data-field="message"]');
        var result = root.querySelector(".send-result");
        var out = root.querySelector(".out code");
        function code() {
            var parts = ['<form>'];
            parts.push('  <input type="text" name="name">');
            parts.push(msg.hasAttribute("name") ? '  <input type="text" name="message">' : '  <input type="text">   <!-- нет name! -->');
            parts.push('  <input type="radio" name="like" value="да">');
            parts.push('  <input type="radio" name="like" value="нет">');
            parts.push('  <button type="submit">Отправить</button>');
            parts.push('</form>');
            out.innerHTML = highlight(parts.join("\n"), "html");
        }
        root.querySelector('[data-k="noname"]').addEventListener("change", function (e) {
            if (e.target.checked) msg.removeAttribute("name"); else msg.setAttribute("name", "message");
            code();
        });
        form.addEventListener("submit", function (e) {
            e.preventDefault();
            var data = new FormData(form);
            var rows = [];
            data.forEach(function (value, key) {
                rows.push("<li><b>" + esc(key) + "</b> = " + (value ? esc(String(value)) : "<i>пусто</i>") + "</li>");
            });
            var html = "<p><b>Форма отправила бы:</b></p>";
            html += rows.length ? "<ul>" + rows.join("") + "</ul>" : "<p>ничего — ни у одного заполненного поля нет name</p>";
            if (!msg.hasAttribute("name")) html += "<p>❗ Поля «Сообщение» в списке нет: у него убрали <code>name</code>.</p>";
            html += '<p class="send-lost">😢 Но отправлять некуда: у формы нет <code>action</code>. На настоящем сайте страница просто перезагрузилась бы, а данные пропали бы.</p>';
            result.innerHTML = html;
        });
        code();
    })();

    /* Цвет, шрифт, текст */
    lab("lab-text", function (v, root) {
        var p = {
            "color": v.color,
            "background-color": v.bg,
            "font-family": v.font,
            "font-size": v.size + "px",
            "text-align": v.align
        };
        if (v.bold) p["font-weight"] = "bold";
        if (v.italic) p["font-style"] = "italic";
        if (v.under) p["text-decoration"] = "underline";
        applyStyles(root.querySelector(".demo"), p);
        showCode(root, cssRule("p", p));
    });

    /* Рамки */
    lab("lab-border", function (v, root) {
        var p = {};
        p[v.side] = v.w + "px " + v.style + " " + v.color;
        p["border-radius"] = v.r + "px";
        applyStyles(root.querySelector(".demo"), p);
        showCode(root, cssRule(".block", p));
    });

    /* Отступы */
    lab("lab-spacing", function (v, root) {
        var p = { "padding": v.pad + "px", "margin": v.mar + "px" };
        applyStyles(root.querySelector(".demo"), p);
        showCode(root, cssRule(".box", p));
    });

    /* Маркеры */
    lab("lab-markers", function (v, root) {
        var p = {};
        if (v.type === "image") p["list-style-image"] = 'url("star.svg")';
        else p["list-style-type"] = v.type;
        p["list-style-position"] = v.pos;
        var ul = root.querySelector(".demo");
        applyStyles(ul, p);
        ul.style.paddingLeft = v.pos === "inside" ? "8px" : "40px";
        showCode(root, cssRule("ul", p));
    });

    /* display */
    lab("lab-display", function (v, root) {
        root.querySelectorAll(".d-item").forEach(function (el) { el.style.display = v.d; });
        var notes = {
            "block": "<b>block:</b> каждая коробка на своей строчке и слушается ширины и высоты.",
            "inline": "<b>inline:</b> коробки встали в строку как слова. Ширина и высота <b>не работают</b> — коробки стали по размеру текста.",
            "inline-block": "<b>inline-block:</b> стоят в строке, как слова, но ширина и высота работают.",
            "none": "<b>none:</b> коробки пропали, как будто их нет в коде."
        };
        note(root, notes[v.d]);
        showCode(root, cssRule(".box", { "width": "110px", "height": "50px", "display": v.d }));
    });

    /* Flexbox */
    lab("lab-flex", function (v, root) {
        var box = root.querySelector(".flex-demo");
        var n = +v.n;
        if (box.children.length !== n) {
            box.innerHTML = "";
            for (var i = 1; i <= n; i++) {
                var d = document.createElement("div");
                d.textContent = i;
                box.appendChild(d);
            }
        }
        var p = {
            "display": "flex",
            "flex-direction": v.dir,
            "justify-content": v.jc,
            "align-items": v.ai,
            "flex-wrap": v.wrap,
            "gap": v.gap + "px"
        };
        applyStyles(box, p);
        Array.prototype.forEach.call(box.children, function (c, i) {
            c.style.flexGrow = v.grow && i === 0 ? "1" : "";
            c.style.minWidth = v.wrap === "wrap" ? "90px" : "";
        });
        var code = cssRule(".shelf", p);
        if (v.grow) code += "\n\n" + cssRule(".shelf div:first-child", { "flex-grow": "1" });
        showCode(root, code);
    });

    /* Позиционирование */
    lab("lab-position", function (v, root) {
        var box = root.querySelector(".pos-box");
        var p = { "position": v.pos };
        if (v.pos !== "static") {
            p.top = v.top + "px";
            if (v.pos !== "sticky") p.left = v.left + "px";
        }
        applyStyles(box, p);
        var notes = {
            "static": "<b>static</b> — обычное место в потоке. Двигай ползунки: ничего не произойдёт, top и left тут не работают.",
            "relative": "<b>relative</b> — блок сдвинулся от своего места, но <b>дырка</b> на старом месте осталась: соседи её не заняли.",
            "absolute": "<b>absolute</b> — блок выпрыгнул: Абзац 3 поднялся на его место. Отсчёт идёт от угла окошка (у него <code>position: relative</code>). Прокрути — блок уедет вместе с текстом.",
            "fixed": "<b>fixed</b> — прокрути окошко: блок стоит на месте! На настоящем сайте он приклеится к окну браузера.",
            "sticky": "<b>sticky</b> — прокрути окошко: сначала блок едет с текстом, а потом прилипает к верху на расстоянии top."
        };
        note(root, notes[v.pos]);
        var code = cssRule(".box", p);
        if (v.pos === "static") code = code.replace("}", "    /* top и left не работают */\n}");
        showCode(root, code);
    });

    /* Псевдоклассы: состояния */
    (function () {
        var root = document.getElementById("lab-states");
        if (!root) return;
        var rules = [
            { id: "hover", code: ".button:hover {\n    background-color: gold;\n}" },
            { id: "active", code: ".button:active {\n    transform: scale(0.9);\n}" },
            { id: "focus", code: "input:focus {\n    border-color: violet;\n}" }
        ];
        var out = root.querySelector(".out code");
        out.innerHTML = rules.map(function (r) {
            return '<span class="rule" data-rule="' + r.id + '">' + highlight(r.code, "css") + "</span>";
        }).join("");
        function set(id, on) {
            var el = out.querySelector('[data-rule="' + id + '"]');
            if (el) el.classList.toggle("live", on);
        }
        var btn = root.querySelector(".pc-btn");
        var inp = root.querySelector(".pc-input");
        btn.addEventListener("pointerenter", function () { set("hover", true); });
        btn.addEventListener("pointerleave", function () { set("hover", false); set("active", false); });
        btn.addEventListener("pointerdown", function () { set("active", true); });
        document.addEventListener("pointerup", function () { set("active", false); });
        inp.addEventListener("focus", function () { set("focus", true); });
        inp.addEventListener("blur", function () { set("focus", false); });
    })();

    /* Псевдоклассы: nth-child */
    (function () {
        var style = document.createElement("style");
        document.head.appendChild(style);
        lab("lab-nth", function (v, root) {
            var sel = v.sel;
            var custom = (v.custom || "").replace(/[^0-9n+\- ]/g, "").trim();
            if (custom) {
                sel = ":nth-child(" + custom + ")";
                root.querySelectorAll(".chips button").forEach(function (b) { b.classList.remove("on"); });
            }
            style.textContent = ".nth-list li" + sel + "{background:#8a4ff0;color:#fff;box-shadow:0 0 0 3px rgba(138,79,240,.35)}";
            root.querySelectorAll(".nth-list li").forEach(function (li, i) { li.textContent = "Пункт " + (i + 1); });
            showCode(root, cssRule("li" + sel, { "background-color": "violet", "color": "white" }));
        });
        var root = document.getElementById("lab-nth");
        if (root) root.addEventListener("click", function (e) {
            if (e.target.closest(".chips button")) {
                root.querySelector('[data-k="custom"]').value = "";
                root.dispatchEvent(new Event("input"));
            }
        });
    })();

    /* Псевдоэлементы */
    (function () {
        var style = document.createElement("style");
        document.head.appendChild(style);
        function q(s) { return '"' + String(s).replace(/\\/g, "\\\\").replace(/"/g, '\\"') + '"'; }
        lab("lab-pe", function (v, root) {
            var rules = [];
            var css = "";
            rules.push(cssRule("h2::before", { "content": q(v.before) }));
            rules.push(cssRule("h2::after", { "content": q(v.after) }));
            if (v.letter) rules.push(cssRule("p::first-letter", { "font-size": "40px", "color": "tomato" }));
            if (v.line) rules.push(cssRule("p::first-line", { "color": "royalblue" }));
            rules.push(cssRule("::selection", { "background-color": v.sel }));
            rules.forEach(function (r) {
                css += r.replace(/^([^{]+)\{/, function (m, s) {
                    return s.split(",").map(function (x) { return ".pe-demo " + x.trim(); }).join(",") + "{";
                }) + "\n";
            });
            style.textContent = css;
            showCode(root, rules.join("\n\n"));
        });
    })();

    /* Градиенты */
    lab("lab-gradient", function (v, root) {
        var colors = [v.c1, v.c2];
        if (v.use3) colors.push(v.c3);
        var rep = v.rep ? "repeating-" : "";
        var stops;
        if (v.rep) {
            var unit = v.type === "conic" ? "deg" : "px";
            var size = v.type === "conic" ? 20 : 18;
            stops = colors.map(function (c, i) { return c + " " + i * size + unit + " " + (i + 1) * size + unit; }).join(", ");
        } else if (v.hard) {
            var step = 100 / colors.length;
            stops = colors.map(function (c, i) {
                return c + " " + Math.round(i * step) + "% " + Math.round((i + 1) * step) + "%";
            }).join(", ");
        } else {
            stops = colors.join(", ");
        }
        var g;
        if (v.type === "linear") g = rep + "linear-gradient(" + v.angle + "deg, " + stops + ")";
        else if (v.type === "radial") g = rep + "radial-gradient(circle, " + stops + ")";
        else g = rep + "conic-gradient(from " + v.angle + "deg, " + stops + ")";
        root.querySelector('[data-k="angle"]').disabled = v.type === "radial";
        root.querySelector('[data-k="hard"]').disabled = v.rep;
        var p = {};
        p[v.prop] = g;
        applyStyles(root.querySelector(".demo"), p);
        showCode(root, cssRule(".box", p));
    });

    /* Тени */
    lab("lab-shadow", function (v, root) {
        var val = (v.inset ? "inset " : "") + v.x + "px " + v.y + "px " + v.blur + "px " + v.spread + "px " + v.color;
        var p = { "box-shadow": val };
        applyStyles(root.querySelector(".demo"), p);
        showCode(root, cssRule(".square", p));
    });

    /* Трансформации */
    lab("lab-transform", function (v, root) {
        var parts = [];
        if (+v.tx || +v.ty) parts.push("translate(" + v.tx + "px, " + v.ty + "px)");
        if (+v.rot) parts.push("rotate(" + v.rot + "deg)");
        if (+v.sc !== 1) parts.push("scale(" + v.sc + ")");
        if (+v.sk) parts.push("skewX(" + v.sk + "deg)");
        var p = { "transform": parts.length ? parts.join(" ") : "none" };
        if (v.origin !== "center") p["transform-origin"] = v.origin;
        var box = root.querySelector(".tf-box");
        box.style.transform = p.transform;
        box.style.transformOrigin = v.origin;
        showCode(root, cssRule(".box", p));
    });

    /* Аудио: сами «сочиняем» короткую мелодию, чтобы не нужен был файл */
    (function () {
        var root = document.getElementById("lab-media");
        if (!root) return;
        var audio = root.querySelector(".media-audio");
        var hidden = root.querySelector(".media-hidden");
        try {
            audio.src = makeMelody();
        } catch (e) { /* без звука тоже можно посмотреть код */ }

        lab("lab-media", function (v) {
            audio.controls = v.controls;
            audio.loop = v.loop;
            audio.muted = v.muted;
            hidden.style.display = v.controls ? "none" : "block";
            if (v.autoplay && !root.dataset.played) {
                root.dataset.played = "1";
                var pr = audio.play();
                if (pr && pr.catch) pr.catch(function () {});
            }
            if (!v.autoplay) root.dataset.played = "";
            var attrs = ["src=\"melody.mp3\""];
            ["controls", "autoplay", "muted", "loop"].forEach(function (k) { if (v[k]) attrs.push(k); });
            var notes = [];
            if (!v.controls) notes.push("Без <code>controls</code> плеера не видно. Такое бывает для фоновой музыки.");
            if (v.autoplay && !v.muted) notes.push("Браузеры часто <b>запрещают</b> автозапуск со звуком, чтобы сайты не шумели. С <code>muted</code> запуск разрешён всегда.");
            if (v.loop) notes.push("С <code>loop</code> мелодия играет по кругу без остановки.");
            note(root, notes.join("<br>"));
            showCode(root, "<audio " + attrs.join(" ") + "></audio>", "html");
        });

        function makeMelody() {
            var rate = 22050;
            var notes = [523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5];
            var len = 0.22;
            var total = Math.floor(rate * len * notes.length);
            var buf = new ArrayBuffer(44 + total * 2);
            var dv = new DataView(buf);
            function str(o, s) { for (var i = 0; i < s.length; i++) dv.setUint8(o + i, s.charCodeAt(i)); }
            str(0, "RIFF"); dv.setUint32(4, 36 + total * 2, true); str(8, "WAVE");
            str(12, "fmt "); dv.setUint32(16, 16, true); dv.setUint16(20, 1, true); dv.setUint16(22, 1, true);
            dv.setUint32(24, rate, true); dv.setUint32(28, rate * 2, true); dv.setUint16(32, 2, true); dv.setUint16(34, 16, true);
            str(36, "data"); dv.setUint32(40, total * 2, true);
            var per = Math.floor(rate * len);
            for (var i = 0; i < total; i++) {
                var n = Math.min(notes.length - 1, Math.floor(i / per));
                var t = (i % per) / rate;
                var env = Math.min(1, t * 60) * Math.exp(-t * 7);
                var s = Math.sin(2 * Math.PI * notes[n] * t) * 0.6 + Math.sin(4 * Math.PI * notes[n] * t) * 0.15;
                dv.setInt16(44 + i * 2, Math.max(-1, Math.min(1, s * env)) * 32767 * 0.5, true);
            }
            return URL.createObjectURL(new Blob([buf], { type: "audio/wav" }));
        }
    })();

    /* ---------- 5. Чек-лист публикации ---------- */
    (function () {
        var sec = document.getElementById("publish");
        if (!sec) return;
        var boxes = sec.querySelectorAll(".checklist input");
        var prog = sec.querySelector(".progress");
        function count() {
            var done = Array.prototype.filter.call(boxes, function (b) { return b.checked; }).length;
            prog.textContent = done === boxes.length
                ? "Всё готово! Твой сайт в интернете 🎉"
                : "Сделано: " + done + " из " + boxes.length;
        }
        boxes.forEach(function (b) { b.addEventListener("change", count); });
        count();
    })();

    /* ---------- Разноцветная полоска в шапке (векторная, SVG) ----------
       Полоска — это SVG-прямоугольник с градиентом. Под мышкой рисуется
       плавная «капля» того же цвета: чуть ярче, с мягким размытым краем. */
    (function () {
        var stripe = document.querySelector(".top-stripe");
        if (!stripe) return;
        var NS = "http://www.w3.org/2000/svg";
        var names = ["--prep", "--html", "--css", "--lay", "--fx", "--pub"];
        var css = getComputedStyle(document.documentElement);

        function el(tag, attrs, parent) {
            var e = document.createElementNS(NS, tag);
            for (var k in attrs) e.setAttribute(k, attrs[k]);
            if (parent) parent.appendChild(e);
            return e;
        }
        var svg = el("svg", { "aria-hidden": "true" }, stripe);
        var defs = el("defs", {}, svg);
        var grad = el("linearGradient", { id: "stripe-grad", gradientUnits: "userSpaceOnUse", x1: 0, y1: 0, x2: 1000, y2: 0 }, defs);
        var stops = names.map(function (n, i) {
            return el("stop", { offset: i / (names.length - 1), "stop-color": css.getPropertyValue(n).trim() }, grad);
        });
        // при смене темы берём цвета заново
        document.addEventListener("themechange", function () {
            var now = getComputedStyle(document.documentElement);
            stops.forEach(function (s, i) { s.setAttribute("stop-color", now.getPropertyValue(names[i]).trim()); });
        });
        // мягкий край + чуть ярче и сочнее
        var filter = el("filter", { id: "stripe-soft", x: "-20%", y: "-50%", width: "140%", height: "200%" }, defs);
        el("feGaussianBlur", { stdDeviation: "0.9" }, filter);
        el("feColorMatrix", { type: "saturate", values: "1.5" }, filter);
        var ct = el("feComponentTransfer", {}, filter);
        ["feFuncR", "feFuncG", "feFuncB"].forEach(function (f) { el(f, { type: "linear", slope: "1.25" }, ct); });

        // мягкий блик: белое пятно, которое плавно исчезает к краям
        var shine = el("radialGradient", { id: "stripe-shine" }, defs);
        el("stop", { offset: 0, "stop-color": "#fff", "stop-opacity": "0.75" }, shine);
        el("stop", { offset: 1, "stop-color": "#fff", "stop-opacity": "0" }, shine);

        var base = el("rect", { x: 0, y: 0, height: 6, fill: "url(#stripe-grad)" }, svg);
        var drop = el("path", { fill: "url(#stripe-grad)", filter: "url(#stripe-soft)" }, svg);
        var glow = el("ellipse", { cy: 5, ry: 7, fill: "url(#stripe-shine)", style: "mix-blend-mode: soft-light" }, svg);

        var W = 1000, R = 26, DEPTH = 7;    // R — ширина капли, DEPTH — насколько она опускается
        var x = 0, tx = 0, amp = 0, tamp = 0, running = false;

        function size() {
            W = stripe.clientWidth || 1000;
            svg.setAttribute("viewBox", "0 0 " + W + " 22");
            base.setAttribute("width", W);
            grad.setAttribute("x2", W);
        }
        function draw() {
            if (amp < 0.01) { drop.setAttribute("d", ""); glow.setAttribute("rx", 0); return; }
            var from = x - R * 3, to = x + R * 3, d = "M" + from + " 5.5";
            for (var px = from; px <= to; px += 2) {
                var g = Math.exp(-Math.pow((px - x) / R, 2));        // плавная «колоколом» кривая
                d += " L" + px.toFixed(1) + " " + (6 + DEPTH * amp * g).toFixed(2);
            }
            d += " L" + to + " 5.5 Z";
            drop.setAttribute("d", d);
            glow.setAttribute("cx", x.toFixed(1));
            glow.setAttribute("rx", (R * 1.6).toFixed(1));
            glow.setAttribute("opacity", amp.toFixed(2));
            drop.setAttribute("opacity", Math.min(1, amp * 1.2).toFixed(2));
        }
        function tick() {
            x += (tx - x) * 0.35;
            amp += (tamp - amp) * 0.2;
            draw();
            if (Math.abs(tx - x) > 0.3 || Math.abs(tamp - amp) > 0.01) {
                requestAnimationFrame(tick);
            } else { running = false; }
        }
        function go() { if (!running) { running = true; requestAnimationFrame(tick); } }
        function point(clientX, first) {
            tx = clientX - stripe.getBoundingClientRect().left;
            if (first) x = tx;
            tamp = 1; go();
        }
        function leave() { tamp = 0; go(); }

        size();
        window.addEventListener("resize", size);
        stripe.addEventListener("mouseenter", function (e) { point(e.clientX, amp < 0.05); });
        stripe.addEventListener("mousemove", function (e) { point(e.clientX); });
        stripe.addEventListener("mouseleave", leave);
        var timer;
        stripe.addEventListener("touchstart", function (e) { clearTimeout(timer); point(e.touches[0].clientX, true); }, { passive: true });
        stripe.addEventListener("touchmove", function (e) { point(e.touches[0].clientX); }, { passive: true });
        stripe.addEventListener("touchend", function () { timer = setTimeout(leave, 700); });
    })();

    /* ---------- Кнопка «Копировать» у почты ---------- */
    document.querySelectorAll("[data-copy]").forEach(function (btn) {
        btn.addEventListener("click", function () { copyText(btn.dataset.copy, btn); });
    });

    /* ---------- Тёмная и светлая тема ----------
       Выбор кнопкой запоминается в этом браузере. Пока ничего не выбрано —
       тема такая же, как в настройках устройства. */
    (function () {
        var root = document.documentElement;
        var btn = document.querySelector(".theme-btn");
        if (!btn) return;
        var icon = btn.querySelector(".theme-icon");
        var label = btn.querySelector(".theme-label");
        function saved() { try { return localStorage.getItem("theme"); } catch (e) { return null; } }
        function paint() {
            var dark = root.getAttribute("data-theme") === "dark";
            icon.textContent = dark ? "☀️" : "🌙";
            label.textContent = dark ? "Светлая тема" : "Тёмная тема";
            btn.setAttribute("aria-pressed", dark);
            btn.title = dark ? "Включить светлую тему" : "Включить тёмную тему";
        }
        btn.addEventListener("click", function () {
            var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
            root.setAttribute("data-theme", next);
            try { localStorage.setItem("theme", next); } catch (e) {}
            paint();
            document.dispatchEvent(new Event("themechange"));
        });
        if (window.matchMedia) {
            var mq = matchMedia("(prefers-color-scheme: dark)");
            var follow = function (e) {
                if (saved()) return;           // человек сам выбрал тему — не трогаем
                root.setAttribute("data-theme", e.matches ? "dark" : "light");
                paint();
                document.dispatchEvent(new Event("themechange"));
            };
            if (mq.addEventListener) mq.addEventListener("change", follow); else if (mq.addListener) mq.addListener(follow);
        }
        paint();
    })();

    /* ---------- Словарики, карточки и всплывающий перевод ---------- */
    (function () {
        function card(key) {
            var e = dictEntry(key);
            if (!e) { if (window.console) console.warn("Нет в словаре:", key); return ""; }
            return '<div class="dict-item"><code>' + esc(dictLabel(key)) + "</code>" +
                (e[0] ? '<span class="dict-en">' + esc(e[0]) + "</span>" : "") +
                '<span class="dict-ru">' + esc(e[1]) + "</span>" +
                (e[2] ? '<span class="dict-note">' + esc(e[2]) + "</span>" : "") + "</div>";
        }
        // словарик раздела: если слов много, часть прячем под кнопку
        var SHOW = 9;
        document.querySelectorAll(".dict[data-words]").forEach(function (box) {
            var keys = box.dataset.words.split("|");
            var html = '<p class="dict-title">📖 Словарик раздела <span>' + keys.length + " " + plural(keys.length) + "</span></p>";
            html += '<div class="dict-grid">' + keys.map(card).join("") + "</div>";
            if (keys.length > SHOW + 2) html += '<button type="button" class="dict-more">Показать все слова ↓</button>';
            box.innerHTML = html;
            if (keys.length > SHOW + 2) {
                box.classList.add("folded");
                box.querySelector(".dict-more").addEventListener("click", function (e) {
                    var folded = box.classList.toggle("folded");
                    e.currentTarget.textContent = folded ? "Показать все слова ↓" : "Свернуть ↑";
                });
            }
        });
        function plural(n) {
            var a = n % 10, b = n % 100;
            if (a === 1 && b !== 11) return "слово";
            if (a >= 2 && a <= 4 && (b < 12 || b > 14)) return "слова";
            return "слов";
        }

        // карточки-перевёртыши
        document.querySelectorAll(".flip-grid[data-words]").forEach(function (grid) {
            grid.innerHTML = grid.dataset.words.split("|").map(function (key) {
                var e = dictEntry(key);
                if (!e) return "";
                return '<button type="button" class="flip" aria-pressed="false"><span class="flip-in">' +
                    '<span class="flip-front"><code>' + esc(dictLabel(key)) + "</code><small>нажми, чтобы перевернуть</small></span>" +
                    '<span class="flip-back"><b>' + esc(e[0] || key) + "</b>" + esc(e[1]) + "</span></span></button>";
            }).join("");
            grid.addEventListener("click", function (ev) {
                var f = ev.target.closest(".flip");
                if (!f) return;
                var on = f.classList.toggle("flipped");
                f.setAttribute("aria-pressed", on);
            });
        });

        // перевод у слов в тексте: <code>&lt;ul&gt;</code>, <code>href</code>, <code>:hover</code>…
        function keyOf(text) {
            var t = text.trim();
            var m = t.match(/^<\/?(!?[A-Za-z][\w-]*)(\s[^>]*)?>$/);
            if (m) {
                var tag = m[1].charAt(0) === "!" ? "!" + m[1].slice(1).toUpperCase() : m[1].toLowerCase();
                return dictEntry(tag) ? tag : null;
            }
            t = t.replace(/[;:]$/, "");
            if (dictEntry(t)) return t;
            var bare = t.replace(/\(.*\)$/, "");         // :nth-child(3) → :nth-child
            if (dictEntry(bare)) return bare;
            return null;
        }
        document.querySelectorAll("main :not(pre) > code").forEach(function (c) {
            if (c.closest(".dict-item, .flip, .has-tip")) return;
            var key = keyOf(c.textContent);
            if (!key) return;
            c.classList.add("has-tip");
            c.setAttribute("tabindex", "0");
            c.setAttribute("data-tip", dictLabel(key) + " — " + dictTip(key));
        });

        // всплывающая подсказка: наведение мышкой или нажатие пальцем
        var pop = document.createElement("div");
        pop.className = "tip-pop";
        pop.setAttribute("role", "tooltip");
        document.body.appendChild(pop);
        var current = null, shownAt = 0;
        function show(el) {
            if (current !== el) shownAt = Date.now();
            current = el;
            pop.textContent = el.getAttribute("data-tip");
            pop.classList.add("on");
            var r = el.getBoundingClientRect();
            var w = pop.offsetWidth, h = pop.offsetHeight;
            var x = Math.min(window.innerWidth - w - 8, Math.max(8, r.left + r.width / 2 - w / 2));
            var y = r.top - h - 8;
            if (y < 8) y = r.bottom + 8;
            pop.style.left = x + "px";
            pop.style.top = y + "px";
        }
        function hide() { current = null; pop.classList.remove("on"); }
        var lastPointer = "mouse";
        document.addEventListener("pointerdown", function (e) { lastPointer = e.pointerType || "mouse"; }, true);
        document.addEventListener("mouseover", function (e) {
            if (lastPointer !== "mouse") return;   // на телефоне подсказкой управляет касание
            var el = e.target.closest && e.target.closest("[data-tip]");
            if (el) show(el); else if (current) hide();
        });
        document.addEventListener("focusin", function (e) {
            var el = e.target.closest && e.target.closest("[data-tip]");
            if (el) show(el);
        });
        document.addEventListener("click", function (e) {
            var el = e.target.closest && e.target.closest("[data-tip]");
            // второе нажатие на то же слово прячет подсказку; первое (оно же фокус) — показывает
            if (el) { if (current === el && Date.now() - shownAt > 500) hide(); else show(el); }
            else hide();
        });
        // прячем подсказку, только если страницу заметно прокрутили
        var shownY = 0;
        var origShow = show;
        show = function (el) { shownY = window.pageYOffset; origShow(el); };
        window.addEventListener("scroll", function () {
            if (current && Math.abs(window.pageYOffset - shownY) > 40) hide();
        }, { passive: true });
        document.addEventListener("keydown", function (e) { if (e.key === "Escape") hide(); });
    })();

    /* ---------- 6. Оглавление ---------- */
    (function () {
        var toc = document.querySelector(".toc");
        var toggle = toc.querySelector(".toc-toggle");
        toggle.addEventListener("click", function () {
            var open = toc.classList.toggle("open");
            toggle.setAttribute("aria-expanded", open);
        });
        toc.querySelectorAll("a").forEach(function (a) {
            a.addEventListener("click", function () {
                toc.classList.remove("open");
                toggle.setAttribute("aria-expanded", "false");
            });
        });
        var links = {};
        toc.querySelectorAll("a").forEach(function (a) { links[a.getAttribute("href").slice(1)] = a; });
        /* Подсветка текущего раздела и прокрутка меню вслед за страницей */
        var body = toc.querySelector(".toc-body");
        var secs = Array.prototype.slice.call(document.querySelectorAll("main .sec"));
        var current = null, ticking = false;
        function scrollY() {
            return window.pageYOffset || document.documentElement.scrollTop || 0;
        }
        function scroller() {
            // на компьютере прокручивается само меню, на телефоне — открытый список внутри него
            return toc.scrollHeight > toc.clientHeight + 1 ? toc : body;
        }
        function keepVisible(link) {
            var box = scroller();
            if (box.scrollHeight <= box.clientHeight + 1) return;
            if (scrollY() < 50) { box.scrollTop = 0; return; }
            var bottom = document.documentElement.scrollHeight - window.innerHeight - scrollY();
            if (bottom < 50) { box.scrollTop = box.scrollHeight; return; }
            var boxRect = box.getBoundingClientRect();
            var r = link.getBoundingClientRect();
            var pad = 40;
            if (r.top < boxRect.top + pad) {
                box.scrollTop -= boxRect.top + pad - r.top;
            } else if (r.bottom > boxRect.bottom - pad) {
                box.scrollTop += r.bottom - (boxRect.bottom - pad);
            }
        }
        function update() {
            ticking = false;
            var line = window.innerHeight * 0.35;
            var id = secs[0].id;
            for (var i = 0; i < secs.length; i++) {
                if (secs[i].getBoundingClientRect().top <= line) id = secs[i].id; else break;
            }
            if (document.documentElement.scrollHeight - window.innerHeight - scrollY() < 4) id = secs[secs.length - 1].id;
            if (id !== current) {
                current = id;
                Object.keys(links).forEach(function (k) { links[k].classList.toggle("active", k === id); });
            }
            if (links[id]) keepVisible(links[id]);
        }
        window.addEventListener("scroll", function () {
            if (!ticking) { ticking = true; requestAnimationFrame(update); }
        }, { passive: true });
        window.addEventListener("resize", update);
        update();

        /* Кнопка «Наверх» + «Назад», как на Фикбуке.
           Обычно кнопка везёт наверх. После любого прыжка (наверх, по ссылке в тексте
           или в меню) она запоминает, где ты был, и превращается в «назад» —
           стрелка показывает, куда вернёт. Без скрипта это просто ссылка на #top. */
        var top = document.querySelector(".to-top");
        var arrow = top.querySelector(".to-top-arrow");
        var hint = top.querySelector(".to-top-hint");
        var header = document.getElementById("top");
        var saved = null;          // куда вернуться
        var jumping = false;       // идёт прыжок — не сбрасываем «назад»
        var headerVisible = true;
        function pos() {
            return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
        }
        function render() {
            var back = saved !== null;
            top.classList.toggle("back", back);
            top.classList.toggle("show", back || !headerVisible);
            if (back) {
                var down = saved > pos();
                arrow.textContent = down ? "↓" : "↑";
                top.setAttribute("aria-label", "Вернуться назад");
                top.title = "Вернуться туда, где был";
            } else {
                arrow.textContent = "↑";
                top.setAttribute("aria-label", "Наверх");
                top.title = "Наверх";
            }
        }
        function scrollToY(y) {
            var start = pos();
            jumping = true;
            try { window.scrollTo({ top: y, behavior: "smooth" }); } catch (err) { window.scrollTo(0, y); }
            // если телефон не начал прокрутку (страница ещё ехала по инерции) — прыгаем сразу
            setTimeout(function () {
                if (Math.abs(pos() - y) > 10 && Math.abs(pos() - start) < 5) {
                    document.documentElement.scrollTop = y;
                    document.body.scrollTop = y;
                    window.scrollTo(0, y);
                }
            }, 300);
        }
        function remember() {
            saved = pos();
            jumping = true;
            render();
        }
        if ("IntersectionObserver" in window && header) {
            new IntersectionObserver(function (entries) {
                headerVisible = entries[0].isIntersecting;
                render();
            }).observe(header);
        } else {
            headerVisible = false;
        }
        // когда прыжок закончился — продолжаем следить; если сам доскроллил до места — «назад» не нужен
        var stopTimer;
        window.addEventListener("scroll", function () {
            if (!headerVisible && !("IntersectionObserver" in window)) headerVisible = pos() < 300;
            clearTimeout(stopTimer);
            stopTimer = setTimeout(function () {
                if (jumping) { jumping = false; }
                else if (saved !== null && Math.abs(pos() - saved) < 150) { saved = null; }
                render();
            }, 150);
            if (saved !== null) render();
        }, { passive: true });

        top.addEventListener("click", function (e) {
            e.preventDefault();
            if (saved !== null) {
                var y = saved;
                saved = null;
                scrollToY(y);
            } else {
                remember();
                scrollToY(0);
            }
            render();
            if (history.replaceState) history.replaceState(null, "", location.pathname + location.search);
        });
        // ссылки внутри страницы (меню, «прыгни к таблицам», «смотри раздел…»)
        document.addEventListener("click", function (e) {
            var a = e.target.closest && e.target.closest('a[href^="#"]');
            if (!a || a === top || a.getAttribute("href").length < 2) return;
            if (!document.getElementById(a.getAttribute("href").slice(1))) return;
            remember();
        });
    })();
})();
