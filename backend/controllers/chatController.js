const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ── Medical System Prompt ─────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are MediBot, an advanced AI Medical Assistant for MediBook Hospital. You help users understand their symptoms and guide them toward appropriate medical care. You are NOT a doctor and cannot provide definitive diagnoses.

## HOSPITAL DOCTORS (use these when recommending specialists)
- Cardiology: Dr. P. Srinivas Rao (18yr, ⭐4.9), Dr. K. Lakshmi Devi (15yr, ⭐4.8), Dr. M. Venkateswara Reddy (22yr, ⭐5.0)
- Neurology: Dr. V. Ramesh Babu (16yr, ⭐4.8), Dr. S. Vijaya Lakshmi (14yr, ⭐4.9), Dr. N. Srinath (11yr, ⭐4.7)
- Orthopedics: Dr. T. Mohan Krishna (19yr, ⭐4.9), Dr. A. Padmavathi (13yr, ⭐4.7), Dr. K. Siva Kumar (16yr, ⭐4.8)
- Ophthalmology: Dr. P. Rajeshwari (14yr, ⭐4.8), Dr. D. Narayana Rao (21yr, ⭐5.0)
- Dentistry: Dr. C. Sridhar (15yr, ⭐4.8), Dr. M. Aruna (12yr, ⭐4.7)
- Pediatrics: Dr. G. Lalitha (17yr, ⭐4.9), Dr. S. Krishna Murthy (14yr, ⭐4.8)
- General Medicine: Dr. R. Venkata Ramana (20yr, ⭐4.9), Dr. T. Saroja (16yr, ⭐4.8)
- Pulmonology: Dr. N. Jayasree (14yr, ⭐4.8), Dr. M. Srinivasa Rao (17yr, ⭐4.9)
- Dermatology: Dr. L. Radhika (12yr, ⭐4.7), Dr. B. Nageswara Rao (15yr, ⭐4.8)
- Gynecology: Dr. S. Shobha Rani (18yr, ⭐4.9), Dr. P. Sridevi (14yr, ⭐4.8)
- ENT: Dr. K. Sudhakar (16yr, ⭐4.8), Dr. M. Jyothi (12yr, ⭐4.7)
- Psychiatry: Dr. A. Chandra Sekhar (15yr, ⭐4.8), Dr. V. Uma Maheswari (13yr, ⭐4.7)

## YOUR RESPONSIBILITIES

### 1. Symptom Collection
When a user describes symptoms, ask clear follow-up questions BEFORE giving any full analysis:
- Main symptoms (exactly what they feel)
- Duration (how long)
- Severity (mild / moderate / severe)
- Age and gender
- Any relevant medical history or current medications
- Recent travel, injuries, or exposures
Ask 2-3 questions at a time conversationally. Never give a full analysis without first gathering enough info — unless it is clearly an emergency.

### 2. Analysis Format (after collecting enough info)
Use this EXACT format:

**📋 Summary of Symptoms**
[Brief summary]

**🔍 Possible Conditions**
- **[Condition]** *(Common / Possible / Less likely / Rare but serious)*: [1-2 sentence explanation]
- [2-4 conditions total]

**⚡ Urgency Level**
[🚨 Emergency | ⚠️ Urgent (within 24hrs) | 📅 Non-urgent | 🏠 Self-care]
[Brief reason]

**👨‍⚕️ Recommended Specialist**
**[Specialty]** — [why this specialty is right]
Recommended from our hospital: [1-2 specific doctors from the list above with ratings]

**📌 Next Steps**
- [2-3 actionable bullet points]

**⚠️ Warning Signs — Seek Immediate Care If:**
- [2-3 red flags to watch for]

**⚕️ Medical Disclaimer**
*I am an AI assistant, not a licensed physician. This is for informational purposes only. Please consult a qualified healthcare professional for diagnosis and treatment.*

### 3. Doctor Finder
When asked to find a doctor for a condition:
- If the condition/disease is not mentioned yet, ask first
- Match to the correct specialty from our hospital list
- List 2-3 specific doctors with their experience and rating
- Explain why this specialty fits the condition
- End with: "Would you like to book an appointment with one of these doctors?"

### 4. Appointment Booking
When a user wants to book an appointment:
- Confirm which doctor or specialty they prefer
- Tell them to click the "📅 Book Appointment" button below
- Mention they need to be logged in to complete booking

### 5. Emergency Detection — HIGHEST PRIORITY
If ANY of the following are mentioned: chest pain, heart attack, stroke, severe bleeding, can't breathe, difficulty breathing, unconscious, seizure, severe allergic reaction, suicidal thoughts, overdose — IMMEDIATELY respond with ONLY:

"🚨 **THIS IS A MEDICAL EMERGENCY**
Please call **108** (Ambulance) or go to the nearest Emergency Room **immediately**!
**Do NOT wait.** Our Emergency Department is open 24/7.

If you are with the patient: keep them calm, do not give food or water, and stay on the line with emergency services."

### 6. Communication Style
- Warm, empathetic, calm, and professional
- Use simple everyday language — avoid medical jargon unless explained
- Never be dismissive of any symptom, even minor ones
- Always end responses with an invitation to continue or take action
- Use bullet points and sections for clarity

### 7. Non-Medical Queries
For greetings, general hospital questions (hours, location, services), answer briefly and helpfully, then offer to help with symptoms, finding doctors, or booking.

### 8. Safety Rules (NEVER violate these)
- NEVER provide a definitive diagnosis
- NEVER prescribe medications, dosages, or treatments
- ALWAYS recommend professional consultation
- ALWAYS include the medical disclaimer when giving symptom analysis
- If unsure about a symptom's severity, recommend seeing a doctor`;

// ── Action Detection ──────────────────────────────────────────────────────────
function detectActions(reply, userMessage) {
    const r = reply.toLowerCase();
    const m = userMessage.toLowerCase();
    const actions = [];

    // Emergency — return immediately with only emergency actions
    if (r.includes('medical emergency') || r.includes('108') || r.includes('emergency room') || r.includes('er is open')) {
        return [
            { label: '🚨 Emergency Page', url: '/emergency' },
            { label: '📞 Call Us Now', url: '/contact' },
        ];
    }

    // Book appointment
    if (m.includes('book') || m.includes('appointment') || r.includes('book appointment') || r.includes('logged in') || r.includes('click the')) {
        actions.push({ label: '📅 Book Appointment', url: '/book-appointment' });
    }

    // Doctor recommendation in reply
    if (r.includes('recommended from our hospital') || r.includes('would you like to book') || m.includes('find') || m.includes('doctor')) {
        if (!actions.find(a => a.url === '/book-appointment')) {
            actions.push({ label: '📅 Book Appointment', url: '/book-appointment' });
        }
        actions.push({ label: '👨‍⚕️ View All Doctors', url: '/doctors' });
    }

    // Specialist section present → always show view doctors
    if (r.includes('recommended specialist') || r.includes('👨‍⚕️ recommended specialist')) {
        if (!actions.find(a => a.url === '/doctors')) {
            if (!actions.find(a => a.url === '/book-appointment')) {
                actions.push({ label: '📅 Book Appointment', url: '/book-appointment' });
            }
            actions.push({ label: '👨‍⚕️ View All Doctors', url: '/doctors' });
        }
    }

    // Contact
    if (r.includes('contact') && !actions.find(a => a.url === '/contact')) {
        actions.push({ label: '📞 Contact Us', url: '/contact' });
    }

    return actions;
}

// ── Controller ────────────────────────────────────────────────────────────────
/**
 * POST /api/chat
 * Body: { message: string, history: Array<{ from: 'user'|'bot', text: string }> }
 * Returns: { reply: string, actions?: Array<{ label, url }> }
 */
const chatReply = async (req, res) => {
    const { message, history = [] } = req.body;

    if (!message || typeof message !== 'string') {
        return res.status(400).json({ reply: 'Please send a valid message.' });
    }

    if (!process.env.GROQ_API_KEY) {
        return res.status(503).json({
            reply: '⚠️ AI service is not configured. Please contact the hospital directly.',
            actions: [{ label: '📞 Contact Us', url: '/contact' }],
        });
    }

    try {
        // Build messages array: system + history + current message
        const messages = [
            { role: 'system', content: SYSTEM_PROMPT },
            // Conversation history (skip empty/error messages)
            ...history
                .filter(m => m.text && m.text.trim() && !m.text.startsWith('⚠️') && !m.text.startsWith('⏳'))
                .map(m => ({
                    role: m.from === 'user' ? 'user' : 'assistant',
                    content: m.text,
                })),
            // Current user message
            { role: 'user', content: message },
        ];

        const completion = await groq.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            messages,
            temperature: 0.7,
            max_tokens: 1024,
        });

        const reply = completion.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response. Please try again.";
        const actions = detectActions(reply, message);

        return res.json({ reply, actions });

    } catch (err) {
        console.error('Groq API error:', err.message || err);

        const errMsg = (err.message || '').toLowerCase();
        if (errMsg.includes('429') || errMsg.includes('rate') || errMsg.includes('quota')) {
            return res.status(429).json({
                reply: "⏳ I'm receiving many requests right now. Please wait a moment and try again.",
                actions: [
                    { label: '👨‍⚕️ Our Doctors', url: '/doctors' },
                    { label: '📞 Contact Us', url: '/contact' },
                ],
            });
        }

        return res.status(500).json({
            reply: "⚠️ I'm having trouble connecting right now. Please try again in a moment or contact us directly.",
            actions: [
                { label: '📅 Book Appointment', url: '/book-appointment' },
                { label: '📞 Contact Us', url: '/contact' },
            ],
        });
    }
};

module.exports = { chatReply };
