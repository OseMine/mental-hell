# Mental Hell

<p align="center">
  <strong>A privacy-first mental health tracking companion.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Expo-54.0-000020?style=for-the-badge&logo=expo&logoColor=white" alt="Expo">
  <img src="https://img.shields.io/badge/React_Native-0.81-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React Native">
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Zustand-5.0-brown?style=for-the-badge" alt="Zustand">
</p>

---

## Overview

Mental Hell is a comprehensive, cross-platform mental health tracking application built with Expo and React Native. It combines **Ecological Momentary Assessment (EMA)** — multiple daily mood check-ins — with clinically validated **PHQ-9** and **GAD-7** weekly questionnaires to provide a holistic picture of your mental well-being.

All data stays **encrypted on your device**. No accounts, no cloud sync, no data leaks.

---

## ✨ Features

### 📝 Daily Check-Ins
Track your mood and stress levels three times a day (morning, midday, evening) with an intuitive slider interface. Add optional notes, weather conditions, and activity levels for richer context.

### 📊 Mental Score
A proprietary algorithm synthesizes your daily mood (40%), stress levels (40%), and weekly questionnaire results (20%) into a single 1–10 wellbeing metric. The overall score weights today at 70% and the 7-day trend at 30%.

### 📋 Weekly Questionnaires
Clinically validated PHQ-9 (Depression) and GAD-7 (Anxiety) screening tools with standardized severity interpretations and evidence-based descriptions.

### 📓 Journal
Write free-form journal entries with mood tracking and tag organization. Search, filter, and revisit your thoughts anytime.

### 🤖 AI Companion (Free, On-Device)
A privacy-first conversational AI that analyzes your local data to provide insights about mood patterns, stress trends, and well-being tips. No data ever leaves your device.

### 🏥 Therapist Review Mode
Generate comprehensive markdown reports summarizing your mood trends, questionnaire results, and check-in history over configurable time periods. Share directly with your healthcare provider.

### 🔬 Science-Backed Methodology
Built on established clinical frameworks with transparent methodology explanations. The app integrates:
- **Ecological Momentary Assessment (EMA)** — real-time mood capture eliminating recall bias
- **Weekly Questionnaire Assessment (WQA)** — PHQ-9 & GAD-7 clinical standards
- **Time-Series Correlation** — connecting daily dynamics with weekly clinical scores

### 🎨 Frosted Glass UI
Modern glassmorphism design language with dynamic Material 3 theming, blur effects, pitch-black OLED mode, and a floating pill-style navigation bar.

### 🌍 Multi-Language Support
Available in 12 languages with auto-detection based on system locale: Deutsch, English, Français, Español, Čeština, Русский, Italiano, Português, Dansk, Íslenska, Svenska, and Norsk.

---

## Screenshots

| Dashboard | Check-Ins | Journal | Analytics |
|:---:|:---:|:---:|:---:|
| Home screen with Mental Score, streak, and 7-day mood chart | Three daily check-in cards with mood, stress, weather, and activity trackers | Journal with search, tags, and mood emojis | Weekly questionnaires with PHQ-9 / GAD-7 results |

---

## Tech Stack

| Layer | Technology |
|:---|:---|
| **Framework** | Expo 54 / React Native 0.81 |
| **Language** | TypeScript 5.9 |
| **Navigation** | Expo Router 6 (file-based routing) |
| **UI** | React Native Paper (Material 3), react-native-reanimated |
| **State** | Zustand 5 with persist middleware |
| **Storage** | expo-secure-store (native) / AsyncStorage (web) |
| **i18n** | i18n-js (12 languages: DE, EN, FR, ES, CS, RU, IT, PT, DA, IS, SV, NO) |
| **Charts** | react-native-svg (custom line chart) |
| **Blur** | expo-blur |
| **Animations** | react-native-reanimated 4 |

---

## Getting Started

### Prerequisites

- Node.js 18+
- Expo CLI (`npm install -g expo-cli`)
- iOS: Xcode 16+ (for iOS simulator)
- Android: Android Studio (for Android emulator)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/mental-hell.git

# Navigate to project
cd mental-hell

# Install dependencies
npm install

# Start the development server
npx expo start
```

### Running on specific platforms

```bash
# Web
npx expo start --web

# iOS
npx expo run:ios

# Android
npx expo run:android
```

---

## Project Structure

```
app/                          # Expo Router pages
├── (tabs)/                   # Tab navigation screens
│   ├── index.tsx             # Home Dashboard
│   ├── today.tsx             # Daily Check-Ins
│   ├── journal.tsx           # Journal
│   ├── science.tsx           # Science & Insights
│   ├── analytics.tsx         # Questionnaires & Charts
│   └── settings.tsx          # Settings
├── journal-editor.tsx        # Journal entry editor (modal)
├── journal-view.tsx          # Journal entry viewer (modal)
├── therapist-report.tsx      # Therapist report generator (modal)
├── ai-chat.tsx               # AI companion chat (modal)
├── onboarding/               # Onboarding flow
├── _layout.tsx               # Root layout
└── +html.tsx                 # Web HTML template

src/
├── components/               # Reusable UI components
│   ├── CheckInCard.tsx       # Daily check-in card
│   ├── MoodChart.tsx         # SVG line chart
│   ├── WeekChart.tsx         # Animated bar chart
│   ├── WeatherSelector.tsx   # Weather condition picker
│   ├── ActivitySelector.tsx  # Activity level picker
│   ├── TodoSection.tsx       # Task list
│   ├── FrostedTabBar.tsx     # Glassmorphism tab bar
│   └── ...                   # Settings sections, etc.
├── store/                    # Zustand stores
│   ├── healthStore.ts        # Health data store
│   ├── settingsStore.ts      # App settings store
│   └── useMentalScore.ts     # Mental Score calculator
├── i18n/                     # Internationalization
│   ├── index.ts              # I18n initialization
│   ├── en.ts                 # English translations
│   ├── de.ts                 # German translations
│   ├── fr.ts                 # French translations
│   ├── es.ts                 # Spanish translations
│   ├── cs.ts                 # Czech translations
│   ├── ru.ts                 # Russian translations
│   ├── it.ts                 # Italian translations
│   ├── pt.ts                 # Portuguese translations
│   ├── da.ts                 # Danish translations
│   ├── is.ts                 # Icelandic translations
│   ├── sv.ts                 # Swedish translations
│   └── no.ts                 # Norwegian translations
├── theme/                    # Theming
├── utils/                    # Utilities
│   ├── exporter.ts           # Data export (JSON)
│   ├── formatters.ts         # Date/number formatters
│   ├── questionnaire.ts      # PHQ-9/GAD-7 logic
│   ├── notifications.ts      # Push notifications
│   └── responsive.ts         # Desktop responsive hook
└── widgets/                  # Base UI widgets
    ├── Background.tsx        # SafeArea + ScrollView wrapper
    ├── CustomCard.tsx        # Glassmorphism card
    ├── StatCard.tsx          # Statistics card
    └── ...
```

---

## Mental Score Formula

```
Daily Score = (Mood + (10 - Stress) + PHQ-9 Component + GAD-7 Component) / 4

Where:
  - Mood:        average of all check-in mood scores (1-10)
  - Stress:      average of all check-in stress levels (1-10), inverted
  - PHQ-9:       (27 - score) / 2.7 → maps 0-27 to 10-0
  - GAD-7:       (21 - score) / 2.1 → maps 0-21 to 10-0

Overall Score = 0.7 × Today + 0.3 × Weekly Average
```

---

## Privacy

Mental Hell is designed with **privacy by default**:
- All data is stored **exclusively on-device** using expo-secure-store (hardware-backed encryption on supported devices)
- **No accounts** required — no email, no phone number
- **No telemetry** — the app never phones home
- **No cloud sync** — your data stays under your control
- **Self-contained AI** — the AI companion analyzes data locally; no API calls to external services

---

## Roadmap

| Feature | Status |
|:---|---:|
| Daily EMA Check-Ins | ✅ Done |
| PHQ-9 / GAD-7 Questionnaires | ✅ Done |
| Mental Score Algorithm | ✅ Done |
| Frosted Glass UI Design | ✅ Done |
| Journal System | ✅ Done |
| Therapist Report Export | ✅ Done |
| AI Companion (Local) | ✅ Done |
| Science & Insights Page | ✅ Done |
| PWA Support | ✅ Done |
| Desktop Responsive Layout | ✅ Done |
| Enhanced Daily Review (Weather, Activity, Todos) | ✅ Done |
| Calendar Actions / Todo Completion Rate | ✅ Done |
| Custom Chart Overhaul | ✅ Done |
| Multi-Language Support (12 languages + auto-detect) | ✅ Done |
| Release Workflow (Web, APK, IPA + AI release notes) | ✅ Done |
| Passive Sensing (GPS, Activity, Sleep) | 🔜 Planned |

---

## License

This project is private and not licensed for public use or distribution.

---

## Disclaimer

This application is a **self-tracking tool**, not a medical diagnostic instrument. It does not replace professional medical advice, diagnosis, or treatment. If you are experiencing a mental health crisis, please contact your local emergency services or crisis hotline immediately.
