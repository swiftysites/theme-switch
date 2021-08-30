/// Displays buttons for switching between light and dark mode.
/// When system supports a color scheme preference, a default button is added.
/// User's choice is stored in session storage (unless it's the default).
class ThemeSwitch extends HTMLElement {

    constructor() {
        super()
    }

    connectedCallback() {
        if (!this.hasAttribute("stylesheet-id")) {
            console.error("A 'stylesheet-id' attribute is required.")
            return
        }

        const stylesheetID = this.getAttribute("stylesheet-id")
        const stylesheetLink = document.querySelector(`#${stylesheetID}`)
        if (stylesheetLink == null) {
            console.error(`A stylesheet link with "id=${stylesheetLink}" could not be found.`)
            return
        }

        // Check whether system supports light/dark theme preference
        const systemSupport = matchMedia("(prefers-color-scheme)").matches

        if (!systemSupport) {
            // With no system support, default theme is always light
            const theme = sessionStorage.getItem("theme")
            if (theme == "light") {
                sessionStorage.removeItem("theme")
            }
        }

        const shadow = this.attachShadow({mode: "open"})
        shadow.innerHTML = `
            <style>
                div {
                    display: inline;
                }

                button {
                    outline: none;
                    margin: 0;
                    border: 1px black solid;
                    background: inherit;
                    color: inherit;
                    transition: .5s border-color;
                }

                button.selected {
                    background: black;
                    color: white;
                }

                div.dark > button {
                    border-color: white;
                }

                div.dark > button.selected {
                    background: white;
                    color: black;
                }
            </style>
            <div>
                ${ systemSupport
                    ? `<button id="default">Default</button>`
                    : ""
                }
                <button id="light">Light</button>
                <button id="dark">Dark</button>
            </div>
        `

        const containerDiv = shadow.querySelector("div")
        const lightButton = shadow.querySelector("#light")
        const darkButton = shadow.querySelector("#dark")

        const mediaQuery = matchMedia("(prefers-color-scheme: light)")
        let defaultTheme = !systemSupport || mediaQuery.matches ? "light" : "dark"

        const updateLink = () => {
            const theme = sessionStorage.getItem("theme")
            const effectiveTheme = theme == null ? defaultTheme : theme
            stylesheetLink.setAttribute("media",
                systemSupport && theme == null ? "(prefers-color-scheme: dark)" : effectiveTheme == "light" ? "not screen" : "screen"
            )
        }

        const updateContainer = () => {
            const theme = sessionStorage.getItem("theme")
            const effectiveTheme = theme == null ? defaultTheme : theme
            containerDiv.className = effectiveTheme == "light" ? "" : "dark"
        }

        const updateButtons = () => {
            const theme = sessionStorage.getItem("theme")
            lightButton.className = theme == "light" || (theme == null && !systemSupport) ? "selected" : ""
            darkButton.className = theme == "dark" ? "selected" : ""
            if (systemSupport) {
                const defaultButton = shadow.querySelector("#default")
                defaultButton.className = theme == null ? "selected" : ""
            }
        }

        const update = () => {
            updateLink()
            updateContainer()
            updateButtons()
        }

        if (systemSupport) {
            mediaQuery.addListener(e => {
                defaultTheme = e.matches ? "light" : "dark"
                update()
            })

            const defaultButton = shadow.querySelector("#default")
            defaultButton.onclick = e => {
                sessionStorage.removeItem("theme")
                update()
            }
        }

        lightButton.onclick = e => {
            if (systemSupport) {
                sessionStorage.setItem("theme", "light")
            } else {
                sessionStorage.removeItem("theme")
            }
            update()
        }

        darkButton.onclick = e => {
            sessionStorage.setItem("theme", "dark")
            update()
        }

        update()
    }

}

customElements.define("theme-switch", ThemeSwitch)
