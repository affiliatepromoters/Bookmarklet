import { readFileSync } from 'fs';
import { join } from 'path';

export default function handler(req, res) {
    const { email } = req.query;
    
    // Database of authorized emails (should match api/auth.js)
    const authorizedEmails = [
        'premiumnfz@gmail.com',
    ];

    if (email && authorizedEmails.includes(email.toLowerCase())) {
        try {
            const filePath = join(process.cwd(), 'private', 'engine.js');
            const engineCode = readFileSync(filePath, 'utf8');
            res.setHeader('Content-Type', 'application/javascript');
            return res.status(200).send(engineCode);
        } catch (err) {
            return res.status(500).send('Error loading engine');
        }
    } else {
        return res.status(403).send('Unauthorized access to engine');
    }
}
