import { useState, useEffect, useCallback, useRef } from 'react';

const useSpeech = () => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState("");
    const recognitionRef = useRef(null);

    const speak = (text, onEndCallback) => {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.onend = () => {
            if (onEndCallback) onEndCallback();
        };
        window.speechSynthesis.speak(utterance);
    };

    const startListening = useCallback(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Speech recognition not supported in this browser.");
            return;
        }

        // Initialize only if it doesn't exist
        if (!recognitionRef.current) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.lang = 'en-US';
            recognitionRef.current.continuous = true; // 👈 Keeps listening even if you pause
            recognitionRef.current.interimResults = true; // 👈 Shows words as you speak
        }

        const recognition = recognitionRef.current;

        recognition.onstart = () => setIsListening(true);
        
        recognition.onresult = (event) => {
            let currentTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
                currentTranscript += event.results[i][0].transcript;
            }
            setTranscript(currentTranscript);
        };

        recognition.onerror = (event) => {
            console.error("Speech Error:", event.error);
            setIsListening(false);
        };

        recognition.onend = () => setIsListening(false);

        try {
            recognition.start();
        } catch (e) {
            console.warn("Recognition already started");
        }
    }, []);

    const stopListening = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
        setIsListening(false);
    };
    useEffect(() => {
        // This 'return' function automatically runs when the component unmounts
        // (i.e., when you navigate away from the Live Interview page)
        return () => {
            console.log("Cleaning up speech hardware...");
            
            // 1. Kill the microphone
            if (recognitionRef.current) {
                recognitionRef.current.stop();
                recognitionRef.current.abort(); // Force quit the listener
            }
            
            // 2. Kill the speaker
            window.speechSynthesis.cancel();
            
            // 3. Reset state
            setIsListening(false);
        };
    }, []);

    return { speak, startListening, stopListening, isListening, transcript, setTranscript };
};

export default useSpeech;