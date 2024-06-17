import { Meta, Title } from '@solidjs/meta'
import { type Component, For, createResource, Show } from 'solid-js'

import { Column, Page, Section, LinkCard } from '~/components'
import GlowingBackground from '~/components/effects/GlowingBackground'
import Posts from '~/constants/posts'

import sharedStyles from '~/styles/shared.module.scss'
import styles from './(landing).module.scss'

export default (() => {
    const [posts] = createResource(fetchPosts)

    return (
        <GlowingBackground>
            <Page>
                <Title>Blog • Palm (PalmDevs)</Title>
                <Meta
                    name="description"
                    content="Visit to see all my blog posts, usually containing some interesting and random stuff."
                />
                <Section centerHorizontal constrainSize>
                    <Column gap="none" class={sharedStyles.DirectTextChildrenAlignCenter}>
                        <h1>My Blog</h1>
                        <p>Welcome to my blog! Here contains random and some interesting stuff.</p>
                    </Column>
                    <div class={styles.Grid}>
                        <Show when={posts()?.length} fallback={'No posts here...'}>
                            <For each={posts()}>
                                {([href, info]) => {
                                    return (
                                        <LinkCard
                                            openInCurrentTab
                                            class={styles.PostCard}
                                            name={info.title}
                                            description={info.description}
                                            href={`/blog/${href}/`}
                                            preview={() => (
                                                <div class={styles.PostCardImageContainer}>
                                                    <img
                                                        style={`--comp-ar: ${info.imageAspectRatio}`}
                                                        class={styles.PostCardImage}
                                                        src={info.image}
                                                        alt="Post cover"
                                                    />
                                                </div>
                                            )}
                                        />
                                    )
                                }}
                            </For>
                        </Show>
                    </div>
                </Section>
            </Page>
        </GlowingBackground>
    )
}) satisfies Component

const fetchPosts = () =>
    Promise.all(
        Object.entries(Posts).map(async ([href, post]) => {
            const { default: _, ...postInfo } = await post()
            return [href, postInfo] as const
        }),
    )
