import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { getLiveQuestions, evaluateInterview } from '../services/interview.api';
import { useInterview } from '../hooks/useInterview';
import useSpeech from '../hooks/useSpeech';
import '../style/liveInterview.scss'


const LiveInterview = () => {
    const { interviewId } = useParams();
    const navigate = useNavigate();
    const { report, getReportById } = useInterview();
    const { speak, startListening, stopListening, isListening, transcript, setTranscript } = useSpeech();

    const [questions, setQuestions] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [currentIndex, setCurrentIndex] = useState(0);
    
    const [accumulatedAnswer, setAccumulatedAnswer] = useState(""); // Saves previous sentences
    const [fullTranscript, setFullTranscript] = useState([]);
    
    const [evaluation, setEvaluation] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [userCommand, setUserCommand] = useState("");

    useEffect(() => {
        if (interviewId) getReportById(interviewId);
    }, [interviewId]);

    const startInterview = async () => {
        if (!report) return;
        setIsProcessing(true);
        try {
            const data = await getLiveQuestions({
                jobDescription: report.jobDescription,
                resumeText: report.resumeText || report.resumeContent || "Candidate's resume",
                userCommand
            });
            setQuestions(data.questions);
            setCurrentStep(1);
            askQuestion(data.questions[0]);
        } catch (err) {
            alert("Failed to start. Check backend.");
        } finally {
            setIsProcessing(false);
        }
    };

    const askQuestion = (text) => {
        speak(text, () => {
            startListening();
        });
    };

    // MANUAL MIC TOGGLE
    const toggleMic = () => {
        if (isListening) {
            stopListening();
            // Save the current transcript chunk to the accumulated answer
            setAccumulatedAnswer(prev => prev + " " + transcript);
            setTranscript(""); 
        } else {
            startListening();
        }
    };

    // MANUAL NEXT QUESTION
    const handleNext = () => {
        stopListening();
        
        // Combine everything they said for this question
        const finalAnswer = (accumulatedAnswer + " " + transcript).trim();
        
        const qaPair = { question: questions[currentIndex], answer: finalAnswer };
        const updatedTranscript = [...fullTranscript, qaPair];
        setFullTranscript(updatedTranscript);
        
        // Reset for the next question
        setAccumulatedAnswer("");
        setTranscript("");

        if (currentIndex < questions.length - 1) {
            const nextIdx = currentIndex + 1;
            setCurrentIndex(nextIdx);
            askQuestion(questions[nextIdx]);
        } else {
            submitForGrading(updatedTranscript);
        }
    };

    const submitForGrading = async (finalTranscript) => {
        setIsProcessing(true);
        try {
            const result = await evaluateInterview({
                transcript: finalTranscript,
                jobDescription: report.jobDescription
            });
            setEvaluation(result);
            setCurrentStep(2);
        } catch (err) {
            alert("Grading failed.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="live-interview">
            {currentStep === 0 && (
                <div className="setup-view">
                    <h1 className="glow-text">AI Interview Command Center</h1>
                    <div className="command-input-container">
                        <input 
                            type="text" 
                            className="command-input"
                            placeholder="e.g. Focus on my backend experience..."
                            value={userCommand}
                            onChange={(e) => setUserCommand(e.target.value)}
                        />
                    </div>

                    {/* 🚀 ADD THIS BLOCK BACK IN */}
                    <div className="quick-chips">
                        {[
                            "Focus on my React projects",
                            "Ask behavioral questions",
                            "Test me on my Coursework",
                            "Strict technical interview"
                        ].map(cmd => (
                            <button 
                                key={cmd} 
                                className="chip" 
                                onClick={() => setUserCommand(cmd)}
                            >
                                {cmd}
                            </button>
                        ))}
                    </div>
                    {/* 🚀 END OF NEW BLOCK */}

                    <button className="primary-button start-btn" onClick={startInterview} disabled={isProcessing}>
                        {isProcessing ? "AI is preparing..." : "Start Interview"}
                    </button>
                </div>
            )}

            {currentStep === 1 && (
                <div className="interview-studio">
                    <div className="studio-header">
                        <span className="question-counter">Question {currentIndex + 1} of {questions.length}</span>
                        <div className="progress-bar">
                            <div className="progress-fill" style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }} />
                        </div>
                    </div>
                    
                    <h2 className="ai-question">"{questions[currentIndex]}"</h2>
                    
                    <div className="transcript-box">
                        <p className="accumulated-text">{accumulatedAnswer}</p>
                        <p className={`active-transcript ${isListening ? 'recording' : ''}`}>
                            {isListening ? transcript || "Listening..." : (transcript ? transcript : "Mic paused.")}
                        </p>
                    </div>

                    <div className="studio-controls">
                        <button 
                            className={`mic-toggle ${isListening ? 'active' : 'paused'}`} 
                            onClick={toggleMic}
                        >
                            {isListening ? "⏹ Pause Mic" : "🎙️ Resume Mic"}
                        </button>
                        
                        <button className="submit-answer-btn" onClick={handleNext}>
                            Submit Answer & Next →
                        </button>
                    </div>
                </div>
            )}

            {currentStep === 2 && evaluation && (
                <div className="result-view">
                    <h2>Session Complete!</h2>
                    <p>{evaluation.feedback}</p>
                    <button className="primary-button" onClick={() => navigate(`/interview/${interviewId}`)}>
                        Back to Dashboard
                    </button>
                </div>
            )}
        </div>
    );
};

export default LiveInterview;