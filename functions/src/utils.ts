import { Client, Message, MessageEmbed, TextChannel } from "discord.js";
import { logger } from "./logger";
import * as functions from "firebase-functions";


export const createMatchEmbed = (embed: MessageEmbed): MessageEmbed => {
    // todo add logic to copy specific fields, create a custom embed
    // For now just resending the same embed in a different channel

    // let embed: MessageEmbed = new MessageEmbed();

    // if (!message) {
    //     message = "Failed to parse content from embed matching regex"
    // }

    // embed.setTitle("Bot message matching a regex")
    // embed.setColor('DARK_ORANGE');
    // embed.addField(`Content`, message.toString(), true);
    // embed.setFooter(`Regex: ${pattern.toString()}`, 'https://i.imgur.com/AfFp7pu.png') // enhance the message that is sent

    logger.info(`sending embed in new channel`, embed)
    return embed;
}

export const getAuthorFromContentLink = (msg: Message): string => {
    // "https://twitter.com/zer0estv/status/1460276083065077760",
    const twitterUsernameExtractionRegex = /(?<=https:\/\/twitter\.com\/)[^\/]*(?=\/)/gi
    const twitterUsernameRegResult: RegExpExecArray | null = twitterUsernameExtractionRegex.exec(msg.content)
    const username: string = twitterUsernameRegResult ? twitterUsernameRegResult[0] : "nomatch"
    logger.info(`extracted username of ${username} from message`)
    return username
}

export const getTweetShiftAuthor = (msg: Message): string => {
    const discordUsername = msg.author.username;
    const indexOfMatch = discordUsername.indexOf('TweetShift')
    logger.info(`extracted username of ${discordUsername} from message`)
    if (indexOfMatch < 1) return "default"
    return msg.author.username.substring(0, indexOfMatch - 3)
}

export const sendParsedEmbed = (originalEmbed: MessageEmbed, pattern: string, client: Client): void => {
    const channelId = functions.config().discord.send_channel_id; // env vars need to be set in firebase
    const embed = createMatchEmbed(originalEmbed); // todo update this embed

    if (channelId) {
        logger.info(`attempting to send embed in channel with id ${channelId}`)
        const channel = client.channels.cache.get(channelId);
        (channel as TextChannel)?.send({ embeds: [embed] });
        (channel as TextChannel)?.send({ content: `Matching pattern was: ${pattern}` });
    }
}

export const sendStringMatch = async (content: string, client: Client, pattern: string): Promise<void> => {
    const channelId = functions.config().discord_send_channel.id; // enhancement is to support sending in same channel as embed is received in
    if (channelId) {
        logger.info(`attempting to send embed in channel with id ${channelId}`)
        const channel = client.channels.cache.get(channelId);
        (channel as TextChannel)?.send({ content: content });
        (channel as TextChannel)?.send({ content: `Matching pattern was: ${pattern}` });
    }
}

export const replaceSpaceAndLowercase = (str: string): string => {
    return str.toLowerCase().replaceAll(/\ /g, '')
}

export function testRegexOnStringCaseInsensitive(content: string, regexPattern: string) {
    let reg = new RegExp(regexPattern, 'i');
    return reg.test(content);
}
