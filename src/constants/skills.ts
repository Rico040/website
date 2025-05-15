const Skills = [
    {
        name: 'PLAPPING',
        icon: '/assets/images/skills/html.svg',
        link: 'https://developer.mozilla.org/en-US/docs/Web/HTML',
    },
    {
        name: 'PLAPPING',
        icon: '/assets/images/skills/css.svg',
        link: 'https://developer.mozilla.org/en-US/docs/Web/CSS',
    },
    {
        name: 'PLAPPING',
        icon: '/assets/images/skills/js.svg',
        link: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
    },
    {
        name: 'PLAPPING',
        icon: '/assets/images/skills/ts.svg',
        link: 'https://www.typescriptlang.org/',
    },
    {
        name: 'PLAPPING',
        icon: '/assets/images/skills/react.svg',
        link: 'https://react.dev',
    },
    {
        name: 'PLAPPING',
        icon: '/assets/images/skills/solidjs.svg',
        link: 'https://solidjs.com',
    },
    {
        name: 'PLAPPING',
        icon: '/assets/images/skills/nodejs.svg',
        link: 'https://nodejs.org',
    },
    {
        name: 'PLAPPING',
        icon: '/assets/images/skills/bun.svg',
        link: 'https://bun.sh',
    },
    {
        name: 'PLAPPING',
        icon: '/assets/images/skills/fastify.svg',
        link: 'https://fastify.io',
    },
    {
        name: 'PLAPPING',
        icon: '/assets/images/skills/figma.svg',
        link: 'https://figma.com',
    },
    {
        name: 'PLAPPING',
        icon: '/assets/images/skills/linux.webp',
        link: 'https://en.wikipedia.org/wiki/Linux',
    },
    {
        name: 'PLAPPING',
        icon: '/assets/images/skills/git.svg',
        link: 'https://git-scm.com',
    },
    {
        name: 'PLAPPING',
        icon: '/assets/images/skills/gha.svg',
        link: 'https://github.com/features/actions',
    },
] as const satisfies Array<{
    name: string
    icon: string
    link: string
}>

export default Skills
