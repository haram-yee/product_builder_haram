const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
const randomSelectBtn = document.getElementById('random-select');

// Function to set the theme
const setTheme = (isDark) => {
    if (isDark) {
        body.classList.add('dark-mode');
        themeToggle.textContent = '라이트 모드 전환';
        localStorage.setItem('theme', 'dark');
    } else {
        body.classList.remove('dark-mode');
        themeToggle.textContent = '다크 모드 전환';
        localStorage.setItem('theme', 'light');
    }
};

// Event listener for the toggle button
themeToggle.addEventListener('click', () => {
    const isDarkMode = body.classList.contains('dark-mode');
    setTheme(!isDarkMode);
});

randomSelectBtn.addEventListener('click', randomSelect);

// Immediately check for saved theme preference on script load
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    setTheme(savedTheme === 'dark');
} else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    setTheme(true);
}

function randomSelect() {
    const userNumberInputs = document.querySelectorAll('#user-numbers input');
    const randomNumbers = new Set();
    while (randomNumbers.size < 6) {
        const randomNum = Math.floor(Math.random() * 45) + 1;
        randomNumbers.add(randomNum);
    }

    const randomNumbersArray = Array.from(randomNumbers);
    userNumberInputs.forEach((input, index) => {
        input.value = randomNumbersArray[index];
    });
}

function draw() {
    // 1. Get user numbers
    const userNumberInputs = document.querySelectorAll('#user-numbers input');
    const userNumbers = new Set();
    for (const input of userNumberInputs) {
        const num = parseInt(input.value);
        if (isNaN(num) || num < 1 || num > 45) {
            alert('1부터 45까지의 숫자를 6개 모두 입력해주세요.');
            return;
        }
        userNumbers.add(num);
    }

    if (userNumbers.size !== 6) {
        alert('중복되지 않는 숫자 6개를 입력해주세요.');
        return;
    }

    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '<h2>추첨 결과</h2>';

    // 2. Generate 5 games
    for (let i = 0; i < 5; i++) {
        const winningNumbers = new Set();
        while (winningNumbers.size < 6) {
            const randomNum = Math.floor(Math.random() * 45) + 1;
            winningNumbers.add(randomNum);
        }

        const winningNumbersArray = Array.from(winningNumbers).sort((a, b) => a - b);

        // 3. Compare and count matches
        const matchedNumbers = new Set([...userNumbers].filter(num => winningNumbers.has(num)));
        const matchCount = matchedNumbers.size;

        // 4. Display results
        const gameResultDiv = document.createElement('div');
        gameResultDiv.classList.add('game-result');

        let resultHTML = `<div class="game-header"><strong>${i + 1}번째 게임</strong> (일치: ${matchCount}개)</div>`;
        resultHTML += '<div class="numbers-container">';

        resultHTML += '<div class="result-numbers-set"><span>내 번호:</span>';
        Array.from(userNumbers).sort((a, b) => a - b).forEach(num => {
            const isMatched = winningNumbers.has(num);
            resultHTML += `<span class="number ${isMatched ? 'matched' : ''}">${num}</span>`;
        });
        resultHTML += '</div>';

        resultHTML += '<div class="result-numbers-set"><span>추첨 번호:</span>';
        winningNumbersArray.forEach(num => {
            const isMatched = userNumbers.has(num);
            resultHTML += `<span class="number ${isMatched ? 'matched' : ''}">${num}</span>`;
        });
        resultHTML += '</div>';

        resultHTML += '</div>';

        gameResultDiv.innerHTML = resultHTML;
        resultsDiv.appendChild(gameResultDiv);
    }
}
