(() => {
    const siteTranslations = window.siteTranslations;
    if (!siteTranslations || !siteTranslations.messages || !siteTranslations.caseIntros) {
        throw new Error("The shared website translations did not load.");
    }

    const supportedLanguages = ["en", "mr", "hi"];
    const languageStorageKey = "claritia-language";
    let currentLanguage = "en";
    try {
        const savedLanguage = window.localStorage.getItem(languageStorageKey);
        if (savedLanguage && supportedLanguages.includes(savedLanguage)) {
            currentLanguage = savedLanguage;
        } else if (savedLanguage) {
            console.warn("Ignoring an unsupported saved website language:", savedLanguage);
        }
    } catch (error) {
        console.warn("The saved website language could not be read:", error);
    }

    const getMessage = (key) => {
        const message = siteTranslations.messages[currentLanguage][key];
        if (typeof message !== "string") {
            throw new Error("Missing " + currentLanguage + " translation for " + key + ".");
        }
        return message;
    };

    const formatMessage = (key, values = {}) => getMessage(key).replace(/\{(\w+)\}/g, (match, name) => {
        if (!Object.prototype.hasOwnProperty.call(values, name)) return match;
        return String(values[name]);
    });

    const getCaseIntroElements = (section) => {
        const groups = [...section.querySelectorAll(".case-glance-section")];
        const story = groups[0] && [...groups[0].querySelectorAll("p")];
        const forensic = groups[1] && groups[1].querySelector("p:not(.case-glance-question)");
        const question = groups[1] && groups[1].querySelector(".case-glance-question");
        const significance = groups[2] && groups[2].querySelector("p");
        const reasons = groups[groups.length - 1] && [...groups[groups.length - 1].querySelectorAll(".case-why-read li")];
        if (!section.querySelector(".case-glance-lead") || !story || story.length !== 2 || !forensic || !question || !significance || !reasons || reasons.length !== 3) {
            throw new Error("A case introduction does not match the shared translation structure.");
        }
        return {
            lead: section.querySelector(".case-glance-lead"),
            story,
            forensic,
            question,
            significance,
            reasons
        };
    };

    const cacheOriginalTranslations = () => {
        document.querySelectorAll("[data-i18n]").forEach((element) => {
            if (!Object.prototype.hasOwnProperty.call(element.dataset, "i18nOriginalText")) {
                element.dataset.i18nOriginalText = element.textContent;
            }
        });
        document.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
            if (!Object.prototype.hasOwnProperty.call(element.dataset, "i18nOriginalAriaLabel")) {
                element.dataset.i18nOriginalAriaLabel = element.getAttribute("aria-label") || "";
            }
        });
        document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
            if (!Object.prototype.hasOwnProperty.call(element.dataset, "i18nOriginalPlaceholder")) {
                element.dataset.i18nOriginalPlaceholder = element.getAttribute("placeholder") || "";
            }
        });
        document.querySelectorAll("[data-case-intro]").forEach((section) => {
            if (section.dataset.caseIntroOriginalText) return;
            const elements = getCaseIntroElements(section);
            section.dataset.caseIntroOriginalText = JSON.stringify({
                lead: elements.lead.textContent,
                story: elements.story.map((element) => element.textContent),
                forensic: elements.forensic.textContent,
                question: elements.question.textContent,
                significance: elements.significance.textContent,
                reasons: elements.reasons.map((element) => element.textContent)
            });
        });
    };

    const setCaseIntroLanguage = (language) => {
        document.querySelectorAll("[data-case-intro]").forEach((section) => {
            const content = language === "en"
                ? JSON.parse(section.dataset.caseIntroOriginalText)
                : siteTranslations.caseIntros[language][section.dataset.caseIntro];
            if (!content) throw new Error("Missing " + language + " case introduction for " + section.dataset.caseIntro + ".");
            const elements = getCaseIntroElements(section);
            elements.lead.textContent = content.lead;
            elements.story.forEach((element, index) => {
                element.textContent = content.story[index];
            });
            elements.forensic.textContent = content.forensic;
            elements.question.textContent = content.question;
            elements.significance.textContent = content.significance;
            elements.reasons.forEach((element, index) => {
                element.textContent = content.reasons[index];
            });
        });
    };

    const applyLanguage = (language) => {
        currentLanguage = language;
        document.documentElement.lang = language;
        document.querySelectorAll("[data-i18n]").forEach((element) => {
            const translated = language === "en"
                ? element.dataset.i18nOriginalText
                : siteTranslations.messages[language][element.dataset.i18n];
            if (typeof translated !== "string") {
                throw new Error("Missing " + language + " translation for " + element.dataset.i18n + ".");
            }
            element.textContent = translated;
        });
        document.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
            const key = element.dataset.i18nAriaLabel;
            const translated = language === "en"
                ? element.dataset.i18nOriginalAriaLabel
                : siteTranslations.messages[language][key];
            if (typeof translated !== "string") throw new Error("Missing " + language + " accessible-label translation for " + key + ".");
            element.setAttribute("aria-label", translated);
        });
        document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
            const key = element.dataset.i18nPlaceholder;
            const translated = language === "en"
                ? element.dataset.i18nOriginalPlaceholder
                : siteTranslations.messages[language][key];
            if (typeof translated !== "string") throw new Error("Missing " + language + " placeholder translation for " + key + ".");
            element.setAttribute("placeholder", translated);
        });
        setCaseIntroLanguage(language);
        document.querySelectorAll("[data-language]").forEach((button) => {
            button.setAttribute("aria-pressed", String(button.dataset.language === language));
        });
        const preferredLanguage = document.getElementById("enquiry-language");
        if (preferredLanguage && preferredLanguage.dataset.userSelected !== "true") {
            preferredLanguage.value = language;
        }
        window.dispatchEvent(new Event("site:languagechange"));
    };

    cacheOriginalTranslations();
    applyLanguage(currentLanguage);

    document.querySelectorAll(".faq-section").forEach((section) => {
        const faqItems = [...section.querySelectorAll(".faq-item")];
        faqItems.forEach((item) => {
            item.addEventListener("toggle", () => {
                if (!item.open) return;
                faqItems.forEach((otherItem) => {
                    if (otherItem !== item) otherItem.open = false;
                });
            });
        });
    });

    document.addEventListener("click", (event) => {
        if (!(event.target instanceof Element)) return;
        const languageButton = event.target.closest("[data-language]");
        if (!languageButton) return;
        const language = languageButton.dataset.language;
        if (!supportedLanguages.includes(language)) return;
        applyLanguage(language);
        try {
            window.localStorage.setItem(languageStorageKey, language);
        } catch (error) {
            console.warn("The website language preference could not be saved:", error);
        }
        const mobileMenu = languageButton.closest(".mobile-menu");
        if (mobileMenu) mobileMenu.open = false;
    });

    const preferredLanguageSelect = document.getElementById("enquiry-language");
    if (preferredLanguageSelect) {
        preferredLanguageSelect.addEventListener("change", () => {
            preferredLanguageSelect.dataset.userSelected = "true";
        });
    }

    const route = window.location.pathname.split("/").filter(Boolean).slice(-1)[0] || "home";
    document.querySelectorAll('[data-route="' + route + '"]').forEach((link) => link.setAttribute("aria-current", "page"));

    if (window.location.protocol === "file:") {
        document.querySelectorAll('a[href^="../"]').forEach((link) => {
            const url = new URL(link.href);
            if (url.pathname.endsWith("/")) url.pathname += "index.html";
            link.href = url.href;
        });
    }

    const caseCards = [...document.querySelectorAll("[data-case-card]")];
    if (caseCards.length) {
        const search = document.getElementById("case-search");
        const filterButtons = [...document.querySelectorAll("[data-case-filter]")];
        const categories = [...document.querySelectorAll("[data-case-category]")];
        const noResults = document.getElementById("case-no-results");
        const searchStatus = document.getElementById("case-search-status");
        const caseModal = document.getElementById("case-details-modal");
        const caseModalTitle = document.getElementById("case-modal-title");
        const caseModalMeta = document.getElementById("case-modal-meta");
        const caseModalContent = document.getElementById("case-modal-content");
        const caseModalClose = caseModal && caseModal.querySelector("[data-case-modal-close]");
        let activeFilter = "all";
        let modalTrigger = null;
        let modalScrollY = 0;
        let modalHistoryOpen = false;
        let modalCloseTimer = null;
        let lockedBodyStyles = null;
        let lockedRootOverflow = "";
        let lockedRootScrollBehavior = "";

        const filterCases = () => {
            const query = search.value.trim().toLocaleLowerCase();
            let visibleCount = 0;
            caseCards.forEach((card) => {
                const categories = (card.dataset.category || "").split(/\s+/).filter(Boolean);
                const matchesCategory = activeFilter === "all" || categories.includes(activeFilter);
                const matchesName = card.dataset.caseName.toLocaleLowerCase().includes(query);
                card.hidden = !matchesCategory || !matchesName;
                if (!card.hidden) visibleCount += 1;
            });
            categories.forEach((category) => {
                category.hidden = !category.querySelector("[data-case-card]:not([hidden])");
            });
            noResults.hidden = visibleCount > 0;
            const count = new Intl.NumberFormat(currentLanguage === "en" ? "en-IN" : currentLanguage + "-IN").format(visibleCount);
            searchStatus.textContent = formatMessage(visibleCount === 1 ? "case.searchCountOne" : "case.searchCountMany", { count });
        };

        search.addEventListener("input", filterCases);
        window.addEventListener("site:languagechange", filterCases);
        filterCases();
        filterButtons.forEach((button) => {
            button.addEventListener("click", () => {
                activeFilter = button.dataset.caseFilter;
                filterButtons.forEach((filterButton) => {
                    filterButton.setAttribute("aria-pressed", String(filterButton === button));
                });
                filterCases();
            });
        });

        const restoreCasePage = () => {
            const bodyStyles = lockedBodyStyles;
            const rootOverflow = lockedRootOverflow;
            const rootScrollBehavior = lockedRootScrollBehavior;
            lockedBodyStyles = null;
            const trigger = modalTrigger;
            modalTrigger = null;
            window.requestAnimationFrame(() => {
                window.requestAnimationFrame(() => {
                    if (bodyStyles) {
                        Object.assign(document.body.style, bodyStyles);
                        document.documentElement.style.overflow = rootOverflow;
                    }
                    if (trigger && trigger.isConnected) trigger.focus({ preventScroll: true });
                    document.documentElement.style.scrollBehavior = "auto";
                    window.scrollTo(0, modalScrollY);
                    document.documentElement.style.scrollBehavior = rootScrollBehavior;
                });
            });
        };

        const closeCaseModal = (returnHistory = true) => {
            if (!caseModal || !caseModal.open || caseModal.classList.contains("is-closing")) return;
            caseModal.classList.add("is-closing");
            if (returnHistory && modalHistoryOpen) {
                modalHistoryOpen = false;
                window.history.back();
            }
            modalCloseTimer = window.setTimeout(() => {
                if (caseModal.open) caseModal.close();
            }, 220);
        };

        if (caseModal && caseModalTitle && caseModalMeta && caseModalContent && caseModalClose) {
            caseModal.addEventListener("click", (event) => {
                if (event.target !== caseModal) return;
                const bounds = caseModal.getBoundingClientRect();
                const outside = event.clientX < bounds.left || event.clientX > bounds.right
                    || event.clientY < bounds.top || event.clientY > bounds.bottom;
                if (outside) closeCaseModal();
            });

            caseModal.addEventListener("cancel", (event) => {
                event.preventDefault();
                closeCaseModal();
            });

            caseModal.addEventListener("keydown", (event) => {
                if (event.key !== "Escape") return;
                event.preventDefault();
                closeCaseModal();
            });

            caseModal.addEventListener("animationend", (event) => {
                if (event.target === caseModal && caseModal.classList.contains("is-closing")) {
                    if (modalCloseTimer) window.clearTimeout(modalCloseTimer);
                    caseModal.close();
                }
            });

            caseModal.addEventListener("close", () => {
                caseModal.classList.remove("is-closing");
                if (modalCloseTimer) window.clearTimeout(modalCloseTimer);
                modalCloseTimer = null;
                if (modalHistoryOpen) {
                    modalHistoryOpen = false;
                    window.history.back();
                }
                restoreCasePage();
            });

            caseModalClose.addEventListener("click", () => closeCaseModal());

            window.addEventListener("popstate", () => {
                if (caseModal.open && !caseModal.classList.contains("is-closing")) {
                    modalHistoryOpen = false;
                    closeCaseModal(false);
                }
            });
        }

        document.addEventListener("click", (event) => {
            if (!(event.target instanceof Element)) return;
            const toggle = event.target.closest("[data-case-toggle]");
            if (!toggle) return;
            const card = toggle.closest("[data-case-card]");
            const details = document.getElementById(toggle.getAttribute("aria-controls"));
            if (!card || !details || !caseModal || !caseModalTitle || !caseModalMeta || !caseModalContent || caseModal.open) return;

            const title = card.querySelector("h3");
            const meta = card.querySelector(".case-insight-meta");
            const area = card.querySelector(".case-insight-area");
            if (!title || !meta || !area) return;

            caseModalTitle.textContent = title.textContent.trim();
            const caseMetadata = [...meta.querySelectorAll("span")].map((item) => item.textContent.trim());
            caseModalMeta.textContent = [...caseMetadata, area.textContent.trim()].filter(Boolean).join(" • ");
            caseModalContent.replaceChildren(details.cloneNode(true));
            const displayedDetails = caseModalContent.firstElementChild;
            if (displayedDetails) {
                displayedDetails.hidden = false;
                displayedDetails.removeAttribute("id");
            }

            modalTrigger = toggle;
            modalScrollY = window.scrollY;
            const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
            lockedBodyStyles = {
                position: document.body.style.position,
                top: document.body.style.top,
                left: document.body.style.left,
                right: document.body.style.right,
                width: document.body.style.width,
                overflow: document.body.style.overflow,
                paddingRight: document.body.style.paddingRight,
                boxSizing: document.body.style.boxSizing
            };
            lockedRootOverflow = document.documentElement.style.overflow;
            lockedRootScrollBehavior = document.documentElement.style.scrollBehavior;
            document.body.style.position = "fixed";
            document.body.style.top = "-" + modalScrollY + "px";
            document.body.style.left = "0";
            document.body.style.right = "0";
            document.body.style.width = "100%";
            document.body.style.overflow = "hidden";
            document.body.style.paddingRight = scrollbarWidth + "px";
            document.body.style.boxSizing = "border-box";
            document.documentElement.style.overflow = "hidden";

            caseModal.classList.remove("is-closing");
            caseModal.showModal();
            caseModalContent.scrollTop = 0;
            caseModalClose.focus();
            modalHistoryOpen = true;
            window.history.pushState({ caseDetailsModal: true }, "");
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
            if (openDialogs[openDialogs.length - 1].id === "case-details-modal") return;
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
            status.textContent = formatMessage("status.invalidEndpoint");
            return;
        }

        status.textContent = formatMessage("status.sending");
        try {
            const response = await fetch(endpoint, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } });
            if (!response.ok) {
                status.textContent = formatMessage("status.failed");
                return;
            }
            const preferredLanguage = preferredLanguageSelect ? preferredLanguageSelect.value : "";
            form.reset();
            updateFormatField();
            if (preferredLanguageSelect) preferredLanguageSelect.value = preferredLanguage || currentLanguage;
            status.dataset.state = "success";
            status.textContent = formatMessage("status.sent");
        } catch (error) {
            status.dataset.state = "error";
            status.textContent = formatMessage("status.networkError");
            console.error("Enquiry submission failed:", error);
        }
    });
})();
