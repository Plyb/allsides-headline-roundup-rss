import express from "express";
import { roundupsToRss } from "./rss_formatter.js";
import { getHeadlineRoundups } from "./scraper.js";

export const app = express();

app.get('/allsides', async (req, res) => {
    try {
        const roundups = await getHeadlineRoundups();
        const rss = roundupsToRss(roundups);
        res.set('Content-Type', 'application/rss+xml');
        res.send(rss);
    } catch (e) {
        console.error(e);
    }
});
