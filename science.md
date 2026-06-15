Wissenschaftliches App-Konzept: Integriertes Mental-Health-Tracking-System

Dieses Dokument definiert die methodische Architektur für ein hybrides Monitoring-System, das die Präzision des Ecological Momentary Assessment (EMA) mit der klinischen Validität wöchentlicher retrospektiver Fragebögen (Weekly Questionnaire Assessment, WQA) verbindet. Als Leitender Wissenschaftlicher Berater zielt dieses Konzept darauf ab, die diagnostische Lücke zwischen dem momentanen Erleben und der retrospektiven klinischen Einordnung zu schließen und durch eine spezialisierte KI-Synthese handlungsrelevante Erkenntnisse für die Therapieunterstützung zu generieren.

1. Strategischer Kontext und Methodik

Die klinische Validität digitaler Erhebungsmethoden wird maßgeblich durch das Problem der Gedächtnisverzerrung (Recall Bias) bedroht. Aktuelle Evidenz (Tamm et al., 2024) belegt, dass insbesondere depressiv erkrankte Patienten dazu neigen, negative Affekte in der Rückschau systematisch überzubewerten. Während herkömmliche WQA-Methoden zwar das globale Funktionsniveau ("Global Functioning") suffizient abbilden, erfassen sie nicht die dynamischen Symptomschwankungen innerhalb eines Zeitraums. Das hier implementierte System nutzt daher die Intra-individual Variability Analysis durch EMA, um den Recall Bias zu eliminieren, und korreliert diese Daten mit dem WQA, um eine klinische Gesamteinordnung zu ermöglichen. Diese methodische Triangulation stellt sicher, dass sowohl die Sensitivität für Interventionseffekte als auch die Vorhersagekraft für den klinischen Status maximiert werden.

Diese methodische Strenge führt direkt zur operativen Operationalisierung der täglichen Interaktionen, die auf maximale Compliance bei minimaler kognitiver Last ausgelegt sind.

2. Artefakt 1: Tägliche EMA-Prompts (Operationalisierung)

Um eine Interaktionsdauer von unter 5 Sekunden sicherzustellen, wird auf komplexe Verzweigungslogiken verzichtet. Die Fragen fokussieren sich strikt auf die psychometrischen Dimensionen Valenz (angenehm/unangenehm) und Aktivierung (energetisch/ruhig) sowie das akute Stresserleben.

Zeitpunkt	Variable	Fragetext	Antworttyp
Morgens	Stimmung (Valenz)	Wie ist deine Stimmung gerade?	5-Punkt Emoji-Skala
Morgens	Aktivierung	Wie viel Energie verspürst du gerade?	Slider (Antriebslos bis Voller Energie)
Mittags	Stress	Wie hoch ist deine aktuelle Belastung?	Slider (Kein Stress bis Extrem hoch)
Mittags	Aktivierung	Wie ruhig oder aufgeregt fühlst du dich?	Slider (Völlig ruhig bis Sehr unruhig)
Abends	Stimmung (Valenz)	Wie war deine Stimmung in den letzten Stunden?	5-Punkt Emoji-Skala
Abends	Aktivierung	Wie erschöpft fühlst du dich gerade?	Slider (Gar nicht bis Extrem erschöpft)

Diese hochfrequenten Datenpunkte bilden das Fundament für eine spätere Time-Series Cross-Correlation, die es der KI ermöglicht, zeitliche Abhängigkeiten zwischen Stimmungsschwankungen und Belastungsspitzen zu identifizieren, bevor diese im wöchentlichen klinischen Deep-Dive validiert werden.

3. Artefakt 2: Wöchentlicher Fragebogen (Klinische Standards)

Zur standardisierten Messung der Symptomschwere werden die klinischen Goldstandards PHQ-9 (Depression) und GAD-7 (Angst) implementiert.

PHQ-9 Sektion (Depressions-Monitoring)

Die Erhebung umfasst 9 Items (Interesse, Stimmung, Schlaf, Energie, Appetit, Selbstwert, Konzentration, Psychomotorik, Suizidalität) auf einer 4-stufigen Skala (0: Überhaupt nicht, 1: An einigen Tagen, 2: An mehr als der Hälfte der Tage, 3: Beinahe jeden Tag).

Scoring-System PHQ-9: | Summenscore | Schweregrad | | :--- | :--- | | 1 – 4 | Minimale depressive Symptomatik | | 5 – 9 | Leichte depressive Symptomatik | | 10 – 14 | Mittelgradig depressive Symptomatik | | 15 – 19 | Ausgeprägte depressive Symptomatik | | 20 – 27 | Schwere depressive Symptomatik |

GAD-7 Sektion (Angst-Monitoring)

Die Erhebung umfasst 7 Items zur Messung generalisierter Angst (Nervosität, Unkontrollierbarkeit der Sorge, übermäßige Sorge, Entspannungsfähigkeit, Rastlosigkeit, Reizbarkeit, Angst vor Unheil).

Interpretation der Grenzwerte GAD-7: | Summenscore | Interpretation | | :--- | :--- | | 5 | Cut-off für leichte Angst | | 10 | Cut-off für moderate Angst | | 15 | Cut-off für schwere Angst |

Implementierung des "So-What"-Layers: Das System definiert einen "Response" klinisch als eine Reduktion des Scores um 50 % im Vergleich zum Baseline-Wert. Der Nutzer erhält ein evidenzbasiertes Feedback: "Dein PHQ-9 Score ist diese Woche um 4 Punkte gesunken. Das entspricht einer Verbesserung von 15 % und korreliert stark mit deiner stabilen Stimmung an den Vormittagen (EMA-Daten)." Diese Korrelation der klinischen Scores mit den täglichen Dynamiken erfolgt automatisiert durch das integrierte KI-Modul.

4. Artefakt 3: Cognitive AI Prompt (Data Intelligence)

Der folgende System-Prompt steuert die Analyse der synthetisierten Datenströme unter Berücksichtigung strenger ethischer Leitplanken (Source 2: Rahsepar Meadi et al., 2025).

### SYSTEM_PROMPT: Psychometrischer Analyst

**Rolle:** Du agierst als Leitender Analyst für digitale Psychometrie. Deine Aufgabe ist die Synthese von EMA-Zeitreihen und klinischen WQA-Scores (PHQ-9/GAD-7).

**Aufgaben:**
1. **Time-Series Cross-Correlation:** Identifiziere Abhängigkeiten zwischen EMA-Variablen (z. B. "Wenn Aktivierung morgens < 3/10, steigt die Stress-Intensität mittags um durchschnittlich 40 %").
2. **Trigger-Analyse:** Suche nach Mustern, die mit klinischen Verschlechterungen in PHQ-9 oder GAD-7 korrespondieren (z. B. Zusammenhänge zwischen erhöhter Erschöpfung am Abend und dem Item 'Schlafstörungen').
3. **Hypothesen-Synthese:** Erstelle eine wöchentliche Zusammenfassung der Belastungsdynamik, ohne diagnostische Ansprüche zu erheben.

**Ethische Leitplanken (Guardrails):**
- **Krisenintervention (Hard Trigger):** Überprüfe zwingend PHQ-9 Item 9 (Suizidalität). Bei jedem Wert > 0 muss die Analyse abgebrochen und der Nutzer sofort mit einer Liste von Notfallkontakten (Krisendienst/Notruf) konfrontiert werden.
- **Transparenz & Turing-Check:** Du musst zu Beginn jeder Analyse explizit offenlegen, dass du ein KI-Algorithmus und kein menschlicher Therapeut bist, um "Deception Mode" zu vermeiden.
- **Vermeidung Epistemischer Ungerechtigkeit:** Formuliere Ergebnisse so, dass die Deutungshoheit des Nutzers über sein eigenes Erleben gewahrt bleibt. Deine Analysen sind Hypothesen, keine absoluten Wahrheiten.
- **Diagnoseverbot:** Stelle keine medizinischen Diagnosen. Nutze Formulierungen wie "Die Daten legen nahe..." oder "Ein mögliches Muster ist...".


Dieser Prompt transformiert statische Datenlisten in einen dynamischen Analyseprozess, der die subjektive Erfahrung des Nutzers mit klinischer Evidenz verknüpft.

5. Zusammenfassung der Systemarchitektur

Die Überlegenheit dieses Systems gegenüber herkömmlichen Journaling-Anwendungen liegt in der methodischen Schließung der Lücke zwischen subjektivem Erleben und klinischer Evidenz. Durch die Kombination von hochfrequentem EMA (Vermeidung des Recall Bias) und klinisch validiertem WQA (PHQ-9/GAD-7) entsteht ein robustes Abbild der psychischen Gesundheit.

Um die Architektur zukunftssicher zu gestalten ("Progressive Approach"), ist in der nächsten Ausbaustufe die Integration von Passive Sensing (objektive Verhaltensmarker wie GPS-basierte Homestay-Dauer, physische Aktivität und Schlafmuster) vorgesehen, wie von Tamm et al. (2024) empfohlen. Dies wird die Objektivität des Monitorings weiter erhöhen. Die Nutzung von Mental-Health-Daten erfordert höchste ethische Verantwortung; die Technologie fungiert hierbei als Werkzeug zur Unterstützung klinischer Entscheidungen, nicht als deren autonomer Ersatz.
