import { useState, useRef, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Select,
  MenuItem,
  Slider,
  Paper,
  Alert
} from "@mui/material";

/* Language-specific content */
const textMap = {
  "en-IN":
    "India is advancing clean electricity solutions to support sustainable development and rural empowerment. \n" +
    "Renewable energy sources such as solar, wind, and hydro power play a vital role in reducing carbon emissions \n" +
    "and improving energy security. Government initiatives and community participation are essential to ensure \n" +
    "that clean energy reaches rural and underserved regions.",

  "hi-IN":
    "भारत सतत विकास और ग्रामीण सशक्तिकरण के समर्थन के लिए स्वच्छ ऊर्जा समाधानों को आगे बढ़ा रहा है। " +
    "सौर, पवन और जल विद्युत जैसे नवीकरणीय ऊर्जा स्रोत कार्बन उत्सर्जन को कम करने और ऊर्जा सुरक्षा में " +
    "महत्वपूर्ण भूमिका निभाते हैं। स्वच्छ ऊर्जा को ग्रामीण और वंचित क्षेत्रों तक पहुँचाने के लिए सरकारी " +
    "पहल और सामुदायिक भागीदारी आवश्यक है।"
};

const FALLBACK_LANGS = ["gu-IN", "mr-IN", "ta-IN", "te-IN"];

function App() {
  const [language, setLanguage] = useState("en-IN");
  const [rate, setRate] = useState(1);
  const [voices, setVoices] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const [showFallback, setShowFallback] = useState(false);

  const utteranceRef = useRef(null);
  const timerRef = useRef(null);

  const isFallback = FALLBACK_LANGS.includes(language);
  const effectiveLang = isFallback ? "en-IN" : language;

  const text = textMap[effectiveLang];
  const words = text.split(" ");

  /* Load voices */
  useEffect(() => {
    const loadVoices = () => {
      setVoices(window.speechSynthesis.getVoices());
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  /* Handle fallback notice */
  useEffect(() => {
    setShowFallback(isFallback);
  }, [language]);

  const getVoiceForLanguage = (lang) =>
    voices.find((v) => v.lang === lang);

  const playSpeech = () => {
    window.speechSynthesis.cancel();
    clearInterval(timerRef.current);
    setActiveIndex(null);

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = effectiveLang;
    utterance.rate = rate;

    const voice = getVoiceForLanguage(effectiveLang);
    if (voice) utterance.voice = voice;

    /* English → native boundary */
    if (effectiveLang === "en-IN") {
      utterance.onboundary = (event) => {
        if (event.name === "word") {
          const index =
            text.substring(0, event.charIndex).split(" ").length - 1;
          setActiveIndex(index);
        }
      };
    }

    /* Hindi → simulated highlighting */
    if (effectiveLang === "hi-IN") {
      let index = 0;
      timerRef.current = setInterval(() => {
        setActiveIndex(index);
        index++;
        if (index >= words.length) {
          clearInterval(timerRef.current);
        }
      }, 400 / rate);
    }

    utterance.onend = () => {
      clearInterval(timerRef.current);
      setActiveIndex(null);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const pauseSpeech = () => window.speechSynthesis.pause();
  const resumeSpeech = () => window.speechSynthesis.resume();
  const stopSpeech = () => {
    window.speechSynthesis.cancel();
    clearInterval(timerRef.current);
    setActiveIndex(null);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#fafafa",
        display: "flex",
        justifyContent: "center",
        p: 2
      }}
    >
      <Paper sx={{ maxWidth: 900, p: 4 }} elevation={1}>
        <Typography variant="h6" gutterBottom>
          Synchronized Text-to-Speech Reader
        </Typography>

        {showFallback && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Selected language voice boundary support is limited.
            Falling back to English for synchronized highlighting.
          </Alert>
        )}

        {/* Text */}
        <Typography component="div" sx={{ lineHeight: 1.9, mb: 4 }}>
          {words.map((word, index) => (
            <span
              key={index}
              style={{
                backgroundColor:
                  index === activeIndex ? "#fff59d" : "transparent",
                padding: "2px 4px",
                marginRight: "4px",
                borderRadius: "4px"
              }}
            >
              {word}
            </span>
          ))}
        </Typography>

        {/* Controls */}
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 3 }}>
          <Button variant="contained" onClick={playSpeech}>
            Play
          </Button>
          <Button onClick={pauseSpeech}>Pause</Button>
          <Button onClick={resumeSpeech}>Resume</Button>
          <Button onClick={stopSpeech}>Stop</Button>
        </Box>

        {/* Language */}
        <Box sx={{ mb: 2 }}>
          <Typography gutterBottom>Language</Typography>
          <Select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            size="small"
          >
            <MenuItem value="en-IN">English</MenuItem>
            <MenuItem value="hi-IN">Hindi</MenuItem>
            <MenuItem value="gu-IN">Gujarati</MenuItem>
            <MenuItem value="mr-IN">Marathi</MenuItem>
            <MenuItem value="ta-IN">Tamil</MenuItem>
            <MenuItem value="te-IN">Telugu</MenuItem>
          </Select>
        </Box>

        {/* Rate */}
        <Box>
          <Typography gutterBottom>Speech Rate</Typography>
          <Slider
            min={0.5}
            max={2}
            step={0.1}
            value={rate}
            onChange={(e, value) => setRate(value)}
          />
        </Box>
      </Paper>
    </Box>
  );
}

export default App;
