# EnA_App

A Hybrid Power Management System

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [License](#license)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Asad-Ahmed-Ansari/EnA_App.git
2. Navigate to the project directory:
   $ cd EnA_App
3. Install the required dependencies:
   $ npm install
4. Link native dependencies (if needed): 
   $ npx react-native link
5. Run the app on your simulator or device:
   $ npx react-native run-android  # For Android
   $ npx react-native run-ios      # For iOS

## Usage 
The app allows admins and super admins to manage bank sites and users. Key functionalities include:

User Registration: Admins and Super Admins can register users with their roles.
Login: Role-based authentication allowing users, Admins, and Super Admins to access their respective dashboards.
Site Management: Super Admins can view and manage bank sites, including filtering sites by banks (MCB, Meezan Bank, Bank Islami).
Admin Management: Super Admins can register Admins for different banks, while Admins manage bank sites.

## Feautres 
Role-based Access Control: Different views and access rights for Users, Admins, and Super Admins.
Bank Site Registration: Ability to register and manage sites for various banks.
Real-time Data: Site management displays data such as contact persons and device numbers in real time.
Animations and Loaders: Modern and appealing animations using Rive and other libraries for a smooth user experience.

## Technology Stack 
The app is built using the following technologies:

$ Frontend: React Native
$ Backend: Node.js with Express
$ Database: PostgreSQL
$ Animations: Rive (for loader animations)
$ Libraries: Axios, React Navigation, Redux (for state management)

## License 
This project is licensed under the MIT License. See the LICENSE file for details.
