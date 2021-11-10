import { Message, MessageEmbed } from "discord.js";

export const getDummyEmbed = (): MessageEmbed => {
    const dummyEmbed = new MessageEmbed();

    dummyEmbed.setTitle("Test Embed");
    dummyEmbed.setDescription("DescriptionString")
    dummyEmbed.addField("Twitter: EllAchE", "Buffalo buffalo buffalo buffalo");
    dummyEmbed.addField("Field 2", "This is serious");
    dummyEmbed.setAuthor("EllAchE");
    dummyEmbed.setURL("https://t.co/BBGOEvfc9g?amp=1"); // corresponding url https://thehill.com/policy/energy-environment/575576-greenpeace-calling-for-end-to-carbon-offsets-amid-climate-emergency
    dummyEmbed.setFooter("Footer");

    return dummyEmbed;
}


export const getDummyMessage = (): Message => {
    // @ts-ignore
    return {
        // @ts-ignore
        "content": "some string values in content",
        // @ts-ignore
        "author": {
            "username": "Jim Cramer • TweetShift"
        }
    }
}