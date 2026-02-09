--PROJECT OVERVIEW--

This project is a Text-to-Speech (TTS) reader prototype.
The application enhances accessibility by converting textual content into speech and supporting
multiple Indian languages using the Web Speech API.

--SETUP INSTRUCTIONS--

1. Clone the repository
2. Run `npm install`
3. Run `npm run dev`
4. Open the app in a supported browser (recommended: Google Chrome)

--SUPPORTED BROWERS--

- Google Chrome (Fully supported)
- Microsoft Edge (UI supported, limited TTS)
- Mozilla Firefox (UI supported, TTS not available)
- Opera (Partial support)
- Safari (Limited support depending on OS)

--KNOWN LIMITATIONS--

1.Word-level text highlighting relies on the onboundary event, which is inconsistently supported across browsers and operating systems.

2.English (en-IN) provides reliable word-boundary events and synchronized highlighting on Google Chrome (Desktop).

3.Hindi (hi-IN) highlighting is implemented using a timing-based simulation due to the lack of reliable boundary events; basic synchronization is achieved, but precise pause–resume alignment may drift.

4.Indian language voices (Gujarati, Marathi, Tamil, Telugu) do not consistently expose boundary events, so synchronized highlighting is not feasible; a graceful fallback to English highlighting is applied.

5.On mobile browsers (Android / iOS), TTS playback works but text highlighting synchronization is unreliable due to platform-level speech engine limitations.

6.Microsoft Edge renders the UI correctly and supports basic TTS playback, but word highlighting events are not triggered reliably.

7.Firefox and Safari have limited or partial support for the Web Speech API, especially for boundary-based synchronization.
