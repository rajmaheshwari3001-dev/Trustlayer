document.addEventListener('DOMContentLoaded', () => {
    // --- Chart.js Setup ---
    initChart();

    // --- UI Elements ---
    const validateBtn = document.getElementById('validate-btn');
    const repoLinkInput = document.getElementById('repo-link');
    const submissionArea = document.getElementById('submission-area');
    const processingArea = document.getElementById('processing-area');
    const resultArea = document.getElementById('result-area');
    const terminalBody = document.getElementById('terminal-body');
    const loadingBar = document.getElementById('loading-bar');
    const releaseBtn = document.getElementById('release-btn');
    const resultTitle = document.getElementById('result-title');
    const resultMessage = document.getElementById('result-message');
    const resultIconRing = document.getElementById('result-icon-ring');
    const resultIcon = document.getElementById('result-icon');

    // --- Mock Terminal Sequence ---
    const terminalSequence = [
        { msg: "Establishing secure connection to GitHub...", time: 300, type: "info" },
        { msg: "Cloning repository: defi-dashboard", time: 500, type: "info" },
        { msg: "Initializing AI Static Analysis...", time: 600, type: "info" },
        { msg: "Scanning dependencies for CVEs...", time: 700, type: "info" },
        { msg: "Vulnerability scan complete. 0 High Risk.", time: 400, type: "ok" },
        { msg: "Analyzing React component structure...", time: 600, type: "info" },
        { msg: "Warning: Missing prop-types in 'Header.jsx'", time: 300, type: "warn" },
        { msg: "Evaluating against Smart Contract (0x71C...34F9)...", time: 800, type: "info" },
        { msg: "Cross-referencing project requirements...", time: 700, type: "info" },
        { msg: "Calculating final Trust Score...", time: 600, type: "info" },
    ];

    validateBtn.addEventListener('click', async () => {
        const link = repoLinkInput.value.trim();
        if (!link) {
            alert('Please provide a repository link!');
            return;
        }

        // Hide submission, show terminal
        submissionArea.classList.add('hidden');
        processingArea.classList.remove('hidden');
        
        // Run Terminal Animation
        await runTerminalAnimation();

        // Simulate fetching backend / fallback
        try {
            const response = await fetch('http://127.0.0.1:5000/api/validate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ link })
            });
            const data = await response.json();
            showResults(data.passed, data.score);
        } catch (e) {
            console.warn("Backend off. Using fallback.");
            showResults(true, 94); // Mock pass
        }
    });

    async function runTerminalAnimation() {
        terminalBody.innerHTML = '';
        let progress = 0;
        
        for (let step of terminalSequence) {
            await sleep(step.time);
            
            const now = new Date();
            const timeStr = `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}:${now.getSeconds().toString().padStart(2,'0')}`;
            
            let statusClass = '';
            if (step.type === 'ok') statusClass = 'ok';
            if (step.type === 'warn') statusClass = 'warn';

            const line = document.createElement('div');
            line.className = 'term-line';
            line.innerHTML = `
                <span class="term-time">[${timeStr}]</span>
                <span class="term-prefix">system@trustlayer:~$</span>
                <span class="term-msg ${statusClass}">${step.msg}</span>
            `;
            
            terminalBody.appendChild(line);
            terminalBody.scrollTop = terminalBody.scrollHeight; // Auto scroll

            progress += (100 / terminalSequence.length);
            loadingBar.style.width = `${progress}%`;
        }
        await sleep(500); // Final pause
    }

    function showResults(passed, score) {
        processingArea.classList.add('hidden');
        resultArea.classList.remove('hidden');

        if (!passed) {
            resultTitle.textContent = "Validation Failed";
            resultTitle.style.color = "var(--error)";
            resultMessage.textContent = "Code does not meet minimum quality threshold (85%). Escrow locked.";
            resultIconRing.style.borderColor = "var(--error)";
            resultIconRing.style.color = "var(--error)";
            resultIconRing.style.background = "rgba(239, 68, 68, 0.1)";
            resultIconRing.style.boxShadow = "0 0 30px rgba(239,68,68,0.3)";
            resultIcon.className = "fa-solid fa-xmark";
            releaseBtn.classList.add('hidden');
        }
    }

    releaseBtn.addEventListener('click', async () => {
        releaseBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing TX...';
        releaseBtn.disabled = true;

        try {
            await fetch('http://127.0.0.1:5000/api/escrow/release', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contract_id: 'CTX-1234' })
            });
        } catch(e) {}
        
        await sleep(1500); // Mock blockchain delay
        
        releaseBtn.innerHTML = '<i class="fa-solid fa-check-double"></i> 1.2 ETH Sent to Wallet';
        releaseBtn.style.background = '#059669';
        
        // Minor visual confetti or glowing pulse could go here
    });

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function initChart() {
        const ctx = document.getElementById('volumeChart').getContext('2d');
        
        // Gradient for chart line
        let gradient = ctx.createLinearGradient(0, 0, 0, 200);
        gradient.addColorStop(0, 'rgba(6, 182, 212, 0.5)'); // Cyan top
        gradient.addColorStop(1, 'rgba(6, 182, 212, 0)');   // Transparent bottom

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                datasets: [{
                    label: 'Escrow Volume ($)',
                    data: [12000, 19000, 15000, 28000],
                    borderColor: '#06B6D4', // Cyan
                    backgroundColor: gradient,
                    borderWidth: 3,
                    pointBackgroundColor: '#050505',
                    pointBorderColor: '#06B6D4',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    fill: true,
                    tension: 0.4 // Smooth curves
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'rgba(5, 5, 5, 0.9)',
                        titleFont: { family: 'Inter', size: 13 },
                        bodyFont: { family: 'Fira Code', size: 14 },
                        padding: 12,
                        borderColor: 'rgba(255,255,255,0.1)',
                        borderWidth: 1,
                        displayColors: false,
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(255,255,255,0.05)', drawBorder: false },
                        ticks: { color: '#94A3B8', font: { family: 'Inter', size: 11 } }
                    },
                    x: {
                        grid: { display: false, drawBorder: false },
                        ticks: { color: '#94A3B8', font: { family: 'Inter', size: 11 } }
                    }
                }
            }
        });
    }
});
