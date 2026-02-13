# MediHome: Personal Medical Dashboard 🩺

## Description

**MediHome** is a secure, full-stack web application designed to act as a "digital medical wallet" for individuals and families. MediHome provides a centralized, private dashboard to track prescriptions, manage care teams, log allergies, and schedule appointments.

Built with security in mind, the application features authenticated user sessions, password hashing, and environment variable protection. The responsive interface ensures critical medical data is accessible on desktop or mobile devices during emergencies.

**Deployed Application:** [Link to your Render App Here]

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Database Structure](#database-structure)
- [Questions](#questions)

## Features

### 🔐 Security & Authentication
* **User Accounts:** Secure sign-up and login functionality.
* **Data Protection:** Passwords are never stored in plain text (hashed via `bcrypt`).
* **Session Management:** Uses `express-session` and `connect-session-sequelize` to keep users logged in securely.
* **Environment Protection:** Sensitive API keys and database credentials are hidden using `dotenv`.

### ⏰ Custom Medication Reminders
* **Time-Based Alerts:** Users can set specific, custom times to be reminded to take their medications, ensuring they stay on schedule.
* **Visual Polish:** The application utilizes a `canvas-confetti` animation to add a moment of visual delight to the user experience.

### 🚨 Smart Interaction Alerts
* **Automated Safety Checks:** The dashboard actively scans the user's active medication list upon rendering.
* **High-Visibility Warnings:** Triggers a centered, modal-based alert system if severe drug combinations (e.g., Lisinopril and Ibuprofen) are detected, advising the user to contact their care team.

### 💊 Medication Cabinet
* **Digital Inventory:** Track current prescriptions, dosages, and frequencies.
* **Refill Tracking:** Input refill dates to generate automatic visual reminders when prescriptions are running low.
* **History Archive:** "Move to History" function allows users to archive old medications without losing their historical medical records.

### 🩺 Care Team Management
* **Provider Directory:** Store contact information for primary care physicians (PCPs) and specialists.
* **One-Click Contact:** Integrated `tel:` and `mailto:` links for quick communication from mobile devices.

### 📅 Smart Scheduling
* **Appointment Tracker:** Log upcoming visits with date, time, and reason for visit.
* **Visual Dashboard:** Upcoming appointments are sorted and displayed prominently on the dashboard.

### ⚠️ Allergy Logs
* **Safety Tracking:** Maintain a list of known allergies with reaction details.
* **Severity Indicators:** Visual color-coded badges (Green/Yellow/Orange/Red) indicate severity levels from "Mild" to "Life-Threatening".

## Tech Stack

**Frontend:**
* **Handlebars.js:** Used as the server-side templating engine to dynamically generate HTML.
* **Tailwind CSS:** A utility-first CSS framework used for rapid UI development and mobile responsiveness.
* **Vanilla JavaScript:** Used for DOM manipulation, handling modal logic, and executing asynchronous Fetch API requests.
* **Canvas Confetti:** Integrated for visual effects and UI polish.

**Backend & API:**
* **Node.js & Express.js:** Powers the core server and handles routing.
* **RESTful API Architecture:** The application utilizes a custom-built API to handle all Create, Read, Update, and Delete (CRUD) operations for user data, medications, doctors, and allergies. All data is parsed and returned in JSON format.
* **Sequelize ORM:** Manages the MySQL database relationships and queries.
* **Security:** Implements `bcrypt` for password hashing and `express-session` for secure user state management.
* **Third-Party API Integration:** Utilizes the **FDA Drug Label API** (`api.fda.gov`) to dynamically fetch, search, and display accurate, real-world pharmaceutical data directly within the application.


## Usage

1.  Navigate to `https://medihome-app.onrender.com/.
2.  **Sign Up:** Create a secure account.
3.  **Dashboard:**
    * Use the **"+ Add"** buttons to populate your medical data.
    * Set up custom time-based reminders for your prescriptions.
    * Use the **Pencil Icon** to edit dosages or refill dates.

![Dashboard Screenshot](./assets/images/screenshotdash.png)

## Database Structure

The application follows a relational model where the `User` is the central entity.

* **Users** have a One-to-Many relationship with **Medications**.
* **Users** have a One-to-Many relationship with **Doctors**.
* **Users** have a One-to-Many relationship with **Appointments**.
* **Users** have a One-to-Many relationship with **Allergies**.

This ensures that data is always scoped privately to the logged-in user.

---

## Questions

For questions about this project, please contact:

* **GitHub:** [[JeanParkDev]](https://github.com/JeanParkDev])
* **Email:** [thejeanpark@gmail.com]