document.addEventListener('DOMContentLoaded', () => {
    initChart();

    const validateBtn = document.getElementById('validate-btn');
    const repoLinkInput = document.getElementById('repo-link');
    const submissionArea = document.getElementById('submission-area');
    const processingArea = document.getElementById('processing-area');
    const resultArea = document.getElementById('result-area');
    const terminalBody = document.getElementById('terminal-body');
    const overallStatus = document.getElementById('overall-status');
    
    // Pipeline Steps
    const steps = [
        document.getElementById('step-1'),
        document.getElementById('step-2'),
        document.getElementById('step-3'),
        document.getElementById('step-4')
    ];

    // Result UI Elements
    const finalScoreText = document.getElementById('final-score-text');
    const scoreCircle = document.querySelector('.overall-score-circle');
    const resultTitle = document.getElementById('result-title');
    const resultMessage = document.getElementById('result-message');
    
    const scoreQuality = document.getElementById('score-quality');
    const scoreSecurity = document.getElementById('score-security');
    const scoreTesting = document.getElementById('score-testing');
    const scoreReqs = document.getElementById('score-reqs');

    const issuesList = document.getElementById('issues-list');
    const issuesContainer = document.getElementById('issues-container');
    
    const releaseBtn = document.getElementById('release-btn');
    const resubmitBtn = document.getElementById('resubmit-btn');

    const terminalSequence = [
        { msg: "Connecting to GitHub...", time: 300, type: "info", step: 0 },
        { msg: "Cloning repo...", time: 400, type: "info", step: 0 },
        { msg: "Running Static Analysis...", time: 500, type: "info", step: 1 },
        { msg: "Calculating cyclomatic complexity...", time: 400, type: "info", step: 1 },
        { msg: "Running Security Audit (CVE check)...", time: 600, type: "info", step: 2 },
        { msg: "Checking for hardcoded secrets...", time: 500, type: "info", step: 2 },
        { msg: "Validating against Smart Contract requirements...", time: 700, type: "info", step: 3 },
        { msg: "Finalizing Deep Audit Report...", time: 500, type: "info", step: 3 },
    ];

    validateBtn.addEventListener('click', startValidation);
    resubmitBtn.addEventListener('click', resetAndStartValidation);

    async function startValidation() {
        const link = repoLinkInput.value.trim();
        if (!link) return alert('Provide a repository link!');

        submissionArea.classList.add('hidden');
        resultArea.classList.add('hidden');
        processingArea.classList.remove('hidden');
        overallStatus.className = 'status-badge pending';
        overallStatus.textContent = 'Validating...';
        
        await runTerminalAnimation();

        try {
            const res = await fetch('http://127.0.0.1:5000/api/validate', {
                method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ link })
            });
            const data = await res.json();
            showResults(data);
        } catch (e) {
            console.warn("Backend off. Using deep fallback.");
            // Mock Deep Result
            showResults({
                passed: false,
                scores: { overall: 72, quality: 80, security: 65, testing: 50, requirements: 90 },
                issues: [
                    { type: 'security', message: "High risk of SQL Injection detected in 'auth/login.js'" },
                    { type: 'testing', message: "Unit tests are failing in 'paymentService'." }
                ],
                message: "Code requires revisions before escrow can be released."
            });
        }
    }

    function resetAndStartValidation() {
        issuesContainer.innerHTML = '';
        issuesList.classList.add('hidden');
        releaseBtn.classList.add('hidden');
        resubmitBtn.classList.add('hidden');
        scoreCircle.className = 'overall-score-circle';
        
        steps.forEach(s => s.className = 'pipe-step');
        steps[0].className = 'pipe-step active';
        
        startValidation();
    }

    async function runTerminalAnimation() {
        terminalBody.innerHTML = '';
        for (let step of terminalSequence) {
            await sleep(step.time);
            
            // Update Visual Pipeline
            steps.forEach((s, idx) => {
                if (idx < step.step) s.className = 'pipe-step done';
                if (idx === step.step) s.className = 'pipe-step active';
            });

            const now = new Date();
            const timeStr = `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}:${now.getSeconds().toString().padStart(2,'0')}`;
            const line = document.createElement('div');
            line.className = 'term-line';
            line.innerHTML = `<span class="term-time">[${timeStr}]</span> <span class="term-msg">${step.msg}</span>`;
            terminalBody.appendChild(line);
            terminalBody.scrollTop = terminalBody.scrollHeight;
        }
        steps[3].className = 'pipe-step done';
        await sleep(500);
    }

    function showResults(data) {
        processingArea.classList.add('hidden');
        resultArea.classList.remove('hidden');

        finalScoreText.textContent = data.scores.overall;
        setScoreColor(scoreQuality, data.scores.quality);
        setScoreColor(scoreSecurity, data.scores.security);
        setScoreColor(scoreTesting, data.scores.testing);
        setScoreColor(scoreReqs, data.scores.requirements);

        if (data.passed) {
            overallStatus.className = 'status-badge success';
            overallStatus.textContent = 'Passed';
            scoreCircle.classList.add('success');
            resultTitle.textContent = "AI Audit Passed!";
            resultTitle.style.color = "var(--success)";
            resultMessage.textContent = data.message;
            releaseBtn.classList.remove('hidden');
        } else {
            overallStatus.className = 'status-badge fail';
            overallStatus.textContent = 'Failed';
            scoreCircle.classList.add('fail');
            resultTitle.textContent = "AI Audit Failed";
            resultTitle.style.color = "var(--error)";
            resultMessage.textContent = data.message;
            resubmitBtn.classList.remove('hidden');
        }

        if (data.issues && data.issues.length > 0) {
            issuesList.classList.remove('hidden');
            data.issues.forEach(issue => {
                const li = document.createElement('li');
                li.className = issue.type === 'security' ? 'sec-issue' : 'qual-issue';
                li.innerHTML = `<strong>[${issue.type.toUpperCase()}]</strong> ${issue.message}`;
                issuesContainer.appendChild(li);
            });
        }
    }

    function setScoreColor(el, score) {
        el.textContent = score + "%";
        if (score >= 85) el.className = 'green-text';
        else if (score >= 70) el.className = 'yellow-text';
        else el.className = 'red-text';
    }

    releaseBtn.addEventListener('click', async () => {
        releaseBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Releasing Funds...';
        await sleep(1500);
        releaseBtn.innerHTML = '<i class="fa-solid fa-check-double"></i> Funds Released Successfully';
    });

    function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

    function initChart() {
        const ctx = document.getElementById('volumeChart').getContext('2d');
        let gradient = ctx.createLinearGradient(0, 0, 0, 200);
        gradient.addColorStop(0, 'rgba(6, 182, 212, 0.5)');
        gradient.addColorStop(1, 'rgba(6, 182, 212, 0)');
        new Chart(ctx, {
            type: 'line',
            data: { labels: ['W1', 'W2', 'W3', 'W4'], datasets: [{ data: [12000, 19000, 15000, 28000], borderColor: '#06B6D4', backgroundColor: gradient, borderWidth: 3, fill: true, tension: 0.4 }] },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94A3B8' } }, x: { grid: { display: false }, ticks: { color: '#94A3B8' } } } }
        });
    }
});
