//import { createMatchEmbed } from "../utils"
import { getDummyEmbed, getDummyMessage } from "./test_helpers";
import { getRedirectUrl, testRegexOnEmbed } from "../embed_listener"
import { EmbedElements } from "../types";
import { getTweetShiftAuthor, replaceSpaceAndLowercase } from "../utils";
import { getRegexPatternFileName } from "../author_switch_logic";
const assert = require('assert')

// describe('Should create valid match embed', () => {
//     it('Should create valid match embed', () => {
//         const matchEmbed = createMatchEmbed("Test", "NO REGEX");
//         assert.equal("Bot message matching a regex", matchEmbed.title);
//         assert.equal("Content", matchEmbed.fields[0].name);
//         assert.equal("Test", matchEmbed.fields[0].value);
//         assert.equal("Regex: NO REGEX", matchEmbed.footer?.text);
//     })
// })

//describe('Should get synchronous regex')

describe('Should properly apply Regex on embed', () => {
    const mockEmbed = getDummyEmbed();
    it('Should match on title', () => {
        assert(EmbedElements.Title, testRegexOnEmbed(mockEmbed, "Test Embed"))
    })

    it('Should fail to match on title', () => {
        assert("NO MATCH", testRegexOnEmbed(mockEmbed, "Test E.mbed"))
    })

    it('Should match on description', () => {
        assert(EmbedElements.Description, testRegexOnEmbed(mockEmbed, ".*ionString"))
    })

    it('Should fail to match on description', () => {
        assert("NO MATCH", testRegexOnEmbed(mockEmbed, "abcdefg"))
    })

    it('Should match on field', () => {
        assert.equal(EmbedElements.Fields, testRegexOnEmbed(mockEmbed, "Fi.ld 2"))
    })

    it('Should match on field', () => {
        assert.equal(EmbedElements.Fields, testRegexOnEmbed(mockEmbed, "buffalo.*buffalo"))
    })

    it('Should fail to match on field', () => {
        assert.equal("NO MATCH", testRegexOnEmbed(mockEmbed, "Fi.ld     2"))
    })

    it('Should fail to match on field', () => {
        assert.equal("NO MATCH", testRegexOnEmbed(mockEmbed, "buffalo.*buffalo\n"))
    })

    it('Should match on original url', () => {
        assert.equal(EmbedElements.Url, testRegexOnEmbed(mockEmbed, "https:\\/\\/t\\.co\\/BBGOEvfc9g\\?amp\\=1"))
    })

    it('Should fail to match on original url', () => {
        assert.equal("NO MATCH", testRegexOnEmbed(mockEmbed, "http\\/t\\.co\\/Bg\\?amp\\=1"))
    })

    it('Should match on footer', () => {
        assert.equal(EmbedElements.Footer, testRegexOnEmbed(mockEmbed, "(F|f)o{2}ter"))
    })

    it('Should fail to match on footer', () => {
        assert.equal("NO MATCH", testRegexOnEmbed(mockEmbed, "(F|f)o{2}terx"))
    })
})

describe('Should getRedirectUrl', () => {
    it('Should get url from short twitter url', async () => {
        assert.equal('http://www.madsci.org/posts/archives/2000-02/950761555.Eg.r.html', await getRedirectUrl('https://t.co/EJ4yZaizM6?amp=1'))
    })

    it('Should return same url when not redirecting', async () => {
        assert.equal('https://www.nba.com', await getRedirectUrl('https://www.nba.com'))
    })
})

describe('Should getTweetShiftAuthor', () => {
    it('Should successfully extract tweetshift userName from message', () => {
        const testMessage = getDummyMessage()
        assert.equal('Jim Cramer', getTweetShiftAuthor(testMessage))
    })

    it('Should return default json string when no match for tweetshift on username', () => {
        const testMessage = getDummyMessage()
        testMessage.author.username = "Dummy"
        assert.equal('default', getTweetShiftAuthor(testMessage))
    })
})

describe('Should replaceSpaceAndLowercase', () => {
    it('Should replaceSpaceAndLowercase', () => {
        assert.equal('ajisbc.\taassfa', replaceSpaceAndLowercase('AJ is BC.\t aassfa '))
    })

    it('Should return same string when no space or uppercase', () => {
        assert.equal('in123.lae', replaceSpaceAndLowercase('in123.lae'))
    })
})

describe('Should only return config files that exist', () => {
    it('Should getRegexPatternFileName for existing file', () => {
        assert.equal('src/regexes/sample-regex.json', getRegexPatternFileName('sample-RegEx'))
    })

    it('Should return false when calling getRegexPatternFileName for file that DNE', () => {
        assert.equal('src/regexes/default.json', getRegexPatternFileName('Unaaaa mon'))
    })
})

// describe('Should iterate reg patterns synchronously', () => {
//     const mockEmbed = getDummyEmbed();
//     it('Should return NO MATCH when no matches found', iterateRegPatternsSynchronous([mockEmbed], 'test/json/test_regex.json', undefined))
// })

// describe('Should properly apply regex on redirect URL', () => {
//     it('Should match on redirect url', async () => {
//         assert.equal(EmbedElements.Url, await iterateRegPatternsAsync([mockEmbed], true, "src/test/json/valid_test_config.json", undefined)) // todo need to initialize a client or pass mock
//     })

//     it('Should fail to match on redirect url', async () => {
//         assert.equal("NO MATCH", await iterateRegPatternsAsync([mockEmbed], true, 'src/test/json/invalid_test_config.json', undefined))  // todo need to initialize a client or pass mock
//     })
// })