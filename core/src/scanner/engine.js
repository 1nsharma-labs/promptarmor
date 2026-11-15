import { INJECTION_RULES } from '../rules/detectors.js';

/**
 * PromptArmor Core Inspection Engine
 * Sub-2ms Zero-Dependency LLM Guardrail & Threat Scanner
 */
export class PromptArmorEngine {
  inspectPrompt(text, options = {}) {
    const startTime = performance.now();
    if (!text || typeof text !== 'string') {
      return {
        safe: true,
        riskScore: 0,
        verdict: 'SAFE',
        threats: [],
        latencyMs: 0
      };
    }

    const threats = [];
    let riskScore = 0;

    // 1. Scan for invisible unicode characters
    if (/[\u200B\u200C\u200D\uFEFF]/.test(text)) {
      threats.push({
        id: 'PA-007',
        name: 'Invisible Unicode Steganography',
        category: 'INDIRECT_INJECTION',
        severity: 'HIGH',
        snippet: '[Hidden Unicode Detected]'
      });
      riskScore += 40;
    }

    // 2. Scan regex threat patterns
    for (const rule of INJECTION_RULES) {
      if (rule.id === 'PA-007') continue; // Handled above
      const match = text.match(rule.regex);
      if (match) {
        threats.push({
          id: rule.id,
          name: rule.name,
          category: rule.category,
          severity: rule.severity,
          snippet: match[0].slice(0, 80)
        });

        if (rule.severity === 'CRITICAL') riskScore += 50;
        else if (rule.severity === 'HIGH') riskScore += 30;
        else riskScore += 15;
      }
    }

    // Cap score at 100
    riskScore = Math.min(100, riskScore);

    const isBlocked = riskScore >= (options.threshold || 50);
    const verdict = isBlocked ? 'BLOCKED' : (riskScore > 20 ? 'SUSPICIOUS' : 'SAFE');
    const latencyMs = Number((performance.now() - startTime).toFixed(3));

    return {
      safe: !isBlocked,
      verdict,
      riskScore,
      threatCount: threats.length,
      threats,
      latencyMs
    };
  }

  /**
   * Inspect OpenAI format messages array
   */
  inspectMessages(messages = [], options = {}) {
    const combinedThreats = [];
    let highestRiskScore = 0;

    for (let i = 0; i < messages.length; i++) {
      const msg = messages[i];
      if (msg.role === 'system') continue; // Don't block trusted developer system prompts

      const content = typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content);
      const res = this.inspectPrompt(content, options);

      if (!res.safe) {
        return {
          safe: false,
          verdict: 'BLOCKED',
          failingMessageIndex: i,
          failingRole: msg.role,
          riskScore: res.riskScore,
          threats: res.threats,
          latencyMs: res.latencyMs
        };
      }

      if (res.threats.length > 0) {
        combinedThreats.push(...res.threats);
        highestRiskScore = Math.max(highestRiskScore, res.riskScore);
      }
    }

    return {
      safe: true,
      verdict: highestRiskScore > 20 ? 'SUSPICIOUS' : 'SAFE',
      riskScore: highestRiskScore,
      threatCount: combinedThreats.length,
      threats: combinedThreats
    };
  }
}

export const globalPromptArmor = new PromptArmorEngine();
