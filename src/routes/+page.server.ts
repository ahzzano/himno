import Parser from 'rss-parser'

export async function load() {
    const parser = new Parser()
    const feed = await parser.parseURL("https://www.reddit.com/r/balkans_irl/.rss");
    // const feed = await parser.parseURL("https://rss.nytimes.com/services/xml/rss/nyt/Science.xml")

    feed.items = feed.items.map((article) => {
        return {
            author: article.author ? article.author : (article.creator ? article.creator : undefined),
            ...article
        }
    })

    return {
        // user set
        name: "r/balkans_irl",
        description: "",
        title: feed.title,
        items: feed.items,
    }
}
