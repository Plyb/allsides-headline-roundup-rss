import axios from "axios";
import { load } from "cheerio";

const baseUrl = 'https://www.allsides.com';
const startUrl = baseUrl + '/headline-roundups';

export async function getHeadlineRoundups() {
    const htmlString = (await axios.get(startUrl)).data;
    const $ = load(htmlString);
    
    const roundupPromises =  [...$('tbody tr')].map(async row => {
        const titleEl = row.children
            .find(child => child.type === 'tag')
        const { text: title, href: titleHref } = parseTd(titleEl); 
        
        const roundupUrl = baseUrl + titleHref;
        const roundupHtmlString = (await axios.get(roundupUrl)).data;
        const roundupDom = load(roundupHtmlString);

        const blurb = roundupDom('.story-id-page-description').html();
        const sourceAreas = roundupDom('.featured-coverage .news-item a.source-area').map((i, el) => load(el).html());
        const newsTitles = [...roundupDom('a.news-title')].map(parseNewsTitle);
        newsTitles.forEach((newsTitle, i) => newsTitle.source = sourceAreas[i]);

        const singleRoundupRssUrl = roundupDom('link[rel="alternate"]').attr('href');
        const singleRoundupRss = (await axios.get(singleRoundupRssUrl)).data; 
        const roundupRssDom = load(singleRoundupRss);
        const pubDate = roundupRssDom('pubDate').first().text();

        return {
            title,
            link: roundupUrl,
            blurb,
            newsTitles,
            pubDate,
        }
    });

    const roundups = await Promise.all(roundupPromises);
    return roundups;
}

function parseTd(td) {
    return {
        text: td.children[1].children[0].data,
        href: td.children[1].attribs.href,
    }
}

function parseNewsTitle(a) {
    return {
        text: a.children[0].data,
        href: a.attribs.href,
    }
}