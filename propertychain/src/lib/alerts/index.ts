/**
 * Alert System Index - PropertyChain
 * 
 * Main exports for the alert system
 * Following UpdatedUIPlan.md Step 65 specifications and CLAUDE.md principles
 */

export { AlertService, alertService } from './service'
export type { AlertSeverity } from './service'
export {
  DEFAULT_THRESHOLDS,
  TIME_WINDOWS,
  NOTIFICATION_TEMPLATES,
  ALERT_CATEGORIES,
  ESCALATION_POLICIES,
  MAINTENANCE_WINDOWS,
  SUPPRESSION_RULES,
  INTEGRATIONS,
  ENVIRONMENT_OVERRIDES,
} from './config'

// Utility functions
export {
  addAlertRule,
  submitMetric,
  getActiveAlerts,
  getAlertHistory,
} from './service'

// Initialize alert system
import { alertService } from './service'

// Export configured instance
export default alertService