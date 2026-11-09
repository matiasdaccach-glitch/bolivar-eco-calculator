"use strict";

const form = document.getElementById("eco-form");
const languageSelect = document.getElementById("language");
const results = document.getElementById("results");
const formError = document.getElementById("form-error");

const transportCO2 = {
  bus: 2.0,
  "private-car": 8.0,
  "shared-car": 4.0,
  "bike-walk": 0
};

const recyclingPoints = {
  low: 5,
  medium: 15,
  high: 25
};

const transportPoints = {
  bus: 15,
  "private-car": 0,
  "shared-car": 10,
  "bike-walk": 25
};

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
    calculate: "Calcular mi impacto",
    error: "Completa todos los campos con valores válidos.",
    resultsEyebrow: "TU RESUMEN",
    resultsTitle: "Tu estimación semanal",
    co2Label: "Huella de carbono estimada",
    co2Note: "de CO₂ por semana",
    pointsLabel: "Puntaje ecológico",
    print: "Imprimir / Guardar PDF",
    reset: "Hacer otro cálculo",
    disclaimer: "Estimación educativa basada en los datos ingresados; no representa una medición oficial.",
    footer: "Pequeños hábitos, grandes cambios.",
    explanation: "Estimación para cinco días escolares. El cálculo usa factores educativos de transporte y papel."
  },
  en: {
    languageLabel: "Language",
    eyebrow: "COLEGIO BOLÍVAR · ECO CHALLENGE",
    pageTitle: "Your impact matters.",
    introText: "Estimate your environmental footprint for a school week.",
    formTitle: "Your weekly habits",
    formDescription: "Enter your information to get an estimate.",
    transportLabel: "How do you travel to school?",
    transportPlaceholder: "Select your transportation",
    bus: "Bus",
    privateCar: "Private car",
    sharedCar: "Carpool",
    bikeWalk: "Bicycle / Walking",
    paperLabel: "Sheets of paper used per day",
    paperPlaceholder: "Example: 5",
    recyclingLabel: "How would you describe your recycling?",
    recyclingPlaceholder: "Select your level",
    low: "Low",
    medium: "Medium",
    high: "High",
    calculate: "Calculate my impact",
    error: "Complete every field with valid values.",
    resultsEyebrow: "YOUR SUMMARY",
    resultsTitle: "Your weekly estimate",
    co2Label: "Estimated carbon footprint",
    co2Note: "kg of CO₂ per week",
    pointsLabel: "Eco score",
    print: "Print / Save PDF",
    reset: "Calculate again",
    disclaimer: "Educational estimate based on the information entered; it is not an official measurement.",
    footer: "Small habits, big changes.",
    explanation: "Estimate for five school days. The calculation uses educational transportation and paper factors."
  }
};

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) {
    element.textContent = value;
  }
}

function updateLanguage(language) {
  const text = translations[language] || translations.es;

  document.documentElement.lang = language;

  setText("language-label", text.languageLabel);
  setText("eyebrow", text.eyebrow);
  setText("page-title", text.pageTitle);
  setText("intro-text", text.introText);
  setText("form-title", text.formTitle);
  setText("form-description", text.formDescription);
  setText("transport-label", text.transportLabel);
  setText("transport-placeholder", text.transportPlaceholder);
  setText("option-bus", text.bus);
  setText("option-private", text.privateCar);
  setText("option-shared", text.sharedCar);
  setText("option-bike", text.bikeWalk);
  setText("paper-label", text.paperLabel);
  setText("paper", "");
  document.getElementById("paper").placeholder = text.paperPlaceholder;
  setText("recycling-label", text.recyclingLabel);
  setText("recycling-placeholder", text.recyclingPlaceholder);
  setText("option-low", text.low);
  setText("option-medium", text.medium);
  setText("option-high", text.high);
  setText("calculate-button", text.calculate);
  setText("results-eyebrow", text.resultsEyebrow);
  setText("results-title", text.resultsTitle);
  setText("co2-label", text.co2Label);
  setText("co2-note", text.co2Note);
  setText("points-label", text.pointsLabel);
  setText("print-button-text", text.print);
  setText("reset-button-text", text.reset);
  setText("disclaimer", text.disclaimer);
  setText("footer-text", text.footer);

  if (!formError.hidden) {
    formError.textContent = text.error;
  }

  if (!results.hidden) {
    setText("result-explanation", text.explanation);
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const language = languageSelect.value;
  const text = translations[language] || translations.es;
  const transport = document.getElementById("transport").value;
  const paperInput = document.getElementById("paper").value;
  const recycling = document.getElementById("recycling").value;
  const paperPerDay = Number(paperInput);

  if (
    !transport ||
    !recycling ||
    paperInput === "" ||
    !Number.isFinite(paperPerDay) ||
    paperPerDay < 0
  ) {
    formError.textContent = text.error;
    formError.hidden = false;
    return;
  }

  formError.hidden = true;

  // Mantiene la estimación del ejemplo: cinco días escolares.
  const weeklyTransportCO2 = transportCO2[transport] * 5;
  const weeklyPaperCO2 = paperPerDay * 5 * 0.005;
  const weeklyCO2 = weeklyTransportCO2 + weeklyPaperCO2;

  // Mantiene el puntaje del ejemplo anterior.
  const paperPoints = Math.max(0, 20 - paperPerDay);
  const ecoPoints =
    transportPoints[transport] +
    recyclingPoints[recycling] +
    paperPoints;

  document.getElementById("co2-value").textContent = weeklyCO2.toFixed(2);
  document.getElementById("points-value").textContent = String(ecoPoints);
  setText("result-explanation", text.explanation);
  results.hidden = false;
  results.scrollIntoView({ behavior: "smooth", block: "nearest" });
});

languageSelect.addEventListener("change", () => {
  updateLanguage(languageSelect.value);
});

document.getElementById("print-button").addEventListener("click", () => {
  window.print();
});

document.getElementById("reset-button").addEventListener("click", () => {
  form.reset();
  results.hidden = true;
  formError.hidden = true;
  document.getElementById("transport").focus();
});

updateLanguage(languageSelect.value);