/**
 * PromptArmor Enterprise SIEM Exporter & Incident Logger
 */
export function exportSecurityIncident(scanResult, reqMetadata = {}) {
  return {
    eventId: 'sec_' + Math.random().toString(36).substring(2, 9),
    timestamp: new Date().toISOString(),
    action: scanResult.safe ? 'ALLOWED' : 'BLOCKED',
    riskScore: scanResult.riskScore,
    threats: scanResult.threats,
    clientIp: reqMetadata.ip || '127.0.0.1',
    endpoint: reqMetadata.url || '/v1/chat/completions'
  };
}
