import { buttonToNewPage, initializeFocusTracker  } from './shared.js';

initializeFocusTracker();
buttonToNewPage('nextButton0', 'instructions1');

document.getElementById('fullscreen-instructions').innerHTML = getFullscreenInstructions();

// Function to detect operating system
function detectOS() {
  const userAgent = navigator.userAgent;
  if (userAgent.includes("Windows")) {
    return "Windows";
  } else if (userAgent.includes("Mac OS")) {
    return "macOS";
  } else if (userAgent.includes("Linux")) {
    return "Linux";
  } else if (userAgent.includes("Android")) {
    return "Android";
  } else if (userAgent.includes("iOS")) {
    return "iOS";
  } else {
    return "Unknown";
  }
}

// Function to detect browser
function detectBrowser() {
  const userAgent = navigator.userAgent;
  if (userAgent.includes("Chrome")) {
    return "Chrome";
  } else if (userAgent.includes("Firefox")) {
    return "Firefox";
  } else if (userAgent.includes("Safari")) {
    return "Safari";
  } else if (userAgent.includes("Edge")) {
    return "Edge";
  } else if (userAgent.includes("Opera") || userAgent.includes("OPR")) {
    return "Opera";
  } else {
    return "Unknown";
  }
}

// Function to get fullscreen shortcut instructions based on OS and browser
function getFullscreenInstructions() {
  const os = detectOS();
  const browser = detectBrowser();

  let instructions = "Press F11 to toggle fullscreen mode.";

  if (os === "macOS") {
    if (browser === "Chrome" || browser === "Opera") {
      instructions = "Press Command + Control + F to toggle fullscreen mode.";
    } else if (browser === "Firefox") {
      instructions = "Press Command + Shift + F to toggle fullscreen mode.";
    }
  } else if (os === "Windows" && browser === "Firefox") {
    instructions = "Press F11 to toggle fullscreen mode.";
  } else {
    // For all other combinations (unknown), provide generic instructions
    instructions = "Please refer to your browser's documentation for fullscreen mode shortcut.";
  }

  return instructions;
}
