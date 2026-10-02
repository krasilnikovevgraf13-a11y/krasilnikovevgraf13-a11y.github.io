(() => {
    "use strict";

    /*
     * Страницы сайта открываются обычной навигацией браузера.
     * Поэтому DOM предыдущей страницы не переносится на новую.
     *
     * Дополнительно перед уходом:
     * - запускаем плавное исчезновение страницы;
     * - не делаем fetch/append старой страницы;
     * - внешние ссылки и mailto не перехватываем.
     *
     * Это предотвращает накопление содержимого при переходах.
     */

    const isInternalPageLink = (link) => {
        if (!link || !link.href) return false;
        if (link.target && link.target !== "_self") return false;
        if (link.hasAttribute("download")) return false;

        const url = new URL(link.href, window.location.href);

        return (
            url.origin === window.location.origin &&
            url.pathname.endsWith(".html")
        );
    };

    document.addEventListener("click", (event) => {
        const link = event.target.closest("a");
        if (!isInternalPageLink(link)) return;

        // Ctrl/Cmd/Shift/Alt + click должен работать как обычная ссылка.
        if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) {
            return;
        }

        event.preventDefault();

        document.body.classList.add("page-leaving");

        // location.assign заменяет текущий документ новым.
        // Старый DOM при этом не добавляется к новому.
        window.setTimeout(() => {
            window.location.assign(link.href);
        }, 180);
    });

    // При открытии новой страницы начинаем с чистого состояния.
    window.addEventListener("pageshow", () => {
        document.body.classList.remove("page-leaving");
        window.scrollTo(0, 0);
    });
})();
