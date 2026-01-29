# GenAI for CAVs Companion Website

This directory contains the companion website for the book **Generative AI for Connected and Autonomous Vehicles**.

## Site Structure

```
public/
├── index.html          # Main landing page
├── assets/
│   └── style.css       # Site stylesheet
├── code/               # Code examples and scripts
├── slides/             # Presentation slides
├── data/               # Datasets and sample data
└── README.md           # This file
```

## Deployment

This website is designed to be synced to `kt-han.github.io/public/books/genai4cav/`.

### Build Process

The website is built using the Makefile in the parent directory:

```bash
cd book/wiley-book
make build-web
```

This copies all necessary web files (HTML, CSS, JS, images) from the `web/` directory to the `public/` directory, excluding documentation files like `.tex` and `.md`.

### Manual Updates

To update the website:

1. Edit files in `book/wiley-book/web/` (the source directory)
2. Run `make build-web` to copy files to `public/`
3. Sync the `public/` directory to your GitHub Pages repository

## File Guidelines

- **HTML files**: Use semantic HTML5, ensure accessibility
- **CSS**: Keep styles in `assets/style.css` for maintainability
- **Code**: Place code examples in `code/` with clear naming
- **Slides**: Store presentation materials in `slides/`
- **Data**: Include datasets in `data/` with appropriate README files

## Notes

- This is a static HTML/CSS website (no build tools required)
- Compatible with GitHub Pages
- All links should use relative paths for portability
- External links (like Wiley instructor portal) should open in new tabs with `target="_blank"` and `rel="noopener noreferrer"`

## Future Enhancements

Potential additions:
- Individual pages for each resource section
- Search functionality
- Code syntax highlighting
- Interactive examples
- Download tracking

