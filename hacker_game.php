<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TERMINAL_ACCESS_V2.0 // OPERATION_BLACKOUT</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');

        :root {
            --primary: #0f0;
            --bg: #000;
            --error: #f00;
            --warn: #ff0;
            --system: #0ff;
            --dim: #004400;
        }

        body {
            background-color: var(--bg);
            color: var(--primary);
            font-family: 'VT323', monospace;
            margin: 0;
            padding: 0;
            height: 100vh;
            overflow: hidden;
            text-shadow: 0 0 4px var(--primary);
            font-size: 18px;
        }

        #crt-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
            background-size: 100% 2px, 3px 100%;
            pointer-events: none;
            z-index: 999;
            animation: flicker 0.15s infinite;
        }

        @keyframes flicker {
            0% {
                opacity: 0.97;
            }

            50% {
                opacity: 1;
            }

            100% {
                opacity: 0.98;
            }
        }

        #terminal {
            padding: 20px;
            height: 100%;
            box-sizing: border-box;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
        }

        #output {
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            padding-bottom: 10px;
        }

        .line {
            margin-bottom: 4px;
            white-space: pre-wrap;
            line-height: 1.2;
        }

        .input-area {
            display: flex;
            align-items: center;
            background: #001100;
            padding: 5px;
            border-top: 1px solid var(--dim);
        }

        .prompt {
            color: var(--primary);
            margin-right: 10px;
            font-weight: bold;
        }

        input {
            background: transparent;
            border: none;
            color: var(--primary);
            font-family: 'VT323', monospace;
            font-size: 1.2rem;
            outline: none;
            flex-grow: 1;
            caret-color: var(--primary);
            text-transform: lowercase;
        }

        /* Classes for text types */
        .sys {
            color: var(--system);
        }

        .err {
            color: var(--error);
            text-shadow: 0 0 5px var(--error);
        }

        .warn {
            color: var(--warn);
        }

        .success {
            color: var(--primary);
            font-weight: bold;
        }

        .info {
            color: #88ff88;
        }

        .dim {
            color: #448844;
        }

        /* Animations */
        @keyframes shake {
            0% {
                transform: translate(1px, 1px) rotate(0deg);
            }

            10% {
                transform: translate(-1px, -2px) rotate(-1deg);
            }

            20% {
                transform: translate(-3px, 0px) rotate(1deg);
            }

            30% {
                transform: translate(3px, 2px) rotate(0deg);
            }

            40% {
                transform: translate(1px, -1px) rotate(1deg);
            }

            50% {
                transform: translate(-1px, 2px) rotate(-1deg);
            }

            60% {
                transform: translate(-3px, 1px) rotate(0deg);
            }

            70% {
                transform: translate(3px, 1px) rotate(-1deg);
            }

            80% {
                transform: translate(-1px, -1px) rotate(1deg);
            }

            90% {
                transform: translate(1px, 2px) rotate(0deg);
            }

            100% {
                transform: translate(1px, -2px) rotate(-1deg);
            }
        }

        .shake {
            animation: shake 0.5s;
            animation-iteration-count: infinite;
        }

        .red-alert {
            background-color: #220000;
        }

        .red-alert body {
            color: #f00;
            text-shadow: 0 0 4px #f00;
        }
    </style>
</head>

<body>
    <div id="crt-overlay"></div>
    <div id="terminal" onclick="document.getElementById('cmd').focus()">
        <div id="output"></div>
        <div class="input-area">
            <span class="prompt" id="prompt-text">unknown@gateway:~$</span>
            <input type="text" id="cmd" autocomplete="off" autofocus>
        </div>
    </div>

    <script>
        // --- GAME ENGINE ---
        const output = document.getElementById('output');
        const input = document.getElementById('cmd');
        const promptText = document.getElementById('prompt-text');
        const body = document.body;

        const sleep = (ms) => new Promise(r => setTimeout(r, ms));

        async function print(text, type = '') {
            const div = document.createElement('div');
            div.className = 'line ' + type;
            output.appendChild(div);

            // Typewriter effect
            let content = text;
            div.textContent = '';
            const speed = 10;

            for (let i = 0; i < content.length; i++) {
                div.textContent += content.charAt(i);
                // Auto scroll
                window.scrollTo(0, document.body.scrollHeight);
                if (i % 3 === 0) await sleep(speed);
            }
        }

        function clear() {
            output.innerHTML = '';
        }

        // --- GAME STATE & FILESYSTEM ---
        const state = {
            level: 1,
            currentDir: 'root',
            inventory: [],
            traceLevel: 0,
            downloadProgress: 0,
            traceActive: false,
            gameOver: false,
            user: 'guest'
        };

        const fileSystem = {
            'root': {
                files: {
                    'welcome.msg': { type: 'txt', content: "WELCOME TO OMNI-CORP PUBLIC GATEWAY.\nUnauthorized access is a felony.\n\nSystem Admin: J. Doe\nLast Reset: Company Founding Year (1999)" },
                    'login.exe': { type: 'exe', action: 'login' }
                }
            },
            'intranet': {
                files: {
                    'staff.txt': { type: 'txt', content: "STAFF LIST:\n- CEO: A. Smith\n- Sec. Chief: B. Wayne\n- R&D Lead: C. Kent" },
                    'trash_bin': { type: 'dir', target: 'trash' },
                    'security_node': { type: 'dir', target: 'security', locked: true }
                }
            },
            'trash': {
                files: {
                    'deleted_img.log': { type: 'txt', content: "Metadata: 'sticky_note.jpg'\nOCR Scan: ...code fragment: 7-4-1..." },
                    '..': { type: 'dir', target: 'intranet' }
                }
            },
            'security': {
                files: {
                    '..': { type: 'dir', target: 'intranet' },
                    'firewall_daemon': { type: 'exe', action: 'firewall_puzzle' },
                    'chimera_project': { type: 'dir', target: 'rnd', locked: true }
                }
            },
            'rnd': {
                files: {
                    '..': { type: 'dir', target: 'security' },
                    'chimera.enc': { type: 'file', content: "ENCRYPTED DATA. RUN DECRYPTION." },
                    'decryptor.exe': { type: 'exe', action: 'decrypt' }
                }
            }
        };

        // --- COMMAND HANDLER ---
        input.addEventListener('keydown', async function (e) {
            if (e.key === 'Enter' && !state.gameOver) {
                const rawCmd = input.value.trim();
                input.value = '';

                // Echo
                const echo = document.createElement('div');
                echo.className = 'line dim';
                echo.textContent = `${promptText.textContent} ${rawCmd}`;
                output.appendChild(echo);

                if (rawCmd) await parseCommand(rawCmd.toLowerCase());
            }
        });

        async function parseCommand(cmdStr) {
            const parts = cmdStr.split(' ');
            const cmd = parts[0];
            const arg = parts[1];

            // Global Commands
            if (cmd === 'clear') { clear(); return; }
            if (cmd === 'help') {
                await print("COMMANDS: ls, cat [file], cd [dir], run [exe], inventory, help", "info");
                if (state.traceActive) await print("EMERGENCY: reroute [city]", "warn");
                return;
            }
            if (cmd === 'inventory') {
                await print("INVENTORY: " + (state.inventory.length ? state.inventory.join(', ') : "Empty"), "info");
                return;
            }

            // Trace Mechanic
            if (state.traceActive && cmd === 'reroute') {
                if (arg) {
                    state.traceLevel = Math.max(0, state.traceLevel - 15);
                    await print(`SIGNAL REROUTED THROUGH ${arg.toUpperCase()}. TRACE REDUCED.`, "success");
                } else {
                    await print("Usage: reroute [city_name]", "err");
                }
                return;
            }

            // File System Commands
            const currentFolder = fileSystem[state.currentDir];

            if (cmd === 'ls') {
                for (const [name, file] of Object.entries(currentFolder.files)) {
                    let type = file.type === 'dir' ? '[DIR]' : (file.type === 'exe' ? '[EXE]' : '[FILE]');
                    await print(`${type.padEnd(8)} ${name}`, file.type === 'dir' ? 'sys' : 'primary');
                }
                return;
            }

            if (cmd === 'cat') {
                if (!arg) { await print("Usage: cat [filename]", "err"); return; }
                const file = currentFolder.files[arg];
                if (file && file.type === 'txt') {
                    await print(file.content);
                } else if (file && file.type === 'file') {
                    await print(file.content, "warn");
                } else {
                    await print("File not found or unreadable.", "err");
                }
                return;
            }

            if (cmd === 'cd') {
                if (!arg) { await print("Usage: cd [directory]", "err"); return; }
                const file = currentFolder.files[arg];
                if (file && file.type === 'dir') {
                    if (file.locked) {
                        await print("ACCESS DENIED. SECURITY LOCK ACTIVE.", "err");
                    } else {
                        state.currentDir = file.target;
                        promptText.textContent = `${state.user}@omni:${state.currentDir}~$`;
                        await print(`Changed directory to /${state.currentDir}`, "sys");
                    }
                } else {
                    await print("Directory not found.", "err");
                }
                return;
            }

            if (cmd === 'run') {
                if (!arg) { await print("Usage: run [executable]", "err"); return; }
                const file = currentFolder.files[arg];
                if (file && file.type === 'exe') {
                    await executeAction(file.action);
                } else {
                    await print("Executable not found.", "err");
                }
                return;
            }

            await print("Command not recognized.", "err");
        }

        // --- GAME ACTIONS ---
        async function executeAction(action) {
            if (action === 'login') {
                await print("OMNI-CORP SECURE LOGIN", "sys");
                await print("Enter Password (4 digits):", "info");

                // Temporary input hijack
                input.onkeydown = null; // Remove main listener
                input.addEventListener('keydown', async function loginHandler(e) {
                    if (e.key === 'Enter') {
                        const pass = input.value.trim();
                        input.value = '';
                        // 1999 from welcome.msg
                        if (pass === '1999') {
                            await print("ACCESS GRANTED.", "success");
                            state.user = 'admin';
                            state.currentDir = 'intranet';
                            promptText.textContent = `admin@omni:intranet~$`;
                            state.level = 2;
                        } else {
                            await print("ACCESS DENIED.", "err");
                        }
                        // Restore main listener
                        input.removeEventListener('keydown', loginHandler);
                        input.addEventListener('keydown', arguments.callee.caller); // Re-bind main is tricky, reloading page is easier but let's just re-add the main one logic
                        // Actually, better to just use a mode flag in the main listener, but for this simple script:
                        location.reload(); // Fail state reset for simplicity or re-bind
                    }
                }, { once: true });

                // Note: The above hijack is messy. Let's use a prompt mode instead.
                // REFACTORING for stability:
                return;
            }

            // ... Wait, the hijack above is buggy. Let's use a simpler approach:
            // We will ask the user to type the password as a command argument for simplicity in this version,
            // OR we just use `run login.exe 1999`.
        }

        // Redefining executeAction to be robust
        async function executeAction(action) {
            if (action === 'login') {
                await print("Password required. Usage: run login.exe [password]", "warn");
                // Check if user typed `run login.exe 1999`? 
                // The parser splits by space. arg is just the filename. 
                // Let's cheat and say "Type the password now:"

                const pass = prompt("ENTER PASSWORD:"); // Browser prompt for "hacking" feel? No, breaks immersion.
                // Let's just say:
                if (pass === '1999') {
                    await print("AUTHENTICATING...", "sys");
                    await sleep(1000);
                    await print("ACCESS GRANTED. WELCOME ADMIN.", "success");
                    state.currentDir = 'intranet';
                    state.user = 'hacker';
                    promptText.textContent = `hacker@omni:intranet~$`;
                } else {
                    await print("AUTHENTICATION FAILED.", "err");
                }
                return;
            }

            if (action === 'firewall_puzzle') {
                await print("FIREWALL DAEMON V4.2", "sys");
                await print("To unlock SECURITY NODE, solve the sequence:", "info");
                await print("2, 4, 8, 16, [?]", "warn");
                const ans = prompt("ENTER NEXT NUMBER:");
                if (ans === '32') {
                    await print("SEQUENCE VERIFIED. UNLOCKING NODE...", "success");
                    fileSystem['intranet'].files['security_node'].locked = false;
                    state.currentDir = 'security';
                    promptText.textContent = `hacker@omni:security~$`;
                } else {
                    await print("INCORRECT. ALARM LEVEL RISING.", "err");
                }
                return;
            }

            if (action === 'decrypt') {
                await print("INITIATING DECRYPTION...", "sys");
                await sleep(1000);
                await print("ERROR: KEY FRAGMENT MISSING.", "err");
                await print("Please enter the 3-digit override code found in trash logs:", "info");
                const code = prompt("OVERRIDE CODE:");
                if (code === '741') {
                    await print("KEY ACCEPTED.", "success");
                    await startEndgame();
                } else {
                    await print("INVALID CODE.", "err");
                }
                return;
            }
        }

        async function startEndgame() {
            state.traceActive = true;
            body.classList.add('red-alert');
            body.classList.add('shake');
            await print("!!! SECURITY ALERT !!!", "err");
            await print("UNAUTHORIZED DECRYPTION DETECTED.", "err");
            await print("DOWNLOADING DATA... TRACE INITIATED.", "warn");
            await print("TIP: Type 'reroute [city]' to delay the trace!", "info");

            const timer = setInterval(async () => {
                if (state.gameOver) { clearInterval(timer); return; }

                state.downloadProgress += 5;
                state.traceLevel += 8; // Trace is faster than download!

                // Visual update
                promptText.textContent = `DL:${state.downloadProgress}% | TRACE:${state.traceLevel}% ~$`;

                if (state.downloadProgress >= 100) {
                    clearInterval(timer);
                    victory();
                } else if (state.traceLevel >= 100) {
                    clearInterval(timer);
                    defeat();
                }
            }, 1000);
        }

        async function victory() {
            state.gameOver = true;
            body.classList.remove('shake');
            body.classList.remove('red-alert');
            clear();
            await print("DOWNLOAD COMPLETE.", "success");
            await print("CONNECTION SEVERED.", "sys");
            await print("--------------------------------", "dim");
            await print("MISSION SUCCESSFUL.", "success");
            await print("The blueprints have been secured. Good work.", "info");
        }

        async function defeat() {
            state.gameOver = true;
            clear();
            await print("TRACE COMPLETE.", "err");
            await print("LOCATION IDENTIFIED.", "err");
            await print("CONNECTION TERMINATED BY HOST.", "err");
            await print("THEY ARE COMING FOR YOU.", "err");
        }

        // --- INIT ---
        async function boot() {
            await print("INITIALIZING...", "dim");
            await sleep(500);
            await print("CONNECTING TO GATEWAY...", "dim");
            await sleep(500);
            await print("CONNECTED.", "success");
            await print("Type 'help' for commands.", "info");
        }

        boot();

    </script>
</body>

</html>