import { useState, useRef, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Select,
  MenuItem,
  Slider,
  Paper
} from "@mui/material";

const text =
  "India is advancing clean electricity solutions to support sustainable development and rural empowerment. \n"
+ "Renewable energy sources such as solar, wind, and hydro power play a vital role in reducing carbon emissions\n "
+ "and improving energy security. Government initiatives and community participation are essential to ensure \n"
+ "that clean energy reaches rural and underserved regions. By adopting innovative technologies and inclusive \n"
+ "policies, India aims to build a resilient, sustainable, and self-reliant energy ecosystem for future generations.";

function App() {
  const [activeIndex, setActiveIndex] = useState(null);
  const [language, setLanguage] = useState("en-IN");
  const [rate, setRate] = useState(1);
  const [voices, setVoices] = useState([]);

  const utteranceRef = useRef(null);
  const words = text.split(" ");

  useEffect(() => {
    const loadVoices = () => {
      setVoices(window.speechSynthesis.getVoices());
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const getVoiceForLanguage = (lang) => {
    let voice = voices.find((v) => v.lang === lang);
    if (!voice) {
      voice = voices.find((v) => v.lang.startsWith("en"));
      alert(`Voice for ${lang} not available. Falling back to English.`);
    }
    return voice;
  };

  const playSpeech = () => {
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    utterance.rate = rate;

    const voice = getVoiceForLanguage(language);
    if (voice) utterance.voice = voice;

    utterance.onboundary = (event) => {
      if (event.name === "word") {
        const index =
          text.substring(0, event.charIndex).split(" ").length - 1;
        setActiveIndex(index);
      }
    };

    utterance.onend = () => setActiveIndex(null);

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const pauseSpeech = () => window.speechSynthesis.pause();
  const resumeSpeech = () => window.speechSynthesis.resume();
  const stopSpeech = () => {
    window.speechSynthesis.cancel();
    setActiveIndex(null);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#fafafa",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        p: 2
      }}
    >
      <Paper sx={{ maxWidth: 900, p: 4 }} elevation={1}>
        <Typography variant="h6" gutterBottom>
          Text-to-Speech Reader
        </Typography>

        {/* Reader Text */}
        <Typography
          component="div"
          sx={{ fontSize: "1.1rem", lineHeight: 1.8, mb: 4 }}
        >
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

        {/* Settings */}
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
