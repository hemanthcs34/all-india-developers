# Ushe Nav – City Pulse Agent 🗺️

**Smarter Cities, Safer Citizens**

Developed by **Team MindMaze** (Hemanth CS & Impana MS)

---

## The Problem

Have you ever been frustrated by false alerts on Google Maps? Or felt bored staring at a static map, unsure of what's happening around you? Have you ever wished you knew about important or fun events nearby, but just didn’t know where to look?

Ushe-Nav was born from these frustrations. We believe that city navigation should be dynamic, reliable, and community-driven.

## What is Ushe-Nav?

**Ushe-Nav** is a full-stack web application that transforms your map into a live, interactive hub for real, local events. It's a user-powered platform where you can discover and share what’s happening around you—whether it's a 🚧 roadblock, a ☔ weather update, or a 🎭 local festival.

Our mission is to create a trustworthy, engaging, and truly local information ecosystem for every city.

## ✨ Core Features

Ushe-Nav is packed with features designed to create a reliable and exciting user experience.

### 1. Dual-Layered Validation System

To combat misinformation, every post goes through a robust two-tiered validation process:

-   **🤖 AI-Powered Verification:** Every uploaded image is analyzed by **Clarifai's AI**. The post is only accepted if the AI's visual analysis matches the user-selected category. No more pictures of cats for a roadblock alert!
-   **👥 Community-Powered Validation:** For non-visual alerts like power outages, the system automatically prompts other users within a 1km radius to confirm the event's authenticity with a simple thumbs up/down vote.

### 2. Ushe-Gram: The Gamified Social Feed

We've made civic engagement rewarding and fun!

-   **Social Feed:** All validated alerts appear in **Ushe-Gram**, an integrated social media-style feed where users can interact with posts.
-   **Likes & Comments:** Users can like and comment on posts, fostering community discussion.
-   **Points & Leaderboard:** Users earn points for posting, validating, and receiving engagement. A real-time leaderboard showcases the top contributors.
-   **Incentives:** Our model includes monthly incentives (coupons, goodies) from sponsors for the top performers on the leaderboard, creating a self-sustaining ecosystem.

### 3. Powerful Map & User Experience

-   **Hyperlocal Focus:** The map is centered on your location, showing only relevant events within a 1km radius.
-   **Customizable Filters:** Easily filter map markers by category to see only the alerts you care about.
-   **Secure Authentication:** A complete login and signup system protects user accounts and data.

## 🛠️ Tech Stack

| Category      | Technology                                                                                                  |
| ------------- | ----------------------------------------------------------------------------------------------------------- |
| **Frontend**  | `HTML5`, `CSS3`, `JavaScript (ES6+)`, `Leaflet.js`                                                          |
| **Backend**   | `Node.js`, `Express.js`                                                                                     |
| **Database**  | `MongoDB` with `Mongoose`                                                                                   |
| **Real-Time** | `Socket.IO`                                                                                                 |
| **AI Vision** | `Clarifai API`                                                                                              |
| **Auth**      | `Passport.js` with `express-session`                                                                        |

## 🚀 Getting Started

Follow these steps to run the project locally.

### Prerequisites

-   Node.js installed
-   MongoDB Community Server installed and running as a service.

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone <your-repo-url>
    cd <your-repo-folder>
    ```

2.  **Set up the backend:**
    -   Navigate to the `backend` directory:
        ```bash
        cd backend
        ```
    -   Install dependencies:
        ```bash
        npm install
        ```
    -   Create a `.env` file in the `backend` directory and add your secret keys:
        ```env
        MONGO_URI=mongodb://127.0.0.1:27017/ushe-nav
        CLARIFAI_API_KEY=YOUR_CLARIFAI_API_KEY
        SESSION_SECRET=a_strong_secret_for_sessions
        ```

3.  **Run the application:**
    -   From the `backend` directory, start the server:
        ```bash
        npm run dev
        ```
    -   Open your browser and navigate to `http://localhost:5000`.

## 🔮 Future Roadmap

This hackathon was just the beginning. Our future plans include:

-   **Smart Navigation:** A built-in navigation system that intelligently routes you around user-reported roadblocks and hazards.
-   **Public Transit Tracking:** Real-time bus and train tracking integrated directly onto the map.
-   **Expanded Community Features:** User profiles, direct messaging, and more ways to connect.

---

Thank you for checking out Ushe-Nav! Let's make city life smarter, together.