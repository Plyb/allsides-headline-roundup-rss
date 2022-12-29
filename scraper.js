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
        const description = roundupDom('.story-id-page-description').text();

        const singleRoundupRssUrl = roundupDom('link[rel="alternate"]').attr('href');
        const singleRoundupRss = (await axios.get(singleRoundupRssUrl)).data; 
        const roundupRssDom = load(singleRoundupRss);
        const pubDate = roundupRssDom('pubDate').first().text();

        return {
            title,
            link: roundupUrl,
            description,
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