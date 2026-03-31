import React, { useState, useEffect } from 'react'
import '../style/interview.scss'
import { useInterview } from '../hooks/useInterview.js'
import { useNavigate, useParams } from 'react-router'
import { searchLiveJobs } from '../services/interview.api'



const NAV_ITEMS = [
    { id: 'technical', label: 'Technical Questions', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>) },
    { id: 'behavioral', label: 'Behavioral Questions', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>) },
    { id: 'roadmap', label: 'Road Map', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11" /></svg>) },
    { id: 'jobs', label: 'Find Jobs', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>) },
]

// ── Sub-components ────────────────────────────────────────────────────────────
const QuestionCard = ({ item, index }) => {
    const [ open, setOpen ] = useState(false)
    return (
        <div className='q-card'>
            <div className='q-card__header' onClick={() => setOpen(o => !o)}>
                <span className='q-card__index'>Q{index + 1}</span>
                <p className='q-card__question'>{item.question}</p>
                <span className={`q-card__chevron ${open ? 'q-card__chevron--open' : ''}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                </span>
            </div>
            {open && (
                <div className='q-card__body'>
                    <div className='q-card__section'>
                        <span className='q-card__tag q-card__tag--intention'>Intention</span>
                        <p>{item.intention}</p>
                    </div>
                    <div className='q-card__section'>
                        <span className='q-card__tag q-card__tag--answer'>Model Answer</span>
                        <p>{item.answer}</p>
                    </div>
                </div>
            )}
        </div>
    )
}

const RoadMapDay = ({ day }) => (
    <div className='roadmap-day'>
        <div className='roadmap-day__header'>
            <span className='roadmap-day__badge'>Day {day.day}</span>
            <h3 className='roadmap-day__focus'>{day.focus}</h3>
        </div>
        <ul className='roadmap-day__tasks'>
            {day.tasks.map((task, i) => (
                <li key={i}>
                    <span className='roadmap-day__bullet' />
                    {task}
                </li>
            ))}
        </ul>
    </div>
)
// ── Job Search Sub-component ──────────────────────────────────────────────────
const JobSearchSection = () => {
    const [location, setLocation] = useState('');
    const [jobs, setJobs] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [searchedQuery, setSearchedQuery] = useState('');

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!location) return;

        setIsSearching(true);
        try {
            const data = await searchLiveJobs(location);
            setJobs(data.jobs || []);
            setSearchedQuery(data.searchQuery);
        } catch (error) {
            console.error("Failed to fetch jobs:", error);
        } finally {
            setIsSearching(false);
        }
    };

    return (
        <section className="job-search-section">
            <div className='content-header'>
                <h2>Find Your Next Role</h2>
                {jobs.length > 0 && <span className='content-header__count'>{jobs.length} matches</span>}
            </div>
            
            <p style={{ color: '#a0a0a0', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                We'll analyze your uploaded resume and find the best active job listings in your area.
            </p>

            <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                <input 
                    type="text" 
                    placeholder="Enter city or 'remote' (e.g., New York, NY)" 
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    style={{ 
                        flex: 1, 
                        padding: '0.8rem 1rem', 
                        borderRadius: '8px', 
                        border: '1px solid #333',
                        backgroundColor: '#1a1a1a', // Matching your dark theme
                        color: 'white',
                        outline: 'none'
                    }}
                />
                <button type="submit" className="button primary-button" disabled={isSearching}>
                    {isSearching ? "Searching..." : "Search Jobs"}
                </button>
            </form>

            {searchedQuery && (
                <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: 'rgba(0, 255, 136, 0.1)', borderRadius: '8px', border: '1px solid rgba(0, 255, 136, 0.2)' }}>
                    <p style={{ margin: 0, color: '#00ff88', fontSize: '0.9rem' }}>
                        🤖 AI searched based on your resume for: <strong>{searchedQuery}</strong>
                    </p>
                </div>
            )}

            <div className='job-list' style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {jobs.map((job, index) => (
                    <div key={index} className='q-card' style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <div className='q-card__header' style={{ cursor: 'default' }}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <h3 style={{ margin: 0, color: '#fff', fontSize: '1.1rem' }}>{job.job_title}</h3>
                                <span style={{ color: '#00ff88', fontSize: '0.85rem', fontWeight: 'bold', marginTop: '4px' }}>
                                    {job.employer_name} • {job.job_city}, {job.job_state}
                                </span>
                            </div>
                        </div>
                        <div className='q-card__body' style={{ marginTop: 0, paddingTop: '0.5rem' }}>
                            <p style={{ color: '#ccc', fontSize: '0.9rem', lineHeight: '1.5' }}>
                                {job.job_description?.substring(0, 200)}...
                            </p>
                            <a 
                                href={job.job_apply_link} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="button"
                                style={{ 
                                    display: 'inline-block',
                                    marginTop: '1rem', 
                                    backgroundColor: '#2a2a2a', 
                                    color: '#fff', 
                                    textDecoration: 'none',
                                    border: '1px solid #444',
                                    padding: '0.5rem 1rem',
                                    borderRadius: '6px',
                                    fontSize: '0.85rem'
                                }}
                            >
                                Apply Externally ↗
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

// ── Main Component ────────────────────────────────────────────────────────────
const Interview = () => {
    const [ activeNav, setActiveNav ] = useState('technical')
    const { report, getReportById, loading, getResumePdf } = useInterview()
    const { interviewId } = useParams()

    const navigate = useNavigate()

    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId)
        }
    }, [ interviewId ])



    if (loading || !report) {
        return (
            <main className='loading-screen'>
                <h1>Loading your interview plan...</h1>
            </main>
        )
    }

    const scoreColor =
        report.matchScore >= 80 ? 'score--high' :
            report.matchScore >= 60 ? 'score--mid' : 'score--low'


    return (
        <div className='interview-page'>
            <div className='interview-layout'>

                {/* ── Left Nav ── */}
                <nav className='interview-nav'>
                    <div className="nav-content">
                        <p className='interview-nav__label'>Sections</p>
                        {NAV_ITEMS.map(item => (
                            <button
                                key={item.id}
                                className={`interview-nav__item ${activeNav === item.id ? 'interview-nav__item--active' : ''}`}
                                onClick={() => setActiveNav(item.id)}
                            >
                                <span className='interview-nav__icon'>{item.icon}</span>
                                {item.label}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={() => navigate(`/interview/${interviewId}/live`)}
                        className='button live-button'
                        style={{ 
                            marginBottom: '0.8rem', 
                            backgroundColor: 'rgba(0, 255, 136, 0.1)', 
                            color: '#00ff88', 
                            border: '1px solid rgba(0, 255, 136, 0.3)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <svg height={"0.9rem"} style={{ marginRight: "0.8rem" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                            <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                        </svg>
                        Start Live Interview
                    </button>

                    <button
                        onClick={() => { getResumePdf(interviewId) }}
                        className='button primary-button' >
                        {/* SVG */}
                        Download Resume
                    </button>
                </nav>

                <div className='interview-divider' />

                {/* ── Center Content ── */}
                <main className='interview-content'>
                    {activeNav === 'technical' && (
                        <section>
                            <div className='content-header'>
                                <h2>Technical Questions</h2>
                                <span className='content-header__count'>{report.technicalQuestions.length} questions</span>
                            </div>
                            <div className='q-list'>
                                {report.technicalQuestions.map((q, i) => (
                                    <QuestionCard key={i} item={q} index={i} />
                                ))}
                            </div>
                        </section>
                    )}

                    {activeNav === 'behavioral' && (
                        <section>
                            <div className='content-header'>
                                <h2>Behavioral Questions</h2>
                                <span className='content-header__count'>{report.behavioralQuestions.length} questions</span>
                            </div>
                            <div className='q-list'>
                                {report.behavioralQuestions.map((q, i) => (
                                    <QuestionCard key={i} item={q} index={i} />
                                ))}
                            </div>
                        </section>
                    )}

                    {activeNav === 'roadmap' && (
                        <section>
                            <div className='content-header'>
                                <h2>Preparation Road Map</h2>
                                <span className='content-header__count'>{report.preparationPlan.length}-day plan</span>
                            </div>
                            <div className='roadmap-list'>
                                {report.preparationPlan.map((day) => (
                                    <RoadMapDay key={day.day} day={day} />
                                ))}
                            </div>
                        </section>
                    )}
                    {activeNav === 'jobs' && (
                        <JobSearchSection />
                    )}
                </main>

                <div className='interview-divider' />

                {/* ── Right Sidebar ── */}
                <aside className='interview-sidebar'>

                    {/* Match Score */}
                    <div className='match-score'>
                        <p className='match-score__label'>Match Score</p>
                        <div className={`match-score__ring ${scoreColor}`}>
                            <span className='match-score__value'>{report.matchScore}</span>
                            <span className='match-score__pct'>%</span>
                        </div>
                        <p className='match-score__sub'>Strong match for this role</p>
                    </div>

                    <div className='sidebar-divider' />

                    {/* Skill Gaps */}
                    <div className='skill-gaps'>
                        <p className='skill-gaps__label'>Skill Gaps</p>
                        <div className='skill-gaps__list'>
                            {report.skillGaps.map((gap, i) => (
                                <span key={i} className={`skill-tag skill-tag--${gap.severity}`}>
                                    {gap.skill}
                                </span>
                            ))}
                        </div>
                    </div>

                </aside>
            </div>
        </div>
    )
}

export default Interview