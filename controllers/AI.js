const { GoogleGenerativeAI } = require("@google/generative-ai");
const Course = require("../models/Course");

// Function to handle AI chat queries
exports.aiChat = async (req, res) => {
    try {
        const { query, courseId, history } = req.body;

        if (!query) {
            return res.status(400).json({
                success: false,
                message: "Query is required",
            });
        }

        // Initialize Gemini AI
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        let context = "";
        if (courseId) {
            const courseDetails = await Course.findById(courseId);
            if (courseDetails) {
                context = `You are a helpful teaching assistant for the course "${courseDetails.courseName}". 
                Course Description: ${courseDetails.courseDescription}. 
                Please answer the user's question based on this course context. If the question is outside the scope, you can still answer politely but mention it's outside the course scope.`;
            }
        } else {
            context = "You are a helpful AI assistant for EduNovaX, an EdTech platform. Help the user with their queries about learning, courses, and platform features.";
        }

        const prompt = `${context}\n\nUser Question: ${query}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return res.status(200).json({
            success: true,
            data: text,
            message: "AI Response generated",
        });

    } catch (error) {
        console.error("AI CHAT ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to generate AI response",
            error: error.message,
        });
    }
};
