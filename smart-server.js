// smart-server.js - Intelligent FREE backend (no API keys needed)
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

// Conversation memory
const sessions = new Map();

// Comprehensive response database
const knowledge = {
  intro: [
    "Hello! I'm Andrew, your AI receptionist at TKLCARE. How may I assist you today?",
    "Welcome to TKLCARE! I'm Andrew. What can I help you with?",
    "Hi there! I'm Andrew from TKLCARE. How can I support you today?"
  ],
  
  services: {
    general: "TKLCARE offers 5 excellent services:\n\n1️⃣ Domiciliary Care - Home support including personal care, medication, meals\n2️⃣ Supported Living - Independent living with personalized support\n3️⃣ Outreach Services - Community support for young adults\n4️⃣ Community Services - Wellbeing and social inclusion programs\n5️⃣ Agency Staff Supply - Qualified healthcare professionals\n\nWhich service interests you most?",
    
    domiciliary: "Our Domiciliary Care provides comprehensive home support including:\n• Personal care & hygiene\n• Medication management\n• Meal preparation\n• Companionship\n• Daily living assistance\n\nWe help people maintain independence in their own homes. Would you like to discuss your specific care needs?",
    
    supported: "Supported Living at TKLCARE empowers individuals to live independently with tailored support. We provide assistance based on each person's unique needs while promoting dignity, choice, and independence. This service is perfect for those who want their own space with backup support available.",
    
    outreach: "Our Outreach Services help young adults and vulnerable individuals access resources, guidance, and community support. We recently expanded these programs! Would you like details about eligibility or referrals?",
    
    agency: "We supply qualified healthcare professionals including:\n• Healthcare Assistants (HCAs)\n• Support Workers\n• Registered Nurses\n• Care Coordinators\n\nOur staff are fully trained, DBS checked, and committed to excellent care."
  },
  
  contact: {
    general: "📍 Address: 269 Rugby Road, Dagenham, RM9 4AT, UK\n📞 Phone: +44 7378 842557\n📧 Email: info@tklcare.co.uk\n🕒 Office Hours: Mon-Fri 9am-5pm\n⏰ Care Services: Available 24/7\n\nHow else can I help?",
    phone: "You can call us at +44 7378 842557. Our office is open Monday-Friday 9am-5pm, but our care services operate 24/7 for emergencies.",
    email: "Email us at info@tklcare.co.uk and we'll respond within 24 hours during business days.",
    location: "We're located at 269 Rugby Road, Dagenham, RM9 4AT, United Kingdom. We're easily accessible by public transport with parking available for visitors."
  },
  
  careers: {
    general: "Great news! We're actively hiring:\n\n✅ Support Workers (Full-time & Part-time)\n✅ Healthcare Assistants (HCAs)\n✅ Senior Care Staff\n\nWe offer:\n• Competitive pay\n• Comprehensive training\n• Career progression\n• Supportive team environment\n\nInterested? Email your CV to info@tklcare.co.uk or call +44 7378 842557",
    
    apply: "To apply:\n1. Email your CV to info@tklcare.co.uk\n2. Call us at +44 7378 842557\n3. Mention any relevant experience in care\n\nWe'll arrange an interview with qualified candidates within 5 working days!",
    
    requirements: "For care positions, we typically look for:\n• Genuine compassion for others\n• Good communication skills\n• Relevant experience (preferred but not essential)\n• Willingness to undergo DBS check\n• Right to work in the UK\n\nWe provide full training for the right candidates!"
  },
  
  pricing: "For accurate pricing tailored to your specific needs, please contact us:\n📞 +44 7378 842557\n📧 info@tklcare.co.uk\n\nEvery care package is personalized, so we'd love to discuss your requirements and provide a detailed quote.",
  
  urgent: "For urgent care needs:\n🚨 Call us immediately: +44 7378 842557\n📧 Emergency email: info@tklcare.co.uk\n\nOur care team is available 24/7 to respond to urgent situations.",
  
  thanks: [
    "You're very welcome! If you need anything else, I'm here to help. Have a wonderful day!",
    "My pleasure! Don't hesitate to reach out if you have more questions.",
    "Happy to help! Feel free to contact us anytime at +44 7378 842557."
  ],
  
  fallback: "That's a great question! For detailed information, I recommend:\n📞 Calling us at +44 7378 842557\n📧 Emailing info@tklcare.co.uk\n\nOur team can provide comprehensive answers tailored to your situation. What else can I help with?"
};

// Smart response matching
function getResponse(message, sessionData) {
  const msg = message.toLowerCase();
  const context = sessionData.lastTopic || '';
  
  // Track topics for context
  let topic = '';
  
  // Greetings
  if (msg.match(/\b(hello|hi|hey|good morning|good afternoon|good evening|greetings)\b/i)) {
    return { text: knowledge.intro[Math.floor(Math.random() * knowledge.intro.length)], topic: 'greeting' };
  }
  
  // Thank you
  if (msg.match(/\b(thank|thanks|appreciate|grateful)\b/i)) {
    return { text: knowledge.thanks[Math.floor(Math.random() * knowledge.thanks.length)], topic: 'thanks' };
  }
  
  // Services - General
  if (msg.match(/\b(service|services|offer|provide|what do you do|help with)\b/i)) {
    return { text: knowledge.services.general, topic: 'services' };
  }
  
  // Domiciliary care
  if (msg.match(/\b(domiciliary|home care|personal care|care at home|in-home)\b/i)) {
    return { text: knowledge.services.domiciliary, topic: 'domiciliary' };
  }
  
  // Supported living
  if (msg.match(/\b(supported living|independent living|supported accommodation)\b/i)) {
    return { text: knowledge.services.supported, topic: 'supported' };
  }
  
  // Outreach
  if (msg.match(/\b(outreach|young adult|youth|community outreach)\b/i)) {
    return { text: knowledge.services.outreach, topic: 'outreach' };
  }
  
  // Agency staff
  if (msg.match(/\b(agency|staff supply|hca|healthcare assistant|temporary staff)\b/i)) {
    return { text: knowledge.services.agency, topic: 'agency' };
  }
  
  // Contact - Phone
  if (msg.match(/\b(phone|call|telephone|ring|number)\b/i)) {
    return { text: knowledge.contact.phone, topic: 'contact' };
  }
  
  // Contact - Email
  if (msg.match(/\b(email|mail|write|send message)\b/i)) {
    return { text: knowledge.contact.email, topic: 'contact' };
  }
  
  // Contact - Location
  if (msg.match(/\b(where|address|location|directions|find you|visit)\b/i)) {
    return { text: knowledge.contact.location, topic: 'contact' };
  }
  
  // Contact - General
  if (msg.match(/\b(contact|reach|get in touch|speak to|talk to)\b/i)) {
    return { text: knowledge.contact.general, topic: 'contact' };
  }
  
  // Careers - Application
  if (msg.match(/\b(apply|application|cv|resume|submit)\b/i)) {
    return { text: knowledge.careers.apply, topic: 'careers' };
  }
  
  // Careers - Requirements
  if (msg.match(/\b(requirement|qualification|need|experience|skill)\b/i)) {
    return { text: knowledge.careers.requirements, topic: 'careers' };
  }
  
  // Careers - General
  if (msg.match(/\b(job|career|work|position|vacancy|hiring|recruit|employment)\b/i)) {
    return { text: knowledge.careers.general, topic: 'careers' };
  }
  
  // Pricing
  if (msg.match(/\b(price|cost|fee|charge|rate|how much|expensive|afford)\b/i)) {
    return { text: knowledge.pricing, topic: 'pricing' };
  }
  
  // Urgent
  if (msg.match(/\b(urgent|emergency|asap|immediate|now|quickly|help)\b/i)) {
    return { text: knowledge.urgent, topic: 'urgent' };
  }
  
  // Hours
  if (msg.match(/\b(hour|open|close|when|time|available|schedule)\b/i)) {
    return { text: "Our office is open Monday-Friday, 9am-5pm for inquiries. However, our care services operate 24/7, 365 days a year. For urgent matters outside office hours, call +44 7378 842557 and our care team will respond.", topic: 'hours' };
  }
  
  // Context-aware follow-ups
  if (context === 'services' && msg.match(/\b(tell me more|more info|details|interested|learn)\b/i)) {
    return { text: "I'd be happy to provide more details! Which service interests you?\n\n1. Domiciliary Care\n2. Supported Living\n3. Outreach Services\n4. Community Services\n5. Agency Staff\n\nJust let me know!", topic: 'services' };
  }
  
  // Default fallback
  return { text: knowledge.fallback, topic: 'general' };
}

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    service: 'TKLCARE AI Receptionist',
    status: 'online',
    version: '1.0.0',
    cost: 'FREE'
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    activeSessions: sessions.size,
    timestamp: new Date().toISOString()
  });
});

// Chat endpoint
app.post('/andrew/chat', (req, res) => {
  try {
    const { message, sessionId } = req.body;
    
    if (!message?.trim()) {
      return res.status(400).json({ error: 'Message required' });
    }
    
    // Get or create session
    const sid = sessionId || `s_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const sessionData = sessions.get(sid) || { messages: [], lastTopic: '' };
    
    // Get smart response
    const response = getResponse(message, sessionData);
    
    // Update session
    sessionData.messages.push(
      { role: 'user', content: message },
      { role: 'assistant', content: response.text }
    );
    sessionData.lastTopic = response.topic;
    
    // Keep only last 10 messages
    if (sessionData.messages.length > 20) {
      sessionData.messages = sessionData.messages.slice(-20);
    }
    
    sessions.set(sid, sessionData);
    
    // Clean old sessions
    if (sessions.size > 100) {
      const oldest = sessions.keys().next().value;
      sessions.delete(oldest);
    }
    
    // Simulate processing time
    setTimeout(() => {
      res.json({
        reply: response.text,
        sessionId: sid,
        messageCount: Math.floor(sessionData.messages.length / 2)
      });
    }, 300 + Math.random() * 700);
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      reply: "I apologize for the technical issue. Please contact us directly at +44 7378 842557 or info@tklcare.co.uk for immediate assistance."
    });
  }
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ FREE TKLCARE AI Backend running on port ${PORT}`);
  console.log(`💰 Cost: $0 - No API keys required!`);
});

module.exports = app;
