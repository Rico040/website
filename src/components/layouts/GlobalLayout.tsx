import { clientOnly } from '@solidjs/start'
import JSConfetti from 'js-confetti'
import { type Component, type JSX, Show, Suspense, createSignal, onCleanup, onMount, useContext } from 'solid-js'
import { format } from 'timeago.js'

import { BottomBanner, Button, NavDock } from '~/components'
import { Birthday, BirthdayEnd, BirthdayLocale } from '~/constants/personal'

import IconBlog from '~/assets/icons/nav/blog.svg'
import IconHome from '~/assets/icons/nav/home.svg'
import IconSource from '~/assets/icons/source.svg'

import { BottomBannerContext, ConfettiContext, ThemeContext } from '~/contexts'
import sharedStyles from '~/styles/shared.module.scss'

const ClientOnlyShow = clientOnly(async () => ({ default: Show }))

const GlobalLayout: Component<{ children: JSX.Element }> = props => {
    const theme = useContext(ThemeContext)
    const [time, setTime] = createSignal<string | null>('...')

    let canvasRef: HTMLCanvasElement | undefined
    let confetti: JSConfetti | undefined

    const launchConfetti = () => {
        confetti?.addConfetti({
            confettiRadius: 4,
            confettiNumber: 250,
            confettiColors: ['primary', 'secondary'].map(token =>
                getComputedStyle(document.documentElement).getPropertyValue(`--gradient-${token}`),
            ),
        })
    }

    const launchHalloweenConfetti = () => {
        confetti?.addConfetti({
            confettiRadius: 8,
            confettiNumber: 5,
            emojiSize: 72,
            emojis: ['👻', '🎃', '💀'],
        })
    }

    onMount(() => {
        confetti = new JSConfetti({ canvas: canvasRef })

        if (Date.now() > Birthday.getTime()) return

        const interval = setInterval(() => {
            if (Date.now() >= Birthday.getTime()) {
                launchConfetti()
                setTime(null)
                clearInterval(interval)
                return
            }

            setTime(format(Birthday, BirthdayLocale))
        }, 1000)

        onCleanup(() => clearInterval(interval))
    })

    return (
        <ConfettiContext.Provider value={{ launch: launchConfetti }}>
            <canvas
                ref={canvasRef}
                style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: var(--layer-overlay);"
            />
            <NavDock
                pages={[
                    { name: 'Home', href: '/', icon: IconHome },
                    { name: 'Blog', href: '/blog', icon: IconBlog, matchSubroutes: true },
                ]}
                links={[
                    {
                        name: 'Source code',
                        icon: IconSource,
                        href: 'https://github.com/PalmDevs/website',
                    },
                ]}
            />
            <Suspense>{props.children}</Suspense>
            <ClientOnlyShow keyed when={Date.now() < BirthdayEnd.getTime()}>
                <BottomBanner
                    id={`${new Date().getFullYear()}-bd`}
                    closeLabel="Close"
                    onClose={launchConfetti}
                    actions={() => <Button onClick={launchConfetti}>Launch confetti 🎉</Button>}
                >
                    <p style="margin: 0">
                        <Show
                            when={time()}
                            fallback={
                                <>
                                    Today's my <span class={sharedStyles.GradientText}>birthday!</span> 🎂
                                </>
                            }
                        >
                            It's <span class={sharedStyles.GradientText}>{time()}</span> before my birthday! 🎂
                        </Show>
                    </p>
                </BottomBanner>
            </ClientOnlyShow>
            <ClientOnlyShow keyed when={document.documentElement.dataset.event === 'halloween'}>
                <BottomBanner
                    id={`${new Date().getFullYear()}-halloween`}
                    closeLabel="I'll pass"
                    openState="unless-closed-by-user"
                    open={theme.colorScheme !== 'dark'}
                    actions={() => {
                        const bottomBanner = useContext(BottomBannerContext)

                        return (
                            <Button
                                variant="primary"
                                onClick={() => {
                                    theme.set('dark')
                                    launchHalloweenConfetti()
                                    bottomBanner?.close()
                                }}
                            >
                                Okay
                            </Button>
                        )
                    }}
                >
                    <p style="margin: 0">
                        <span class={sharedStyles.GradientText}>Happy Halloween!</span> Turn on dark mode for a more
                        spooky experience. bOoOo 👻!
                    </p>
                </BottomBanner>
                <BottomBanner
                    id={`${new Date().getFullYear()}-halloween`}
                    onClose={launchHalloweenConfetti}
                    openState="unless-closed-by-user"
                    open={theme.colorScheme !== 'light'}
                >
                    <p style="margin: 0">
                        <span class={sharedStyles.GradientText}>Happy Halloween</span>, visitor! 🎃
                        <br />
                        Enjoy this cool theme for a limited time! 🍬
                    </p>
                </BottomBanner>
            </ClientOnlyShow>
        </ConfettiContext.Provider>
    )
}

export default GlobalLayout
