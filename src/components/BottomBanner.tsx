import { For, type JSX, createEffect, createSignal, onMount } from 'solid-js'
import { Row } from './Page'
import { Button } from './buttons'

import { Portal } from 'solid-js/web'
import styles from './BottomBanner.module.scss'

const BottomBanner = (props: BottomBarProps) => {
    const [shouldOpen, setShouldOpen] = createSignal(false)
    let ref: HTMLDivElement | undefined

    const handleRef = (el: HTMLDivElement) => {
        ref = el

        if (localStorage.getItem(`bottom_bar_closed:${props.id}`)) return

        requestAnimationFrame(() => {
            el!.style.bottom = `-${getComputedStyle(el, ':before').height}px`

            setTimeout(() => {
                setShouldOpen(true)
                el!.style.removeProperty('bottom')
            }, 250)
        })
    }

    return (
        <Portal>
            <div ref={handleRef} class={styles.Container} data-open={shouldOpen()} aria-hidden={shouldOpen()}>
                <Row wrap centerHorizontal centerVertical gap="sm" class={styles.Banner}>
                    <div class={styles.Background} />
                    {props.children}
                    <Row centerHorizontal wrap gap="sm">
                        <For each={props.actions}>{action => action}</For>
                        <Button
                            variant="secondary"
                            onClick={() => {
                                props.onClose?.()
                                ref!.style.bottom = `-${getComputedStyle(ref!, ':before').height}px`
                                localStorage.setItem(`bottom_bar_closed:${props.id}`, 'true')
                                setTimeout(() => setShouldOpen(false), 1000)
                            }}
                        >
                            {props.closeLabel ?? 'Close'}
                        </Button>
                    </Row>
                </Row>
            </div>
        </Portal>
    )
}

export default BottomBanner

interface BottomBarProps {
    id: string
    children: JSX.Element | JSX.Element[]
    actions?: JSX.Element[]
    closeLabel?: string
    onClose?: () => void
}
