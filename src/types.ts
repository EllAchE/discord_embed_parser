export enum EmbedElements {
    Title = "title",
    Description = "description",
    Footer = "footer",
    Url = "url",
    Fields = "fields",
}

export interface RegexConfig {
    substring: string[]
    regex: string[]
}
