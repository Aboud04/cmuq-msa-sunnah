# CMUQ MSA Sunnah Explorer

![App Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

A lightweight web application designed for the **CMU-Q Muslim Student Association**. This tool allows users to discover narrations from the six major books of Hadith and navigate through their respective chapters.

## 🌟 Features

* **Random Hadith Discovery:** Instantly fetches a random narration from major collections (Bukhari, Muslim, Abu Dawud, Tirmidhi, Nasai).
* **Chapter Navigation:** Automatically detects the current chapter and allows users to read the "Previous" and "Next" Hadiths in that sequence.
* **Authenticity Grading:** Clearly displays the grade of each narration (e.g., *Sahih*, *Hasan*, *Da'if*) with color-coded indicators.
* **Sunnah Gold Theme:** Styled with a "Sunnah Gold" & Dark Charcoal palette for a classic, readable aesthetic.
* **Dual Script:** Uses *Amiri* for clear Arabic text and *Inter* for modern English translations.
* **Responsive Design:** Works seamlessly on mobile and desktop.

## 🛠️ Tech Stack

* **Frontend:** HTML5, CSS3, Vanilla JavaScript (ES6+)
* **API:** [Hadith-API by fawazahmed0](https://github.com/fawazahmed0/hadith-api) (Mirror of Sunnah.com)
* **Fonts:** [Amiri](https://fonts.google.com/specimen/Amiri) (Arabic) & [Inter](https://fonts.google.com/specimen/Inter) (UI)

## 🚀 How to Run

Since this is a static web application, no backend server is required.

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/yourusername/sunnah-explorer.git](https://github.com/yourusername/sunnah-explorer.git)
    ```
2.  **Open the project:**
    Navigate to the folder and open `index.html` in your browser.

**VS Code Users:**
* Install the "Live Server" extension.
* Right-click `index.html` and select "Open with Live Server".

## 🤝 Contributing

Contributions are welcome! If you'd like to improve the UI or add new books:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

## Acknowledgments

* Data sourced from [Sunnah.com](https://sunnah.com).
* API maintained by [Fawaz Ahmed](https://github.com/fawazahmed0).
* Developed for the CMU-Q Muslim Student Association.
