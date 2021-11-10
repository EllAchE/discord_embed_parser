import { Client, MessageEmbed } from 'discord.js';
import { readJSONSync } from 'fs-extra';
import { logger } from './logger';
import { EmbedElements, RegexConfig } from './types'
import { sendParsedEmbed, sendStringMatch } from './utils';
const followRedirect = require('follow-redirect-url')

export const testRegexOnEmbed = (embed: MessageEmbed, regexPattern: string): string => {
    const regexMatchFunction = (content: string, regexPattern: string): boolean => {
        let reg = new RegExp(regexPattern, 'i');
        return reg.test(content);
    }
    return checkEmbed(embed, regexPattern, regexMatchFunction)
}

export const testSubstringOnEmbed = (embed: MessageEmbed, substring: string): string => {
    const substringMatchFunction = (content: string, pattern: string): boolean => {
        return content.includes(pattern);
    }
    return checkEmbed(embed, substring, substringMatchFunction)
}

export const iterateRegPatternsAsyncString = async (content: string, regexFilePath: string, client: Client): Promise<void> => {
    const regexConfig: RegexConfig = readJSONSync(regexFilePath); // Load saved regexes to apply

    for (let pattern of regexConfig.regex) {
        let reg = new RegExp(pattern, 'i');
        if (reg.test(content)) {
            sendStringMatch(content, client)
        }
    }
    for (let substring of regexConfig.substring) {
        if (content.includes(substring)) {
            sendStringMatch(content, client)
        }
    }
}

export const getRedirectUrl = async (url: string): Promise<string> => { // these tests will fail depending on region, so don't be alarmed
    const r = await followRedirect.startFollowing(url).then(urls => {
        return urls[urls.length - 1].url
    }).catch(err => {
        logger.error(err)
    })
    if (r) return r;
    else return url;
}

export const iterateRegPatternsAsyncEmbeds = async (embeds: MessageEmbed[], shouldCheckRedirectUrl: boolean, regexFilePath: string, client: Client): Promise<string> => {
    if (!shouldCheckRedirectUrl) return "NO MATCH";
    const regexConfig: RegexConfig = readJSONSync(regexFilePath); // Load saved regexes to apply

    for (let embed of embeds) {
        if (embed[EmbedElements.Url]) {
            const redirectUrl: string = await getRedirectUrl(embed[EmbedElements.Url]!.toString())

            for (let pattern of regexConfig.regex) {
                let reg = new RegExp(pattern, 'i');

                if (reg.test(redirectUrl)) { // suppress null warning
                    sendParsedEmbed(embed, pattern, client);
                    return EmbedElements.Url;
                }
            }
            for (let substring of regexConfig.substring) {
                if (redirectUrl.includes(substring)) { // suppress null warning
                    sendParsedEmbed(embed, substring, client);
                    return EmbedElements.Url;
                }
            }
        }
    }
    logger.info("No match on message when checking content asynchronously (shortened URLs).", new Date())
    return "NO MATCH";
}

export const iteratePatternsSynchronousEmbeds = (embeds: MessageEmbed[], regexFilePath: string, client: Client): string => {
    const regexConfig: RegexConfig = readJSONSync(regexFilePath); // Load saved regexes to apply

    let matchPatternString;
    let regResult = "NO MATCH";
    for (let embed of embeds) {
        for (let substring of regexConfig.substring) {
            regResult = testSubstringOnEmbed(embed, substring)
            if (regResult != "NO MATCH") {
                logger.info("Match on message!", new Date())
                matchPatternString = substring;
                break;
            }
        }

        if (regResult == "NO MATCH") {
            for (let pattern of regexConfig.regex) { // enhancement here is to make the regexes contain more detail, i.e. an id, a message to send, special thing to extract etc.
                regResult = testRegexOnEmbed(embed, pattern);

                if (regResult != "NO MATCH") {
                    logger.info("Match on message!", new Date());
                    matchPatternString = pattern;
                    break;
                }
            }

        }

        // if (regResult != "NO MATCH" && regResult == EmbedElements.Fields) {
        //     // let fieldString = "";
        //     // const embedFieldArray: any[] = embed[regResult];

        //     // embedFieldArray.forEach((field) => {
        //     //     fieldString += field.value.toString();  //comment out while not doing any modification to embed that is sent
        //     // })

        //     sendParsedEmbed(embed, matchPatternString, client);
        //     break;
        // }
        if (regResult != "NO MATCH") {
            //const stringMatch = embed[regResult].toString(); // commented  out until further logic needed on parsing embed
            sendParsedEmbed(embed, matchPatternString, client);
            break;
        }
    }
    logger.info("No match on message when checking content synchronously. Will check shortened URLs.", new Date())
    return regResult;
}

// todo performance opp is summing all of the content together before applying searches

export const checkEmbed = (embed: MessageEmbed, pattern: string, matchFunction: (content: string, pattern: string) => boolean) => {
    const nonFieldEmbedElements = [EmbedElements.Title, EmbedElements.Description, EmbedElements.Url]

    for (let field of embed.fields) {
        if (matchFunction(field.name.toString(), pattern) || matchFunction(field.value.toString(), pattern)) {
            return EmbedElements.Fields; // right now this doesn't distinguish WHICH field triggered. Could be desired behavior
        }
    }

    for (let element of nonFieldEmbedElements) {
        if (embed[element]) {
            if (matchFunction(embed[element]!.toString(), pattern)) { // suppress null warning
                return element;
            }
        }
    }

    if (embed[EmbedElements.Footer]?.text) {
        const footer = embed[EmbedElements.Footer]?.text
        if (footer && matchFunction(footer, pattern)) return EmbedElements.Footer
    }

    return "NO MATCH";
}