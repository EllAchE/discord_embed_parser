import { replaceSpaceAndLowercase } from "./utils";
import { existsSync } from "fs"
import { logger } from "./logger";

export const getRegexPatternFileName = (authorName: string): string => {
    const suffix = replaceSpaceAndLowercase(authorName);
    const prefix = 'src/regexes/'
    logger.info(`received authorName of ${authorName} and created suffix of ${suffix}`)
    if (existsSync(`${prefix}${suffix}.json`)) return `${prefix}${suffix}.json`
    else return `${prefix}default.json`
}
