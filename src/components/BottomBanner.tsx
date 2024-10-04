import {
    type ComponentProps,
    For,
    type JSX,
    createEffect,
    createMemo,
    createSignal,
    onMount,
    useContext,
} from 'solid-js'
import { Row } from './Page'
import { Button } from './buttons'

import { Portal } from 'solid-js/web'
import { BottomBannerContext } from '~/contexts'
import styles from './BottomBanner.module.scss'

const BottomBanner = (props: BottomBarProps) => {
    const [shouldOpen, _setShouldOpen] = createSignal(false)
    let ref: HTMLDivElement | undefined

    const setClosedByUser = () => localStorage.setItem(getStorageKey(props.id), 'true')
    const animateOpen = () => ref?.style.removeProperty('bottom')
    const animateClose = () => {
        // Really bad workaround because for some reason, getting the pseudo element height doesn't work (returns auto)
        // 2 pixels because 1 looks weird.
        if (ref) ref.style.bottom = `calc(-${ref.getBoundingClientRect().height}px - 2px)`
    }

    const setShouldOpen = (value: boolean) => {
        if (value) animateOpen()
        else animateClose()

        setTimeout(() => _setShouldOpen(value), 1000)
    }

    const closeFunction = () => {
        setClosedByUser()
        props.onClose?.()
        setShouldOpen(false)
    }

    const handleRef = (el: HTMLDivElement) => {
        ref = el
        if (isBottomBarClosed(props.id) && props.openState !== 'force') return

        requestAnimationFrame(() => {
            setShouldOpen(props.openState === 'managed' ? true : (props.open ?? true))
            animateOpen()
        })
    }

    createEffect(() => {
        const closedByUser = isBottomBarClosed(props.id)
        if (closedByUser) return setShouldOpen(false)

        if (props.openState && props.openState !== 'managed') {
            const newState = closedByUser ? false : (props.open ?? true)
            if (!newState) animateClose()
            else animateOpen()

            setTimeout(() => setShouldOpen(newState), 1000)
        }
    })

    return (
        <Portal>
            <div ref={handleRef} class={styles.Container} data-open={shouldOpen()} aria-hidden={shouldOpen()}>
                <Row wrap centerHorizontal centerVertical gap="sm" class={styles.Banner}>
                    <div class={styles.Background} />
                    {props.children}
                    <Row centerHorizontal wrap gap="sm">
                        <BottomBannerContext.Provider value={{ close: closeFunction }}>
                            {typeof props.actions === 'function' ? <props.actions /> : props.actions}
                        </BottomBannerContext.Provider>
                        <Button
                            variant={props.closeButtonVariant ?? 'secondary'}
                            onClick={() => {
                                // If the open state is forced, don't close it
                                if (props.openState === 'force') return
                                closeFunction()
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

const getStorageKey = (id: string) => `bottom_bar_closed:${id}`
const isBottomBarClosed = (id: string) => localStorage.getItem(getStorageKey(id))

export default BottomBanner

interface BottomBarProps {
    id: string
    children: JSX.Element | JSX.Element[]
    actions?: JSX.Element | (() => JSX.Element)
    closeLabel?: string
    closeButtonVariant?: ComponentProps<typeof Button>['variant']
    /**
     * Runs when the banner is closed when the user clicks the close button.
     * If the close button hasn't been clicked, this won't run.
     */
    onClose?: () => void
    /**
     * How to manage the open state of the banner
     * - `force`: Always force the status from the `open` prop
     * - `unless-closed-by-user`: Only use the `open` prop if the user hasn't closed the banner manually
     * - `managed`: Don't use the `open` prop, manage the state internally
     */
    openState?: 'force' | 'unless-closed-by-user' | 'managed'
    open?: boolean
}
