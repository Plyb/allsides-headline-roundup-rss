export function roundupsToRss(roundups) {
    return `<?xml version="1.0" encoding="utf-8" ?>
            <rss version="2.0" xml:base="https://www.rss.kobylewis.net/allsides" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:foaf="http://xmlns.com/foaf/0.1/" xmlns:rdfs="http://www.w3.org/2000/01/rdf-schema#" xmlns:sioc="http://rdfs.org/sioc/ns#" xmlns:sioct="http://rdfs.org/sioc/types#" xmlns:skos="http://www.w3.org/2004/02/skos/core#" xmlns:xsd="http://www.w3.org/2001/XMLSchema#">
                <channel>
                    <title>AllSides Balanced News Feed - Headline Roundups</title>
                    <link>https://www.allsides.com/news/rss</link>
                    <description>AllSides Balanced News Feed - Top news stories from the Left, Center and Right.</description>
                    <language>en</language>
                    ${roundups.map(roundup => roundupToRssItem(roundup)).join('\n')}
                </channel>
            </rss>`
}

function roundupToRssItem(roundup) {
    const desc = `${roundup.blurb}
                 ${roundup.newsTitles.map(newsTitleToLink).join('\n')}`;

    return `<item>
                <title>${htmlEntities(roundup.title)}</title>
                <link>${roundup.link}</link>
                <description>${htmlEntities(desc)}</description>
                <pubDate>${roundup.pubDate}</pubDate>
                <guid isPermaLink="true">${roundup.link}</guid>
            </item>`;
}

function newsTitleToLink(newsTitle) {
    return `<p><strong><a href="${newsTitle.href}">${newsTitle.text}</a></strong> ${newsTitle.source}</p>`;
}

function htmlEntities(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}