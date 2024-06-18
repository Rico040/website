import { type Component, For, type JSX, createEffect, createSignal, onCleanup, onMount, useContext } from 'solid-js'
import { Portal } from 'solid-js/web'

import { ThemeContext } from '~/contexts'
import { logger } from '~/utils'
import styles from './GlowingBackground.module.scss'

const GlowingBackground: Component<{
    children: JSX.Element | JSX.Element[]
    reanimateInterval?: number
    orbs?: number
    scrollStiffness?: number
}> = props => {
    const theme = useContext(ThemeContext)
    const log = (method: keyof typeof logger, ...args: unknown[]) => logger[method]('GlowingBackground', ...args)

    const [effectDisabled, setEffectDisabled] = createSignal(false)

    // Listen and set media query changes
    onMount(() => {
        const prefersNoEffect = matchMedia(
            '(prefers-contrast:more),(prefers-reduced-transparency:reduce),(prefers-reduced-motion:reduce),print',
        )

        const handler = (e: Pick<MediaQueryListEvent, 'matches'>) => {
            if (e.matches) log('log', 'User prefers accessibility options, disabling')
            setEffectDisabled(e.matches)
        }

        handler(prefersNoEffect)

        prefersNoEffect.addEventListener('change', handler)
        onCleanup(() => prefersNoEffect.removeEventListener('change', handler))
    })

    // More conditions to disable effects
    createEffect(() => {
        if ('mozInnerScreenX' in window && typeof window.mozInnerScreenX !== 'undefined') {
            // Firefox with low opacity gradient sucks
            log('log', 'Firefox browser detected, disabling')
        } else if (theme.colorScheme !== 'dark') {
            log('log', 'Not using dark color scheme, disabling')
        } else {
            log('log', 'No conditions matched, effect is enabled')
            return setEffectDisabled(false)
        }

        setEffectDisabled(true)
    })

    const handleRef = (ref: HTMLDivElement) => {
        // Handle effect disables
        createEffect(() =>
            effectDisabled() ? ref.style.setProperty('display', 'none') : ref.style.removeProperty('display'),
        )

        // Handle initial animation
        createEffect(() => {
            if (effectDisabled()) return

            const elements = [...ref.children] as [HTMLElement, ...HTMLElement[]]

            // Randomize initial positions
            animateGlow(elements)
            // Requesting the next frame so the randomized positions are already rendered
            requestAnimationFrame(() => {
                // Randomize them again so it animates while it's still invisible
                requestAnimationFrame(() => animateGlow(elements))
                // Finally make it visible
                requestAnimationFrame(() => {
                    ref.style.removeProperty('opacity')
                    log('log', 'Component visuals ready')
                })
            })

            const interval = setInterval(() => animateGlow(elements), props.reanimateInterval ?? 30000)
            onCleanup(() => clearInterval(interval))
        })

        // Handle scrolling parallax effect
        onMount(() => {
            if (effectDisabled()) return

            const parentHeight = ref.clientHeight
            const handleScroll = () =>
                requestAnimationFrame(() => {
                    log('debug', 'Scroll position updated')
                    ref.style.top = `-${
                        (parentHeight / (props.scrollStiffness ?? 9.5)) *
                        (window.scrollY / (document.body.clientHeight - window.innerHeight))
                    }px`
                })

            window.addEventListener('scroll', handleScroll)
            log('log', 'Component parallax scroll ready')
            onCleanup(() => window.removeEventListener('scroll', handleScroll))
        })
    }

    return (
        <>
            <Portal mount={document.querySelector('main') ?? document.body}>
                <div style="opacity: 0" aria-hidden="true" ref={handleRef} class={styles.Container}>
                    <For each={[...Array(props.orbs ?? 20).keys()]}>{() => <div class={styles.Orb} />}</For>
                </div>
            </Portal>
            {props.children}
        </>
    )
}

export default GlowingBackground

const animateGlow = (elements: HTMLElement[]) => {
    logger.debug('GlowingBackground.animateGlow', 'Animating glow')

    for (const elem of elements) {
        const xDisposition = Math.random() * 80
        const yDisposition = Math.random() * 50
        const factor = Math.random() > 0.5 ? -Math.random() : Math.random() + 0.5
        const scale = Math.max(0.75, Math.random() * 1.5)

        elem.setAttribute(
            'style',
            `top: ${yDisposition * factor}%; left: ${xDisposition * factor}%; transform: scale(${scale})`,
        )
    }
}
