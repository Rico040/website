import { type Component, type JSX, createContext, onCleanup, onMount } from 'solid-js'
import { createStore } from 'solid-js/store'
import { ThemeCycleMap } from './constants/theme'
import { logger } from './utils'

export const ThemeContext = createContext<ThemeStruct>(undefined as unknown as ThemeStruct)

export const ThemeProvider: Component<{ children: JSX.Element | JSX.Element[] }> = props => {
    const [theme, setTheme] = createStore<ThemeStruct>({
        theme: 'auto',
        colorScheme: 'dark',
        initialized: false,
        set: value => {
            if (value === 'auto') {
                localStorage.removeItem('theme_override')
                setTheme({
                    colorScheme: matchMedia('(prefers-color-scheme:light)').matches ? 'light' : 'dark',
                })
            } else {
                localStorage.setItem('theme_override', value)
                setTheme({
                    colorScheme: value as ThemeColorScheme,
                })
            }

            setTheme({
                theme: value,
            })

            logger.log('ThemeProvider', `Theme set to "${theme.theme}" with color scheme "${theme.colorScheme}"`)
            document.documentElement.dataset.theme = theme.colorScheme
        },
        cycle: () => {
            theme.set(ThemeCycleMap[theme.theme])
        },
    })

    onMount(() => {
        const prefersLightTheme = matchMedia('(prefers-color-scheme:light)')
        const override = localStorage.getItem('theme_override') as ThemeColorScheme

        setTheme({
            theme: override ?? 'auto',
            colorScheme: override ?? (prefersLightTheme.matches ? 'light' : 'dark'),
            initialized: true,
        })

        logger.log('ThemeProvider', `Initialized with theme "${theme.theme}" and color scheme "${theme.colorScheme}"`)

        const listener = () => !localStorage.getItem('theme_override') && theme.set('auto')
        prefersLightTheme.addEventListener('change', listener)
        onCleanup(() => prefersLightTheme.removeEventListener('change', listener))
    })

    return <ThemeContext.Provider value={theme}>{props.children}</ThemeContext.Provider>
}

export const ConfettiContext = createContext<ConfettiStruct>(undefined as unknown as ConfettiStruct)

// This can only be used inside of BottomBanner actions, so it should be nullable to prevent misuse
export const BottomBannerContext = createContext<BottomBannerStruct>()

export interface ThemeStruct {
    theme: ThemeTheme
    colorScheme: ThemeColorScheme
    set: (theme: ThemeTheme) => void
    cycle: () => void
    initialized: boolean
}

export type ThemeColorScheme = 'light' | 'dark'
export type ThemeTheme = ThemeColorScheme | 'auto'

export interface ConfettiStruct {
    launch(): void
}

export interface BottomBannerStruct {
    close(): void
}
