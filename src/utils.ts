import { Client, Message, MessageEmbed, TextChannel } from "discord.js";
import { logger } from "./logger";

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

export const getTweetShiftAuthor = (msg: Message): string => {
    const username = msg.author.username;
    const indexOfMatch = username.indexOf('TweetShift')
    if (indexOfMatch < 1) return "default"
    return msg.author.username.substring(0, indexOfMatch - 3)
}

export const sendParsedEmbed = (originalEmbed: MessageEmbed, pattern: string, client: Client): void => {
    const channelId = process.env.DISCORDJS_SEND_CHANNEL_ID;
    const embed = createMatchEmbed(originalEmbed); // todo update this embed

    if (channelId) {
        const channel = client.channels.cache.get(channelId);
        (channel as TextChannel)?.send({ embeds: [embed] });
        (channel as TextChannel)?.send({ content: `Matching pattern was: ${pattern}` });
    }
}

export const sendStringMatch = async (content: string, client: Client): Promise<void> => {
    const channelId = process.env.DISCORDJS_SEND_CHANNEL_ID; // enhancement is to support sending in same channel as embed is received in
    if (channelId) {
        const channel = client.channels.cache.get(channelId);
        (channel as TextChannel)?.send({ content: content });
    }
}

export const replaceSpaceAndLowercase = (str: string): string => {
    return str.toLowerCase().replaceAll(/\ /g, '')
}