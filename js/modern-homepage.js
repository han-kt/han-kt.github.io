// Modern Academic Homepage JavaScript

// Load comprehensive publications data from generated file
// This file contains all 192 publications from YAML data
// Generated on: 2025-07-29 21:45:00
// Breakdown: 69 conferences, 19 journals, 102 patents, 2 books

// Initialize Fuse.js for search
let fuse;
let filteredPublications = [];

// DOM elements - will be initialized after DOM loads
let themeToggle, mobileMenuBtn, mobileMenu, searchInput, filterSelect, publicationsList, lastUpdated;

// Check if publications data is loaded
function checkPublicationsData() {
    if (typeof publications === 'undefined') {
        console.error('Publications data not loaded!');
        return false;
    }
    return true;
}

// Theme management
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    updateThemeIcon(savedTheme);
}

function toggleTheme() {
    const isDark = document.documentElement.classList.toggle('dark');
    const theme = isDark ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
    updateThemeIcon(theme);
}

function updateThemeIcon(theme) {
    if (!themeToggle) return;
    const icon = themeToggle.querySelector('i');
    if (theme === 'dark') {
        icon.className = 'fas fa-sun text-yellow-500';
    } else {
        icon.className = 'fas fa-moon text-gray-600';
    }
}

// Mobile menu
function toggleMobileMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.toggle('hidden');
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // Close mobile menu if open
                if (mobileMenu) {
                    mobileMenu.classList.add('hidden');
                }
            }
        });
    });
}

// Header scroll effect
function initHeaderScroll() {
    const header = document.getElementById('header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > lastScroll && currentScroll > 100) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
    });
}

// Publications search and filter
function initPublications() {
    // Check if publications data is loaded
    if (!checkPublicationsData()) {
        console.error('Cannot initialize publications - data not available');
        return;
    }
    
    // Check if required elements exist
    if (!searchInput || !filterSelect || !publicationsList) {
        console.error('Required publication elements not found');
        return;
    }
    
    // Initialize Fuse.js with comprehensive publications data
    const options = {
        keys: ['title', 'authors', 'venue', 'abstract'],
        threshold: 0.3,
        includeScore: true
    };
    fuse = new Fuse(publications, options);
    
    // Initialize filtered publications with all publications
    filteredPublications = [...publications];
    
    // Event listeners
    searchInput.addEventListener('input', filterPublications);
    filterSelect.addEventListener('change', filterPublications);
    
    // Initial render
    renderPublications();
}

function filterPublications() {
    const searchTerm = searchInput.value.trim();
    const filterType = filterSelect.value;
    
    let results = publications; // Start with all publications
    
    // Apply type filter FIRST
    if (filterType !== 'all') {
        results = results.filter(pub => pub.type === filterType);
    }
    
    // Apply search AFTER type filter
    if (searchTerm) {
        // Create a new Fuse instance with the filtered results
        const searchOptions = {
            keys: ['title', 'authors', 'venue', 'abstract'],
            threshold: 0.4, // Slightly more lenient threshold
            includeScore: true,
            ignoreLocation: true, // Search anywhere in the string
            findAllMatches: true
        };
        const searchFuse = new Fuse(results, searchOptions);
        const searchResults = searchFuse.search(searchTerm);
        results = searchResults.map(result => result.item);
    }
    
    filteredPublications = results;
    renderPublications();
}



function getTypeLabel(type) {
    switch (type) {
        case 'conference': return 'Conference';
        case 'journal': return 'Journal';
        case 'patent': return 'Patent';
        case 'book': return 'Book';
        default: return 'Venue';
    }
}

function renderPublications() {
    if (!publicationsList) {
        console.error('Publications list element not found!');
        return;
    }
    

    
    if (filteredPublications.length === 0) {
        publicationsList.innerHTML = '<p class="text-gray-500 text-center py-8">No publications found.</p>';
        return;
    }
    
    // Calculate original reference numbers based on full publications list
    const originalTypeCounts = {
        conference: 0,
        journal: 0,
        patent: 0,
        book: 0
    };
    
    // Count total publications of each type in the full list
    publications.forEach(pub => {
        originalTypeCounts[pub.type]++;
    });
    
    // Create a map to store original reference numbers for each publication
    const originalRefNumbers = new Map();
    const currentCounts = {
        conference: 0,
        journal: 0,
        patent: 0,
        book: 0
    };
    
    // Calculate original reference numbers for all publications
    publications.forEach(pub => {
        currentCounts[pub.type]++;
        const reverseNumber = originalTypeCounts[pub.type] - currentCounts[pub.type] + 1;
        const refNumber = `[${pub.type.charAt(0).toUpperCase()}${String(reverseNumber).padStart(2, '0')}]`;
        originalRefNumbers.set(pub.id, refNumber);
    });
    
    publicationsList.innerHTML = filteredPublications.map((pub, index) => {
        // Generate publication type prefix
        let typePrefix = '';
        switch(pub.type) {
            case 'journal':
                typePrefix = '📘';
                break;
            case 'conference':
                typePrefix = '📄';
                break;
            case 'patent':
                typePrefix = '⚡';
                break;
            case 'book':
                typePrefix = '📚';
                break;
            default:
                typePrefix = '📚';
        }
        
        // Use the original reference number for this publication
        const refNumber = originalRefNumbers.get(pub.id) || `[${pub.type.charAt(0).toUpperCase()}${String(pub.id).padStart(2, '0')}]`;
        
        // Generate venue abbreviation
        let venueAbbr = pub.venue;
        if (pub.venue.includes('IEEE Transactions on Intelligent Vehicles')) {
            venueAbbr = 'IEEE T-IV';
        } else if (pub.venue.includes('IEEE Transactions on Intelligent Transportation Systems')) {
            venueAbbr = 'IEEE T-ITS';
        } else if (pub.venue.includes('IEEE Internet of Things Journal')) {
            venueAbbr = 'IEEE IoT-J';
        } else if (pub.venue.includes('IEEE Transactions on Vehicular Technology')) {
            venueAbbr = 'IEEE TVT';
        } else if (pub.venue.includes('IEEE Intelligent Vehicles Symposium')) {
            venueAbbr = 'IEEE IV';
        } else if (pub.venue.includes('IEEE International Conference on Intelligent Transportation Systems')) {
            venueAbbr = 'IEEE ITSC';
        } else if (pub.venue.includes('US Patent Application')) {
            // Keep the full patent application number for clarity
            venueAbbr = pub.venue;
        } else if (pub.venue.includes('US Patent')) {
            // Keep the full patent number for clarity
            venueAbbr = pub.venue;
        }
        
        return `
            <div class="publication-item bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-3 hover:shadow-md transition-shadow border-l-4 border-blue-500">
                <div class="flex items-start justify-between">
                    <div class="flex-1">
                        <div class="flex items-start gap-2 mb-2">
                            <span class="text-lg">${typePrefix}</span>
                            <span class="font-mono text-sm text-gray-500 dark:text-gray-400">${refNumber}</span>
                            <h3 class="publication-title text-base font-semibold text-gray-900 dark:text-white flex-1">
                                "${pub.title}"
                            </h3>
                        </div>
                        
                        <div class="ml-6 text-sm text-gray-600 dark:text-gray-300">
                            <p class="mb-1"><strong>Authors:</strong> ${pub.authors}</p>
                            <p class="mb-1"><strong>${pub.type_label || getTypeLabel(pub.type)}:</strong> ${venueAbbr}, ${pub.year}</p>
                        </div>
                        
                        <div class="ml-6 mt-2 flex flex-wrap gap-2">
                            ${pub.url ? `
                                <a href="${pub.url}" target="_blank" rel="noopener noreferrer" 
                                   class="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded hover:bg-blue-100 transition-colors">
                                    <i class="fas fa-external-link-alt mr-1"></i>Link
                                </a>
                            ` : ''}
                            ${pub.pdf ? `
                                <a href="${pub.pdf}" target="_blank" rel="noopener noreferrer" 
                                   class="inline-flex items-center px-2 py-1 text-xs font-medium text-green-600 bg-green-50 rounded hover:bg-green-100 transition-colors">
                                    <i class="fas fa-file-pdf mr-1"></i>PDF
                                </a>
                            ` : ''}
                            ${pub.abstract && pub.abstract.trim() !== '' ? `
                                <button onclick="toggleAbstract(${pub.id})" 
                                        class="inline-flex items-center px-2 py-1 text-xs font-medium text-green-600 bg-green-50 rounded hover:bg-green-100 transition-colors">
                                    <i class="fas fa-eye mr-1"></i>Abstract
                                </button>
                            ` : ''}
                            <button onclick="copyBibTeX(${pub.id}, event)" 
                                    class="inline-flex items-center px-2 py-1 text-xs font-medium text-purple-600 bg-purple-50 rounded hover:bg-purple-100 transition-colors">
                                <i class="fas fa-code mr-1"></i>BibTeX
                            </button>
                        </div>
                    </div>
                </div>
                
                ${pub.abstract && pub.abstract.trim() !== '' ? `
                    <div id="abstract-${pub.id}" class="publication-abstract hidden mt-3 ml-6 p-3 bg-gray-50 dark:bg-gray-700 rounded">
                        <h4 class="font-semibold text-gray-900 dark:text-white mb-2 text-sm">Abstract</h4>
                        <p class="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">${pub.abstract}</p>
                    </div>
                ` : ''}
            </div>
        `;
    }).join('');
}

function toggleAbstract(id) {
    const abstract = document.getElementById(`abstract-${id}`);
    if (!abstract) {
        console.warn(`Abstract element not found for publication ${id}`);
        return;
    }
    
    if (abstract.classList.contains('hidden')) {
        abstract.classList.remove('hidden');
    } else {
        abstract.classList.add('hidden');
    }
}

// Format authors for BibTeX (convert commas to 'and')
function formatAuthorsForBibTeX(authorsStr) {
    if (!authorsStr) return '';
    
    // Replace ", and " with " and "
    let formatted = authorsStr.replace(/,\s*and\s+/g, ' and ');
    
    // Replace remaining commas with " and "
    formatted = formatted.replace(/,\s*/g, ' and ');
    
    return formatted;
}

function copyBibTeX(id, event) {
    const pub = publications.find(p => p.id === id);
    if (!pub) return;
    
    // Generate BibTeX entry
    let bibtex = '';
    const key = `${pub.authors.split(',')[0].split(' ').pop()}${pub.year}${pub.title.split(' ').slice(0, 2).join('').replace(/[^a-zA-Z]/g, '')}`;
    
    // Format authors properly for BibTeX
    const formattedAuthors = formatAuthorsForBibTeX(pub.authors);
    
    if (pub.type === 'journal') {
        bibtex = `@article{${key},
  title={${pub.title}},
  author={${formattedAuthors}},
  journal={${pub.venue}},
  year={${pub.year}},
  publisher={IEEE}
}`;
    } else if (pub.type === 'conference') {
        bibtex = `@inproceedings{${key},
  title={${pub.title}},
  author={${formattedAuthors}},
  booktitle={${pub.venue}},
  year={${pub.year}},
  organization={IEEE}
}`;
    } else if (pub.type === 'patent') {
        bibtex = `@patent{${key},
  title={${pub.title}},
  author={${formattedAuthors}},
  number={${pub.venue}},
  year={${pub.year}},
  assignee={Toyota Motor North America}
}`;
    } else if (pub.type === 'book') {
        bibtex = `@book{${key},
  title={${pub.title}},
  author={${formattedAuthors}},
  publisher={${pub.venue}},
  year={${pub.year}}
}`;
    }
    
    // Copy to clipboard
    navigator.clipboard.writeText(bibtex).then(() => {
        // Show success message
        const button = event.target.closest('button');
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check mr-1"></i>Copied!';
        button.classList.remove('text-purple-600', 'bg-purple-50', 'hover:bg-purple-100');
        button.classList.add('text-green-600', 'bg-green-50');
        
        setTimeout(() => {
            button.innerHTML = originalText;
            button.classList.remove('text-green-600', 'bg-green-50');
            button.classList.add('text-purple-600', 'bg-purple-50', 'hover:bg-purple-100');
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy BibTeX:', err);
        alert('Failed to copy BibTeX to clipboard');
    });
}

// Update last modified date
function updateLastModified() {
    if (!lastUpdated) return;
    const lastModified = new Date(document.lastModified);
    lastUpdated.textContent = lastModified.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Intersection Observer for animations
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);
    
    // Observe sections
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
}

// Initialize DOM elements
function initDOMElements() {
    themeToggle = document.getElementById('theme-toggle');
    mobileMenuBtn = document.getElementById('mobile-menu-btn');
    mobileMenu = document.getElementById('mobile-menu');
    searchInput = document.getElementById('search-input');
    filterSelect = document.getElementById('filter-select');
    publicationsList = document.getElementById('publications-list');
    lastUpdated = document.getElementById('last-updated');
    
    // Check if elements were found
    if (!themeToggle) console.warn('Theme toggle button not found');
    if (!mobileMenuBtn) console.warn('Mobile menu button not found');
    if (!mobileMenu) console.warn('Mobile menu not found');
    if (!searchInput) console.warn('Search input not found');
    if (!filterSelect) console.warn('Filter select not found');
    if (!publicationsList) console.warn('Publications list not found');
    if (!lastUpdated) console.warn('Last updated element not found');
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize DOM elements first
    initDOMElements();
    
    initTheme();
    initSmoothScrolling();
    initHeaderScroll();
    initPublications();
    initAnimations();
    updateLastModified();
    
    // Event listeners
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (mobileMenuBtn && mobileMenu && !mobileMenuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
            mobileMenu.classList.add('hidden');
        }
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + K for search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k' && searchInput) {
            e.preventDefault();
            searchInput.focus();
        }
        
        // Escape to close mobile menu
        if (e.key === 'Escape' && mobileMenu) {
            mobileMenu.classList.add('hidden');
        }
    });
});

// Export functions for global access
window.toggleAbstract = toggleAbstract;
window.copyBibTeX = copyBibTeX; 