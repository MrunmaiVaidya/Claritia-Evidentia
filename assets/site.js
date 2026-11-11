(() => {
    const route = window.location.pathname.split("/").filter(Boolean).slice(-1)[0] || "home";
    document.querySelectorAll('[data-route="' + route + '"]').forEach((link) => link.setAttribute("aria-current", "page"));

    if (window.location.protocol === "file:") {
        document.querySelectorAll('a[href^="../"]').forEach((link) => {
            const url = new URL(link.href);
            if (url.pathname.endsWith("/")) url.pathname += "index.html";
            link.href = url.href;
        });
    }

    const form = document.getElementById("enquiry-form");
    const serviceSelect = document.getElementById("enquiry-service");
    const formatSelect = document.getElementById("enquiry-format");
    const formatField = document.getElementById("format-field");
    const status = document.getElementById("enquiry-status");
    const connectionNote = document.getElementById("enquiry-connection-note");

    const updateFormatField = () => {
        if (!serviceSelect || !formatSelect || !formatField) return;
        const requiresFormat = serviceSelect.value === "International Fingerprint Card Assistance";
        formatField.hidden = !requiresFormat;
        formatSelect.required = false;
        if (!requiresFormat) formatSelect.value = "";
    };

    const contactUrl = (trigger) => {
        const contactPath = window.location.protocol === "file:" ? "../contact/index.html" : "../contact/";
        const url = new URL(contactPath, window.location.href);
        const service = trigger.dataset.enquiryService || "";
        const format = trigger.dataset.enquiryFormat || "";
        if (service) url.searchParams.set("service", service);
        if (format) url.searchParams.set("format", format);
        url.hash = "intake";
        return url.href;
    };

    if (form && serviceSelect && formatSelect) {
        const params = new URLSearchParams(window.location.search);
        const requestedService = params.get("service");
        const requestedFormat = params.get("format");
        if (requestedService) {
            serviceSelect.value = requestedService === "PCC & International Fingerprint Card Assistance"
                ? (requestedFormat ? "International Fingerprint Card Assistance" : "Police Clearance Certificate Assistance")
                : requestedService;
        }
        updateFormatField();
        if (requestedFormat && [...formatSelect.options].some((option) => option.value === requestedFormat)) {
            serviceSelect.value = "International Fingerprint Card Assistance";
            updateFormatField();
            formatSelect.value = requestedFormat;
        }
    }

    document.addEventListener("keydown", (event) => {
        if (event.key !== "Escape") return;
        const openDialogs = [...document.querySelectorAll("dialog[open]")];
        if (openDialogs.length) {
            event.preventDefault();
            openDialogs[openDialogs.length - 1].close();
        }
    });

    document.addEventListener("click", (event) => {
        if (!(event.target instanceof Element)) return;
        const link = event.target.closest("a[data-enquiry-service], a[data-enquiry-format]");
        if (link) {
            event.preventDefault();
            window.location.href = contactUrl(link);
            return;
        }

        const openTrigger = event.target.closest("[data-open-dialog]");
        if (openTrigger) {
            const dialog = document.getElementById(openTrigger.dataset.openDialog);
            if (dialog instanceof HTMLDialogElement) dialog.showModal();
        }

        const closeTrigger = event.target.closest("[data-close-dialog]");
        if (closeTrigger) {
            const dialog = closeTrigger.closest("dialog");
            if (dialog) dialog.close();
        }

        const enquiryTrigger = event.target.closest("[data-close-and-enquire]");
        if (enquiryTrigger) {
            document.querySelectorAll("dialog[open]").forEach((dialog) => dialog.close());
            window.location.href = contactUrl(enquiryTrigger);
            return;
        }

        if (event.target instanceof HTMLDialogElement && event.target.open) event.target.close();
    });

    if (!form || !serviceSelect || !formatSelect || !status || !connectionNote) return;

    serviceSelect.addEventListener("change", updateFormatField);
    connectionNote.hidden = Boolean(form.dataset.endpoint.trim());

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        status.dataset.state = "error";
        const endpoint = form.dataset.endpoint.trim();
        if (!/^https:\/\/[^ ]+$/i.test(endpoint)) {
            status.textContent = "The enquiry form endpoint is invalid. No enquiry was sent.";
            return;
        }

        status.textContent = "Sending your enquiry…";
        try {
            const response = await fetch(endpoint, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } });
            if (!response.ok) {
                status.textContent = "Your enquiry could not be sent. Please try again later.";
                return;
            }
            form.reset();
            updateFormatField();
            status.dataset.state = "success";
            status.textContent = "Thank you. Your enquiry has been sent successfully.";
        } catch (error) {
            status.dataset.state = "error";
            status.textContent = "A network error prevented your enquiry from being sent. Please try again when your connection is available.";
            console.error("Enquiry submission failed:", error);
        }
    });
})();
