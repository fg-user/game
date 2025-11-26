let writer;
const charInput = document.getElementById('charInput');
const searchBtn = document.getElementById('searchBtn');
const animateBtn = document.getElementById('animateBtn');
const quizBtn = document.getElementById('quizBtn');
const pinyinText = document.getElementById('pinyinText');
const meaningContent = document.getElementById('meaningContent');
const strokeCount = document.getElementById('strokeCount');
const audioBtn = document.getElementById('audioBtn');

// Initialize HanziWriter
function initWriter(char) {
    document.getElementById('character-target-div').innerHTML = '';

    writer = HanziWriter.create('character-target-div', char, {
        width: 300,
        height: 300,
        padding: 5,
        showOutline: true,
        strokeAnimationSpeed: 1,
        delayBetweenStrokes: 200,
        radicalColor: '#e63946',
        strokeColor: '#2b2d42',
    });
}

// Fetch Character Data using cnchar
function fetchCharData(char) {
    // Pinyin
    const pinyin = cnchar.spell(char, 'tone');
    pinyinText.textContent = pinyin;

    // Stroke Count
    const strokes = cnchar.stroke(char);
    strokeCount.textContent = strokes;

    // Meaning & Words (Using cnchar-idiom and poly for basic info, 
    // but for definitions we might need a dictionary. 
    // For now, we'll simulate definitions or use cnchar's limited info if available,
    // or just show idioms/words containing it.)

    // Get words/idioms
    const words = cnchar.idiom(char);

    let html = '';

    // Explanation (Mocking a definition since cnchar doesn't provide full dict definitions)
    // In a real app, we'd hit a dictionary API here.
    // For this demo, we'll show the character and its components/structure if available, or just words.

    // Load AI definitions from ai_definitions.json (assume it's loaded globally as aiDefinitions)

    if (aiDefinitions[char]) {
        const defObj = aiDefinitions[char];
        html += `<p><strong>字义：</strong> ${defObj.definition}</p>`;
        if (defObj.compounds && defObj.compounds.length > 0) {
            // html += `<p><strong>常见词语:</strong> ${defObj.compounds.join('，')}</p>`;
            html += `<p><strong>常见词语:</strong></p>`;
            defObj.compounds.slice(0, 10).forEach(word => {
                    html += `<span class="word-item">${word}</span>`;
                });
        }
        if (defObj.mnemonic) {
            html += `<p><strong>记忆法:</strong></p><span class="word-item"> ${defObj.mnemonic}</span>`;
        }
    } else {
        html += `<p><strong>Character:</strong> ${char}</p>`;
        if (words && words.length > 0) {
            html += `<p><strong>常见成语/词语:</strong></p><div class="words-list">`;
            // Show up to 5 words
            words.slice(0, 10).forEach(word => {
                html += `<span class="word-item">${word}</span>`;
            });
            html += `</div>`;
        } else {
            html += `<p>未在库中找到常见词语</p>`;
        }
    }


    

    // Explanation using cnchar.explain if available (it's not standard in base cnchar, 
    // so we rely on what we have). 
    // We can add a "Radical" info.
    const radical = cnchar.radical(char);
    html += `<p style="margin-top: 1rem;"><strong>部首:</strong> ${radical}</p>`;

    meaningContent.innerHTML = html;
}

function handleSearch() {
    const char = charInput.value.trim();
    if (char && char.length === 1 && /[\u4e00-\u9fa5]/.test(char)) {
        initWriter(char);
        fetchCharData(char);
        writer.animateCharacter();
    } else {
        alert('Please enter a single Chinese character.');
    }
}

// Event Listeners
searchBtn.addEventListener('click', handleSearch);

charInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSearch();
    }
});

animateBtn.addEventListener('click', () => {
    if (writer) {
        writer.animateCharacter();
    }
});

quizBtn.addEventListener('click', () => {
    if (writer) {
        writer.quiz();
    }
});

audioBtn.addEventListener('click', () => {
    const char = charInput.value.trim();
    if (char) {
        // Use SpeechSynthesis API
        const utterance = new SpeechSynthesisUtterance(char);
        utterance.lang = 'zh-CN';
        window.speechSynthesis.speak(utterance);
    }
});

// Initial load
window.addEventListener('load', () => {
    // Load a default character
    charInput.value = '黑';
    handleSearch();
});
