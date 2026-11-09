const translations = {
  es: {
    languageLabel: "Idioma",
    eyebrow: "COLEGIO BOLÍVAR · RETO AMBIENTAL",
    pageTitle: "Tu impacto también cuenta.",
    introText: "Calcula una estimación de tu huella ambiental durante una semana escolar.",
    formTitle: "Tus hábitos semanales",
    formDescription: "Completa los datos para obtener tu estimación.",
    transportLabel: "¿Cómo vas al colegio?",
    transportPlaceholder: "Selecciona tu transporte",
    bus: "Bus",
    privateCar: "Carro privado",
    sharedCar: "Carro compartido",
    bikeWalk: "Bicicleta / Caminando",
    paperLabel: "Hojas de papel usadas al día",
    paperPlaceholder: "Ejemplo: 5",
    recyclingLabel: "¿Cómo describirías tu reciclaje?",
    recyclingPlaceholder: "Selecciona tu nivel",
    low: "Bajo",
    medium: "Medio",
    high: "Alto",
    calculateButton: "Calcular mi impacto",
    resultsEyebrow: "TU RESUMEN",
    resultsTitle: "Tu estimación semanal",
    co2Label: "Huella de carbono estimada",
    co2Note: "de CO₂ por semana",
    pointsLabel: "Puntaje ecológico",
    pointsNote: "Eco-Points",
    printButton: "Imprimir / Guardar PDF",
    resetButton: "Hacer otro cálculo",
    disclaimer: "Estimación educativa basada en los datos ingresados; no representa una medición oficial.",
    footer: "Pequeños hábitos, grandes cambios.",
    error: "Completa todos los campos con valores válidos.",
    explanationLow: "Tu resultado muestra oportunidades para reducir tu impacto. Considera compartir el transporte, caminar cuando sea posible y reciclar más.",
    explanationMid: "Vas por buen camino. Unos pequeños cambios en transporte, uso de papel y reciclaje pueden reducir aún más tu impacto.",
    explanationHigh: "¡Buen trabajo! Tus hábitos ayudan a reducir tu impacto. Sigue manteniendo estas decisiones sostenibles."
  },
  en: {
    languageLabel: "Language",
    eyebrow: "COLEGIO BOLÍVAR · ENVIRONMENTAL CHALLENGE",
    pageTitle: "Your impact matters.",
    introText: "Estimate your environmental footprint during a school week.",
    formTitle: "Your weekly habits",
    formDescription: "Complete the fields to get your estimate.",
    transportLabel: "How do you get to school?",
    transportPlaceholder: "Select your transportation",
    bus: "Bus",
    privateCar: "Private car",
    sharedCar: "Shared car",
    bikeWalk: "Bicycle / Walking",
    paperLabel: "Sheets of paper used per day",
    paperPlaceholder: "Example: 5",
    recyclingLabel: "How would you describe your recycling?",
    recyclingPlaceholder: "Select your level",
    low: "Low",
    medium: "Medium",
    high: "High",
    calculateButton: "Calculate my impact",
    resultsEyebrow: "YOUR SUMMARY",
    resultsTitle: "Your weekly estimate",
    co2Label: "Estimated carbon footprint",
    co2Note: "of CO₂ per week",
    pointsLabel: "Eco score",
    pointsNote: "Eco-Points",
    printButton: "Print / Save as PDF",
    resetButton: "Start another calculation",
    disclaimer: "Educational estimate based on the information entered; it is not an official measurement.",
    footer: "Small habits, big changes.",
    error: "Complete all fields with valid values.",
    explanationLow: "Your result shows opportunities to reduce your impact. Consider sharing transportation, walking when possible, and recycling more.",
    explanationMid: "You are on the right track. Small changes in transportation, paper use, and recycling can reduce your impact further.",
    explanationHigh: "Great work! Your habits help reduce your impact. Keep making these sustainable choices."
  }
};

const form = document.getElementById("eco-form");
const results = document.getElementById("results");
const errorMessage = document.getElementById("form-error");
const languageSelect = document.getElementById("language");
const printButton = document.getElementById("print-button");
const resetButton = document.getElementById("reset-button");

let currentLanguage = "es";

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) element.textContent = value;
}

function setLanguage(language) {
  currentLanguage = language;
  const t = translations[language];

  document.documentElement.lang = language;
  document.title = language === "es"
    ? "Bolívar Eco-Calculator"
    : "Bolívar Eco-Calculator";

  setText("language-label", t.languageLabel);
  setText("eyebrow", t.eyebrow);
  setText("page-title", t.pageTitle);
  setText("intro-text", t.introText);
  setText("form-title", t.formTitle);
  setText("form-description", t.formDescription);
  setText("transport-label", t.transportLabel);
  setText("transport-placeholder", t.transportPlaceholder);
  setText("option-bus", t.bus);
  setText("option-private", t.privateCar);
  setText("option-shared", t.sharedCar);
  setText("option-bike", t.bikeWalk);
  setText("paper-label", t.paperLabel);
  document.getElementById("paper").placeholder = t.paperPlaceholder;
  setText("recycling-label", t.recyclingLabel);
  setText("recycling-placeholder", t.recyclingPlaceholder);
  setText("option-low", t.low);
  setText("option-medium", t.medium);
  setText("option-high", t.high);
  setText("calculate-button", t.calculateButton + " →");
  setText("results-eyebrow", t.resultsEyebrow);
  setText("results-title", t.resultsTitle);
  setText("co2-label", t.co2Label);
  setText("co2-note", t.co2Note);
  setText("points-label", t.pointsLabel);
  setText("points-note", t.pointsNote);
  setText("print-button-text", t.printButton);
  setText("reset-button-text", t.resetButton);
  setText("disclaimer", t.disclaimer);
  setText("footer-text", t.footer);

  if (!errorMessage.hidden) {
    errorMessage.textContent = t.error;
  }

  updateExplanation();
}

function calculateImpact(transport, paperPerDay, recycling) {
  const transportFactors = {
    bus: 1.2,
    "private-car": 4.8,
    "shared-car": 2.2,
    "bike-walk": 0
  };

  const recyclingPoints = {
    low: 10,
    medium: 25,
    high: 40
  };

  const weeklyTransportKg = transportFactors[transport] * 5;
  const weeklyPaperKg = paperPerDay * 5 * 0.005;
  const co2 = weeklyTransportKg + weeklyPaperKg;

  let points = 100 - Math.round(co2 * 4);
  points += recyclingPoints[recycling];
  points = Math.max(0, Math.min(100, points));

  return {
    co2: co2.toFixed(2),
    points
  };
}

function updateExplanation() {
  if (!results || results.hidden) return;

  const points = Number(document.getElementById("points-value").textContent);
  const t = translations[currentLanguage];

  let message;
  if (points >= 75) {
    message = t.explanationHigh;
  } else if (points >= 45) {
    message = t.explanationMid;
  } else {
    message = t.explanationLow;
  }

  setText("result-explanation", message);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  errorMessage.hidden = true;

  const transport = document.getElementById("transport").value;
  const paperInput = document.getElementById("paper");
  const paperPerDay = Number(paperInput.value);
  const recycling = document.getElementById("recycling").value;

  if (
    !transport ||
    !recycling ||
    paperInput.value.trim() === "" ||
    !Number.isFinite(paperPerDay) ||
    paperPerDay < 0
  ) {
    errorMessage.textContent = translations[currentLanguage].error;
    errorMessage.hidden = false;
    return;
  }

  const result = calculateImpact(transport, paperPerDay, recycling);

  setText("co2-value", result.co2);
  setText("points-value", String(result.points));

  results.hidden = false;
  updateExplanation();
  results.scrollIntoView({ behavior: "smooth", block: "start" });
});

languageSelect.addEventListener("change", () => {
  setLanguage(languageSelect.value);
});

printButton.addEventListener("click", () => {
  if (results.hidden) return;
  window.print();
});

resetButton.addEventListener("click", () => {
  form.reset();
  results.hidden = true;
  errorMessage.hidden = true;
  setText("co2-value", "0.00");
  setText("points-value", "0");
  setText("result-explanation", "");
  document.getElementById("transport").focus();
  window.scrollTo({ top: 0, behavior: "smooth" });
});

setLanguage("es");