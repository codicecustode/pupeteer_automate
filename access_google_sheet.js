import { google } from 'googleapis';
import fs from 'fs';
import puppeteer from 'puppeteer';
import express from 'express'
const app = express()

// Define the scope
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];

// Authorize a client with credentials
const authorize = async () => {
    
    const auth = new google.auth.JWT(process.env.CLIENT_EMAIL, null, process.env.PRIVATE_KEY, SCOPES);
    return auth;
};
// Fetch data from Google Sheets
const getData = async (auth) => {
    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.SPREADSHEET_ID; // Replace with your spreadsheet ID
    const range = 'Sheet1'; // Replace with your sheet name

    const res = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range,
    });
    
    const rows = res.data.values;
    if (rows.length) {
        const headers = rows[0];
        const data = rows.slice(1).map(row => {
            return headers.reduce((acc, header, index) => {
                acc[header] = row[index];
                return acc;
            }, {});
        });
        
        return data;
    } else {
        console.log('No data found.');
        return [];
    }
};

// Automate login process
const automateLoginProcessOfLinkedin = async (url, username, password) => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    try {
        await page.goto(url, { waitUntil: 'networkidle2' });

        await page.waitForSelector('#username', { timeout: 10000 });
        await page.type('#username', username);

        await page.waitForSelector('#password', { timeout: 10000 });
        await page.type('#password', password);

        await page.waitForSelector('button[type="submit"]', { timeout: 10000 });
        await page.click('button[type="submit"]');

        // Wait for a while to observe the result
        await new Promise((resolve)=>setTimeout(()=> resolve() ,10000));
    } catch (error) {
        console.error('Error during automation process:', error);
    } finally {
        await browser.close();
    }
};

const automateLoginProcessOfAmazone = async (url, username, password) => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    try {
        await page.goto(url, { waitUntil: 'networkidle2' });

        await page.waitForSelector('#ap_email', { timeout: 10000 });
        await page.type('#ap_email', username);

        await page.waitForSelector('#continue', { timeout: 10000});
        await page.click('#continue');

        await page.waitForSelector('#ap_password', { timeout: 10000 });
        await page.type('#ap_password', password);

        await page.waitForSelector('#signInSubmit', { timeout: 10000 });
        await page.click('#signInSubmit');
        // Wait for a while to observe the result
        await new Promise((resolve)=>setTimeout(()=> resolve() ,10000));
    } catch (error) {
        console.error('Error during automation process:', error);
    } finally {
        await browser.close();
    }
};


export{
    automateLoginProcessOfLinkedin,
    getData,
    authorize,
    automateLoginProcessOfAmazone
}
