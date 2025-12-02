/**
 * UCLA MSBA Knowledge Base
 * Contains structured knowledge about MSBA program based on impact analysis report
 */

class MSBAKnowledgeBase {
    constructor() {
        this.knowledge = {
            prerequisites: [
                {
                    question: "What are the MSBA prerequisites?",
                    answer: "The MSBA program requires: Mathematics (Calculus, Linear Algebra, Statistics), Programming skills (Python or R), and recommended 1-2 years of work experience (though not required).",
                    source: "MSBA Prerequisites Page",
                    url: "/degrees/master-of-science-in-business-analytics/admissions/prerequisites",
                    fullUrl: "https://anderson.ucla.edu/degrees/master-of-science-in-business-analytics/admissions/prerequisites",
                    riskLevel: "Medium",
                    organicTraffic: "50.44%"
                },
                {
                    question: "Do I need work experience?",
                    answer: "Work experience is not required but recommended (1-2 years preferred). The program accepts students from diverse backgrounds.",
                    source: "MSBA Admissions",
                    url: "/degrees/master-of-science-in-business-analytics/admissions",
                    fullUrl: "https://anderson.ucla.edu/degrees/master-of-science-in-business-analytics/admissions"
                }
            ],
            fees: [
                {
                    question: "What is the MSBA program cost?",
                    answer: "The total program cost is approximately $70,000+ (varies by year). This includes tuition, fees, and program expenses. Financial aid and scholarships are available.",
                    source: "MSBA Fees & Financing Page",
                    url: "/degrees/master-of-science-in-business-analytics/admit-central/program-calendar-and-fees",
                    fullUrl: "https://anderson.ucla.edu/degrees/master-of-science-in-business-analytics/admit-central/program-calendar-and-fees",
                    riskLevel: "High",
                    organicTraffic: "74.30%"
                },
                {
                    question: "Are there financing options?",
                    answer: "Yes, UCLA Anderson offers financial aid, scholarships, and loan options. International students may have additional financing resources.",
                    source: "MSBA Fees & Financing",
                    url: "/degrees/master-of-science-in-business-analytics/admit-central/program-calendar-and-fees",
                    fullUrl: "https://anderson.ucla.edu/degrees/master-of-science-in-business-analytics/admit-central/program-calendar-and-fees"
                },
                {
                    question: "What are financial prerequisites?",
                    answer: "There are no specific financial prerequisites like minimum bank balance required at application. However, once admitted, international students need to show proof of funding for I-20 and visa requirements. For accurate cost breakdown, check the MSBA Program Costs page.",
                    source: "MSBA Fees & Financing Page",
                    url: "/degrees/master-of-science-in-business-analytics/admit-central/program-calendar-and-fees",
                    fullUrl: "https://anderson.ucla.edu/degrees/master-of-science-in-business-analytics/admit-central/program-calendar-and-fees"
                },
                {
                    question: "Where can I find financial prerequisite information?",
                    answer: "Financial prerequisite information can be found on the MSBA Tuition & Financing page, which includes latest cost details, funding options, scholarships, and loan information.",
                    source: "MSBA Tuition & Financing",
                    url: "/degrees/master-of-science-in-business-analytics/admit-central/program-calendar-and-fees",
                    fullUrl: "https://anderson.ucla.edu/degrees/master-of-science-in-business-analytics/admit-central/program-calendar-and-fees"
                }
            ],
            admissions: [
                {
                    question: "What are the admission requirements?",
                    answer: "MSBA admissions use a holistic review process. Requirements include: transcripts, GRE/GMAT scores, letters of recommendation, personal statement, resume, and application fee. Application deadlines vary by round.",
                    source: "MSBA Admissions Page",
                    url: "/degrees/master-of-science-in-business-analytics/admissions",
                    fullUrl: "https://anderson.ucla.edu/degrees/master-of-science-in-business-analytics/admissions",
                    riskLevel: "Low",
                    organicTraffic: "49.35%"
                },
                {
                    question: "What are the application deadlines?",
                    answer: "Application deadlines vary by round. Please check the official MSBA admissions page for current deadlines and round-specific requirements.",
                    source: "MSBA Admissions",
                    url: "/degrees/master-of-science-in-business-analytics/admissions",
                    fullUrl: "https://anderson.ucla.edu/degrees/master-of-science-in-business-analytics/admissions"
                }
            ],
            program: [
                {
                    question: "How long is the MSBA program?",
                    answer: "The MSBA program is a 15-month full-time program, designed to be completed in 4 quarters.",
                    source: "MSBA Program Page",
                    url: "/degrees/master-of-science-in-business-analytics-msba",
                    fullUrl: "https://anderson.ucla.edu/degrees/master-of-science-in-business-analytics-msba",
                    riskLevel: "Low",
                    organicTraffic: "48.51%"
                },
                {
                    question: "What courses are included?",
                    answer: "The program includes core courses in data science, business analytics, machine learning, and statistical methods. Students also complete a capstone project with industry partners.",
                    source: "MSBA Academics Page",
                    url: "/degrees/master-of-science-in-business-analytics/academics",
                    fullUrl: "https://anderson.ucla.edu/degrees/master-of-science-in-business-analytics/academics"
                },
                {
                    question: "Is MSBA a STEM program?",
                    answer: "Yes, the MSBA program is STEM-designated, which allows international students to extend their OPT (Optional Practical Training) period.",
                    source: "MSBA Program Information",
                    url: "/degrees/master-of-science-in-business-analytics-msba",
                    fullUrl: "https://anderson.ucla.edu/degrees/master-of-science-in-business-analytics-msba"
                }
            ],
            career: [
                {
                    question: "What are the career outcomes?",
                    answer: "MSBA graduates have strong placement rates with average starting salaries of $120,000+. Top employers include major tech companies, consulting firms, and financial institutions.",
                    source: "MSBA Student Outcomes & Placement",
                    url: "/degrees/master-of-science-in-business-analytics/career-impact/student-outcomes-placement",
                    fullUrl: "https://anderson.ucla.edu/degrees/master-of-science-in-business-analytics/career-impact/student-outcomes-placement",
                    riskLevel: "Low",
                    organicTraffic: "43.71%"
                },
                {
                    question: "What career services are available?",
                    answer: "UCLA Anderson provides comprehensive career services including resume review, interview preparation, networking events, and direct connections with employers.",
                    source: "MSBA Career Services",
                    url: "/degrees/master-of-science-in-business-analytics/career-impact",
                    fullUrl: "https://anderson.ucla.edu/degrees/master-of-science-in-business-analytics/career-impact"
                }
            ],
            faq: [
                {
                    question: "Is the MSBA program full-time?",
                    answer: "Yes, the MSBA program is a full-time, 15-month program designed for students to complete in 4 quarters.",
                    source: "MSBA FAQ",
                    url: "/degrees/master-of-science-in-business-analytics/admissions/faq",
                    fullUrl: "https://anderson.ucla.edu/degrees/master-of-science-in-business-analytics/admissions/faq"
                },
                {
                    question: "Can I work while studying?",
                    answer: "The MSBA program is intensive and full-time. While some students may have part-time opportunities, the program is designed to be the primary focus.",
                    source: "MSBA FAQ",
                    url: "/degrees/master-of-science-in-business-analytics/admissions/faq",
                    fullUrl: "https://anderson.ucla.edu/degrees/master-of-science-in-business-analytics/admissions/faq"
                }
            ],
            events: [
                {
                    question: "What admissions events are available?",
                    answer: "UCLA Anderson MSBA hosts various admissions events including information sessions, webinars, and campus visits. Check the admissions events page for upcoming dates and registration.",
                    source: "MSBA Admissions Events",
                    url: "/degrees/master-of-science-in-business-analytics/admissions/events",
                    fullUrl: "https://anderson.ucla.edu/degrees/master-of-science-in-business-analytics/admissions/events"
                }
            ],
            videos: [
                {
                    question: "What videos are available about MSBA?",
                    answer: "UCLA Anderson MSBA offers several videos including program overview, student life, career networking, and admissions information.",
                    source: "MSBA Videos",
                    videos: [
                        {
                            title: "This Is What The Master of Science in Business Analytics Is All About",
                            youtubeId: "1hoFiu7BP08",
                            description: "Program overview and introduction"
                        },
                        {
                            title: "A Day in the Life of MSBA",
                            youtubeId: "xsALV8FO9JE",
                            description: "Student life and daily experience"
                        },
                        {
                            title: "Building Personal and Professional Networks",
                            youtubeId: "UCLA_MSBA_NETWORK",
                            description: "Career networking and professional development"
                        }
                    ]
                }
            ]
        };
    }

    /**
     * Search knowledge base
     */
    searchKnowledge(category, query) {
        const categoryData = this.knowledge[category] || [];
        const queryLower = query.toLowerCase();
        
        // Simple keyword matching
        const results = categoryData.filter(item => {
            const searchText = (item.question + ' ' + item.answer).toLowerCase();
            return queryLower.split(' ').some(word => searchText.includes(word));
        });

        return results.length > 0 ? results : categoryData.slice(0, 2);
    }

    /**
     * Get all knowledge for a category
     */
    getCategoryKnowledge(category) {
        return this.knowledge[category] || [];
    }

    /**
     * Add new knowledge
     */
    addKnowledge(category, knowledgeItem) {
        if (!this.knowledge[category]) {
            this.knowledge[category] = [];
        }
        this.knowledge[category].push(knowledgeItem);
    }
}

// Export for global use
if (typeof window !== 'undefined') {
    window.MSBAKnowledgeBase = MSBAKnowledgeBase;
    window.msbaKnowledgeBase = new MSBAKnowledgeBase();
}

