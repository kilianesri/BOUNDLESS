/* ============================================================
   BOUNDLESS — Model econòmic (funcions reutilitzables)
   Segons BUILD_amb_Claude_Code.md (secció "MODEL ECONÒMIC")

   PVP (Closing Budget) = Trip Cost × (1 + marge_X)
   Comissió             = Closing Budget − Trip Cost
   Boundless            = Comissió × 0.20
   TURISCOOP_AETHNIC    = Comissió × 0.40
   Kilian               = Comissió × 0.40
   Benefici_pax         = Comissió / total_pax
   In_target            = 320 <= Benefici_pax <= 340   (només multi-dia)
   ============================================================ */
window.BOUNDLESS = window.BOUNDLESS || {};

BOUNDLESS.economy = (function () {
  const SPLIT = { boundless: 0.20, turiscoop_aethnic: 0.40, kilian: 0.40 };
  const TARGET_MIN = 320;
  const TARGET_MAX = 340;

  // PVP a partir del cost de proveïdor i el marge X (ex. 0.30)
  function pvp(tripCost, marginX) {
    return round(tripCost * (1 + marginX));
  }

  function commission(closingBudget, tripCost) {
    return round(closingBudget - tripCost);
  }

  function splits(comm) {
    return {
      boundless: round(comm * SPLIT.boundless),
      turiscoop_aethnic: round(comm * SPLIT.turiscoop_aethnic),
      kilian: round(comm * SPLIT.kilian),
    };
  }

  function benefitPerPax(comm, totalPax) {
    if (!totalPax) return 0;
    return round(comm / totalPax);
  }

  // L'objectiu 320–340 €/pax NOMÉS aplica a viatges de diversos dies
  function inTarget(benefit, isMultiDay) {
    if (!isMultiDay) return null; // no aplica
    return benefit >= TARGET_MIN && benefit <= TARGET_MAX;
  }

  // Càlcul complet a partir de tripCost + marge + pax
  function compute({ tripCost, marginX, adults = 0, children = 0, days = 1 }) {
    const totalPax = (adults || 0) + (children || 0);
    const closing = pvp(tripCost, marginX);
    const comm = commission(closing, tripCost);
    const sp = splits(comm);
    const bpax = benefitPerPax(comm, totalPax);
    const multiDay = days > 1;
    return {
      tripCost: round(tripCost),
      marginX,
      closingBudget: closing,
      commission: comm,
      splits: sp,
      totalPax,
      benefitPerPax: bpax,
      isMultiDay: multiDay,
      inTarget: inTarget(bpax, multiDay),
    };
  }

  function round(n) { return Math.round((Number(n) || 0) * 100) / 100; }

  return { pvp, commission, splits, benefitPerPax, inTarget, compute,
           SPLIT, TARGET_MIN, TARGET_MAX, round };
})();

// Format de moneda (català)
BOUNDLESS.eur = function (n) {
  if (n === null || n === undefined || n === '') return '—';
  return new Intl.NumberFormat('ca-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);
};
BOUNDLESS.pct = function (x) { return Math.round(x * 100) + '%'; };
