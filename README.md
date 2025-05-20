# Safety and Emergency Hub

The **Safety and Emergency Hub** is a mobile-optimized web application designed to enhance safety and emergency response in Kenya. It empowers users to report emergencies, access verified emergency contacts, receive real-time incident alerts, and learn safety skills, addressing critical challenges like delayed response times and lack of centralized safety resources.

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Project Overview

Kenya faces significant safety challenges, including slow emergency response (only 10% of Kenyans have timely ambulance access), limited access to verified emergency contacts, and low disaster preparedness. The Safety and Emergency Hub solves these by providing:

- A platform for reporting emergencies with geolocation and multimedia.
- Real-time alerts for local incidents (e.g., floods, protests).
- A verified directory of hospitals, police, and ambulances.
- Community-driven response via trained volunteers.
- Safety education tailored to Kenyan contexts (e.g., flood preparedness).

The app is mobile-first, supports offline access, and integrates with M-Pesa and Safaricom APIs for seamless payments and notifications, targeting Kenya’s 90% mobile internet users.

## Features

- User authentication (signup, login, logout).
- Display active alerts, emergency contacts, and safety tips.
- Submit and view volunteer requests.
- Geolocation-based alert reporting (client-side).
- Planned: SMS alerts, USSD support, panic button.

- **Incident Reporting**: Report emergencies (e.g., accidents, crimes) with photos, videos, and GPS coordinates.
- **Geo-Based Alerts**: Receive SMS or in-app notifications about nearby incidents.
- **Emergency Directory**: Searchable database of verified hospitals, police stations, and ambulances.
- **Community Responders**: Connect with trained volunteers for rapid response, with a trust-based rating system.
- **Safety Education**: Interactive tutorials on first aid, fire safety, and disaster preparedness, gamified with quizzes.
- **Panic Button**: One-tap feature to alert contacts with user’s location.
- **Offline Mode**: Access cached contacts and tips without internet.
- **USSD Support**: Basic features (e.g., emergency contacts) accessible via USSD for rural feature phone users.
- **Multilingual Interface**: Supports English, Swahili, and local languages (e.g., Kikuyu, Luo).

## Tech Stack

- **Backend**: Node.js, Express.js
- **Frontend**: EJS, HTML/CSS/JavaScript
- **Database**: MySQL
- **Libraries**: bcrypt, express-session, mysql2

## Installation

Follow these steps to set up the project locally:

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Git
- API keys for:
  - M-Pesa API (Safaricom Daraja)
  - Google Maps API
  - Twilio or Safaricom SMS API

### Steps

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/your-username/safety-emergency-hub.git
   cd safety-emergency-hub
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Set Up Environment Variables**:
   Create a `.env` file in the root directory and add:

   ```
   PORT=3000
   MONGODB_URI=your-mongodb-connection-string
   MPESA_API_KEY=your-mpesa-api-key
   GOOGLE_MAPS_API_KEY=your-google-maps-api-key
   SMS_API_KEY=your-twilio-or-safaricom-api-key
   JWT_SECRET=your-jwt-secret
   ```

4. **Run the Application**:

   ```bash
   npm start
   ```

   The app will run on `http://localhost:3000`.

5. **Run Tests** (optional):
   ```bash
   npm test
   ```

## Usage

- **For Users**: Access the web app via a browser (e.g., Chrome, Safari) on a smartphone or desktop. Register with a phone number, report incidents, search for emergency contacts, or enable alerts.
- **For Admins**: Use the admin dashboard (accessible via `/admin` with credentials) to moderate reports, manage contacts, and view analytics.
- **For Developers**: Extend features by adding new modules (e.g., flood prediction AI) or integrating additional APIs (e.g., weather alerts).

## Contributing

We welcome contributions to make the Safety and Emergency Hub better! To contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m "Add your feature"`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request with a clear description of changes.

Please follow our [Code of Conduct](CODE_OF_CONDUCT.md) and ensure code adheres to ESLint standards.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

- **Project Lead**: [Your Name] (tiffanynandwa@gmail.com)
- **GitHub**: [Your GitHub Profile](https://github.com/your-username)
- **Issues**: Report bugs or suggest features on the [Issues](https://github.com/your-username/safety-emergency-hub/issues) page.

---

Built with 💙 for a safer Kenya. Join us in saving lives and empowering communities!
