const fs = require('fs');
const path = require('path');
const CryptoJS = require('crypto-js');

// Configurable password - CHANGE THIS to whatever password you want!
const PASSWORD = 'stellar'; 

const srcPath = path.join(__dirname, 'src', 'index.html');
const destPath = path.join(__dirname, 'index.html');

if (!fs.existsSync(srcPath)) {
    console.error('Error: Source file src/index.html not found! Please create it first.');
    process.exit(1);
}

// Read the unencrypted source code
const htmlContent = fs.readFileSync(srcPath, 'utf8');

// Encrypt the source code using AES-256
const encrypted = CryptoJS.AES.encrypt(htmlContent, PASSWORD).toString();

// Generate the fully self-contained HTML file with premium decryption UI
const outputHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Protected Access</title>
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap" rel="stylesheet">
    <!-- CryptoJS Library -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.2.0/crypto-js.min.js"></script>
    <style>
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: 'Outfit', sans-serif;
        }
        html {
            height: 100%;
        }
        body {
            height: 100%;
            overflow: hidden;
            background: radial-gradient(circle at center, #fafafa 0%, #f1f5f9 100%);
            display: none; /* Hide body initially to prevent login screen flash during auto-login */
            justify-content: center;
            align-items: center;
            color: #0f172a;
        }
        /* Floating background elements for premium feel */
        .orb {
            position: absolute;
            border-radius: 50%;
            filter: blur(80px);
            z-index: 1;
            opacity: 0.08;
            animation: float 20s infinite alternate;
        }
        .orb-1 {
            width: 400px;
            height: 400px;
            background: #4f46e5;
            top: -100px;
            left: -100px;
        }
        .orb-2 {
            width: 500px;
            height: 500px;
            background: #06b6d4;
            bottom: -150px;
            right: -150px;
            animation-delay: -10s;
        }
        @keyframes float {
            0% { transform: translate(0, 0) scale(1); }
            100% { transform: translate(50px, 50px) scale(1.1); }
        }

        /* Glassmorphic card container */
        .login-card {
            position: relative;
            z-index: 10;
            width: 100%;
            max-width: 400px;
            padding: 2.5rem;
            background: rgba(255, 255, 255, 0.7);
            border: 1px solid rgba(15, 23, 42, 0.06);
            border-radius: 24px;
            backdrop-filter: blur(20px);
            box-shadow: 0 20px 40px rgba(15, 23, 42, 0.05);
            text-align: center;
            animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .logo-icon {
            font-size: 3rem;
            margin-bottom: 1rem;
            background: linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            font-weight: 800;
        }
        h1 {
            font-size: 1.75rem;
            font-weight: 600;
            margin-bottom: 0.5rem;
            letter-spacing: -0.5px;
            color: #0f172a;
        }
        p {
            font-size: 0.95rem;
            color: #475569;
            margin-bottom: 2rem;
            font-weight: 300;
        }

        /* Modern styled form elements */
        .input-group {
            position: relative;
            margin-bottom: 1.5rem;
        }
        input[type="password"] {
            width: 100%;
            padding: 1rem 1.25rem;
            background: rgba(15, 23, 42, 0.03);
            border: 1px solid rgba(15, 23, 42, 0.08);
            border-radius: 12px;
            color: #0f172a;
            font-size: 1rem;
            transition: all 0.3s ease;
            outline: none;
            text-align: center;
            letter-spacing: 4px;
        }
        input[type="password"]::placeholder {
            letter-spacing: normal;
            color: #94a3b8;
        }
        input[type="password"]:focus {
            background: rgba(255, 255, 255, 0.8);
            border-color: #3b82f6;
            box-shadow: 0 0 15px rgba(59, 130, 246, 0.15);
        }

        button {
            width: 100%;
            padding: 1rem;
            background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
            border: none;
            border-radius: 12px;
            color: #ffffff;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 20px rgba(15, 23, 42, 0.15);
        }
        button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 24px rgba(15, 23, 42, 0.25);
        }
        button:active {
            transform: translateY(1px);
        }

        /* Dynamic feedback states */
        .error-msg {
            color: #ef4444;
            font-size: 0.9rem;
            margin-top: 1rem;
            display: none;
            font-weight: 400;
        }
        .shake {
            animation: shake 0.4s ease-in-out;
        }
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            20%, 60% { transform: translateX(-10px); }
            40%, 80% { transform: translateX(10px); }
        }
    </style>
</head>
<body>
    <div class="orb orb-1"></div>
    <div class="orb orb-2"></div>

    <div class="login-card" id="card">
        <div class="logo-icon">STELLAR</div>
        <h1>Enter Password</h1>
        <p>This space is encrypted. Enter credentials to decrypt.</p>
        
        <form id="login-form" onsubmit="decryptPage(event)">
            <div class="input-group">
                <input type="password" id="password" placeholder="••••••••" required autofocus autocomplete="current-password">
            </div>
            <button type="submit">Unlock Workspace</button>
        </form>
        <div class="error-msg" id="error">Invalid password. Please try again.</div>
    </div>

    <script>
        const encryptedData = "${encrypted}";
        const SESSION_DURATION = 8 * 60 * 60 * 1000; // 8 hours in milliseconds

        // Auto-decrypt if session is still valid
        window.addEventListener('DOMContentLoaded', () => {
            const savedPassword = localStorage.getItem('stellar_session_key');
            const expiryTime = localStorage.getItem('stellar_session_expiry');

            if (savedPassword && expiryTime && Date.now() < Number(expiryTime)) {
                try {
                    const bytes = CryptoJS.AES.decrypt(encryptedData, savedPassword);
                    const decryptedHtml = bytes.toString(CryptoJS.enc.Utf8);

                    if (decryptedHtml.trim() !== '' && (decryptedHtml.startsWith('<!DOCTYPE') || decryptedHtml.startsWith('<html'))) {
                        // Success: Overwrite document immediately without showing login UI
                        document.open();
                        document.write(decryptedHtml);
                        document.close();
                        return;
                    }
                } catch (e) {
                    // Fail silently and clear broken storage
                    localStorage.removeItem('stellar_session_key');
                    localStorage.removeItem('stellar_session_expiry');
                }
            }
            // Show lock screen if no auto-login occurred
            document.body.style.display = 'flex';
        });

        function decryptPage(event) {
            event.preventDefault();
            const passwordInput = document.getElementById('password');
            const password = passwordInput.value;
            const errorDiv = document.getElementById('error');
            const cardDiv = document.getElementById('card');

            try {
                // Attempt to decrypt the AES payload
                const bytes = CryptoJS.AES.decrypt(encryptedData, password);
                const decryptedHtml = bytes.toString(CryptoJS.enc.Utf8);

                if (decryptedHtml.trim() === '' || !decryptedHtml.startsWith('<!DOCTYPE') && !decryptedHtml.startsWith('<html')) {
                    throw new Error('Incorrect decryption output');
                }

                // Decryption successful: Save session for 8 hours
                localStorage.setItem('stellar_session_key', password);
                localStorage.setItem('stellar_session_expiry', (Date.now() + SESSION_DURATION).toString());

                // Overwrite the document completely
                document.open();
                document.write(decryptedHtml);
                document.close();

            } catch (e) {
                // Decryption failed: Trigger error shake animation
                errorDiv.style.display = 'block';
                cardDiv.classList.add('shake');
                passwordInput.value = '';
                passwordInput.focus();

                setTimeout(() => {
                    cardDiv.classList.remove('shake');
                }, 500);
            }
        }
    </script>
</body>
</html>`;

fs.writeFileSync(destPath, outputHtml, 'utf8');
console.log('Success! Encrypted build written to root index.html.');
