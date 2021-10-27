import { replaceSpaceAndLowercase } from "./utils";
import { existsSync } from "fs"

export const getRegexPatternFileName = (authorName: string): string => {
    const suffix = replaceSpaceAndLowercase(authorName);
    const prefix = 'src/regexes/'
    if (existsSync(`${prefix}${suffix}.json`)) return `${prefix}${suffix}.json`
    else return `${prefix}default.json`
}
