# ACME Auction House

[![Screenshot-2024-08-06-203941.png](https://i.postimg.cc/65fdhW4L/Screenshot-2024-08-06-203941.png)](https://postimg.cc/ppyhWtZp)
*Your premier platform for online auctions*

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) 
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
![Javascript](https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)

## 📚 Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)

## 🚀 Project Overview

ACME Auction House is a cutting-edge full-stack web application designed for online auctions. Users can register, log in, and participate in real-time bidding events. Built with React for a dynamic front end and a robust backend, this application ensures a seamless and engaging user experience.

## ✨ Features

- 📝 **User Registration and Login:** Secure and easy user management
- 📊 **Dashboard:** Track active and past bids effortlessly
- 📅 **Auction Management:** Create, manage, and participate in auctions
- 📱 **Responsive Design:** Optimized for all devices
- 🔔 **Real-Time Updates:** Instant notifications for bidding activities

## 💻 Getting Started

To get started with ACME Auction House, follow these steps:

1. **Clone the repository:**

    ```bash
    git clone https://github.com/ary1905/ACME-Auction-House.git
    ```

2. **Navigate to the project directory:**

    ```bash
    cd ACME-Auction-House
    ```

3. **Install Client dependencies:**

    ```bash
    cd client
    npm install
    ```

4. **Start the development server:**

    ```bash
    npm start
    ```

5. **Open your browser and go to:**

    ```
    http://localhost:3000
    ```
    
6. **Install Server dependencies:**

    ```bash
    cd server
    npm install
    ```

7. **Environment File .env setup:**

    1. Copy the `.env.example` file to `.env`:

       ```sh
       cp .env.example .env
       ```
   
    2. Generate `EMAIL_PASS`

       If you need to generate an `EMAIL_PASS` for use with a service like Gmail, follow these steps to create an App Password (assuming you are using Google):

       1. **Go to your Google Account:** [Google Account](https://myaccount.google.com/)

       2. **Security:**
          - Click on `Security` in the left sidebar.
          - Enable 2 step verification. (You need to enter your password again)
          - Visit This Link https://myaccount.google.com/apppasswords and create an app password.
          - Enter the name of your project for which you want to create an App Password.
          - Click `Create`.
          - A 16-character password will be generated. Copy this password.
          - Use this password as `EMAIL_PASS` in your `.env` file.
          - Use the corresponding Google Email Id for `EMAIL_USER`.

    **Example `.env` File**

    Your `.env` file after filling in the placeholders might look like this:

    ```env
    DATABASE_URL=postgres://<HOST_NAME>:<PASSWORD>@localhost:5432/<DATABASE_NAME>
    JWT_SECRET=33e16e8a1f0f12c6af17987f802261804bd118a09347b1cf880a5aa03d3326dbf3665f72153fb496f95966c263e7484afc232da035232b199871472b5133334f
    EMAIL_USER=xyz@gmail.com
    EMAIL_PASS=<YOUR_GENERATED_APP_PASSWORD> (16 digits: For Example => abcd efgh ijkl mnop)
    ```

8. **Start the server:**

    ```bash
    npm run dev
    ```

## 📖 API Documentation

Explore the API endpoints and usage guidelines in our [API Documentation](https://acme-auction-house-api-docs.vercel.app/).

## 📸 Screenshots

Here are some screenshots of the application in action:

*Home Page*
[![Screenshot-330.png](https://i.postimg.cc/zfVK5Tt0/Screenshot-330.png)](https://postimg.cc/kVPBvRdb)
[![Screenshot-332.png](https://i.postimg.cc/gjPZvQYT/Screenshot-332.png)](https://postimg.cc/LYN5Sygt)
[![Screenshot-331.png](https://i.postimg.cc/wMcsF2MT/Screenshot-331.png)](https://postimg.cc/T51w3rnZ)

*Login*
[![Screenshot-333.png](https://i.postimg.cc/wTgNMC4t/Screenshot-333.png)](https://postimg.cc/z32vPcr5)

*Sign Up*
[![Screenshot-334.png](https://i.postimg.cc/VLgCCK2K/Screenshot-334.png)](https://postimg.cc/8jFc8mpv)

*Auction Page*
[![Screenshot-341.png](https://i.postimg.cc/65W7tdTn/Screenshot-341.png)](https://postimg.cc/vDK8vxrZ)

## 📝 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
