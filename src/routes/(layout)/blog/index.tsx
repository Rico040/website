import type { Component } from 'solid-js'
import { Column, LinkButton, Page, Section } from '~/components'

import IconHome from '~/assets/icons/nav/home.svg'

import sharedStyles from '~/styles/shared.module.scss'

export default (() => {
    return (
        <Page>
            <Section constrainSize>
                <Column gap="none" class={sharedStyles.DirectTextChildrenAlignCenter}>
                    {/* biome-ignore lint/a11y/useHeadingContent: Screen readers kinda suck, so here's a workaround */}
                    <h1 aria-label="Coming soon">
                        <span aria-hidden="true">Coming </span>
                        <span
                            aria-hidden="true"
                            style="font-weight: var(--weight-bolder)"
                            class={sharedStyles.GradientText}
                        >
                            soon
                        </span>
                        <span aria-hidden="true">...</span>
                    </h1>
                    <p style="text-wrap: balance">Blog posts are currently being added. Check back later!</p>
                </Column>
                <LinkButton openInCurrentTab leadingIcon={IconHome} href="/">
                    Alright, go back home
                </LinkButton>
            </Section>
        </Page>
    )
}) satisfies Component
