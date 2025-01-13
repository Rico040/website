import { Link, Meta, Title } from '@solidjs/meta'
import { HttpStatusCode } from '@solidjs/start'
import { Column, Page, Row, Section } from '~/components/Page'
import { LinkButton } from '~/components/buttons/Button'

import { RepositoryLinks } from '~/constants/links'

import IconHome from '~/assets/icons/nav/home.svg'
import IconReport from '~/assets/icons/report.svg'

import sharedStyles from '~/styles/shared.module.css'

import type { Component } from 'solid-js'

const FourOhFourPage: Component = () => {
    return (
        <Page noCrawl noSetCanonical>
            <Title>404 • Palm (PalmDevs)</Title>
            <Link rel="canonical" href="https://palmdevs.me" />
            <Meta name="description" content="This page doesn't exist. Did you take a wrong turn?" />
            <HttpStatusCode code={404} />
            <Section id="info">
                <Column gap="none" centerHorizontal class={sharedStyles.TextChildrenCenter}>
                    <h1>Wrong way?</h1>
                    <p style="text-wrap: balance">This page doesn't exist. Did you take a wrong turn?</p>
                    <Row style="padding-block-start: var(--gap-medium)">
                        <LinkButton leadingIcon={IconHome} openInCurrentTab href="/">
                            Go back home
                        </LinkButton>
                        <LinkButton variant="secondary" leadingIcon={IconReport} href={RepositoryLinks.issues}>
                            Report an issue
                        </LinkButton>
                    </Row>
                </Column>
            </Section>
        </Page>
    )
}

export default FourOhFourPage
