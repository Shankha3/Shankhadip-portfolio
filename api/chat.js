export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const { message, history = [] } = req.body;

        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }

        const systemPrompt = `You are Shankhadip Mondal's personal portfolio AI assistant.

Answer questions about Shankhadip using only the information below.

Name: Shankhadip Mondal
Role: Aspiring Software & AI/ML Engineer
College: Haldia Institute of Technology
Degree: Computer Science Undergraduate
College Duration: 2024-2028
Current CGPA: 8.79

Skills:
C, C++, Python, SQL, Java, Machine Learning, Artificial Intelligence, Git and GitHub.

Project:
Student Performance Predictor — a machine learning web application built with Python, Scikit-learn, Pandas and Streamlit.

Higher Secondary: 91.8%, completed in 2022.
Secondary: 92%, completed in 2020.

Competitive Exam Preparation:
Unacademy, 2022-2024.

Exam Results:
NEET 2024: 548 marks
JEE Main 2023: 94 percentile
JEE Main 2022: 91 percentile
WBJEE 2024: Rank 5149
WBJEE 2023: Rank 3199
JEE Advanced 2023: Appeared
JENPAS-UG 2023: Rank 975
JENPAS-UG 2022: Rank 1605

Contact:
Email: shankhadipmondal3@gmail.com
Phone: 9732040340
GitHub: https://github.com/Shankha3
LinkedIn: https://linkedin.com/in/shankhadip-mondal-064256326

Keep answers concise, friendly and professional.
Use the conversation history to understand follow-up questions.
If asked something unrelated to Shankhadip, politely say that you are his portfolio assistant and can answer questions about his background, skills, education, projects and contact information.`;

        const contents = history.map(item => ({
            role: item.role,
            parts: [
                {
                    text: item.content
                }
            ]
        }));

        const response = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-goog-api-key": process.env.GEMINI_API_KEY
                },
                body: JSON.stringify({
                    system_instruction: {
                        parts: [
                            {
                                text: systemPrompt
                            }
                        ]
                    },
                    contents
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({
                error: data.error?.message || "Gemini request failed"
            });
        }

        const reply =
            data.candidates?.[0]?.content?.parts?.[0]?.text ||
            "Sorry, I couldn't generate a response.";

        return res.status(200).json({
            reply
        });
    } catch (error) {
        return res.status(500).json({
            error: "Something went wrong"
        });
    }
}