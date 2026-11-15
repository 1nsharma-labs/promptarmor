/**
 * PromptArmor Core Threat Detectors (OWASP Top 10 for LLMs)
 */

export const INJECTION_RULES = [
  // 1. System Prompt Overrides & Instruction Hijacking
  {
    id: 'PA-001',
    name: 'Instruction Hijacking / System Override',
    category: 'SYSTEM_OVERRIDE',
    severity: 'CRITICAL',
    regex: /(?:ignore|disregard|forget|bypass|override)\s+(?:all\s+)?(?:previous|prior|above|existing|system)\s+(?:instructions|directions|rules|prompts|guidelines)/i
  },
  {
    id: 'PA-002',
    name: 'System Prompt Extraction / Leaking',
    category: 'SYSTEM_OVERRIDE',
    severity: 'HIGH',
    regex: /(?:repeat|print|show|reveal|display|output|tell me)\s+(?:your\s+)?(?:system\s+prompt|initial\s+prompt|base\s+instructions|system\s+instructions|hidden\s+rules)/i
  },
  {
    id: 'PA-003',
    name: 'Developer Mode / Unrestricted State Hijack',
    category: 'SYSTEM_OVERRIDE',
    severity: 'CRITICAL',
    regex: /(?:enter|enable|activate|switch\s+to)\s+(?:developer\s+mode|god\s+mode|debug\s+mode|unrestricted\s+mode|jailbreak\s+mode)/i
  },

  // 2. Jailbreak Personas & Anti-Filter Roleplay
  {
    id: 'PA-004',
    name: 'DAN (Do Anything Now) Jailbreak',
    category: 'JAILBREAK_ROLEPLAY',
    severity: 'CRITICAL',
    regex: /\b(?:DAN\s+mode|Do\s+Anything\s+Now|EvilConfidant|STAN|DUDE|AIM\s+mode)\b/i
  },
  {
    id: 'PA-005',
    name: 'Hypothetical Safety Bypass Roleplay',
    category: 'JAILBREAK_ROLEPLAY',
    severity: 'HIGH',
    regex: /(?:pretend|act\s+as|roleplay\s+as)\s+(?:an?\s+)?(?:unfiltered|unrestricted|amoral|evil|jailbroken|ruleless)\s+(?:ai|assistant|model|bot)/i
  },
  {
    id: 'PA-006',
    name: 'Ethics Inversion / Opposite Day Prompting',
    category: 'JAILBREAK_ROLEPLAY',
    severity: 'HIGH',
    regex: /(?:ignore\s+all\s+ethical|disregard\s+content\s+policies|for\s+educational\s+purposes\s+only\s+without\s+restrictions|in\s+a\s+fictional\s+world\s+with\s+no\s+laws)/i
  },

  // 3. Indirect Prompt Injection & Steganography
  {
    id: 'PA-007',
    name: 'Invisible Unicode Steganography',
    category: 'INDIRECT_INJECTION',
    severity: 'HIGH',
    regex: /[\u200B\u200C\u200D\uFEFF]{2,}/
  },
  {
    id: 'PA-008',
    name: 'Hidden HTML Comment Injection',
    category: 'INDIRECT_INJECTION',
    severity: 'HIGH',
    regex: /<!--\s*(?:system|override|instruction|admin):[\s\S]*?-->/i
  },

  // 4. Data Exfiltration via Markdown Link/Image Injection
  {
    id: 'PA-009',
    name: 'Markdown Image / Webhook Exfiltration Vector',
    category: 'DATA_EXFILTRATION',
    severity: 'CRITICAL',
    regex: /!\[.*?\]\(https?:\/\/[^\s\)]+[\?&](?:token|key|secret|password|prompt|q|leak)=/i
  },

  // 5. Delimiter & Protocol Tag Spoofing
  {
    id: 'PA-010',
    name: 'ChatML / Token Delimiter Spoofing',
    category: 'DELIMITER_ESCAPES',
    severity: 'CRITICAL',
    regex: /(?:<\|im_start\|>|<\|im_end\|>|<\|endoftext\|>|\[INST\]|\[\/INST\]|<<SYS>>|<\/SYS>>)/i
  }
];
