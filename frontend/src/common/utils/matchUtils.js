export function getStatusText(status, language) {
    const statusTexts = {
      "1H": { en: "First Half", es: "Primer Tiempo" },
      "HT": { en: "Half-time", es: "Entre tiempo" },
      "2H": { en: "Second Half", es: "Segundo Tiempo" },
      "ET": { en: "Extra Time", es: "Tiempo Extra" },
      "P": { en: "Penalties", es: "Penalti" },
      "PST": { en: "Postponed", es: "Pospuesto" },
      "SUSP": { en: "Suspended", es: "Suspendido" },
      "INT": { en: "Interrupted", es: "Interrumpido" },
      "CANC": { en: "Cancelled", es: "Cancelado" },
      "ABD": { en: "Abandoned", es: "Abandonado" },
      "FT": { en: "Finished", es: "Finalizado" },
      "AET": { en: "Finished after extra time", es: "Finalizado en tiempo extra" },
      "PEN": { en: "Finished after the penalty shootout", es: "Finalizado en tanda de penales" },
    };
  
    const shortStatus = typeof status === 'string' ? status : status.short;
    return statusTexts[shortStatus]?.[language] || shortStatus;
  }