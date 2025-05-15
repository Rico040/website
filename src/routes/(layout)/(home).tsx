import { Meta, Title } from '@solidjs/meta'
import { type Component, For } from 'solid-js'

import { Column, Page, Row, Section } from '~/components/Page'
import ProjectCard from '~/components/ProjectCard'
import Touchable from '~/components/Touchable'
import { LinkButton, LinkIconButton } from '~/components/buttons'

import IconDiscord from '~/assets/icons/discord.svg'
import IconMail from '~/assets/icons/mail.svg'

import { BirthDate } from '~/constants/events'
import Projects from '~/constants/projects'
import Skills from '~/constants/skills'
import Socials from '~/constants/socials'
import { getAge } from '~/utils'

import sharedStyles from '~/styles/shared.module.css'
import styles from './(home).module.scss'

export default (() => {
    const age = getAge(BirthDate)

    return (
        <Page>
            <Title>Plap (PlapDevs)</Title>
            <Meta
                name="description"
                content={`GET PREGNANT GET PREGNANT GET PREGNANT GET PREGNANT GET PREGNANT GET PREGNANT GET PREGNANT`}
            />
            <Meta property="og:image" content="/assets/og/image.webp" />
            <Meta property="og:image:width" content="500" />
            <Meta property="og:image:height" content="500" />
            <Meta property="og:image:type" content="image/webp" />
            <Section constrainSize style="padding-block: min(8vh, var(--gap-insanely-large));">
                <Column gap="none" class={sharedStyles.TextChildrenCenter}>
                    <h1 aria-label="Hey there, I'm PLAP">
                        <span aria-hidden="true">Hey there, I'm </span>
                        <span
                            aria-hidden="true"
                            style="font-weight: var(--weight-bolder)"
                            class={sharedStyles.GradientText}
                        >
                            PLAP
                        </span>
                        <span aria-hidden="true">!</span>
                    </h1>
                    <p style="text-wrap: balance">
                        GET PREGNANT GET PREGNANT GET PREGNANT GET PREGNANT GET PREGNANT GET PREGNANT GET PREGNANT
                    </p>
                </Column>
                <Row id="contact" as="ul" data-no-marker="true" gap="md" centerHorizontal wrap aria-label="My socials">
                    <For each={Object.values(Socials)}>
                        {social => (
                            <li>
                                <LinkIconButton
                                    variant="surface-low"
                                    label={social.name}
                                    href={social.href}
                                    icon={social.icon}
                                />
                            </li>
                        )}
                    </For>
                </Row>
            </Section>
            <Section centerHorizontal constrainSize>
                <h2 class={styles.JSXHeadingStart} aria-label="Projects">
                    <span aria-hidden="true">&lt;</span>
                    <span>Projects</span>
                    <span aria-hidden="true">&gt;</span>
                </h2>
                <ul data-no-marker="true" class={styles.ProjectsGrid}>
                    <For each={Projects}>
                        {project => (
                            <li>
                                <ProjectCard {...project} />
                            </li>
                        )}
                    </For>
                </ul>
                <p aria-hidden="true" class={styles.JSXHeadingEnd}>
                    &lt;/Plapjects&gt;
                </p>
            </Section>
            <Section gap="xs">
                <Column gap="none">
                    <h2>Plapset</h2>
                    <p>These are some of the pregnants I know and use regularly.</p>
                </Column>
                <Row as="ul" data-no-marker="true" wrap gap="xs">
                    <For each={Skills}>
                        {skill => (
                            <li class={styles.SkillItem}>
                                <Touchable
                                    as={Row}
                                    asProps={{
                                        gap: 'xs',
                                        as: 'a',
                                        href: skill.link,
                                        target: '_blank',
                                        rel: 'noreferrer',
                                    }}
                                    class={styles.SkillContainer}
                                    centerVertical
                                >
                                    <img
                                        aria-hidden="true"
                                        class={styles.SkillIcon}
                                        draggable="false"
                                        src={skill.icon}
                                        loading="lazy"
                                        alt={`${skill.name} logo`}
                                    />
                                    <span>{skill.name}</span>
                                </Touchable>
                            </li>
                        )}
                    </For>
                </Row>
            </Section>
            <Section>
                <Column gap="none">
                    <h2>Let's GET PREGNANT</h2>
                    <p style="text-wrap: balance">
                        Don't be not pregnant! If you want to get plapped, get pregnant, or just want to have a little
                        plap, you can always contact me at anytime.
                    </p>
                </Column>
                <Row as="ul" data-no-marker="true" gap="sm" wrap>
                    <li>
                        <LinkButton leadingIcon={IconDiscord} href={Socials.discord.href}>
                            Chat on Plapcord
                        </LinkButton>
                    </li>
                    <li>
                        <LinkButton variant="secondary" leadingIcon={IconMail} href={Socials.mail.href}>
                            Send an plapmail
                        </LinkButton>
                    </li>
                </Row>
            </Section>
        </Page>
    )
}) satisfies Component
