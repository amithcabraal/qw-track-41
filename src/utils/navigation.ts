import { clearPendingChallenge } from './challenge';

export const cleanupChallenge = () => {
  // Clear local storage
  clearPendingChallenge();
  
  // Remove challenge from URL without page reload
  if (window.history.pushState) {
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
    window.history.pushState({ path: newUrl }, '', newUrl);
  }
};