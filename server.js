import express from 'express'
const app = express()
import { config } from 'dotenv'
config()

import{automateLoginProcessOfLinkedin, getData, authorize, automateLoginProcessOfAmazone } from './access_google_sheet.js'

app.get('/login/:rowIndex', async (req, res) => {
        const rowIndex = parseInt(req.params.rowIndex, 10);
        if (isNaN(rowIndex)) {
            throw new Error('Invalid rowIndex parameter');
        }
        try {
            const auth = await authorize(); // Authorize Google Sheets API
            const data = await getData(auth); // Get data from Google Sheets
            const { websiteUrl, username, password } = data[rowIndex];
            
            if (websiteUrl.includes('linkedin')) {

                await automateLoginProcessOfLinkedin(process.env.LINKEDIN_URL, username, password);
                res.status(200).send('Login process initiated successfully.');

            } else if(websiteUrl.includes('amazone')){

                await automateLoginProcessOfAmazone(process.env.AMAZONE_URL, username, password);
                res.status(200).send('Login process initiated successfully.');

            }
            else {
                res.status(404).send(`Invalid URL index ${rowIndex}`);
            }
        } catch (error) {
            console.error('Error triggering login:', error);
            res.status(500).send('Internal Server Error');
        }
    });
    
    // Start the server
    const PORT = process.env.PORT;
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });