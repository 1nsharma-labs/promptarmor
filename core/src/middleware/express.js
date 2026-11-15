import { globalPromptArmor } from '../scanner/engine.js';

/**
 * 1-Line Drop-in PromptArmor Security Middleware for Express / Node.js
 */
export function promptArmorMiddleware(options = {}) {
  return (req, res, next) => {
    // Check if body has messages array or prompt string
    const body = req.body || {};
    const messages = body.messages;
    const prompt = body.prompt;

    let scanResult;
    if (Array.isArray(messages)) {
      scanResult = globalPromptArmor.inspectMessages(messages, options);
    } else if (typeof prompt === 'string') {
      scanResult = globalPromptArmor.inspectPrompt(prompt, options);
    } else {
      return next();
    }

    if (!scanResult.safe) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({
        error: {
          message: 'Security Violation: Prompt injection or jailbreak attempt detected.',
          type: 'prompt_armor_threat_blocked',
          threats: scanResult.threats,
          riskScore: scanResult.riskScore
        }
      }));
    }

    // Attach security scan metadata to request
    req.promptArmor = scanResult;
    next();
  };
}
