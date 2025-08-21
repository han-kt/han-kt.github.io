// Modern Academic Homepage JavaScript

// Load comprehensive publications data from generated file
// This file contains all 192 publications from YAML data
// Generated on: 2025-07-29 21:45:00
// Breakdown: 69 conferences, 19 journals, 102 patents, 2 books

// Initialize Fuse.js for search
let fuse;
let filteredPublications = [];

// DOM elements
const themeToggle = document.getElementById('theme-toggle');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const searchInput = document.getElementById('search-input');
const filterSelect = document.getElementById('filter-select');
const publicationsList = document.getElementById('publications-list');
const lastUpdated = document.getElementById('last-updated');

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
    if (themeToggle) {
        const icon = themeToggle.querySelector('i');
        if (theme === 'dark') {
            icon.className = 'fas fa-sun text-yellow-500';
        } else {
            icon.className = 'fas fa-moon text-gray-600';
        }
    }
}

// Mobile menu
function toggleMobileMenu() {
    if (mobileMenu) {
        mobileMenu.classList.toggle('hidden');
    }
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
                mobileMenu.classList.add('hidden');
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

// Function to filter publications and scroll to publications section
function filterAndScrollToPublications(filterType) {
    // Set the filter dropdown value
    if (filterSelect) {
        filterSelect.value = filterType;
    }
    
    // Clear search input
    if (searchInput) {
        searchInput.value = '';
    }
    
    // Apply the filter
    filterPublications();
    
    // Scroll to publications section
    const publicationsSection = document.getElementById('publications');
    if (publicationsSection) {
        publicationsSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
    
    // Close mobile menu if open
    if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.add('hidden');
    }
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
    
    // Sort by effective date (descending) to ensure proper chronological order
    // Use actual dates when available, fall back to year
    results.sort((a, b) => {
        // For patents, prefer grant_date over filing_date
        const getEffectiveDate = (pub) => {
            if (pub.type === 'patent') {
                if (pub.grant_date) {
                    return new Date(pub.grant_date);
                } else if (pub.filing_date) {
                    return new Date(pub.filing_date);
                }
            }
            // For other publications, use year
            return new Date(pub.year, 0, 1); // January 1st of the year
        };
        
        const dateA = getEffectiveDate(a);
        const dateB = getEffectiveDate(b);
        
        return dateB - dateA; // Descending order (newest first)
    });
    
    filteredPublications = results;
    renderPublications();
}

function getDisplayDate(pub) {
    // Get the appropriate date for display
    if (pub.type === 'patent') {
        if (pub.grant_date) {
            // Format grant date in standard academic format
            const date = new Date(pub.grant_date);
            return `${date.getFullYear()} (${date.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
            })})`;
        } else if (pub.filing_date) {
            // Format filing date in standard academic format
            const date = new Date(pub.filing_date);
            return `${date.getFullYear()} (${date.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
            })})`;
        }
    }
    // For other publications, just show the year
    return pub.year;
}

function getPatentVenue(pub) {
    // Construct patent venue in standard academic format
    if (pub.patent_type === 'granted' && pub.patent_number) {
        if (pub.grant_date) {
            const date = new Date(pub.grant_date);
            const formattedDate = date.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric',
                year: 'numeric'
            });
            return `US Patent No. ${pub.patent_number}, ${formattedDate}`;
        } else {
            return `US Patent No. ${pub.patent_number}`;
        }
    } else if (pub.patent_type === 'application' && pub.application_number) {
        if (pub.filing_date) {
            const date = new Date(pub.filing_date);
            const formattedDate = date.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric',
                year: 'numeric'
            });
            return `US Patent App. No. ${pub.application_number}, filed on ${formattedDate}`;
        } else {
            return `US Patent App. No. ${pub.application_number}`;
        }
    } else {
        // Fallback
        return pub.venue;
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
    
    // Count publications by type first
    const typeCounts = {
        conference: 0,
        journal: 0,
        patent: 0,
        book: 0
    };
    
    // Count total publications of each type
    filteredPublications.forEach(pub => {
        typeCounts[pub.type]++;
    });
    
    // Track current count for each type (for reverse numbering)
    const currentCounts = {
        conference: 0,
        journal: 0,
        patent: 0,
        book: 0
    };
    
    publicationsList.innerHTML = filteredPublications.map((pub, index) => {
        // Increment count for this type
        currentCounts[pub.type]++;
        
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
        
        // Generate reference number in reverse order within each type
        const reverseNumber = typeCounts[pub.type] - currentCounts[pub.type] + 1;
        const refNumber = `[${pub.type.charAt(0).toUpperCase()}${String(reverseNumber).padStart(2, '0')}]`;
        
        // Generate venue abbreviation and appropriate label
        let venueAbbr = pub.venue;
        let venueLabel = 'Venue';
        
        if (pub.type === 'conference') {
            venueLabel = 'Conference';
        } else if (pub.type === 'journal') {
            venueLabel = 'Journal';
        } else if (pub.type === 'patent') {
            venueLabel = 'Patent';
        } else if (pub.type === 'book') {
            // Check if this is a book chapter (has pages) or a full book
            if (pub.venue.includes('pp.') || pub.venue.includes('(pp.')) {
                venueLabel = 'Book Chapter';
            } else {
                venueLabel = 'Book';
            }
        }
        
        if (pub.venue.includes('IEEE Transactions on Intelligent Vehicles')) {
            venueAbbr = 'IEEE Transactions on Intelligent Vehicles (T-IV)';
        } else if (pub.venue.includes('IEEE Transactions on Intelligent Transportation Systems')) {
            venueAbbr = 'IEEE Transactions on Intelligent Transportation Systems (T-ITS)';
        } else if (pub.venue.includes('IEEE Internet of Things Journal')) {
            venueAbbr = 'IEEE Internet of Things Journal (IoT-J)';
        } else if (pub.venue.includes('IEEE Transactions on Vehicular Technology')) {
            venueAbbr = 'IEEE Transactions on Vehicular Technology (TVT)';
        } else if (pub.venue.includes('IEEE Intelligent Vehicles Symposium')) {
            venueAbbr = 'IEEE Intelligent Vehicles Symposium (IV)';
        } else if (pub.venue.includes('IEEE International Conference on Intelligent Transportation Systems')) {
            venueAbbr = 'IEEE International Conference on Intelligent Transportation Systems (ITSC)';
        } else if (pub.venue.includes('US Patent Application')) {
            venueAbbr = pub.venue; // Keep full patent application number
        } else if (pub.venue.includes('US Patent')) {
            venueAbbr = pub.venue; // Keep full patent number
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
                            <p class="mb-1"><strong>${venueLabel}:</strong> ${pub.type === 'patent' ? getPatentVenue(pub) : `${venueAbbr}, ${getDisplayDate(pub)}`}${pub.note ? ` (${pub.note})` : ''}</p>
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

function copyBibTeX(id, event) {
    const pub = publications.find(p => p.id === id);
    if (!pub) return;
    
    // Generate BibTeX entry
    let bibtex = '';
    const key = `${pub.authors.split(',')[0].split(' ').pop()}${pub.year}${pub.title.split(' ').slice(0, 2).join('').replace(/[^a-zA-Z]/g, '')}`;
    
    if (pub.type === 'journal') {
        bibtex = `@article{${key},
  title={${pub.title}},
  author={${pub.authors}},
  journal={${pub.venue}},
  year={${pub.year}},
  publisher={IEEE}
}`;
    } else if (pub.type === 'conference') {
        bibtex = `@inproceedings{${key},
  title={${pub.title}},
  author={${pub.authors}},
  booktitle={${pub.venue}},
  year={${pub.year}},
  organization={IEEE}
}`;
    } else if (pub.type === 'patent') {
        bibtex = `@patent{${key},
  title={${pub.title}},
  author={${pub.authors}},
  number={${pub.venue}},
  year={${pub.year}},
  assignee={Toyota Motor North America}
}`;
    } else if (pub.type === 'book') {
        bibtex = `@book{${key},
  title={${pub.title}},
  author={${pub.authors}},
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
    if (lastUpdated) {
        const lastModified = new Date(document.lastModified);
        lastUpdated.textContent = lastModified.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
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

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
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
    if (mobileMenuBtn && mobileMenu) {
        document.addEventListener('click', (e) => {
            if (!mobileMenuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
                mobileMenu.classList.add('hidden');
            }
        });
    }
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + K for search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            if (searchInput) {
                searchInput.focus();
            }
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