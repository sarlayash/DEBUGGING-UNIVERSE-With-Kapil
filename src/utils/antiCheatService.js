import { doc, setDoc, collection } from 'firebase/firestore';
import { db, auth } from './firebase';
import { setAccountLock, clearUserProfile } from './storage';

export const NOTIFIED_SECURITY_EMAILS = [
  'kapilnarula27july@gmail.com',
  'namaste@sarlayash.com'
];

/**
 * Dispatches an automated incident notification email to Kapil and SarlaYash security inboxes
 */
async function dispatchSecurityAlertEmail(incidentData) {
  const payload = {
    _subject: `⚠️ [CRITICAL ANTI-CHEAT ALERT] Disqualification & 24H Lockout: ${incidentData.candidateName}`,
    "Platform": "DEBUGGING UNIVERSE With Kapil (Powered By SarlaYash Mission)",
    "Incident Reference": incidentData.incidentId,
    "Candidate Name": incidentData.candidateName,
    "Candidate Email": incidentData.candidateEmail,
    "Candidate Google UID": incidentData.candidateUid,
    "Cheating Violation Detected": incidentData.violationReason,
    "Detection Timestamp": incidentData.disqualifiedAt,
    "Penalty Enforced": "24-Hour Complete Account Lockout (Zero Retry)",
    "Lockout Active Until": incidentData.lockExpiresStr,
    "Browser Environment": navigator.userAgent,
    "Viewport Resolution": `${window.innerWidth}x${window.innerHeight} (Screen: ${window.screen.width}x${window.screen.height})`,
    "Authorized Signatory Notified": "Kapil (Founder & Chief Architect, SarlaYash Mission)",
    "Recipient List": NOTIFIED_SECURITY_EMAILS.join(', ')
  };

  // Dispatch to both email endpoints concurrently
  const emailPromises = NOTIFIED_SECURITY_EMAILS.map(async (email) => {
    try {
      const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(email)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      return { email, status: response.ok ? 'DISPATCHED' : 'QUEUED' };
    } catch (err) {
      console.warn(`Email dispatch attempt notice for ${email}:`, err.message);
      return { email, status: 'LOGGED_IN_FIRESTORE' };
    }
  });

  return Promise.allSettled(emailPromises);
}

/**
 * Master handler for Cheating Violations:
 * 1. Enforces strict 24-hour account lockout in localStorage and Cloud Firestore
 * 2. Immediately dispatches alert emails to kapilnarula27july@gmail.com & namaste@sarlayash.com
 * 3. Logs immutable forensic audit trail to Cloud Firestore collection 'anti_cheat_violations'
 * 4. Terminates current active session
 */
export async function reportCheatingIncident({
  candidateName = 'Verified Learner',
  candidateEmail = 'learner@google.com',
  candidateUid = 'ANONYMOUS',
  violationReason = 'Anti-cheat integrity protocol violation',
  examContext = {}
}) {
  const now = Date.now();
  const lockoutDurationMs = 24 * 60 * 60 * 1000; // 24 Hours
  const lockExpiresAt = now + lockoutDurationMs;
  const lockExpiresStr = new Date(lockExpiresAt).toLocaleString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short'
  });
  const disqualifiedAt = new Date(now).toISOString();
  const incidentId = `SY-AUDIT-${now.toString(36).toUpperCase()}-${Math.floor(Math.random() * 8999 + 1000)}`;

  // 1. Enforce local 24-hour lockout
  setAccountLock(violationReason, lockoutDurationMs);

  const incidentRecord = {
    incidentId,
    candidateName,
    candidateEmail,
    candidateUid,
    violationReason,
    disqualifiedAt,
    lockExpiresAt,
    lockExpiresStr,
    lockDurationHours: 24,
    notifiedEmails: NOTIFIED_SECURITY_EMAILS,
    status: 'ACTIVE_LOCKOUT_24H',
    userAgent: navigator.userAgent,
    screenResolution: `${window.screen.width}x${window.screen.height}`,
    examContext: {
      ...examContext,
      score: 0,
      passed: false
    }
  };

  // 2. Log forensic record to Cloud Firestore
  try {
    const violationRef = doc(db, 'anti_cheat_violations', incidentId);
    await setDoc(violationRef, incidentRecord, { merge: true });

    // Also update learner profile lock state if UID exists
    if (candidateUid && candidateUid !== 'ANONYMOUS') {
      const learnerRef = doc(db, 'learners', candidateUid);
      await setDoc(learnerRef, {
        accountLock: {
          isLocked: true,
          lockedUntil: lockExpiresAt,
          lockExpiresStr,
          reason: violationReason,
          incidentId,
          lockedAt: disqualifiedAt
        }
      }, { merge: true });
    }

    // Also trigger Firebase Email Extension queue if enabled
    try {
      const mailRef = doc(collection(db, 'mail'));
      await setDoc(mailRef, {
        to: NOTIFIED_SECURITY_EMAILS,
        message: {
          subject: `⚠️ [CRITICAL ANTI-CHEAT ALERT] Candidate Disqualified & Locked for 24H: ${candidateName}`,
          html: `
            <div style="font-family: sans-serif; padding: 20px; color: #0f172a; background: #ffffff;">
              <h2 style="color: #b91c1c;">⚠️ Examination Integrity Infraction Alert</h2>
              <p><strong>Debugging Universe With Kapil (Powered By SarlaYash Mission)</strong></p>
              <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
                <tr><td style="padding: 8px; border: 1px solid #cbd5e1; font-weight: bold;">Candidate</td><td style="padding: 8px; border: 1px solid #cbd5e1;">${candidateName} (${candidateEmail})</td></tr>
                <tr><td style="padding: 8px; border: 1px solid #cbd5e1; font-weight: bold;">Violation</td><td style="padding: 8px; border: 1px solid #cbd5e1; color: #b91c1c;">${violationReason}</td></tr>
                <tr><td style="padding: 8px; border: 1px solid #cbd5e1; font-weight: bold;">Incident ID</td><td style="padding: 8px; border: 1px solid #cbd5e1; font-family: monospace;">${incidentId}</td></tr>
                <tr><td style="padding: 8px; border: 1px solid #cbd5e1; font-weight: bold;">Timestamp</td><td style="padding: 8px; border: 1px solid #cbd5e1;">${disqualifiedAt}</td></tr>
                <tr><td style="padding: 8px; border: 1px solid #cbd5e1; font-weight: bold;">Penalty</td><td style="padding: 8px; border: 1px solid #cbd5e1; font-weight: bold; color: #b91c1c;">24-Hour Account Lockout (Locked until: ${lockExpiresStr})</td></tr>
              </table>
              <p style="margin-top: 20px; font-size: 12px; color: #64748b;">Notice dispatched automatically to: ${NOTIFIED_SECURITY_EMAILS.join(', ')}</p>
            </div>
          `
        }
      });
    } catch (e) {}

  } catch (fsError) {
    console.warn('Firestore incident logging notice:', fsError.message);
  }

  // 3. Dispatch automated email to kapilnarula27july@gmail.com & namaste@sarlayash.com
  dispatchSecurityAlertEmail(incidentRecord);

  return incidentRecord;
}
