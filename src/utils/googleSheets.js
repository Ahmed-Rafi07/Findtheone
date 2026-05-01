// Google Sheets integration for tracking results
// This sends data to your Google Apps Script for tracking

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyTeLNxKuVqsCr9afNrKBS8Rul07yL_A1_KOJni2pMra3h7-iTb2B64E7qI8twMwPHErQ/exec';

export async function trackResultToSheet(userData) {
  try {
    await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify({
        userName: userData.userName || 'Unknown',
        crushName: userData.crushName || 'Unknown',
        score: userData.score || 0,
        message: userData.message || '',
        time: new Date().toISOString(),
      }),
      mode: 'no-cors', // Important for Google Apps Script
    });

    // Silently succeed (no-cors doesn't return proper response)
    return { status: 'tracked' };
  } catch (error) {
    // Silent fail - don't interrupt user experience
    console.log('[Analytics] Sheet sync skipped');
    return { status: 'offline' };
  }
}
