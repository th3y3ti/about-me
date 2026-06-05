document.addEventListener('DOMContentLoaded', function() {
    initThemeManager();
    initTerminal();
    initFilterEngine();
    initVideoModal();
});

/* ==========================================================================
   1. Theme Manager
   ========================================================================== */
function initThemeManager() {
    const defaultTheme = 'cyber';
    let currentTheme = localStorage.getItem('portfolio-theme') || defaultTheme;
    
    // Apply initial theme
    applyTheme(currentTheme);

    // Inject theme switcher into navbar dynamically
    const navContainer = document.querySelector('.nav-container');
    if (navContainer && !document.querySelector('.theme-switcher')) {
        const switcher = document.createElement('div');
        switcher.className = 'theme-switcher';
        switcher.innerHTML = `
            <button class="theme-btn" data-theme="cyber" title="Dark Cyber">
                <svg viewBox="0 0 24 24"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm0-2V4a8 8 0 110 16z"/></svg>
            </button>
            <button class="theme-btn" data-theme="matrix" title="Matrix Green">
                <svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 1010 10A10 10 0 0012 2zm1 14.93V17a1 1 0 01-2 0v-.07A7 7 0 015.07 13H5a1 1 0 010-2h.07A7 7 0 0111 5.07V5a1 1 0 012 0v.07A7 7 0 0118.93 11H19a1 1 0 010 2h-.07A7 7 0 0113 16.93zM12 7a5 5 0 105 5 5 5 0 00-5-5z"/></svg>
            </button>
            <button class="theme-btn" data-theme="light" title="Light Paper">
                <svg viewBox="0 0 24 24"><path d="M12 7a5 5 0 105 5 5 5 0 00-5-5zm0-5a1 1 0 011 1v1a1 1 0 01-2 0V3a1 1 0 011-1zm0 16a1 1 0 011 1v1a1 1 0 01-2 0v-1a1 1 0 011-1zM5.636 4.222a1 1 0 011.414 0l.707.707a1 1 0 11-1.414 1.414l-.707-.707a1 1 0 010-1.414zm11.314 11.314a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414zM3 11a1 1 0 011 1v0a1 1 0 01-2 0v0a1 1 0 011-1zm16 0a1 1 0 011 1v0a1 1 0 01-2 0v0a1 1 0 011-1zM5.636 19.778a1 1 0 010-1.414l.707-.707a1 1 0 111.414 1.414l-.707.707a1 1 0 01-1.414 0zm11.314-11.314a1 1 0 010-1.414l.707-.707a1 1 0 011.414 1.414l-.707.707a1 1 0 01-1.414 0z"/></svg>
            </button>
        `;
        navContainer.appendChild(switcher);

        // Highlight active switcher button
        const activeBtn = switcher.querySelector(`[data-theme="${currentTheme}"]`);
        if (activeBtn) activeBtn.classList.add('active');

        // Hook click events
        switcher.querySelectorAll('.theme-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                switcher.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                const theme = this.getAttribute('data-theme');
                applyTheme(theme);
            });
        });
    }
}

function applyTheme(theme) {
    document.body.classList.remove('theme-matrix', 'theme-light');
    if (theme === 'matrix') {
        document.body.classList.add('theme-matrix');
    } else if (theme === 'light') {
        document.body.classList.add('theme-light');
    }
    localStorage.setItem('portfolio-theme', theme);
}


/* ==========================================================================
   2. Interactive Terminal Simulator
   ========================================================================== */
function initTerminal() {
    const terminalBody = document.getElementById('terminal-body');
    const terminalInput = document.getElementById('terminal-input');
    const terminalOutput = document.getElementById('terminal-output');

    if (!terminalBody || !terminalInput || !terminalOutput) return;

    // Welcome Message
    const welcome = `YETI-SEC Terminal OS v2.0
Type 'help' to view available cybersecurity operational commands.

`;
    terminalOutput.textContent = welcome;

    // Direct clicks on terminal body to focus input
    terminalBody.addEventListener('click', () => {
        terminalInput.focus();
    });

    terminalInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            const rawVal = this.value;
            const command = rawVal.trim().toLowerCase();
            this.value = '';

            // Print the prompt and input to screen
            const line = document.createElement('div');
            line.innerHTML = `<span class="terminal-prompt">robert@yeti-sec:~$</span> <span>${escapeHtml(rawVal)}</span>`;
            terminalBody.insertBefore(line, this.parentElement);

            // Execute command
            executeCommand(command);
            
            // Auto scroll to bottom
            terminalBody.scrollTop = terminalBody.scrollHeight;
        }
    });

    function executeCommand(cmd) {
        let outputText = '';
        
        switch (cmd) {
            case '':
                break;
            case 'help':
            case '?':
                outputText = `Available Commands:
  help     - Show this operational help menu
  skills   - List core cybersecurity & technology domains
  projects - Show a index of notable portfolio projects
  ciso     - Virtual CISO fractional services detail
  contact  - Display secure contact coordinates
  yeti     - Execute yeti.decryption.routine
  clear    - Clear terminal logs`;
                break;
            case 'skills':
                outputText = `Robert Higham - Core Expertise Checklist:
  [+] Cybersecurity Program Strategy & Leadership
  [+] Enterprise Information Security Risk Management
  [+] ISO 27001 Lead Auditor / Audit Preparation
  [+] Threat Hunting, SIEM & SOC Workflow Automation
  [+] Detection Engineering & Security Tool Customization
  [+] AI & Machine Learning integration in Cyber Operations`;
                break;
            case 'projects':
                outputText = `Select Projects:
  [1] Escalation Redesign: Reduced missed detections from 2% to 0.4%
  [2] Threat Hunting: Exceeded initial business line targets by 500%
  [3] SOC-in-a-Box: Open-source SOC automation framework (Python)
  [4] Finian (finian.ai): AI-Powered security analysis tool
  To browse the full project list, navigate to 'Work' in the main menu.`;
                break;
            case 'ciso':
                outputText = `Fractional & Virtual CISO Services:
  - Strategic security blueprinting
  - ISO 27001 pre-audits and training
  - Threat containment and response architecture
  - Fluent "C-Suite" communication and escalation management
  See 'Services' page in navbar for a complete overview.`;
                break;
            case 'contact':
                outputText = `Contact Coordinates:
  - Secure Email: robert@higham.security (redirects to rhigham@gmail.com)
  - GitHub Code: https://github.com/th3y3ti
  - CV Download: Available via CV link in main navigation`;
                break;
            case 'yeti':
                outputText = `[!] Running yeti.decryption.routine...
[+] Yeti detected in system matrix:

            .--------.
           / .------. \\
          / /  @   @ \\ \\
          | |        | |
         (| |  \\__/  | |)
          | \\  ___  / |
          /  '-----'  \\
         /             \\
        /  /|       |\\  \\
       /  / |       | \\  \\
      (___) (_______) (___)
      
[+] Status: YETI-SEC SYSTEM ENCRYPTED AND READY`;
                break;
            case 'clear':
                terminalOutput.textContent = '';
                // Remove previous command lines we appended dynamically
                const lines = terminalBody.querySelectorAll('div:not(.terminal-input-line)');
                lines.forEach(l => l.remove());
                return;
            default:
                outputText = `Command not recognized: '${cmd}'. Type 'help' for options.`;
                break;
        }

        if (outputText) {
            const outDiv = document.createElement('div');
            outDiv.className = 'terminal-output';
            outDiv.textContent = outputText + '\n\n';
            terminalBody.insertBefore(outDiv, terminalInput.parentElement);
        }
    }

    function escapeHtml(text) {
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
}


/* ==========================================================================
   3. DRY Filter Engine
   ========================================================================== */
function initFilterEngine() {
    const activeFilters = new Set();
    const activeFiltersContainer = document.getElementById('active-filters');
    const clearFiltersButton = document.getElementById('clear-filters');
    const filterSection = document.querySelector('.filter-section');

    if (!filterSection) return; // Only run on pages that have filters (Work, Community)

    // Setup active filters container elements if not present in HTML
    let currentFiltersWrapper = activeFiltersContainer;
    
    // Bind all clickable tags
    document.querySelectorAll('.tag').forEach(tag => {
        tag.addEventListener('click', function(e) {
            e.preventDefault();
            const filterValue = this.textContent.trim();
            toggleFilter(filterValue);
        });
    });

    // Clear filters button trigger
    if (clearFiltersButton) {
        clearFiltersButton.addEventListener('click', () => {
            activeFilters.clear();
            syncTagActiveState();
            renderActiveFiltersPanel();
            filterCards();
        });
    }

    function toggleFilter(filter) {
        if (activeFilters.has(filter)) {
            activeFilters.delete(filter);
        } else {
            activeFilters.add(filter);
        }
        syncTagActiveState();
        renderActiveFiltersPanel();
        filterCards();
    }

    function syncTagActiveState() {
        document.querySelectorAll('.tag').forEach(tag => {
            const tagVal = tag.textContent.trim();
            if (activeFilters.has(tagVal)) {
                tag.classList.add('active');
            } else {
                tag.classList.remove('active');
            }
        });
    }

    function renderActiveFiltersPanel() {
        if (activeFilters.size > 0) {
            filterSection.classList.add('has-filters');
            if (clearFiltersButton) clearFiltersButton.style.display = 'inline-block';
            
            if (currentFiltersWrapper) {
                currentFiltersWrapper.innerHTML = '';
                activeFilters.forEach(filter => {
                    const activePill = document.createElement('span');
                    activePill.className = 'tag active';
                    activePill.textContent = filter;
                    activePill.addEventListener('click', () => toggleFilter(filter));
                    currentFiltersWrapper.appendChild(activePill);
                });
            }
        } else {
            filterSection.classList.remove('has-filters');
            if (clearFiltersButton) clearFiltersButton.style.display = 'none';
            if (currentFiltersWrapper) currentFiltersWrapper.innerHTML = '';
        }
    }

    function filterCards() {
        const cards = document.querySelectorAll('.project-card');
        
        cards.forEach(card => {
            if (activeFilters.size === 0) {
                // Show all
                card.style.display = 'flex';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0) scale(1)';
                }, 50);
                return;
            }

            const cardTags = Array.from(card.querySelectorAll('.tag')).map(t => t.textContent.trim());
            const hasAll = Array.from(activeFilters).every(f => cardTags.includes(f));

            if (hasAll) {
                card.style.display = 'flex';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0) scale(1)';
                }, 50);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'scale(0.95) translateY(5px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 200);
            }
        });

        // Hide empty grid headers
        document.querySelectorAll('.projects-grid').forEach(grid => {
            const visibleCards = Array.from(grid.querySelectorAll('.project-card')).filter(c => {
                return c.style.display !== 'none';
            }).length;
            
            // The header is the preceding element (e.g. h2)
            const header = grid.previousElementSibling;
            if (header && header.tagName === 'H2') {
                if (visibleCards === 0) {
                    header.style.display = 'none';
                } else {
                    header.style.display = 'block';
                }
            }
        });
    }
}

/* ==========================================================================
   4. Video Modal Player Overlay
   ========================================================================== */
function initVideoModal() {
    const cards = document.querySelectorAll('.project-card[data-video]');
    
    cards.forEach(card => {
        const videoId = card.getAttribute('data-video');
        if (!videoId) return;

        // Create Play Walkthrough button
        const playBtn = document.createElement('button');
        playBtn.className = 'card-video-btn';
        playBtn.type = 'button';
        playBtn.innerHTML = `
            <svg viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
            </svg>
            Watch Walkthrough
        `;

        // Find insertion point - before project links or at the end
        const projectLinks = card.querySelector('.project-links');
        if (projectLinks) {
            card.insertBefore(playBtn, projectLinks);
        } else {
            card.appendChild(playBtn);
        }

        // Click listener
        playBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            openVideoModal(videoId);
        });
    });

    function openVideoModal(videoId) {
        // Create modal element
        const modal = document.createElement('div');
        modal.className = 'video-modal';
        
        modal.innerHTML = `
            <div class="video-modal-content">
                <button class="video-modal-close" aria-label="Close video">&times;</button>
                <iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen></iframe>
            </div>
        `;

        document.body.appendChild(modal);

        // Fade in
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);

        // Close function
        const closeModal = () => {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.remove();
            }, 300);
        };

        const closeBtn = modal.querySelector('.video-modal-close');
        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });

        // ESC key close support
        const escapeClose = (e) => {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', escapeClose);
            }
        };
        document.addEventListener('keydown', escapeClose);
    }
}

