document.addEventListener('DOMContentLoaded', () => {
    const validateBtn = document.getElementById('validate-btn');
    const repoLinkInput = document.getElementById('repo-link');
    
    const submissionArea = document.getElementById('submission-area');
    const processingArea = document.getElementById('processing-area');
    const resultArea = document.getElementById('result-area');
    
    const scorePath = document.getElementById('score-path');
    const scoreText = document.getElementById('score-text');
    const resultTitle = document.getElementById('result-title');
    const resultMessage = document.getElementById('result-message');
    const releaseAction = document.getElementById('release-action');
    const releaseBtn = document.getElementById('release-btn');
    const chart = document.querySelector('.circular-chart');

    // Simulate API connection (we will just mock the delay locally if backend is off, or call backend)
    // For demo purposes, we will try to fetch from local python backend, fallback to pure frontend mock if it fails.
    
    validateBtn.addEventListener('click', async () => {
        const link = repoLinkInput.value.trim();
        if (!link) {
            alert('Please provide a repository link or file upload first!');
            return;
        }

        // 1. Show Processing UI
        submissionArea.classList.add('hidden');
        processingArea.classList.remove('hidden');

        try {
            // Attempt to hit the python backend
            const response = await fetch('http://127.0.0.1:5000/api/validate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ link })
            });
            
            const data = await response.json();
            showResults(data);
            
        } catch (error) {
            console.warn("Backend not running, falling back to frontend mock");
            
            // Mock delay
            setTimeout(() => {
                const score = Math.floor(Math.random() * (100 - 65 + 1)) + 65;
                const passed = score >= 85;
                
                showResults({
                    score: score,
                    passed: passed,
                    message: passed ? 'Work meets all quality standards.' : 'Work is missing critical requirements. Needs revision.'
                });
            }, 3000);
        }
    });

    function showResults(data) {
        // 2. Hide Processing, Show Result UI
        processingArea.classList.add('hidden');
        resultArea.classList.remove('hidden');

        // Update score UI
        scoreText.textContent = `${data.score}%`;
        scorePath.setAttribute('stroke-dasharray', `${data.score}, 100`);
        
        if (data.passed) {
            chart.classList.add('green');
            chart.classList.remove('red');
            resultTitle.textContent = 'Validation Passed!';
            resultTitle.style.color = 'var(--success)';
            resultMessage.textContent = data.message;
            releaseAction.classList.remove('hidden');
        } else {
            chart.classList.add('red');
            chart.classList.remove('green');
            resultTitle.textContent = 'Validation Failed';
            resultTitle.style.color = 'var(--error)';
            resultMessage.textContent = data.message;
            releaseAction.classList.add('hidden');
        }
    }

    releaseBtn.addEventListener('click', async () => {
        const originalText = releaseBtn.innerHTML;
        releaseBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Releasing...';
        releaseBtn.disabled = true;

        try {
            // Attempt backend
            await fetch('http://127.0.0.1:5000/api/escrow/release', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contract_id: 'CTX-1234' })
            });
        } catch (e) {
            // Mock delay
            await new Promise(resolve => setTimeout(resolve, 1500));
        }

        releaseBtn.innerHTML = '<i class="fa-solid fa-check"></i> Funds Released Securely';
        releaseBtn.style.background = '#059669'; // darker green
    });
});
