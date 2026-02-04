/**
 * Vercel Serverless Function: Health Check
 */

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  return res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Logan AI Chatbot'
  });
};
