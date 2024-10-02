import { register } from 'timeago.js'

const year = new Date().getUTCFullYear()

export const BirthDate = new Date('2008-07-01 00:00:00 UTC+7')
export const Birthday = new Date(`${year}-07-01 00:00:00 UTC+7`)
export const BirthdayEnd = new Date(`${year}-07-02 00:00:00 UTC+7`)
export const BirthdayLocale = 'birthday-locale'

register(
    BirthdayLocale,
    (_: number, index: number, __?: number): [string, string] =>
        (
            [
                ['a few seconds', 'a few seconds'],
                ['%s seconds', '%s seconds'],
                ['1 minute', '1 minute'],
                ['%s minutes', '%s minutes'],
                ['1 hour', '1 hour'],
                ['%s hours', '%s hours'],
            ] as [string, string][]
        )[index],
)
