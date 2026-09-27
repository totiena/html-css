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

    function hlTag(tag) {
        return tokenize(tag, /("[^"]*")|(^<\/?!?[\w-]+)|([\w:-]+)(?==)/g, function (m) {
            if (m[1]) return span("t-str", m[1]);
            if (m[2]) {
                var open = m[2].match(/^<\/?!?/)[0];
                return esc(open) + span("t-tag", m[2].slice(open.length));
            }
            return span("t-attr", m[3]);
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
            if (m[3]) return span("t-sel", m[3]);
            if (m[4]) return span("t-prop", m[4]);
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
                quiz.querySelectorAll(".opts button").forEach(function (b) { b.classList.remove("wrong"); });
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
            head: ["&lt;head&gt; — голова страницы", "Её не видно на сайте. Тут лежат название вкладки <code>&lt;title&gt;</code>, кодировка и подключение CSS через <code>&lt;link&gt;</code>."],
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
            style.textContent = ".nth-list li" + sel + "{background:#8a4ff0;color:#fff;transform:translateX(6px)}";
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
        if ("IntersectionObserver" in window) {
            var io = new IntersectionObserver(function (entries) {
                entries.forEach(function (en) {
                    if (!en.isIntersecting) return;
                    Object.keys(links).forEach(function (id) { links[id].classList.toggle("active", id === en.target.id); });
                });
            }, { rootMargin: "-30% 0px -65% 0px" });
            document.querySelectorAll("main .sec").forEach(function (s) { io.observe(s); });
        }

        var top = document.querySelector(".to-top");
        window.addEventListener("scroll", function () {
            top.classList.toggle("show", window.scrollY > 800);
        }, { passive: true });
        top.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });
    })();
})();
