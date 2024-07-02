export const combineClassNames = (...classNames: (string | undefined)[]) => classNames.filter(Boolean).join(' ')
export const undefinedIf = <T, U>(condition: T, value: U) => (condition ? undefined : value)

const createLogMethod =
    (method: 'log' | 'debug' | 'warn' | 'error') =>
    (tag: string, ...args: unknown[]) =>
        console[method](`%c[${tag}]`, 'font-weight: bold; color: aquamarine', ...args)

export const logger = {
    log: createLogMethod('log'),
    debug: createLogMethod('debug'),
    warn: createLogMethod('warn'),
    error: createLogMethod('error'),
}

export const getAge = (birthDate: Date) => {
    const today = new Date(Date.now() + 7 * 60 * 60 * 1000)
    let age = today.getUTCFullYear() - birthDate.getUTCFullYear()
    const monthDiff = today.getUTCMonth() - birthDate.getUTCMonth()

    // Check if the birth date has not occurred yet this year
    if (monthDiff < 0 || (monthDiff === 0 && today.getUTCDate() < birthDate.getUTCDate())) age--
    return age
}
