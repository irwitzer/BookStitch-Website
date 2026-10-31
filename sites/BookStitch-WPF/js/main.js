"use strict";
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.getElementById('site-links');
menuButton?.addEventListener('click', () => {
  const expanded = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!expanded));
  navigation.classList.toggle('is-open', !expanded);
});
const sectionLinks = [...(navigation?.querySelectorAll('a[href^="#"]') || [])];
function markActiveSection(hash) {
  const target = sectionLinks.find(link => link.getAttribute('href') === hash);
  if (!target) return;
  sectionLinks.forEach(link => {
    const active = link === target;
    link.classList.toggle('active', active);
    if (active) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
}
for (const link of sectionLinks) {
  link.addEventListener('click', () => {
    // Keep the selected section highlighted when the mobile menu is reopened.
    markActiveSection(link.getAttribute('href'));
    navigation.classList.remove('is-open');
    menuButton?.setAttribute('aria-expanded', 'false');
  });
}
window.addEventListener('hashchange', () => markActiveSection(window.location.hash));
markActiveSection(window.location.hash || '#home');

(() => {
  const triggers = [...document.querySelectorAll('.book-trigger, [data-lantern-detail], .footer-imprint-trigger')];
  const dialog = document.getElementById('book-dialog');
  if (!triggers.length || !dialog) return;

  const image = dialog.querySelector('.book-animation-frame');
  const panel = dialog.querySelector('.book-feature-panel');
  const content = dialog.querySelector('.book-dialog-content');
  const closeButton = dialog.querySelector('.book-dialog-close');
  const titleNode = dialog.querySelector('#book-dialog-title');
  const subtitleNode = dialog.querySelector('.book-panel-subtitle');
  const columnSections = dialog.querySelectorAll('.book-panel-columns section');
  const noteNode = dialog.querySelector('.book-panel-note');

  const playerGuideColumns = [[["Audiobookshelf", "Web · Server · Android · iPhone · iPad", "Excellent audiobook support with embedded chapters, cover art, series information, and extensive metadata. Although Audiobookshelf has a dedicated Narrator field, it reads narrator information from the Composer tag rather than the separate Narrator tag in audio files. BookStitch's optional compatibility mapping addresses this difference.\n\nAudiobookshelf also supports embedded Series and Series-Part metadata, allowing audiobooks to be grouped, organized, and sorted by series and sequence number. Metadata priorities may affect which information is displayed."], ["Plex", "Web · Windows · macOS · Linux · Android · iPhone · iPad", "M4B audio playback is supported, but Plex and Plexamp do not natively provide navigation through embedded audiobook chapters, whether Nero or QuickTime. Native audiobook metadata support is also limited. Neither the dedicated Narrator tag nor the Composer tag is treated as an audiobook narrator field.\n\nPlex does not natively recognize embedded audiobook series names or sequence numbers. Series organization requires alternative methods, such as manually managed collections. Third-party players that connect to Plex, such as Prologue, provide more advanced audiobook features, including chapter navigation."], ["Apple Books", "macOS · iPhone · iPad", "Supports audiobook playback with chapters and cover art. Personal audiobooks can be imported into Apple Books on a Mac. However, specialized metadata such as ISBN and ASIN may not appear as separate fields for imported audiobooks.\n\nApple Books supports series and sequence numbers for titles published through the Apple Books Store, but automatic recognition of embedded Series and Series-Part metadata in personally imported M4B files has not been confirmed."], ["Prologue", "iPhone · iPad · Android", "A dedicated audiobook player for Plex and Audiobookshelf libraries. Supports chapter navigation, cover art, series, bookmarks, and offline listening. Requires a connected Plex or Audiobookshelf server. Metadata changes may require a library refresh before they appear."]], [["Smart AudioBook Player", "Android", "Designed for locally stored audiobooks, including M4B files with excellent chapter navigation. Offers playback speed control, bookmarks, and individual listening progress. Each audiobook must be stored in its own folder.\n\nMetadata display is limited to basic information such as title, author, and genre. Dedicated Narrator tags and most extended metadata fields are not displayed. Embedded series names and sequence numbers are also not recognized or displayed as separate metadata fields."], ["BookPlayer", "iPhone · iPad", "Open-source audiobook player supporting local file imports, chapter navigation, bookmarks, and playback speed control. Files can be imported through AirDrop or the Files app. Some chapter-display issues have been reported with particular M4B files.\n\nNative recognition and display of embedded Series and Series-Part metadata has not been confirmed."], ["Voice Audiobook Player", "Android", "Open-source player supporting M4A, M4B, MP3, and other audio formats. Provides chapter navigation, embedded cover art, bookmarks, and playback progress. Search supports titles and authors, although specialized metadata fields are not all exposed."], ["VLC Media Player", "Windows · macOS · Linux · Android · iPhone · iPad", "Plays M4A and M4B files and supports chapter navigation. However, when both Nero and QuickTime chapter lists are present, VLC may prioritize the Nero chapters. This can limit navigation to 255 chapters, even when the QuickTime chapter track contains more.\n\nBookStitch avoids this conflict by exporting new audiobooks with QuickTime chapters only."]]];
  const BOOK_DETAILS = {
    'open-imprint': {
      title: 'Imprint',
      subtitle: 'Information pursuant to Section 18 (1) of the German Interstate Media Treaty (MStV)',
      sections: [
        {heading: 'Responsible for this website', body: 'Sascha Bärtschi\nHans-Thoma-Straße 6\n14467 Potsdam\nGermany'},
        {heading: 'GitHub', body: 'github.com/irwitzer', subsections: [
          {heading: 'About this project', body: 'BookStitch is a private, non-commercial open-source project. The software is provided free of charge and is licensed under the GNU General Public License, Version 3 (GPL-3.0).'}
        ]}
      ],
      note: ''
    },
    'open-formats-book': {"title": "Formats", "subtitle": "From audio files to CDs, bring your sources together.", "sections": [{"heading": "Supported Input Formats", "blocks": [{"text": "BookStitch supports the following audio sources and formats:"}, {"label": "Sources:", "text": "Local files and folders · Audio CDs · MP3 CDs · Data CDs"}, {"label": "Audio:", "text": "MP3 · M4A · M4B · AAC · WAV · FLAC · OGG · OGA · Opus · WMA (Legacy)"}, {"heading": "Supported Input Chapter Formats"}, {"text": "Reads embedded chapters from supported audio files:"}, {"list": [{"strong": "MP4 / QuickTime", "text": " chapters (M4A, M4B)"}, {"strong": "Nero", "text": " chapters (M4A, M4B)"}, {"strong": "ID3v2 CHAP / CTOC", "text": " chapters (MP3)"}, {"strong": "FLAC", "text": " embedded chapters"}, {"strong": "OGG / OGA / Opus", "text": " embedded chapters"}, {"strong": "Automatic chapter creation", "text": " from individual audio files, including titles and filenames"}]}]}, {"heading": "Supported Output Formats", "blocks": [{"text": "Export your audiobook as AAC audio in an M4A or M4B container, with flexible quality presets."}, {"label": "Output:", "text": "M4A · M4B (AAC)"}, {"label": "Presets:", "text": "64 kbps (Mono) · 96 kbps (Mono) · 96 · 128 · 160 · 192 · 256 kbps"}, {"heading": "Supported Output Chapter Formats"}, {"list": [{"strong": "MP4 / QuickTime", "text": " embedded chapters (M4A, M4B)"}, {"text": "Chapter titles and precise timestamps"}]}]}], "note": ""},
    'open-chapter-book': {"title": "Chapter", "subtitle": "Shape clear chapters for a better listening experience.", "sections": [{"heading": "Smart Chapter Creation", "body": "Automatically detect and preserve embedded chapters, or generate chapter suggestions from track titles, tags, and filenames.\n\nSeamlessly combine audio files with embedded chapters and files containing only standard metadata tags into a single audiobook. BookStitch intelligently manages chapter structures, automatically calculates continuous chapter numbering, and keeps everything in the correct order."}, {"heading": "Custom Chapter Control", "body": "Take full control of your chapters with a powerful, customizable naming system. Build chapter titles by combining numbers, book or album titles, original or cleaned metadata tags, and filenames.\n\nDefine your own naming patterns, separators, and numbering styles. Rearrange chapters, adjust their timing, and edit individual titles. Keep existing chapters, refine automatic suggestions, or create an entirely custom chapter structure."}], "note": ""},
    'open-metadata-book': {"title": "Metadata & Cover Art", "subtitle": "Give your audiobook the details and artwork it deserves.", "sections": [{"heading": "Rich Audiobook Metadata", "blocks": [{"richText": "Take full control of your audiobook with BookStitch's comprehensive metadata editor, supporting **43 metadata fields**."}, {"text": "Edit titles, authors, narrators, series and volumes, publishers, languages, genres, ISBN, ASIN, MusicBrainz IDs, and much more."}, {"richText": "Multi-value fields support multiple authors, narrators, and other contributors, with intuitive **drag-and-drop reordering**."}, {"text": "BookStitch automatically reads existing metadata from your source files whenever available and carries your selected information into the finished audiobook."}]}, {"heading": "Cover Art Integration", "blocks": [{"text": "BookStitch automatically detects and extracts embedded cover artwork from your source files whenever available."}, {"richText": "Import images in JPEG, PNG, or WebP format, or simply **drag and drop artwork directly from your browser or other applications**."}, {"text": "Non-square images are automatically cropped to square proportions. BookStitch then converts your artwork to high-quality JPEG at **1000 × 1000, 2000 × 2000, or 3000 × 3000 pixels**, automatically selecting the appropriate resolution based on the source image.", "rich": true}, {"text": "Advanced image processing includes color-profile management, careful transparency handling, and resolution quality checks to ensure clean, consistent cover artwork."}]}], "note": ""},
    'open-tracks-book': {"title": "Smart Track Management", "subtitle": "Keep your tracks organized, reviewed, and under control.", "sections": [{"heading": "Intelligent Track Organization", "body": "Bring order to even the largest audio collections. BookStitch automatically organizes tracks using filenames, track numbers, metadata, and disc information.\n\nIts intelligent warning system detects missing or duplicate chapters, numbering gaps, incorrect track sequences, mismatches between filenames and metadata tags, and unreadable metadata. It also identifies missing, empty, invalid, or undecodable audio files, helping you catch problems early and keep your audiobook properly organized."}, {"heading": "Full Track Control", "body": "Stay in control of every track from import to export. Easily rearrange tracks, adjust titles, or exclude unwanted files without modifying your original audio.\n\nReview detected issues, fine-tune the track order, and make sure everything is exactly where it belongs before creating your finished audiobook."}], "note": ""},
    'open-passthrough-book': {"title": "Pass Through", "subtitle": "Preserve compatible audio without unnecessary re-encoding.", "sections": [{"heading": "Preserve Original Audio Quality", "blocks": [{"text": "Why re-encode audio when you don't have to? BookStitch can reuse compatible AAC audio directly, preserving the original encoded data without unnecessary conversion or additional quality loss."}, {"richText": "You can even update metadata, replace cover artwork, and edit chapters **without re-encoding the audio**. As long as the audio remains compatible with Pass-Through, the original encoded audio is preserved."}, {"text": "This saves processing time while keeping your audio exactly as it was encoded."}]}, {"heading": "Intelligent Audio Processing", "body": "BookStitch automatically checks codecs, bitrates, channels, and sample rates to determine when Pass-Through is possible. Compatible AAC tracks are preserved, while others are converted when needed.\n\nPass-Through supports sample rates of 16,000 · 22,050 · 24,000 · 32,000 · 44,100 · 48,000 · 64,000 · 88,200 · 96,000 Hz, provided the audio and export settings are compatible.\n\nAll tracks are prepared for a seamless M4A or M4B audiobook."}], "note": ""},
    'open-drive-circle-book': {"title": "Drive Circle", "subtitle": "Keep multi-disc imports organized from drive to drive.", "sections": [{"heading": "Multiple Drives, One Workflow", "body": "Take the hassle out of importing large audiobook collections. Drive Circle lets you use up to five optical drives, automatically processing discs one after another. Whether you're working with audio CDs or MP3 CDs, BookStitch keeps everything organized and reduces the need for constant disc changes."}, {"heading": "Smart Disc Recognition", "body": "BookStitch automatically identifies inserted discs and keeps track of those already processed. Intelligent detection helps prevent duplicate imports, recognizes incorrect disc types, and guides you through disc changes. Even complex multi-disc collections become a smooth, organized workflow from the first disc to the last."}], "note": ""},
    'open-project-book': {"title": "Project", "subtitle": "Keep your projects ready to revisit, refine, expand, and re-export.", "sections": [{"heading": "Your Audiobook Project Library", "body": "Keep all your audiobook projects organized and accessible in one place. BookStitch preserves your original source audio, tracks, chapters, metadata, cover artwork, and export settings, allowing you to return to your work whenever needed.\n\nFor audio CDs, source audio is retained in FLAC format. MP3 and data CD projects preserve the original audio files at their source quality, providing a reliable foundation for future exports.\n\nProjects are retained for 180 days by default, with a configurable retention period of up to 360 days."}, {"heading": "Review, Refine & Re-Export", "blocks": [{"text": "Your finished audiobook is never the end of the story. Reopen any project to update metadata, replace cover artwork, refine chapters, or rearrange tracks. You can even expand existing projects with additional audio files, new CDs, or newly released content."}, {"richText": "Want a different audio quality? Simply select another export preset and create a new M4A or M4B audiobook directly from the preserved source audio, **without re-encoding an already compressed export or starting from scratch**."}, {"text": "Experiment with different bitrates, make adjustments, and re-export as often as you like. Pause and resume your work whenever needed, keeping full control of your audiobook projects."}]}], "note": ""},
    'open-shadow-lantern': {
      "title": "Zero Bullshit",
      "subtitle": "Your Files. Your Rules. No Bullshit.",
      "sections": [
        {
          "heading": "Your Files Stay Yours",
          "body": "BookStitch only reads your original audio files. It never modifies, renames, moves, deletes, or overwrites them. All conversion, editing, and export operations use separate project and output files. Your original collection remains untouched and protected.",
          "extraHeading": "Privacy by Design",
          "extraBody": "No account, no sign-in, no advertising, no tracking, no telemetry, and no subscriptions. BookStitch does not collect usage data or upload your audio files, metadata, cover art, or project information. Your audiobook projects stay on your own computer."
        },
        {
          "heading": "Offline & Transparent Processing",
          "body": "BookStitch uses conventional audio-processing algorithms powered by FFmpeg and FFprobe. Core audiobook processing requires neither artificial intelligence nor cloud services. Once the required tools are installed, audiobook creation works entirely offline. Internet access is only needed for activities such as downloading tools, installing updates, or opening external links.",
          "extraHeading": "Open Source, Open Formats",
          "extraBody": "BookStitch is open-source software licensed under GNU GPL v3.0-only. Its source code is publicly available for inspection, modification, and redistribution under the license terms. Finished audiobooks use standard M4A or M4B containers with AAC audio, without proprietary file formats or vendor lock-in."
        }
      ],
      "note": ""
    },
    'open-antique-projector': {
    "title": "Player Compatibility",
    "subtitle": "Your audiobook. Your player. Your choice.",
    "sections": [
        {
            "heading": "Built for Broad Compatibility",
            "body": "BookStitch creates M4A and M4B audiobooks with AAC audio, embedded cover artwork, rich metadata, and QuickTime chapters.\n\nBecause audiobook players handle metadata differently, BookStitch includes intelligent compatibility features to make your audiobook information more accessible across different applications."
        },
        {
            "heading": "Smart Metadata Compatibility",
            "body": "BookStitch can include essential audiobook details, such as title, author, narrator, series, language, duration, and chapter count, in the standard Description field. This helps keep important information accessible even when a player does not recognize specialized metadata fields.\n\nFor players that use the Composer field to identify narrators, BookStitch can automatically copy narrator information into that field while preserving the dedicated narrator metadata.\n\nBoth compatibility features can be configured or disabled in the metadata settings.\n\nFor detailed information about individual applications, supported features, and known limitations, explore the Compatibility Guide below."
        }
    ],
    "note": ""
},
    'open-shadow-projector': { title:'Shadow Projector', subtitle:'', sections:[{heading:'',body:''},{heading:'',body:''}],note:'' },
    'open-export-book': {"title": "M4A & M4B Export", "subtitle": "Create beautiful audiobooks for your personal collection, ready to enjoy for years to come.", "sections": [{"heading": "One Complete Audiobook", "body": "Turn hundreds of individual audio tracks into a single, beautifully organized audiobook.\n\nBookStitch brings everything together in an M4A or M4B file, complete with precisely timed chapters, embedded cover artwork, and carefully prepared metadata.\n\nUsing widely supported AAC audio and the established MP4/QuickTime chapter format, your finished audiobooks are ready for compatible players on iPhone, Android, and other devices.\n\nCreate a polished, lasting audiobook collection that is easy to organize, navigate, and enjoy."}, {"heading": "Flexible, High-Quality Export", "blocks": [{"richText": "Choose the format and audio quality that best suit your needs. BookStitch offers flexible AAC encoding presets ranging from **64 kbps mono to 256 kbps stereo**, giving you control over sound quality and file size."}, {"text": "Audio tracks are carefully processed and combined, with chapter timestamps verified to within 0.5 milliseconds in testing and consistent metadata throughout the finished audiobook."}, {"text": "Whether you're preserving a favorite story or building an extensive audiobook library, BookStitch helps you create high-quality files you'll enjoy returning to again and again."}]}], "note": ""},
  };

  syncOverviewCatchphrases();

  let active = false;
  let ghost = null;
  let animation = null;
  let focusBefore = null;
  let activeTrigger = null;
  let serial = 0;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const targetSize = () => Math.min(window.innerWidth * 0.32, window.innerHeight * 0.26, 215);

  function syncOverviewCatchphrases() {
    triggers.forEach(trigger => {
      const details = BOOK_DETAILS[trigger.id];
      const desc = trigger.querySelector('.book-trigger-desc');
      if (details && desc) desc.textContent = details.subtitle;
    });
  }

  function alignFormatsChapterHeadings() {
    const subheads = Array.from(columnSections, section => section.querySelector('.book-formats-subheading'));
    subheads.forEach(node => { if (node) node.style.marginTop = ''; });
    // On mobile the columns are stacked; never introduce alignment whitespace.
    if (window.matchMedia('(max-width:600px)').matches) return;
    const visible = subheads.filter(Boolean);
    if (visible.length < 2) return;
    const tops = visible.map(node => node.getBoundingClientRect().top);
    const targetTop = Math.max(...tops);
    visible.forEach((node, index) => {
      const offset = targetTop - tops[index];
      if (offset > 1) node.style.marginTop = `${Math.ceil(offset)}px`;
    });
  }

  function setPanelCopy(triggerId) {
    const details = BOOK_DETAILS[triggerId] || BOOK_DETAILS['open-formats-book'];
    titleNode.textContent = details.title;
    subtitleNode.textContent = details.subtitle;
    details.sections.forEach((section, index) => {
      const container = columnSections[index];
      if (!container) return;
      // All feature text is inserted as text nodes, not untrusted HTML.
      container.replaceChildren();
      const heading = document.createElement('h3');
      heading.textContent = section.heading;
      container.appendChild(heading);
      for (const block of section.blocks || [{ text: section.body }]) {
        if (block.heading) {
          const subheading = document.createElement('h4');
          subheading.className = 'book-formats-subheading';
          subheading.textContent = block.heading;
          container.appendChild(subheading);
          continue;
        }
        if (block.list) {
          const list = document.createElement('ul');
          list.className = 'book-formats-list';
          block.list.forEach(item => {
            const li = document.createElement('li');
            if (item.strong) {
              const bold = document.createElement('strong');
              bold.textContent = item.strong;
              li.appendChild(bold);
            }
            li.appendChild(document.createTextNode(item.text || ''));
            list.appendChild(li);
          });
          container.appendChild(list);
          continue;
        }
        const paragraphs = (block.richText || block.text).split(/\n\n/);
        for (const paragraphText of paragraphs) {
        const paragraph = document.createElement('p');
        if (block.label) {
          const label = document.createElement('strong');
          label.textContent = block.label + ' ';
          paragraph.appendChild(label);
        }
        if (block.strong) {
          const strong = document.createElement('strong');
          strong.textContent = paragraphText;
          paragraph.appendChild(strong);
        } else if (block.richText || block.rich) {
          paragraphText.split(/(\*\*[^*]+\*\*)/g).forEach(part => {
            if (part.startsWith('**') && part.endsWith('**')) {
              const strong = document.createElement('strong');
              strong.textContent = part.slice(2, -2);
              paragraph.appendChild(strong);
            } else if (part) {
              paragraph.appendChild(document.createTextNode(part));
            }
          });
        } else {
          paragraph.appendChild(document.createTextNode(paragraphText));
        }
        if (triggerId === 'open-imprint' && index === 0) paragraph.classList.add('imprint-address');
        container.appendChild(paragraph);
        }
      }
      // V89: contextual shortcuts to the nested download-samples view.
      // The link uses the same deep-link handler as an external #download-samples URL.
      const sampleLinkColumn = {};
      if (sampleLinkColumn[triggerId] === index) {
        const sampleLink = document.createElement('a');
        sampleLink.href = '#download-samples';
        sampleLink.className = 'book-sample-shortcut';
        sampleLink.textContent = 'Download BookStitch Sample Audiobook';
        sampleLink.setAttribute('aria-label', 'Open Download Samples');
        container.appendChild(sampleLink);
      }
      if (triggerId === 'open-imprint' && index === 1) {
        const githubParagraph = container.querySelector('p');
        if (githubParagraph) {
          const link = document.createElement('a');
          link.href = 'https://github.com/irwitzer';
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
          link.textContent = 'https://github.com/irwitzer';
          githubParagraph.replaceChildren(link);
        }
      }
      // Optional additional headings and paragraphs for longer detail panels.
      for (const part of section.subsections || []) {
        const subheading = document.createElement('h3');
        subheading.textContent = part.heading;
        subheading.className = 'lantern-extra-heading';
        container.appendChild(subheading);
        if (part.body) {
          for (const paragraphText of part.body.split(/\n\n/)) {
            const paragraph = document.createElement('p');
            paragraph.textContent = paragraphText;
            container.appendChild(paragraph);
          }
        }
      }
      if (section.extraHeading && section.extraBody) {
        const extraTitle = document.createElement('h3');
        extraTitle.textContent = section.extraHeading;
        extraTitle.className = 'lantern-extra-heading';
        const extraPara = document.createElement('p');
        extraPara.textContent = section.extraBody;
        container.append(extraTitle, extraPara);
      }
    });
    if (triggerId === 'open-antique-projector') {
      // V2.7: the compatibility guide is part of the Antique Projector,
      // following the original two-column compatibility introduction.
      const guideBlock = document.createElement('div');
      guideBlock.className = 'combined-player-guide';

      const guideHeading = document.createElement('div');
      guideHeading.className = 'combined-player-guide-heading';
      const ornament = document.createElement('span');
      ornament.className = 'combined-player-ornament';
      ornament.setAttribute('aria-hidden', 'true');
      ornament.textContent = '✦';
      const h2 = document.createElement('h2');
      h2.textContent = 'Player Compatibility Guide';
      const subtitle = document.createElement('p');
      subtitle.textContent = 'How Different Players Handle Your Audiobooks';
      guideHeading.append(ornament, h2, subtitle);
      guideBlock.appendChild(guideHeading);

      const guideColumns = document.createElement('div');
      guideColumns.className = 'book-panel-columns combined-player-guide-columns';
      playerGuideColumns.forEach(items => {
        const col = document.createElement('section');
        items.forEach(([heading, platforms, body]) => {
          const h3 = document.createElement('h3');
          h3.textContent = heading;
          const platformsNode = document.createElement('p');
          platformsNode.className = 'player-guide-platforms';
          platformsNode.textContent = platforms;
          col.append(h3, platformsNode);
          body.split(/\\n\\n/).forEach(text => {
            const p = document.createElement('p');
            p.textContent = text;
            col.appendChild(p);
          });
        });
        guideColumns.appendChild(col);
      });
      guideBlock.appendChild(guideColumns);

      const notice = document.createElement('section');
      notice.className = 'player-guide-notice';
      const heading = document.createElement('h3');
      heading.textContent = 'Compatibility Notice';
      notice.appendChild(heading);
      [
        'This information is based on official documentation, published reports, and hands-on testing of several players. Player compatibility can change as applications receive updates, fixing existing issues or occasionally introducing new ones.',
        'The best way to check compatibility is to try it yourself. Download our sample audiobooks and see how your preferred player handles chapters, cover art, and metadata.'
      ].forEach(text => {
        const p = document.createElement('p');
        p.textContent = text;
        notice.appendChild(p);
      });
      guideBlock.appendChild(notice);

      const sampleCallout = document.createElement('div');
      sampleCallout.className = 'player-samples-callout';
      const sampleLink = document.createElement('a');
      sampleLink.href = '#download-samples';
      sampleLink.className = 'player-samples-link gramophone-guide-trigger';
      sampleLink.setAttribute('aria-label', 'Open Download Samples: Alice in Wonderland and Sherlock Holmes');
      const gramophone = document.createElement('img');
      gramophone.src = 'assets/gramophone-compatibility-v72.webp';
      gramophone.alt = '';
      gramophone.width = 112;
      gramophone.height = 112;
      gramophone.decoding = 'async';
      const label = document.createElement('span');
      label.textContent = 'Download Samples';
      sampleLink.append(gramophone, label);
      sampleCallout.appendChild(sampleLink);
      guideBlock.appendChild(sampleCallout);
      noteNode.replaceChildren(guideBlock);
    } else if (triggerId === 'open-chapter-book') {
      // Centered invitation follows both unchanged Chapter text columns.
      const invitation = document.createElement('div');
      invitation.className = 'chapter-samples-invitation';
      const explanation = document.createElement('p');
      explanation.textContent = 'Check whether your favorite player supports audiobook chapters.';
      const sampleLink = document.createElement('a');
      sampleLink.href = '#download-samples';
      sampleLink.className = 'book-sample-shortcut';
      sampleLink.textContent = 'Download BookStitch Sample Audiobook';
      sampleLink.setAttribute('aria-label', 'Open Download Samples');
      invitation.append(explanation, sampleLink);
      noteNode.replaceChildren(invitation);
    } else if (triggerId === 'open-metadata-book') {
      // Centered invitation follows both unchanged Metadata & Cover Art columns.
      const invitation = document.createElement('div');
      invitation.className = 'chapter-samples-invitation';
      const explanation = document.createElement('p');
      explanation.textContent = 'Check whether your favorite player supports metadata and cover art.';
      const sampleLink = document.createElement('a');
      sampleLink.href = '#download-samples';
      sampleLink.className = 'book-sample-shortcut';
      sampleLink.textContent = 'Download BookStitch Sample Audiobook';
      sampleLink.setAttribute('aria-label', 'Open Download Samples');
      invitation.append(explanation, sampleLink);
      noteNode.replaceChildren(invitation);
    } else if (triggerId === 'open-shadow-projector') {
      // Reserved for future content. Keep the Shadow Projector clickable.
      columnSections.forEach(section => section.replaceChildren());
      noteNode.replaceChildren();
    } else {
      noteNode.textContent = details.note;
    }
  }

  function clearGhost() {
    if (animation) {
      animation.cancel();
      animation = null;
    }
    if (ghost) {
      ghost.remove();
      ghost = null;
    }
    if (activeTrigger) {
      const sourceImg = activeTrigger.querySelector('.step-icon-book img, .lantern-visual img, .footer-star-wrap img');
      if (sourceImg) sourceImg.style.visibility = '';
    }
  }

  // V83 — stable deep links for the eight books, four Magic devices and nested samples.
  const DETAILS_BY_HASH = Object.freeze({
    formats:'open-formats-book', chapter:'open-chapter-book',
    metadata:'open-metadata-book', 'smart-track-management':'open-tracks-book',
    'pass-through':'open-passthrough-book', 'drive-circle':'open-drive-circle-book',
    project:'open-project-book', export:'open-export-book',
    'shadow-lantern':'open-shadow-lantern',
    'antique-projector':'open-antique-projector',
    'shadow-projector':'open-shadow-projector'
  });
  const HASH_BY_TRIGGER = Object.fromEntries(Object.entries(DETAILS_BY_HASH).map(([hash,id])=>[id,'#'+hash]));
  function hashForTrigger(id) { return HASH_BY_TRIGGER[id] || '#imprint'; }
  function detailHash() {
    const key = decodeURIComponent(location.hash.slice(1)).toLowerCase();
    return key === 'download-samples' || key === 'imprint' || Object.hasOwn(DETAILS_BY_HASH,key);
  }
  function setDetailHash(hash) {
    if (location.hash === hash) return;
    history.pushState({bookStitchDetail:true},'',hash);
    markActiveSection(hash === '#imprint' ? '#home' : (hash === '#download-samples' || hash.includes('lantern') || hash.includes('projector') ? '#magic' : '#features'));
  }
  function navigateToDefault(trigger) {
    const target = trigger?.hasAttribute('data-lantern-detail') ? '#magic'
      : trigger?.id === 'open-imprint' ? '#home' : '#features';
    history.replaceState(null,'',target);
    markActiveSection(target);
  }
  let syncingUrl = false;
  async function syncDetailsFromUrl() {
    if (syncingUrl) return;
    syncingUrl = true;
    try {
      const key = decodeURIComponent(location.hash.slice(1)).toLowerCase();
      const nested = key === 'download-samples';
      if (key === 'magic-lantern') {
        if (guideActive) closeGuide({keepHash:true});
        if (active) close({keepHash:true});
        return; // The screenshot gallery maintains its own deep-link handler.
      }
      const id = nested ? DETAILS_BY_HASH['antique-projector'] : key === 'imprint' ? 'open-imprint' : DETAILS_BY_HASH[key];
      if (!id) {
        if (guideActive) closeGuide({keepHash:true});
        if (active) close({keepHash:true});
        return;
      }
      const trigger = document.getElementById(id);
      if (!trigger) return;
      if (guideActive && !nested) closeGuide({keepHash:true});
      if (active && activeTrigger?.id !== id) close({keepHash:true});
      if (!active) await open(trigger,{fromUrl:true,instant:true});
      if (nested && !guideActive) {
        const gramophone = dialog.querySelector('.gramophone-guide-trigger');
        if (gramophone) await openGuide(gramophone,{fromUrl:true,instant:true});
      }
      markActiveSection(id.includes('book') ? '#features' : id === 'open-imprint' ? '#home' : '#magic');
    } finally { syncingUrl = false; }
  }
  function close(options = {}) {
    if (!options.keepHash && detailHash()) navigateToDefault(activeTrigger);
    serial++;
    clearGhost();
    active = false;
    dialog.hidden = true;
    dialog.setAttribute('aria-hidden', 'true');
    dialog.classList.remove('is-ready', 'is-lantern-detail', 'is-imprint-detail');
    panel.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('book-dialog-visible');
    activeTrigger = null;
    if (focusBefore?.isConnected) focusBefore.focus();
  }

  async function open(trigger, options = {}) {
    if (active) return;
    active = true;
    activeTrigger = trigger;
    const token = ++serial;
    focusBefore = options.fromUrl ? null : document.activeElement;
    if (!options.fromUrl) setDetailHash(hashForTrigger(trigger.id));
    const source = trigger.querySelector('.step-icon-book img, .lantern-visual img, .footer-star-wrap img');
    const bookSrc = source?.currentSrc || source?.src;
    if (!bookSrc || !source) { active = false; return; }

    dialog.dataset.detailTrigger = trigger.id;
    dialog.classList.toggle('is-lantern-detail', trigger.hasAttribute('data-lantern-detail') || trigger.id === 'open-imprint');
    dialog.classList.toggle('is-imprint-detail', trigger.id === 'open-imprint');
    setPanelCopy(trigger.id);
    const detailScroller = panel.querySelector('.book-panel-scroll');
    detailScroller.scrollTop = 0;
    image.src = bookSrc;
    image.alt = '';
    dialog.hidden = false;
    dialog.setAttribute('aria-hidden', 'false');
    detailScroller.scrollTop = 0;
    dialog.classList.remove('is-ready');
    panel.setAttribute('aria-hidden', 'true');
    document.body.classList.add('book-dialog-visible');
    dialog.style.setProperty('--detail-book-size', targetSize() + 'px');
    content.focus();

    if (!options.instant && !reducedMotion.matches) {
      const original = source.getBoundingClientRect();
      ghost = document.createElement('img');
      ghost.src = bookSrc;
      ghost.alt = '';
      ghost.setAttribute('aria-hidden', 'true');
      Object.assign(ghost.style, {
        position: 'fixed',
        left: original.left + 'px',
        top: original.top + 'px',
        width: original.width + 'px',
        height: original.height + 'px',
        objectFit: 'contain',
        pointerEvents: 'none',
        zIndex: '1002',
        transformOrigin: 'top left',
        filter: 'drop-shadow(0 16px 34px rgba(0,0,0,.58))',
      });
      document.body.appendChild(ghost);
      source.style.visibility = 'hidden';
      const landing = image.getBoundingClientRect();
      // Uniform scale preserves the artwork proportions. Position the flying
      // bitmap by its center so it lands precisely on the destination image.
      const scale = Math.min(landing.width / original.width, landing.height / original.height);
      const dx = landing.left + landing.width / 2 - original.left - original.width * scale / 2;
      const dy = landing.top + landing.height / 2 - original.top - original.height * scale / 2;
      animation = ghost.animate(
        [
          { transform: 'translate(0,0) scale(1)', opacity: 1 },
          { transform: `translate(${dx}px,${dy}px) scale(${scale})`, opacity: 1 }
        ],
        { duration: 820, easing: 'cubic-bezier(.23,.78,.25,1)', fill: 'forwards' }
      );
      try {
        await animation.finished;
      } catch (_) {
        return;
      }
      if (serial !== token) return;
      clearGhost();
    }

    if (serial !== token) return;
    dialog.classList.add('is-ready');
    panel.setAttribute('aria-hidden', 'false');
    detailScroller.scrollTop = 0;
    if (trigger.id === 'open-formats-book') requestAnimationFrame(alignFormatsChapterHeadings);
    closeButton.focus({preventScroll: true});
  }

  // V72: Nested compatibility guide, using a separate detail panel.
  // Closing it returns to the exact parent-panel scroll position.
  const guideDialog = dialog.cloneNode(true);
  guideDialog.id = 'gramophone-dialog';
  guideDialog.setAttribute('aria-labelledby', 'gramophone-dialog-title');
  guideDialog.classList.add('is-lantern-detail');
  guideDialog.querySelector('#book-dialog-title').id = 'gramophone-dialog-title';
  guideDialog.querySelector('.book-dialog-close').setAttribute('aria-label', 'Return to Player Compatibility Guide');
  guideDialog.querySelector('.book-animation-frame').src = 'assets/gramophone-compatibility-v72.webp';
  guideDialog.querySelector('.book-animation-frame').setAttribute('width', '1180');
  guideDialog.querySelector('.book-animation-frame').setAttribute('height', '1333');
  guideDialog.querySelector('#gramophone-dialog-title').textContent = 'Download Samples';
  guideDialog.querySelector('.book-panel-subtitle').textContent = 'Experience BookStitch in your favorite player.';

  const sampleColumns = guideDialog.querySelectorAll('.book-panel-columns section');
  sampleColumns.forEach(section => section.replaceChildren());
  function sampleHeading(parent, text, className = '') {
    const heading = document.createElement('h3');
    heading.textContent = text;
    if (className) heading.className = className;
    parent.appendChild(heading);
  }
  function sampleParagraph(parent, text, className = '') {
    const paragraph = document.createElement('p');
    paragraph.textContent = text;
    if (className) paragraph.className = className;
    parent.appendChild(paragraph);
  }
  // First column: Alice's Adventures in Wonderland reference sample (download URLs to follow).
  const alice = sampleColumns[0];
  sampleHeading(alice, "Alice's Adventures in Wonderland");
  sampleParagraph(alice, 'Lewis Carroll · Narrated by Kara Shallenberg · LibriVox Version 2', 'sample-byline');
  sampleParagraph(alice, 'A complete audiobook created with BookStitch from 12 original LibriVox audio tracks. The M4A file includes 12 embedded chapters, cover art, and extensive metadata, including authors, narrators, series information, publication details, and compatibility fields.');
  const aliceMulti = document.createElement('p');
  aliceMulti.append('This sample also includes ');
  const aliceMultiBold = document.createElement('strong');
  aliceMultiBold.textContent = 'multi-value metadata';
  aliceMulti.append(aliceMultiBold, ', with two authors, two narrators, three genres, and 14 separate keywords. Additional author and narrator entries are clearly marked as test values. BookStitch lets you arrange these values in your preferred order, while preserving the complete metadata. Some players display only the first value, even when multiple entries are stored in the file.');
  alice.appendChild(aliceMulti);
  sampleParagraph(alice, 'Download the audiobook to explore how your preferred player handles chapters, artwork, and metadata. The accompanying reference file lists the configured values, allowing you to compare them with what your player actually displays.');
  sampleHeading(alice, 'Audiobook Details', 'sample-subheading');
  const aliceFacts = [
    ['Title', "Alice's Adventures in Wonderland"],
    ['Author', 'Lewis Carroll (+ test value)'],
    ['Narrator', 'Kara Shallenberg (+ test value)'],
    ['Publisher', 'LibriVox'],
    ['Release Year', '2010'],
    ['Language', 'English'],
    ['Genres', "Audiobook · Fantasy · Children's Literature"],
    ['Series', 'Alice in Wonderland · Book 1'],
    ['Duration', '2h 47m 24s'],
    ['Chapters', '12'],
    ['Format', 'M4A · AAC Mono · 64 kbps'],
    ['File Size', '81.2 MB']
  ];
  const aliceFactsList = document.createElement('dl');
  aliceFactsList.className = 'sample-details-list';
  aliceFacts.forEach(([name,value]) => {
    const pair = document.createElement('div');
    const dt = document.createElement('dt'); dt.textContent = name + ':';
    const dd = document.createElement('dd'); dd.textContent = value;
    pair.append(dt,dd);
    aliceFactsList.appendChild(pair);
  });
  alice.appendChild(aliceFactsList);
  const aliceLinks = document.createElement('div');
  aliceLinks.className = 'sample-download-actions';
  [
    ['Download Audiobook (M4A)', 'https://github.com/irwitzer/BookStitch-Samples/releases/download/samples-v1/Lewis.Carroll.-.Alice.s.Adventures.in.Wonderland.m4a'],
    ['Download Full Metadata Reference (TXT)', 'https://github.com/irwitzer/BookStitch-Samples/releases/download/samples-v1/Lewis.Carroll.-.Alice.s.Adventures.in.Wonderland.Metadata-Reference.txt']
  ].forEach(([label, url]) => {
    const link = document.createElement('a');
    link.className = 'sample-download-link';
    link.href = url;
    link.textContent = label;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    aliceLinks.appendChild(link);
  });
  alice.appendChild(aliceLinks);
  sampleParagraph(alice, 'Some contributor entries and catalog identifiers are intentionally included for compatibility testing and do not represent actual contributors or identifiers of this specific recording. See the metadata reference for details.', 'sample-disclaimer');

  // Second column: Sherlock Holmes reference sample (links to follow).
  const sherlock = sampleColumns[1];
  sampleHeading(sherlock, 'The Adventures of Sherlock Holmes');
  sampleParagraph(sherlock, 'Arthur Conan Doyle · Narrated by StudioMike · LibriVox Version 5', 'sample-byline');
  sampleParagraph(sherlock, 'A complete audiobook created with BookStitch from 14 original LibriVox audio tracks. The finished M4B file contains 14 embedded chapters, cover art, and extensive metadata, including authors, narrators, series information, publication details, and compatibility fields.');
  const multi = document.createElement('p');
  multi.append('This sample also includes ');
  const multiBold = document.createElement('strong');
  multiBold.textContent = 'multi-value metadata';
  multi.append(multiBold, ', with two authors, two narrators, three genres, and 13 separate keywords. Additional author and narrator entries are clearly marked as test values. BookStitch lets you arrange these values in your preferred order, while preserving the complete metadata. Some players display only the first value, even when multiple entries are stored in the file.');
  sherlock.appendChild(multi);
  sampleParagraph(sherlock, 'Download the audiobook to explore how your preferred player handles chapters, artwork, and metadata. The accompanying reference file lists the configured values, allowing you to compare them with what your player actually displays.');
  sampleHeading(sherlock, 'Audiobook Details', 'sample-subheading');
  const sampleFacts = [
    ['Title', 'The Adventures of Sherlock Holmes'],
    ['Author', 'Arthur Conan Doyle (+ test value)'],
    ['Narrator', 'StudioMike (+ test value)'],
    ['Publisher', 'LibriVox'],
    ['Release Year', '2019'],
    ['Language', 'English'],
    ['Genres', 'Audiobook · Mystery · Detective Fiction'],
    ['Series', 'Sherlock Holmes · Book 3'],
    ['Duration', '9h 35m 41s'],
    ['Chapters', '14'],
    ['Format', 'M4B · AAC'],
    ['File Size', 'Approx. 400 MB']
  ];
  const facts = document.createElement('dl');
  facts.className = 'sample-details-list';
  sampleFacts.forEach(([name,value]) => {
    const pair = document.createElement('div');
    const dt = document.createElement('dt'); dt.textContent = name + ':';
    const dd = document.createElement('dd'); dd.textContent = value;
    pair.append(dt,dd);
    facts.appendChild(pair);
  });
  sherlock.appendChild(facts);
  const links = document.createElement('div');
  links.className = 'sample-download-actions';
  [
    ['Download Audiobook (M4B)', 'https://github.com/irwitzer/BookStitch-Samples/releases/download/samples-v1/Arthur.Conan.Doyle.-.The.Adventures.of.Sherlock.Holmes.m4b'],
    ['Download Full Metadata Reference (TXT)', 'https://github.com/irwitzer/BookStitch-Samples/releases/download/samples-v1/Arthur.Conan.Doyle.-.The.Adventures.of.Sherlock.Holmes.Metadata-Reference.txt']
  ].forEach(([label, url]) => {
    const link = document.createElement('a');
    link.className = 'sample-download-link';
    link.href = url;
    link.textContent = label;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    links.appendChild(link);
  });
  sherlock.appendChild(links);
  sampleParagraph(sherlock, 'Some contributor entries and catalog identifiers are intentionally included for compatibility testing and do not represent actual contributors or identifiers of this specific recording. See the metadata reference for details.', 'sample-disclaimer');
  guideDialog.querySelector('.book-panel-note').textContent = '';
  guideDialog.hidden = true;
  guideDialog.setAttribute('aria-hidden','true');
  dialog.after(guideDialog);
  const guideContent = guideDialog.querySelector('.book-dialog-content');
  let guideActive = false;
  let guideReturnFocus = null;
  function closeGuide(options = {}) {
    if (!options.keepHash) setDetailHash('#antique-projector');
    if (!guideActive) return;
    guideActive = false;
    guideDialog.hidden = true;
    guideDialog.classList.remove('is-ready');
    guideDialog.setAttribute('aria-hidden','true');
    dialog.removeAttribute('aria-hidden');
    if (guideReturnFocus?.isConnected) guideReturnFocus.focus({preventScroll:true});
  }
  async function openGuide(trigger, options = {}) {
    if (!trigger || guideActive) return;
    if (!options.fromUrl) setDetailHash('#download-samples');
    guideActive = true;
    guideReturnFocus = trigger;
    dialog.setAttribute('aria-hidden','true');
    guideDialog.hidden = false;
    guideDialog.querySelector('.book-panel-scroll').scrollTop = 0;
    guideDialog.classList.remove('is-ready');
    guideDialog.setAttribute('aria-hidden','false');
    guideDialog.style.setProperty('--detail-book-size', targetSize()+'px');
    guideContent.focus({preventScroll:true});
    const source = trigger.querySelector('img');
    const destination = guideDialog.querySelector('.book-animation-frame');
    if (!options.instant && !reducedMotion.matches && source?.animate) {
      const from = source.getBoundingClientRect();
      const to = destination.getBoundingClientRect();
      // Position-preserving image flight, as used for feature books.
      const flying = source.cloneNode();
      Object.assign(flying.style,{
        position:'fixed',left:from.left+'px',top:from.top+'px',
        width:from.width+'px',height:from.height+'px',
        objectFit:'contain',zIndex:'1102',pointerEvents:'none',
        transformOrigin:'top left'
      });
      document.body.append(flying);
      // Preserve aspect ratio throughout the nested gramophone flight.
      const scale = Math.min(to.width / from.width, to.height / from.height);
      const dx = to.left + to.width/2 - from.left - from.width*scale/2;
      const dy = to.top + to.height/2 - from.top - from.height*scale/2;
      const a = flying.animate([
        {transform:'translate(0,0) scale(1)'},
        {transform:`translate(${dx}px,${dy}px) scale(${scale})`}
      ],{duration:550,easing:'cubic-bezier(.23,.78,.25,1)'});
      try { await a.finished; } catch (_) {}
      flying.remove();
    }
    if (guideActive) {
      guideDialog.classList.add('is-ready');
      guideDialog.querySelector('.book-panel-scroll').scrollTop = 0;
    }
    guideDialog.querySelector('.book-dialog-close').focus({preventScroll:true});
  }
  dialog.addEventListener('click', event => {
    const trigger = event.target.closest('.gramophone-guide-trigger');
    if (trigger) { event.preventDefault(); void openGuide(trigger); }
  });
  guideDialog.querySelectorAll('[data-book-close]').forEach(node=>node.addEventListener('click',closeGuide));
  document.addEventListener('keydown',event=>{
    if (guideActive && event.key==='Escape') {
      event.preventDefault();
      event.stopImmediatePropagation();
      closeGuide();
    }
  },true);
  window.addEventListener('resize',()=>{
    if (guideActive) guideDialog.style.setProperty('--detail-book-size',targetSize()+'px');
    if (active && activeTrigger?.id === 'open-formats-book') {
      requestAnimationFrame(alignFormatsChapterHeadings);
    }
  });

  triggers.forEach(trigger => trigger.addEventListener('click', () => open(trigger)));
  window.addEventListener('popstate', () => { void syncDetailsFromUrl(); });
  window.addEventListener('hashchange', () => { void syncDetailsFromUrl(); });
  void syncDetailsFromUrl();
  dialog.querySelectorAll('[data-book-close]').forEach(node => node.addEventListener('click', close));
  window.addEventListener('resize', () => {
    if (!dialog.hidden) dialog.style.setProperty('--detail-book-size', targetSize() + 'px');
  });
  document.addEventListener('keydown', event => {
    if (!active) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
    }
  });
})();

// V36: randomly timed glow groups remain, and overview catchphrases are synced to the popup subtitles.
(() => {
  const books = [...document.querySelectorAll('.workflow .book-trigger')];
  if (!books.length) return;
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const active = new Set();
  const pulseDuration = 1450;
  let timer;

  function pulse() {
    if (!document.hidden && !document.body.classList.contains('book-dialog-visible') && !motionPreference.matches) {
      const available = books.filter(book => !active.has(book));
      // Usually one or two, sometimes three, rarely four at the same time.
      const roll = Math.random();
      const requested = roll < .47 ? 1 : roll < .82 ? 2 : roll < .96 ? 3 : 4;
      const count = Math.min(requested, available.length, 4 - active.size);
      for (let i = 0; i < count; i++) {
        const index = Math.floor(Math.random() * available.length);
        const book = available.splice(index, 1)[0];
        active.add(book);
        book.classList.add('is-pulsing');
        window.setTimeout(() => {
          book.classList.remove('is-pulsing');
          active.delete(book);
        }, pulseDuration);
      }
    }
    // Slower and nonperiodic compared with V34's fixed one-second rotation.
    timer = window.setTimeout(pulse, 1900 + Math.random() * 1600);
  }
  timer = window.setTimeout(pulse, 1300 + Math.random() * 1600);
  motionPreference.addEventListener?.('change', () => {
    if (motionPreference.matches) {
      for (const book of active) book.classList.remove('is-pulsing');
      active.clear();
    }
  });
})();


// V51: Three Magic triggers all reveal the screenshot gallery.
(() => {
  const triggers=[...document.querySelectorAll('[data-gallery-trigger]')];
  const dialog=document.querySelector('#gallery-dialog');
  if(!triggers.length||!dialog)return;
  const slides=[
    {title:'Main Window — Sherlock Holmes',desc:'Sherlock Holmes audiobook prepared in BookStitch.',src:'assets/screenshot-01-v86.webp',alt:'Sherlock Holmes audiobook prepared in BookStitch.',width:1251,height:861},
    {title:'Metadata — Sherlock Holmes',desc:'Sherlock Holmes multi-value metadata in the editor.',src:'assets/screenshot-02-v86.webp',alt:'Sherlock Holmes multi-value metadata in the editor.',width:1252,height:860},
    {title:'Drive Circle Settings',desc:'Drive Circle settings with connected optical drives.',src:'assets/screenshot-03-v86.webp',alt:'Drive Circle settings with connected optical drives.',width:1254,height:862},
    {title:'Project Library — Alice in Wonderland',desc:'Resume or manage the Alice in Wonderland audiobook project.',src:'assets/screenshot-04-v86.webp',alt:'Resume or manage the Alice in Wonderland audiobook project.',width:1252,height:864},
    {title:'Application Information',desc:'BookStitch application information in the light theme.',src:'assets/screenshot-05-v86.webp',alt:'BookStitch application information in the light theme.',width:1247,height:860},
    {title:'Main Window — Alice in Wonderland',desc:'Alice in Wonderland audiobook with twelve tracks.',src:'assets/screenshot-06-v86.webp',alt:'Alice in Wonderland audiobook with twelve tracks.',width:1251,height:862},
    {title:'Compatibility Metadata — Alice in Wonderland',desc:'Alice in Wonderland compatibility metadata settings.',src:'assets/screenshot-07-v86.webp',alt:'Alice in Wonderland compatibility metadata settings.',width:1250,height:859}
  ];
  let index=0,previousFocus=null,startX=null,flight=null,ghost=null,flightId=0,activeSource=null;
  const title=dialog.querySelector('#gallery-slide-title'),desc=dialog.querySelector('#gallery-slide-desc');
  const count=dialog.querySelector('#gallery-slide-count');
  const screenshot=dialog.querySelector('#gallery-screenshot');
  const dots=[...dialog.querySelectorAll('[data-gallery-index]')];
  // Responsive WebP variants: the full original remains available for large/high-DPI displays.
  const responsiveSizes='(max-width: 620px) calc(100vw - 24px), (max-width: 1024px) calc(100vw - 60px), min(90vw, 1250px)';
  const variants=slide=>{
    const stem=slide.src.replace(/\.webp$/,'');
    return `${stem}-640.webp 640w, ${stem}-960.webp 960w, ${slide.src} ${slide.width}w`;
  };
  // Keep a bounded image cache: the first four screenshots are warmed after load;
  // opening the gallery adds a few more, rather than downloading future galleries in full.
  const preloaded=new Map();
  const connection=navigator.connection||navigator.mozConnection||navigator.webkitConnection;
  const conserveData=()=>Boolean(connection?.saveData || /^(slow-2g|2g)$/.test(connection?.effectiveType||''));
  const idle=callback=>{
    if('requestIdleCallback' in window) window.requestIdleCallback(callback,{timeout:2500});
    else window.setTimeout(callback,650);
  };
  function prefetch(slideIndex){
    if(conserveData() || document.hidden)return;
    slideIndex=(slideIndex+slides.length)%slides.length;
    if(preloaded.has(slideIndex))return;
    const slide=slides[slideIndex];
    const image=new Image();
    image.decoding='async';
    image.fetchPriority='low';
    image.sizes=responsiveSizes;
    image.srcset=variants(slide);
    image.src=slide.src;
    image.onerror=()=>preloaded.delete(slideIndex);
    preloaded.set(slideIndex,image);
    while(preloaded.size>8){preloaded.delete(preloaded.keys().next().value);}
  }
  function prefetchNearby(){
    if(conserveData())return;
    prefetch(index+1);                    // The next slide is the first priority.
    idle(()=>{if(!dialog.hidden)prefetch(index+2);});
  }
  function render(){
    const slide=slides[index];
    title.textContent=slide.title;
    desc.textContent=slide.desc;
    count.textContent=`${index+1} / ${slides.length}`;
    screenshot.alt=slide.alt;
    screenshot.width=slide.width;
    screenshot.height=slide.height;
    screenshot.sizes=responsiveSizes;
    screenshot.srcset=variants(slide);
    screenshot.src=slide.src;
    dots.forEach((d,i)=>{
      d.classList.toggle('is-active',i===index);
      if(i===index)d.setAttribute('aria-current','true');
      else d.removeAttribute('aria-current');
    });
    prefetchNearby();
  }
  const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
  function cancelFlight(){
    flightId++;
    if(flight){flight.cancel();flight=null;}
    if(ghost){ghost.remove();ghost=null;}
    if(activeSource)activeSource.style.visibility='';
  }
  async function open(triggerEl,options={}){
    if (!options.fromUrl && location.hash !== '#magic-lantern') history.pushState({bookStitchDetail:true},'','#magic-lantern');
    previousFocus=document.activeElement;
    activeSource=triggerEl.querySelector('.lantern-visual img');
    index=0;render();
    const sourceRect=activeSource.getBoundingClientRect();
    dialog.hidden=false;
    prefetchNearby();
    // On entering the gallery, gently warm screenshots 5 and 6 in the background.
    // Subsequent slides are prefetched only as the visitor navigates.
    idle(()=>{if(!dialog.hidden){prefetch(4);idle(()=>{if(!dialog.hidden)prefetch(5);});}});
    dialog.classList.remove('gallery-landed');
    dialog.setAttribute('aria-hidden','false');
    document.body.classList.add('book-dialog-visible');
    const token=++flightId;
    const landing=dialog.querySelector('.gallery-projector img');
    landing.src=activeSource.currentSrc||activeSource.src;
    if(!options.instant && !reducedMotion.matches && sourceRect.width && sourceRect.height){
      const destination=landing.getBoundingClientRect();
      ghost=document.createElement('img');
      ghost.src=activeSource.currentSrc||activeSource.src;
      ghost.alt='';ghost.setAttribute('aria-hidden','true');
      Object.assign(ghost.style,{
        position:'fixed',left:sourceRect.left+'px',top:sourceRect.top+'px',
        width:sourceRect.width+'px',height:sourceRect.height+'px',
        objectFit:'contain',pointerEvents:'none',zIndex:'1200',transformOrigin:'top left',
        filter:'drop-shadow(0 12px 22px rgba(0,0,0,.48))'
      });
      document.body.appendChild(ghost);
      activeSource.style.visibility='hidden';
      const sx=destination.width/sourceRect.width;
      const sy=destination.height/sourceRect.height;
      flight=ghost.animate([
        {transform:'translate(0px,0px) scale(1,1)',opacity:1},
        {transform:`translate(${destination.left-sourceRect.left}px,${destination.top-sourceRect.top}px) scale(${sx},${sy})`,opacity:1}
      ],{duration:680,easing:'cubic-bezier(.22,.76,.25,1)',fill:'forwards'});
      try{await flight.finished;}catch(_){return;}
      if(token!==flightId)return;
    }
    cancelFlight();
    dialog.classList.add('gallery-landed');
    dialog.querySelector('.gallery-close').focus();
  }
  function close(options={}){if(!options.keepHash && location.hash === '#magic-lantern') history.replaceState(null,'','#magic');cancelFlight();dialog.classList.remove('gallery-landed');dialog.hidden=true;dialog.setAttribute('aria-hidden','true');document.body.classList.remove('book-dialog-visible');previousFocus?.focus();activeSource=null;}
  function move(amount){index=(index+amount+slides.length)%slides.length;render();}
  triggers.forEach(trigger=>{
    trigger.addEventListener('click',()=>open(trigger));
    trigger.addEventListener('pointerenter',()=>prefetch(0),{once:true});
    trigger.addEventListener('focus',()=>prefetch(0),{once:true});
  });
  // Warm the first four responsive screenshots only after the primary page is loaded.
  // Low fetch priority + idle scheduling keeps the initial page and its fonts first.
  // Data Saver and very slow connections are respected by prefetch().
  const warmOpeningSlides=()=>idle(()=>{
    for(let i=0;i<Math.min(4,slides.length);i++)prefetch(i);
  });
  if(document.readyState==='complete')warmOpeningSlides();
  else window.addEventListener('load',warmOpeningSlides,{once:true});
  function syncGalleryHash(){
    if(location.hash === '#magic-lantern'){
      if(dialog.hidden && triggers[0]) void open(triggers[0],{fromUrl:true,instant:true});
    } else if(!dialog.hidden){close({keepHash:true});}
  }
  window.addEventListener('popstate',syncGalleryHash);
  window.addEventListener('hashchange',syncGalleryHash);
  syncGalleryHash();
  dialog.querySelectorAll('[data-gallery-close]').forEach(el=>el.addEventListener('click',close));
  dialog.querySelector('#gallery-prev').addEventListener('click',()=>move(-1));
  dialog.querySelector('#gallery-next').addEventListener('click',()=>move(1));
  dots.forEach(d=>d.addEventListener('click',()=>{index=Number(d.dataset.galleryIndex);render();}));
  document.addEventListener('keydown',e=>{if(dialog.hidden)return;if(e.key==='Escape'){e.preventDefault();close();}else if(e.key==='ArrowRight'){e.preventDefault();move(1);}else if(e.key==='ArrowLeft'){e.preventDefault();move(-1);}else if(e.key==='Tab'){const els=[...dialog.querySelectorAll('button')];const first=els[0],last=els[els.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}});
  const screen=dialog.querySelector('.gallery-screen-frame');
  screen.addEventListener('touchstart',e=>{startX=e.changedTouches[0].clientX;},{passive:true});
  screen.addEventListener('touchend',e=>{if(startX===null)return;const dx=e.changedTouches[0].clientX-startX;startX=null;if(Math.abs(dx)>45)move(dx<0?1:-1);},{passive:true});
})();



// V68: Hero trust popovers rendered at document-body level to avoid stacking
// contexts from the Hero and section backgrounds; content is compact, no scrollbars.
(() => {
  const ids=['open-source','language','privacy'];
  const pairs=ids.map(id=>({trigger:document.getElementById(id+'-trigger'),panel:document.getElementById(id+'-popover')})).filter(p=>p.trigger&&p.panel);
  pairs.forEach(p=>{document.body.appendChild(p.panel);p.panel.classList.add('trust-floating-v68');});
  const close=(p,focus=false)=>{p.panel.hidden=true;p.trigger.setAttribute('aria-expanded','false');if(focus)p.trigger.focus();};
  const place=p=>{
    const r=p.trigger.getBoundingClientRect(),w=Math.min(415,window.innerWidth-28),gap=9;
    const left=Math.max(14,Math.min(r.left,window.innerWidth-w-14));
    p.panel.style.width=w+'px';
    p.panel.style.left=left+'px';
    p.panel.style.top='0px';
    p.panel.style.visibility='hidden';
    const height=p.panel.getBoundingClientRect().height;
    const below=r.bottom+gap;
    const above=r.top-gap-height;
    const top=(below+height<=window.innerHeight-10||above<10)?below:above;
    p.panel.style.top=Math.max(10,Math.min(top,window.innerHeight-height-10))+'px';
    p.panel.style.visibility='';
  };
  pairs.forEach(p=>p.trigger.addEventListener('click',e=>{
    e.stopPropagation();const open=p.panel.hidden;
    pairs.forEach(close);
    if(open){p.panel.hidden=false;p.trigger.setAttribute('aria-expanded','true');place(p);}
  }));
  document.addEventListener('click',e=>pairs.forEach(p=>{if(!p.trigger.contains(e.target)&&!p.panel.contains(e.target))close(p);}));
  document.addEventListener('keydown',e=>{if(e.key==='Escape')pairs.forEach(p=>{if(!p.panel.hidden)close(p,true);});});
  window.addEventListener('resize',()=>pairs.forEach(p=>{if(!p.panel.hidden)place(p);}));
  window.addEventListener('scroll',()=>pairs.forEach(p=>{if(!p.panel.hidden)close(p);}),{passive:true});
})();
