// Shared entry point for the installed Salesmartly chat plugin.
let pending = null;
window.openSiteCustomerService = function () {
  if (window.ssq && typeof window.ssq.push === 'function') {
    window.ssq.push('chatOpen');
    return;
  }
  if (pending) return;
  const started = Date.now();
  pending = window.setInterval(function () {
    if (window.ssq && typeof window.ssq.push === 'function') {
      window.clearInterval(pending);
      pending = null;
      window.ssq.push('chatOpen');
    } else if (Date.now() - started > 20000) {
      window.clearInterval(pending);
      pending = null;
      console.warn('Customer service plugin has not loaded. Please retry.');
    }
  }, 200);
};
