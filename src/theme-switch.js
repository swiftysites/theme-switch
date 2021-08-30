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

        const color = this.hasAttribute("color") ? this.getAttribute("color") : blue
        const colorDark = this.hasAttribute("color-dark") ? this.getAttribute("color-dark") : color

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
                .theme-switch {
                    --switch-color: ${color};
                    font-size: .70588rem;
                    line-height: 1.33333;
                    font-weight: 400;
                    letter-spacing: -.01em;
                    font-family: Helvetica Neue,Helvetica,Arial,sans-serif;
                    border: 1px solid var(--switch-color);
                    border-radius: var(--toggle-border-radius-outer,4px);
                    display: inline-flex;
                    padding: 1px;
                }

                .theme-switch:focus {
                    outline: none;
                }

                .theme-switch.dark {
                    --switch-color: ${colorDark};
                }

                input[type=radio] {
                    position: absolute;
                    clip: rect(1px,1px,1px,1px);
                    -webkit-clip-path: inset(0 0 99.9% 99.9%);
                    clip-path: inset(0 0 99.9% 99.9%);
                    overflow: hidden;
                    height: 1px;
                    width: 1px;
                    padding: 0;
                    border: 0;
                    -webkit-appearance: none;
                    -moz-appearance: none;
                    appearance: none;
                }

                input[type=radio]:checked + .text {
                    background: var(--switch-color);
                    border-color: var(--switch-color);
                    color: white;
                }

                .text {
                    border: 1px solid transparent;
                    border-radius: var(--toggle-border-radius-inner,2px);
                    color: var(--switch-color);
                    display: inline-block;
                    padding: 1px 0;
                    text-align: center;
                    width: 40px;
                }

                .text:hover {
                    cursor: pointer;
                }
            </style>
            <div aria-label="Select a color scheme preference" role="radiogroup" tabindex="0" class="theme-switch">
                <label> <input type="radio" name="theme" value="light"></input> <div class="text">Light</div></label>
                <label> <input type="radio" name="theme" value="dark"></input> <div class="text">Dark</div></label>
                ${ systemSupport
                    ? `<label> <input type="radio" name="theme" value="auto"></input> <div class="text">Auto</div></label>`
                    : ""
                }
            </div>
        `

        const containerDiv = shadow.querySelector(".theme-switch")
        const lightButton = () => shadow.querySelector("input[value=light]")
        const darkButton = () => shadow.querySelector("input[value=dark]")
        const autoButton = () => shadow.querySelector("input[value=auto]")

        const radioHandler = event => {
            let newTheme = event.currentTarget.value
            if (newTheme == "auto" || (!systemSupport && newTheme == "light")) {
                sessionStorage.removeItem("theme")
            } else if (newTheme == "dark") {
                sessionStorage.setItem("theme", "dark")
            } else { // newTheme == "light" && systemSupport
                sessionStorage.setItem("theme", "light")
            }
            update()
        }

        lightButton().onchange = radioHandler
        darkButton().onchange = radioHandler
        if (systemSupport) {
            autoButton().onchange = radioHandler
        }

        const mediaQuery = matchMedia("(prefers-color-scheme: light)")
        let defaultTheme = !systemSupport || mediaQuery.matches ? "light" : "dark"

        const update = () => {
            // update link
            const theme = sessionStorage.getItem("theme")
            const effectiveTheme = theme == null ? defaultTheme : theme
            stylesheetLink.setAttribute("media",
                systemSupport && theme == null ? "(prefers-color-scheme: dark)" : effectiveTheme == "light" ? "not screen" : "screen"
            )
            // update container
            containerDiv.className = effectiveTheme == "light" ? "theme-switch" : "theme-switch dark"
        }

        if (systemSupport) {
            mediaQuery.addListener(e => {
                defaultTheme = e.matches ? "light" : "dark"
                update()
            })
        }

        // updateRadioGroup
        const theme = sessionStorage.getItem("theme")
        if (theme == "light" || (!systemSupport && theme == null)) {
            lightButton().checked = true
        } else if (theme == "dark") {
            darkButton().checked = true
        } else { // theme == null && systemSupport
            autoButton().checked = true
        }

        update()
    }

}

customElements.define("theme-switch", ThemeSwitch)
