import { execSync, spawnSync } from 'child_process'
import { defineConfig } from '@solidjs/start/config'
import mdx from '@vinxi/plugin-mdx'
import rehypePrettyCode from 'rehype-pretty-code'
import remarkGfm from 'remark-gfm'
import remarkSlug from 'remark-slug'
import svgPlugin from 'vite-plugin-solid-svg'

const defineString = (str?: string) => `"${str || 'unknown'}"`

const integrityCheckItems = ['public', 'src', './app.config.ts', './bun.lockb']
const integrityCheck = spawnSync('git', ['diff', '--name-only', 'HEAD', ...integrityCheckItems], {
    timeout: 5000,
})

const integrityDirtyItems = integrityCheck.stdout.toString().trim().split('\n').filter(Boolean)

export default defineConfig({
    ssr: true,
    server: {
        esbuild: {
            options: {
                target: 'es2022',
            },
        },
        preset: process.env.NITRO_PRESET ?? 'bun',
        prerender: {
            crawlLinks: true,
            failOnError: true,
        },
    },
    extensions: ['mdx'],
    vite: {
        build: {
            target: 'es2022',
        },
        css: {
            preprocessorOptions: {
                scss: {
                    api: 'modern-compiler',
                },
            },
        },
        plugins: [
            mdx.default.withImports({})({
                jsx: true,
                jsxImportSource: 'solid-js',
                providerImportSource: 'solid-mdx',
                remarkPlugins: [remarkGfm, remarkSlug],
                rehypePlugins: [
                    [
                        rehypePrettyCode,
                        {
                            theme: {
                                dark: 'github-dark-dimmed',
                                light: 'github-light',
                            },
                        },
                    ],
                ],
            }),
            svgPlugin({ defaultAsComponent: true }),
        ],
        define: {
            __APP_COMMIT: defineString(process.env.COMMIT_REF ?? execSync('git rev-parse HEAD').toString().trim()),
            __APP_DEPLOY_CONTEXT: defineString(process.env.CONTEXT ?? process.env.NODE_ENV),
            __APP_BRANCH: defineString(
                process.env.BRANCH ?? execSync('git rev-parse --abbrev-ref HEAD').toString().trim(),
            ),
            __APP_INTEGRITY: defineString(
                integrityDirtyItems.length ? 'dirty' : integrityCheck.status !== null ? 'clean' : 'unknown',
            ),
            __APP_INTEGRITY_DIRTY_FILES: `[${integrityDirtyItems.map(defineString).join(',')}]`,
        },
    },
})
