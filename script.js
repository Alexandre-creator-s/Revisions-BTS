document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    //  1. MODE SOMBRE (Dark Mode)
    // ==========================================
    const themeToggle = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('bts-theme');

    // Appliquer le thème sauvegardé
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggle.textContent = '☀️';
    }

    themeToggle.addEventListener('click', () => {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        if (isDark) {
            document.documentElement.removeAttribute('data-theme');
            themeToggle.textContent = '🌙';
            localStorage.setItem('bts-theme', 'light');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            themeToggle.textContent = '☀️';
            localStorage.setItem('bts-theme', 'dark');
        }
        // Petit effet de rotation
        themeToggle.style.transform = 'scale(1.2) rotate(360deg)';
        setTimeout(() => {
            themeToggle.style.transform = '';
        }, 400);
    });


    // ==========================================
    //  3. CHECK-LIST JOUR J
    // ==========================================
    const checklistItems = document.querySelectorAll('.checklist-item');
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    const resetBtn = document.getElementById('checklist-reset');
    const totalItems = checklistItems.length;

    // Charger l'état sauvegardé
    const savedChecklist = JSON.parse(localStorage.getItem('bts-checklist') || '{}');

    function updateProgress() {
        const checkedCount = document.querySelectorAll('.checklist-item.checked').length;
        const percent = (checkedCount / totalItems) * 100;
        progressFill.style.width = percent + '%';
        progressText.textContent = `${checkedCount} / ${totalItems}`;

        // Couleur spéciale quand tout est coché
        if (checkedCount === totalItems) {
            progressText.textContent = `✅ ${checkedCount} / ${totalItems} — Prêt(e) !`;
        }
    }

    checklistItems.forEach(item => {
        const key = item.getAttribute('data-item');

        // Restaurer l'état
        if (savedChecklist[key]) {
            item.classList.add('checked');
            item.querySelector('.checklist-checkbox').textContent = '✓';
        }

        item.addEventListener('click', () => {
            item.classList.toggle('checked');
            const isChecked = item.classList.contains('checked');
            item.querySelector('.checklist-checkbox').textContent = isChecked ? '✓' : '';

            // Sauvegarder
            savedChecklist[key] = isChecked;
            localStorage.setItem('bts-checklist', JSON.stringify(savedChecklist));

            updateProgress();
        });
    });

    // Reset checklist
    resetBtn.addEventListener('click', () => {
        checklistItems.forEach(item => {
            item.classList.remove('checked');
            item.querySelector('.checklist-checkbox').textContent = '';
            savedChecklist[item.getAttribute('data-item')] = false;
        });
        localStorage.setItem('bts-checklist', JSON.stringify(savedChecklist));
        updateProgress();
    });

    // Init
    updateProgress();

    // ==========================================
    //  4. SIMULATEUR DE NOTES
    // ==========================================
    const noteInputs = document.querySelectorAll('.note-input-wrapper input');
    const resultNote = document.getElementById('result-note');
    const resultBarFill = document.getElementById('result-bar-fill');
    const resultVerdict = document.getElementById('result-verdict');
    const simulateurReset = document.getElementById('simulateur-reset');

    // Charger les notes sauvegardées
    const savedNotes = JSON.parse(localStorage.getItem('bts-notes') || '{}');
    noteInputs.forEach(input => {
        const key = input.id;
        if (savedNotes[key] !== undefined && savedNotes[key] !== '') {
            input.value = savedNotes[key];
        }
    });

    function calculateAverage() {
        let totalPoints = 0;
        let totalCoeffs = 0;
        let filledCount = 0;

        noteInputs.forEach(input => {
            const val = parseFloat(input.value);
            const coeff = parseInt(input.getAttribute('data-coeff'));

            if (!isNaN(val) && val >= 0 && val <= 20) {
                totalPoints += val * coeff;
                totalCoeffs += coeff;
                filledCount++;
            }
        });

        if (filledCount === 0) {
            resultNote.textContent = '— / 20';
            resultBarFill.style.width = '0%';
            resultBarFill.style.background = 'var(--gradient-hero)';
            resultVerdict.textContent = '';
            return;
        }

        const moyenne = totalPoints / totalCoeffs;
        const moyenneStr = moyenne.toFixed(2);
        resultNote.textContent = `${moyenneStr} / 20`;

        // Barre de progression (sur 20)
        const percent = (moyenne / 20) * 100;
        resultBarFill.style.width = Math.min(percent, 100) + '%';

        // Couleur de la barre et verdict
        if (moyenne < 10) {
            resultBarFill.style.background = 'linear-gradient(90deg, #EF4444, #F87171)';
            resultNote.style.color = '#EF4444';
            resultVerdict.textContent = `😬 ${moyenneStr}/20 — Il faut bosser ! Concentre-toi sur les matières à gros coefficient.`;
            resultVerdict.style.color = '#EF4444';
            resultVerdict.style.background = 'rgba(239, 68, 68, 0.1)';
        } else if (moyenne < 12) {
            resultBarFill.style.background = 'linear-gradient(90deg, #F59E0B, #FBBF24)';
            resultNote.style.color = '#D97706';
            resultVerdict.textContent = `😊 ${moyenneStr}/20 — Admis(e) ! Continue de réviser pour décrocher une mention.`;
            resultVerdict.style.color = '#D97706';
            resultVerdict.style.background = 'rgba(245, 158, 11, 0.1)';
        } else if (moyenne < 14) {
            resultBarFill.style.background = 'linear-gradient(90deg, #FBBF24, #34D399)';
            resultNote.style.color = '#059669';
            resultVerdict.textContent = `🎉 ${moyenneStr}/20 — Mention Assez Bien ! Beau travail, pousse encore un peu.`;
            resultVerdict.style.color = '#059669';
            resultVerdict.style.background = 'rgba(16, 185, 129, 0.1)';
        } else if (moyenne < 16) {
            resultBarFill.style.background = 'linear-gradient(90deg, #10B981, #059669)';
            resultNote.style.color = '#059669';
            resultVerdict.textContent = `🏆 ${moyenneStr}/20 — Mention Bien ! Tu gères, continue comme ça !`;
            resultVerdict.style.color = '#059669';
            resultVerdict.style.background = 'rgba(5, 150, 105, 0.1)';
        } else {
            resultBarFill.style.background = 'linear-gradient(90deg, #059669, #047857)';
            resultNote.style.color = '#047857';
            resultVerdict.textContent = `🌟 ${moyenneStr}/20 — Mention Très Bien ! Tu es une machine, bravo !`;
            resultVerdict.style.color = '#047857';
            resultVerdict.style.background = 'rgba(4, 120, 87, 0.1)';
        }

        // Sauvegarder les notes
        const notesToSave = {};
        noteInputs.forEach(input => {
            notesToSave[input.id] = input.value;
        });
        localStorage.setItem('bts-notes', JSON.stringify(notesToSave));
    }

    // Écouter les changements de notes
    noteInputs.forEach(input => {
        input.addEventListener('input', calculateAverage);
    });

    // Reset
    simulateurReset.addEventListener('click', () => {
        noteInputs.forEach(input => {
            input.value = '';
        });
        localStorage.removeItem('bts-notes');
        calculateAverage();
    });

    // Init
    calculateAverage();

    // ==========================================
    //  5. ASSISTANT IA (GEMINI)
    // ==========================================
    const apiKeyInput = document.getElementById('gemini-api-key');
    const saveApiKeyBtn = document.getElementById('save-api-key');
    const apiSetup = document.getElementById('ia-api-setup');
    const iaMessages = document.getElementById('ia-messages');
    const iaQuestion = document.getElementById('ia-question');
    const iaSendBtn = document.getElementById('ia-send');

    // Clé API sauvegardée
    let geminiApiKey = localStorage.getItem('bts-gemini-key') || '';

    if (geminiApiKey) {
        apiSetup.classList.add('key-saved');
        apiSetup.querySelector('.ia-key-info strong').textContent = '🔑 Clé API enregistrée ✓';
        apiSetup.querySelector('.ia-key-info p').textContent = 'Clique ici pour la modifier';
        apiSetup.style.cursor = 'pointer';
        apiSetup.addEventListener('click', () => {
            apiSetup.classList.remove('key-saved');
            apiSetup.querySelector('.ia-key-info strong').textContent = 'Clé API Gemini requise';
            apiSetup.querySelector('.ia-key-info p').innerHTML = 'Obtiens ta clé gratuite sur <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener">Google AI Studio</a>';
            apiKeyInput.value = geminiApiKey;
            apiSetup.style.cursor = '';
        });
    }

    saveApiKeyBtn.addEventListener('click', () => {
        const key = apiKeyInput.value.trim();
        if (key.length < 10) {
            alert('Clé API invalide. Vérifie ta clé sur aistudio.google.com');
            return;
        }
        geminiApiKey = key;
        localStorage.setItem('bts-gemini-key', key);
        apiSetup.classList.add('key-saved');
        apiSetup.querySelector('.ia-key-info strong').textContent = '🔑 Clé API enregistrée ✓';
        apiSetup.querySelector('.ia-key-info p').textContent = 'Clique ici pour la modifier';
    });

    function addMessage(content, isUser = false) {
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('ia-message', isUser ? 'ia-user' : 'ia-bot');

        const avatar = document.createElement('div');
        avatar.classList.add('ia-avatar');
        avatar.textContent = isUser ? '🧑‍🎓' : '🤖';

        const bubble = document.createElement('div');
        bubble.classList.add('ia-bubble');

        // Simple markdown-like formatting
        const formattedContent = content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br>');
        bubble.innerHTML = `<p>${formattedContent}</p>`;

        msgDiv.appendChild(avatar);
        msgDiv.appendChild(bubble);
        iaMessages.appendChild(msgDiv);

        // Auto-scroll
        iaMessages.scrollTop = iaMessages.scrollHeight;
    }

    function addTypingIndicator() {
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('ia-message', 'ia-bot');
        msgDiv.id = 'typing-indicator';

        const avatar = document.createElement('div');
        avatar.classList.add('ia-avatar');
        avatar.textContent = '🤖';

        const bubble = document.createElement('div');
        bubble.classList.add('ia-bubble');
        bubble.innerHTML = '<div class="ia-typing"><span></span><span></span><span></span></div>';

        msgDiv.appendChild(avatar);
        msgDiv.appendChild(bubble);
        iaMessages.appendChild(msgDiv);
        iaMessages.scrollTop = iaMessages.scrollHeight;
    }

    function removeTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) indicator.remove();
    }

    async function askGemini(question) {
        if (!geminiApiKey) {
            addMessage("⚠️ Tu n'as pas encore entré ta clé API Gemini. Remplis le champ ci-dessus pour commencer !");
            return;
        }

        // Afficher la question de l'utilisateur
        addMessage(question, true);

        // Indicateur de frappe
        addTypingIndicator();
        iaSendBtn.disabled = true;

        const systemPrompt = `Tu es un assistant de révisions pour un étudiant en BTS SIO SLAM (Services Informatiques aux Organisations - Solutions Logicielles et Applications Métiers). 

Tes matières principales sont :
- E1 : Culture générale et expression
- E2-A : Expression et communication en langue anglaise
- E4 : Culture économique, juridique et managériale pour l'informatique (CEJM)
- E7 : Cybersécurité des services informatiques

Règles :
- Réponds de manière claire et structurée, comme un prof qui explique à un élève
- Utilise des bullet points et des exemples concrets
- Sois concis mais complet
- Si la question est hors-sujet par rapport au BTS, réponds quand même mais précise que c'est hors programme
- Utilise le tutoiement
- Mets les termes importants en **gras**`;

        try {
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        system_instruction: {
                            parts: [{ text: systemPrompt }]
                        },
                        contents: [{
                            parts: [{ text: question }]
                        }],
                        generationConfig: {
                            temperature: 0.7,
                            maxOutputTokens: 1024,
                        }
                    })
                }
            );

            removeTypingIndicator();

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                const errMsg = errData?.error?.message || `Erreur HTTP ${response.status}`;
                addMessage(`❌ **Erreur API** : ${errMsg}\n\nVérifie ta clé API ou réessaie plus tard.`);
                iaSendBtn.disabled = false;
                return;
            }

            const data = await response.json();
            const answer = data?.candidates?.[0]?.content?.parts?.[0]?.text;

            if (answer) {
                addMessage(answer);
            } else {
                addMessage("🤔 Je n'ai pas pu générer de réponse. Reformule ta question ou réessaie.");
            }
        } catch (error) {
            removeTypingIndicator();
            addMessage(`❌ **Erreur réseau** : ${error.message}\n\nVérifie ta connexion internet.`);
        }

        iaSendBtn.disabled = false;
    }

    // Envoyer une question
    function sendQuestion() {
        const question = iaQuestion.value.trim();
        if (!question) return;
        iaQuestion.value = '';
        askGemini(question);
    }

    iaSendBtn.addEventListener('click', sendQuestion);
    iaQuestion.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendQuestion();
        }
    });

    // ==========================================
    //  6. GESTION DYNAMIQUE DES FICHES (CRUD)
    // ==========================================
    
    // Données par défaut pour restaurer les fiches initiales
    const initialFiches = [
        { id: 'f1', subject: 'e1', badge: 'Culture générale', epreuve: 'E1 — Culture générale et expression', title: 'Synthèse de documents', description: 'Méthode de la synthèse : confrontation des documents, plan thématique, reformulation objective...', content: '<h3>Méthode de la synthèse</h3><p>La synthèse de documents est une épreuve phare du BTS. Elle consiste à confronter plusieurs documents (textes, images, graphiques) autour d\'un thème commun.</p><h4>Les étapes clés :</h4><ul><li><strong>Lecture attentive</strong> et prise de notes</li><li>Tableau de confrontation</li><li>Plan thématique (2 ou 3 parties)</li><li>Rédaction sans avis personnel</li></ul>' },
        { id: 'f2', subject: 'e1', badge: 'Culture générale', epreuve: 'E1 — Culture générale et expression', title: 'Écriture personnelle', description: 'Rédiger une argumentation structurée : thèse, antithèse, synthèse avec exemples culturels...', content: '<h3>L\'écriture personnelle</h3><p>L\'écriture personnelle répond à une question posée en lien avec le thème de l\'année. Tu dois argumenter en t\'appuyant sur tes connaissances et les documents vus en cours.</p><h4>Structure :</h4><ul><li>Introduction (Amorce, Sujet, Problématique, Plan)</li><li>Développement en 2 parties argumentées</li><li>Conclusion (Bilan et ouverture)</li></ul>' },
        { id: 'f3', subject: 'e7', badge: 'Cybersécurité', epreuve: 'E7 — Cybersécurité des services informatiques', title: 'Injections SQL', description: 'Principe de l\'injection, requêtes paramétrées, échappement des entrées, exemples d\'attaques.', content: '<h3>Injections SQL</h3><p>L\'injection SQL est une faille permettant à un attaquant d\'interagir directement avec la base de données via les champs de saisie d\'une application.</p><h4>Protection :</h4><pre><code>// Exemple de requête préparée en PHP\n$stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");\n$stmt->execute([$email]);</code></pre><ul><li>Utiliser des <strong>requêtes préparées</strong></li><li>Échapper les caractères spéciaux</li><li>Limiter les privilèges SQL</li></ul>' },
        { id: 'f4', subject: 'e4', badge: 'CEJM', epreuve: 'E4 — CEJM pour l\'informatique', title: 'RGPD', description: 'Protection des données, principes fondamentaux, droits des utilisateurs et obligations des entreprises.', content: '<h3>Le RGPD</h3><p>Le Règlement Général sur la Protection des Données encadre le traitement des données personnelles dans l\'UE.</p><h4>Principes de base :</h4><ul><li>Transparence et consentement</li><li>Minimisation des données</li><li>Droit à l\'oubli et portabilité</li><li>Sécurité par défaut (Privacy by Design)</li></ul>' },
        { id: 'f5', subject: 'e7', badge: 'Cybersécurité', epreuve: 'E7 — Cybersécurité des services informatiques', title: 'OWASP Top 10', description: 'Les 10 vulnérabilités web les plus critiques selon l\'OWASP.', content: '<h3>OWASP Top 10 (2021)</h3><p>L\'OWASP publie régulièrement un classement des failles les plus exploitées sur le Web.</p><ol><li><strong>Broken Access Control</strong> (Échec du contrôle d\'accès)</li><li><strong>Cryptographic Failures</strong> (Défaillances cryptographiques)</li><li><strong>Injection</strong> (Injections SQL, XSS...)</li><li>Insecure Design</li><li>Security Misconfiguration</li></ol>' },
        { id: 'f6', subject: 'e4', badge: 'CEJM', epreuve: 'E4 — CEJM pour l\'informatique', title: 'Management Agile', description: 'Méthodes Scrum & Kanban, sprints, rôles (PO, Scrum Master) et rituels.', content: '<h3>L\'Agilité</h3><p>Les méthodes agiles privilégient l\'adaptation et la collaboration par rapport à la planification rigide.</p><h4>Scrum :</h4><ul><li><strong>Product Owner</strong> : porte la vision du produit</li><li><strong>Scrum Master</strong> : garant de la méthode</li><li><strong>Équipe de dev</strong> : réalise les sprints</li></ul>' }
    ];

    const fichesContainer = document.getElementById('fiches-container');
    const addFicheBtn = document.getElementById('add-fiche-btn');
    const searchInput = document.getElementById('search-input');
    const clearSearchBtn = document.getElementById('clear-search');
    const toastContainer = document.getElementById('toast-container');
    
    // Modals
    const ficheModal = document.getElementById('fiche-modal');
    const formModal = document.getElementById('form-modal');
    
    // Form Elements
    const ficheForm = document.getElementById('fiche-form');
    const formTitle = document.getElementById('form-title');
    const formSubject = document.getElementById('form-subject');
    const formBadge = document.getElementById('form-badge');
    const formEpreuve = document.getElementById('form-epreuve-full');
    const formDesc = document.getElementById('form-description');
    const formContent = document.getElementById('form-content');
    const formId = document.getElementById('form-fiche-id');
    const formModalTitle = document.getElementById('form-modal-title');
    
    // Read Modal Elements
    const modalTitle = document.getElementById('modal-title');
    const modalCourseContent = document.getElementById('modal-course-content');
    const modalBadge = document.getElementById('modal-badge');
    const modalEpreuve = document.getElementById('modal-epreuve');
    const modalNotes = document.getElementById('modal-notes');
    const modalEditBtn = document.getElementById('modal-edit-btn');
    const modalDeleteBtn = document.getElementById('modal-delete-btn');
    const modalSaveStatus = document.getElementById('modal-save-status');
    const modalCharCount = document.getElementById('modal-char-count');

    let fiches = JSON.parse(localStorage.getItem('bts-fiches')) || initialFiches;
    let currentFicheId = '';

    // Notifications Toast
    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <span class="toast-icon">${type === 'success' ? '✅' : type === 'danger' ? '❌' : 'ℹ️'}</span>
            <span class="toast-message">${message}</span>
        `;
        toastContainer.appendChild(toast);
        
        setTimeout(() => toast.classList.add('visible'), 10);
        setTimeout(() => {
            toast.classList.remove('visible');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // Sauvegarder dans localStorage
    function saveToStorage() {
        localStorage.setItem('bts-fiches', JSON.stringify(fiches));
    }

    // Générer une clé unique pour les notes
    function noteKey(ficheId) {
        return 'bts-note-' + ficheId;
    }

    // Rendu des fiches
    function renderFiches() {
        const currentFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        fichesContainer.innerHTML = '';

        const filteredFiches = fiches.filter(fiche => {
            const matchesFilter = currentFilter === 'all' || fiche.subject === currentFilter;
            const matchesSearch = fiche.title.toLowerCase().includes(searchTerm) || 
                                 fiche.description.toLowerCase().includes(searchTerm) ||
                                 fiche.content.toLowerCase().includes(searchTerm);
            return matchesFilter && matchesSearch;
        });

        if (filteredFiches.length === 0) {
            fichesContainer.innerHTML = `
                <div class="empty-state">
                    <span class="empty-icon">🔎</span>
                    <p>Aucune fiche ne correspond à votre recherche.</p>
                </div>
            `;
            return;
        }

        filteredFiches.forEach((fiche, index) => {
            const card = document.createElement('article');
            card.className = 'fiche-card';
            card.style.animationDelay = `${index * 0.05}s`;
            card.setAttribute('data-subject', fiche.subject);
            card.setAttribute('data-id', fiche.id);

            const hasNotes = localStorage.getItem(noteKey(fiche.id));

            card.innerHTML = `
                <span class="epreuve-code">${fiche.epreuve}</span>
                <h2>${fiche.title}</h2>
                <span class="badge badge-${fiche.subject}">${fiche.badge}</span>
                <p>${fiche.description}</p>
                ${hasNotes ? '<div class="notes-indicator">📝 Notes perso ajoutées</div>' : ''}
                <div class="card-footer">
                    <a href="#" class="read-more" data-id="${fiche.id}">Lire la fiche</a>
                </div>
            `;

            fichesContainer.appendChild(card);
        });

        // Réattacher les événements
        document.querySelectorAll('.read-more').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                openReadModal(btn.getAttribute('data-id'));
            });
        });
    }

    // Recherche en temps réel
    searchInput.addEventListener('input', () => {
        clearSearchBtn.style.display = searchInput.value ? 'block' : 'none';
        renderFiches();
    });

    clearSearchBtn.addEventListener('click', () => {
        searchInput.value = '';
        clearSearchBtn.style.display = 'none';
        renderFiches();
        searchInput.focus();
    });

    // Ouvrir le modal de lecture
    function openReadModal(id) {
        const fiche = fiches.find(f => f.id === id);
        if (!fiche) return;

        currentFicheId = id;
        modalTitle.textContent = fiche.title;
        modalBadge.textContent = fiche.badge;
        modalBadge.className = `modal-badge badge-${fiche.subject}`;
        modalEpreuve.textContent = fiche.epreuve;
        
        // Rendu du contenu (simple HTML)
        modalCourseContent.innerHTML = fiche.content;

        // Charger les notes
        const savedNotes = localStorage.getItem(noteKey(id)) || '';
        modalNotes.value = savedNotes;
        modalCharCount.textContent = `${savedNotes.length} caractère${savedNotes.length !== 1 ? 's' : ''}`;
        modalSaveStatus.classList.remove('visible');

        ficheModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Ouvrir le formulaire (Ajout ou Modif)
    function openFormModal(id = null) {
        if (id) {
            const fiche = fiches.find(f => f.id === id);
            formModalTitle.textContent = '✏️ Modifier la Fiche';
            formId.value = fiche.id;
            formTitle.value = fiche.title;
            formSubject.value = fiche.subject;
            formBadge.value = fiche.badge;
            formEpreuve.value = fiche.epreuve;
            formDesc.value = fiche.description;
            formContent.value = fiche.content;
        } else {
            formModalTitle.textContent = '📝 Nouvelle Fiche';
            ficheForm.reset();
            formId.value = '';
        }
        
        ficheModal.classList.remove('active');
        formModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Sauvegarder la fiche
    ficheForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const id = formId.value || 'f' + Date.now();
        const newFiche = {
            id: id,
            title: formTitle.value.trim(),
            subject: formSubject.value,
            badge: formBadge.value.trim(),
            epreuve: formEpreuve.value.trim(),
            description: formDesc.value.trim(),
            content: formContent.value.trim()
        };

        if (formId.value) {
            const index = fiches.findIndex(f => f.id === id);
            fiches[index] = newFiche;
            showToast('Fiche mise à jour !');
        } else {
            fiches.push(newFiche);
            showToast('Nouvelle fiche ajoutée !');
        }

        saveToStorage();
        closeModals();
        renderFiches();
    });

    // Supprimer une fiche
    modalDeleteBtn.addEventListener('click', () => {
        if (confirm('Es-tu sûr de vouloir supprimer cette fiche ?')) {
            fiches = fiches.filter(f => f.id !== currentFicheId);
            localStorage.removeItem(noteKey(currentFicheId));
            saveToStorage();
            closeModals();
            renderFiches();
            showToast('Fiche supprimée', 'danger');
        }
    });

    // Événements boutons
    addFicheBtn.addEventListener('click', () => openFormModal());
    modalEditBtn.addEventListener('click', () => openFormModal(currentFicheId));
    
    document.getElementById('form-modal-close').addEventListener('click', closeModals);
    document.getElementById('form-cancel').addEventListener('click', closeModals);
    document.getElementById('modal-close').addEventListener('click', closeModals);

    function closeModals() {
        ficheModal.classList.remove('active');
        formModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Auto-save des notes
    let saveTimeout;
    modalNotes.addEventListener('input', () => {
        const text = modalNotes.value;
        modalCharCount.textContent = `${text.length} caractère${text.length !== 1 ? 's' : ''}`;
        
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(() => {
            localStorage.setItem(noteKey(currentFicheId), text);
            modalSaveStatus.textContent = '✓ Sauvegardé';
            modalSaveStatus.classList.add('visible');
            setTimeout(() => modalSaveStatus.classList.remove('visible'), 2000);
            renderFiches(); 
        }, 500);
    });

    // Filtres
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            renderFiches();
        });
    });

    // ==========================================
    //  7. OUTILS PRATIQUES (SQL & PDF)
    // ==========================================

    // --- Générateur SQL ---
    const sqlSelect = document.getElementById('sql-select');
    const sqlFrom = document.getElementById('sql-from');
    const sqlWhere = document.getElementById('sql-where');
    const sqlOrder = document.getElementById('sql-order');
    const sqlGenerated = document.getElementById('generated-sql');
    const copySqlBtn = document.getElementById('copy-sql');

    function updateSQL() {
        const sel = sqlSelect.value.trim() || '*';
        const frm = sqlFrom.value.trim() || 'table';
        const whe = sqlWhere.value.trim();
        const ord = sqlOrder.value.trim();

        let sql = `SELECT ${sel} FROM ${frm}`;
        if (whe) sql += ` WHERE ${whe}`;
        if (ord) sql += ` ORDER BY ${ord}`;
        sql += ';';

        sqlGenerated.textContent = sql;
    }

    if (sqlSelect) {
        [sqlSelect, sqlFrom, sqlWhere, sqlOrder].forEach(input => {
            input.addEventListener('input', updateSQL);
        });
    }

    if (copySqlBtn) {
        copySqlBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(sqlGenerated.textContent).then(() => {
                showToast('Requête copiée !');
            });
        });
    }

    // --- Dépôt PDF ---
    const dropZone = document.getElementById('drop-zone');
    const pdfUpload = document.getElementById('pdf-upload');
    const pdfList = document.getElementById('pdf-list');

    let uploadedFiles = [];

    function renderFileList() {
        if (!pdfList) return;
        pdfList.innerHTML = '';
        if (uploadedFiles.length === 0) {
            pdfList.innerHTML = '<p style="text-align:center; font-size:0.8rem; color:var(--text-light); margin-top:1rem;">Aucun document déposé.</p>';
            return;
        }

        uploadedFiles.forEach((file, index) => {
            const item = document.createElement('div');
            item.className = 'pdf-item';
            item.innerHTML = `
                <div class="pdf-info">
                    <span>📄 ${file.name}</span>
                </div>
                <div class="pdf-actions">
                    <button class="pdf-btn pdf-btn-view" title="Ouvrir">👁️</button>
                    <button class="pdf-btn pdf-btn-delete" title="Supprimer">🗑️</button>
                </div>
            `;

            item.querySelector('.pdf-btn-view').onclick = () => window.open(file.url, '_blank');
            item.querySelector('.pdf-btn-delete').onclick = () => {
                URL.revokeObjectURL(file.url);
                uploadedFiles.splice(index, 1);
                renderFileList();
            };

            pdfList.appendChild(item);
        });
    }

    function handleFiles(files) {
        Array.from(files).forEach(file => {
            if (file.type === 'application/pdf') {
                const url = URL.createObjectURL(file);
                uploadedFiles.push({ name: file.name, url: url });
                showToast(`PDF ajouté : ${file.name}`);
            } else {
                showToast('Seuls les fichiers PDF sont acceptés.', 'danger');
            }
        });
        renderFileList();
    }

    if (dropZone) {
        dropZone.onclick = () => pdfUpload.click();
        pdfUpload.onchange = (e) => handleFiles(e.target.files);

        dropZone.ondragover = (e) => { e.preventDefault(); dropZone.classList.add('dragover'); };
        dropZone.ondragleave = () => dropZone.classList.remove('dragover');
        dropZone.ondrop = (e) => {
            e.preventDefault();
            dropZone.classList.remove('dragover');
            handleFiles(e.dataTransfer.files);
        };
    }

    // ==========================================
    //  8. BAC À SABLE SQL (MOCK SQL)
    // ==========================================

    const sandboxSourceBody = document.getElementById('sandbox-source-body');
    const sqlSandboxInput = document.getElementById('sql-sandbox-input');
    const sqlSandboxRun = document.getElementById('sql-sandbox-run');
    const sqlSandboxNext = document.getElementById('sql-sandbox-next');
    const sqlSandboxFeedback = document.getElementById('sql-sandbox-feedback');
    const sandboxResultArea = document.getElementById('sandbox-result-area');
    const sqlLevelBadge = document.getElementById('sql-level');
    const sqlChallengeText = document.getElementById('sql-challenge-text');

    const mockData = [
        { id: 1, nom: 'Dupont', prenom: 'Jean', moyenne: 14.5, ville: 'Paris' },
        { id: 2, nom: 'Durand', prenom: 'Marie', moyenne: 11.2, ville: 'Lyon' },
        { id: 3, nom: 'Martin', prenom: 'Lucas', moyenne: 16.8, ville: 'Marseille' },
        { id: 4, nom: 'Lefebvre', prenom: 'Sophie', moyenne: 9.5, ville: 'Paris' },
        { id: 5, nom: 'Moreau', prenom: 'Thomas', moyenne: 13.0, ville: 'Lille' }
    ];

    const sqlChallenges = [
        {
            id: 1,
            text: "Affiche tous les étudiants de la table (tout sélectionner).",
            expectedQuery: "SELECT * FROM Etudiants",
            validate: (query) => {
                const q = query.toLowerCase().replace(/;/g, '').trim();
                return q === "select * from etudiants";
            }
        },
        {
            id: 2,
            text: "Affiche seulement les colonnes 'nom' et 'prenom' de tous les étudiants.",
            expectedQuery: "SELECT nom, prenom FROM Etudiants",
            validate: (query) => {
                const q = query.toLowerCase().replace(/;/g, '').replace(/\s/g, '').trim();
                return q === "selectnom,prenomfrometudiants" || q === "selectprenom,nomfrometudiants";
            }
        },
        {
            id: 3,
            text: "Affiche les étudiants qui ont une moyenne strictement supérieure à 12.",
            expectedQuery: "SELECT * FROM Etudiants WHERE moyenne > 12",
            validate: (query) => {
                const q = query.toLowerCase().replace(/;/g, '').replace(/\s+/g, ' ').trim();
                return q.includes("where moyenne > 12") || q.includes("where moyenne>12");
            }
        },
        {
            id: 4,
            text: "Trouve tous les étudiants qui habitent à 'Paris'.",
            expectedQuery: "SELECT * FROM Etudiants WHERE ville = 'Paris'",
            validate: (query) => {
                const q = query.toLowerCase().replace(/;/g, '').replace(/\s+/g, ' ').replace(/"/g, "'").trim();
                return q.includes("where ville = 'paris'") || q.includes("where ville='paris'");
            }
        }
    ];

    let currentLevel = 0;

    function renderSourceTable() {
        if (!sandboxSourceBody) return;
        sandboxSourceBody.innerHTML = mockData.map(row => `
            <tr>
                <td>${row.id}</td>
                <td>${row.nom}</td>
                <td>${row.prenom}</td>
                <td>${row.moyenne}</td>
                <td>${row.ville}</td>
            </tr>
        `).join('');
    }

    function loadChallenge() {
        const challenge = sqlChallenges[currentLevel];
        sqlLevelBadge.textContent = `Défi ${challenge.id}`;
        sqlChallengeText.textContent = challenge.text;
        sqlSandboxInput.value = '';
        sqlSandboxFeedback.style.display = 'none';
        sqlSandboxFeedback.className = 'sandbox-feedback';
        sandboxResultArea.innerHTML = '';
        sqlSandboxNext.disabled = true;
    }

    function runSandboxQuery() {
        const query = sqlSandboxInput.value.trim();
        if (!query) return;

        const challenge = sqlChallenges[currentLevel];
        const isValid = challenge.validate(query);

        if (isValid) {
            sqlSandboxFeedback.textContent = "🌟 BRAVO ! Ta requête est correcte.";
            sqlSandboxFeedback.className = 'sandbox-feedback feedback-success';
            sqlSandboxNext.disabled = false;
            
            // Simuler un affichage de résultat (simplifié)
            sandboxResultArea.innerHTML = `
                <div style="padding:1rem; color:var(--success); font-size:0.85rem; background:rgba(16, 185, 129, 0.05);">
                    <strong>Résultat de l'exécution :</strong><br>
                    Requête validée avec succès sur la table Etudiants.
                </div>
            `;
            
            showToast("Défi réussi ! ✨");
        } else {
            sqlSandboxFeedback.textContent = "❌ Oups, ce n'est pas tout à fait ça. Vérifie la syntaxe ou les noms de colonnes.";
            sqlSandboxFeedback.className = 'sandbox-feedback feedback-error';
            sandboxResultArea.innerHTML = '';
        }
        sqlSandboxFeedback.style.display = 'block';
    }

    if (sqlSandboxRun) {
        sqlSandboxRun.addEventListener('click', runSandboxQuery);
    }

    if (sqlSandboxNext) {
        sqlSandboxNext.addEventListener('click', () => {
            currentLevel++;
            if (currentLevel < sqlChallenges.length) {
                loadChallenge();
            } else {
                sqlChallengeText.textContent = "🏆 Félicitations ! Tu as terminé tous les défis SQL.";
                sqlSandboxInput.style.display = 'none';
                sqlSandboxRun.style.display = 'none';
                sqlSandboxNext.style.display = 'none';
                sqlLevelBadge.textContent = "Gagné !";
            }
        });
    }

    // Init Sandbox
    renderSourceTable();
    loadChallenge();
    updateSQL();
    renderFileList();
    renderFiches();

});