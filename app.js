document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generate-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const container = document.getElementById('verses-container');
    const loadingEl = document.getElementById('loading');
    const errorEl = document.getElementById('error-message');

    // API Configuration
    const API_BASE = 'https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1';
    
    // Metadata
    const BOOK_METADATA = {
        bukhari: { name: 'Sahih al-Bukhari', sections: 97 },
        muslim: { name: 'Sahih Muslim', sections: 56 },
        abudawud: { name: 'Sunan Abi Dawud', sections: 43 },
        tirmidhi: { name: 'Jami` at-Tirmidhi', sections: 49 },
        nasai: { name: 'Sunan an-Nasai', sections: 51 }
    };

    const BOOKS = Object.keys(BOOK_METADATA);

    // State
    let state = {
        bookId: null,
        sectionId: null,
        hadithIndex: 0,
        mergedData: []
    };

    generateBtn.addEventListener('click', handleGenerate);
    prevBtn.addEventListener('click', () => handleNavigate(-1));
    nextBtn.addEventListener('click', () => handleNavigate(1));

    async function handleGenerate() {
        resetUI();
        loadingEl.classList.remove('hidden');
        generateBtn.disabled = true;

        try {
            const randomBookId = BOOKS[Math.floor(Math.random() * BOOKS.length)];
            state.bookId = randomBookId;

            let validSectionFound = false;
            let attempts = 0;

            while (!validSectionFound && attempts < 3) {
                const maxSections = BOOK_METADATA[state.bookId].sections;
                state.sectionId = Math.floor(Math.random() * maxSections) + 1;

                try {
                    await fetchSectionData(state.bookId, state.sectionId);
                    validSectionFound = true;
                } catch (err) {
                    console.warn(`Section ${state.sectionId} failed, retrying...`);
                    attempts++;
                }
            }

            if (!validSectionFound) throw new Error('Could not find a valid hadith section.');

            state.hadithIndex = Math.floor(Math.random() * state.mergedData.length);

            renderHadith();
            updateButtonUI();

        } catch (error) {
            console.error(error);
            showError('Failed to fetch hadith. Please try again.');
        } finally {
            loadingEl.classList.add('hidden');
            generateBtn.disabled = false;
        }
    }

    async function fetchSectionData(bookId, sectionId) {
        const [engRes, araRes] = await Promise.all([
            fetch(`${API_BASE}/editions/eng-${bookId}/sections/${sectionId}.json`),
            fetch(`${API_BASE}/editions/ara-${bookId}/sections/${sectionId}.json`)
        ]);

        if (!engRes.ok || !araRes.ok) throw new Error('Failed to fetch section');

        const engJson = await engRes.json();
        const araJson = await araRes.json();

        state.mergedData = engJson.hadiths.map(engHadith => {
            const araHadith = araJson.hadiths.find(a => a.hadithnumber === engHadith.hadithnumber);
            return {
                ...engHadith,
                arabicText: araHadith ? araHadith.text : '',
                bookName: BOOK_METADATA[bookId].name,
                sectionName: (engJson.metadata && engJson.metadata.section) 
                             ? engJson.metadata.section[sectionId] 
                             : `Chapter ${sectionId}`
            };
        });
        
        if (state.mergedData.length === 0) throw new Error('Empty section');
    }

    function handleNavigate(direction) {
        const newIndex = state.hadithIndex + direction;

        if (newIndex >= 0 && newIndex < state.mergedData.length) {
            const oldHeight = container.scrollHeight;
            const oldScrollY = window.scrollY;

            state.hadithIndex = newIndex;
            
            const hadith = state.mergedData[state.hadithIndex];
            const card = createHadithCard(hadith, false); // isMain is false, but label removed anyway

            if (direction === -1) {
                container.prepend(card);
                const newHeight = container.scrollHeight;
                window.scrollTo(0, oldScrollY + (newHeight - oldHeight));
            } else {
                container.appendChild(card);
            }

            updateButtonUI();
        }
    }

    function createHadithCard(hadith, isMain) {
        const card = document.createElement('div');
        // We keep the class 'main-verse' for the visual border highlight, 
        // but the text label inside will be generic.
        card.className = `verse-card ${isMain ? 'main-verse' : 'context-verse'}`;
        
        const cleanText = hadith.text.replace(/<[^>]*>/g, '');

        card.innerHTML = `
            <div class="verse-header">
                <span style="font-weight:600; color:var(--text-primary);">
                    ${hadith.bookName}
                </span>
                <span class="badge">#${hadith.hadithnumber}</span>
            </div>
            
            <div class="verse-sub-header">
                ${hadith.sectionName}
            </div>

            <div class="arabic-text">
                ${hadith.arabicText}
            </div>
            <div class="translation-text">
                ${cleanText}
            </div>
            
            <div class="grades-footer">
                ${renderGrades(hadith.grades)}
            </div>
        `;
        return card;
    }

    function renderHadith() {
        container.innerHTML = '';
        const hadith = state.mergedData[state.hadithIndex];
        const card = createHadithCard(hadith, true);
        container.appendChild(card);
    }

    function renderGrades(grades) {
        if (!grades || grades.length === 0) return '';
        return grades.map(g => {
            let color = '#a3a3a3';
            const gradeLower = g.grade.toLowerCase();
            if (gradeLower.includes('sahih')) color = '#10b981'; 
            if (gradeLower.includes('hasan')) color = '#f59e0b'; 
            if (gradeLower.includes('daif')) color = '#ef4444';  

            return `<span style="margin-right:12px; display:inline-block;">
                <strong style="color:${color}">${g.grade}</strong> 
                <span style="opacity:0.7">(${g.name})</span>
            </span>`;
        }).join('');
    }

    function updateButtonUI() {
        prevBtn.classList.remove('hidden');
        nextBtn.classList.remove('hidden');

        prevBtn.disabled = state.hadithIndex <= 0;
        nextBtn.disabled = state.hadithIndex >= state.mergedData.length - 1;

        // Simplified Buttons
        if (prevBtn.disabled) {
            prevBtn.innerHTML = '<span>Start of Chapter</span>';
            prevBtn.style.opacity = '0.5';
        } else {
            prevBtn.innerHTML = '<span class="icon">↑</span> Previous Hadith';
            prevBtn.style.opacity = '1';
        }

        if (nextBtn.disabled) {
            nextBtn.innerHTML = '<span>End of Chapter</span>';
            nextBtn.style.opacity = '0.5';
        } else {
            nextBtn.innerHTML = '<span class="icon">↓</span> Next Hadith';
            nextBtn.style.opacity = '1';
        }
    }

    function resetUI() {
        container.innerHTML = '';
        errorEl.classList.add('hidden');
        prevBtn.classList.add('hidden');
        nextBtn.classList.add('hidden');
    }

    function showError(msg) {
        errorEl.textContent = msg;
        errorEl.classList.remove('hidden');
    }
});