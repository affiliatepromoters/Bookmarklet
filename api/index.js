import { readFileSync } from 'fs';
import { join } from 'path';

export default function handler(req, res) {
    // Add CORS headers to allow requests from Quotex
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle OPTIONS request (CORS preflight)
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const email = (req.method === 'POST' ? req.body.email : req.query.email);
    
    // Database of authorized emails
    const authorizedEmails = [
        'premiumnfz@gmail.com',
    ];

    if (email && authorizedEmails.includes(email.toLowerCase())) {
        try {
            const overlayPath = join(process.cwd(), 'public', 'overlay.js');
            const enginePath = join(process.cwd(), 'private', 'engine.js');
            const scriptPath = join(process.cwd(), 'public', 'Script');
            
            const overlayCode = readFileSync(overlayPath, 'utf8');
            const engineCode = readFileSync(enginePath, 'utf8');
            const gatekeeperCode = readFileSync(scriptPath, 'utf8');

            return res.status(200).json({ 
                authorized: true, 
                message: "User authorized",
                overlayCode: overlayCode,
                engineCode: engineCode,
                gatekeeperCode: gatekeeperCode
            });
        } catch (err) {
            return res.status(500).json({ error: "Failed to load components" });
        }
    } else {
        return res.status(200).json({ 
            authorized: false, 
            message: "User not authorized or expired",
            errorOverlay: `
                (function() {
                    const div = document.createElement('div');
                    div.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.8);z-index:2147483647;display:flex;align-items:center;justify-content:center;color:white;font-family:sans-serif;backdrop-filter:blur(10px);';
                    div.innerHTML = '<div style=\"background:#1e293b;padding:40px;border-radius:20px;border:2px solid #ef4444;text-align:center;box-shadow:0 20px 50px rgba(0,0,0,0.5);\">' +
                        '<h1 style=\"color:#ef4444;margin-bottom:10px;font-size:24px;\">LICENSE EXPIRED</h1>' +
                        '<p style=\"color:#94a3b8;margin-bottom:20px;\">Your account (' + (email || 'Unknown') + ') is not authorized.</p>' +
                        '<button onclick=\"this.parentElement.parentElement.remove()\" style=\"background:#ef4444;color:white;border:none;padding:10px 30px;border-radius:8px;font-weight:bold;cursor:pointer;\">Close</button>' +
                        '</div>';
                    document.body.appendChild(div);
                })();
            `
        });
    }
}
