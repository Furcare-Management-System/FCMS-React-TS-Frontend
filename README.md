# Furcare Management System (FCMS)

## Deployment & Installation Documentation

## Table of Contents

1. [Introduction](#introduction)
2. [System Requirements](#system-requirements)
3. [Prerequisites Installation](#prerequisites-installation)
4. [Source Code Setup](#source-code-setup)
5. [Backend Configuration](#backend-configuration)
6. [Frontend Configuration](#frontend-configuration)
7. [Production Build (Local)](#production-build-local)
8. [Admin Credentials](#admin-credentials)

## Introduction

This document provides comprehensive instructions for setting up, configuring, and deploying the Furcare Management System (FCMS), which consists of a Laravel backend and React+Vite frontend. The guide is intended for developers setting up the development environment and for deploying to client machines.

## System Requirements

### Minimum Hardware Requirements

- **Processor:** Intel Core i5 or equivalent
- **RAM:** 8 GB
- **Disk Space:** 10 GB free space
- **Display:** 1366 x 768 resolution

### Recommended System Specifications

- **Edition:** Windows 10 Pro
- **Processor:** Intel(R) Core(TM) i5-3340M CPU @ 2.70GHz 2.70 GHz or higher
- **Installed RAM:** 8.00 GB or higher
- **System type:** 64-bit operating system, x64-based processor

## Prerequisites Installation

### Required Software

1. **XAMPP Control Panel (version 8.2.12)**

   - Download from [Apache Friends website](https://www.apachefriends.org/index.html)
   - Run the installer and follow the instructions
   - Ensure Apache and MySQL services are installed

2. **PHP (version 8.2.12)**

   - PHP should be included with XAMPP installation
   - Verify by opening command prompt and typing: `php -v`

3. **Composer (version 2.7.7)**

   - Download from [Composer website](https://getcomposer.org/download/)
   - Follow the installation instructions
   - Verify installation: `composer -V`

4. **Node.js (version 22.14.0) and npm (10.9.2)**

   - Download from [Node.js website](https://nodejs.org/)
   - Install the LTS version
   - Verify installation:
     ```
     node -v
     npm -v
     ```

5. **Git**

   - Download from [Git website](https://git-scm.com/downloads)
   - Install with default settings
   - Verify installation: `git --version`

6. **Visual Studio Code (recommended IDE)**

   - Download from [VS Code website](https://code.visualstudio.com/)
   - Install with default settings

7. **Web Browsers**
   - Microsoft Edge (Latest version)
   - Google Chrome (Recommended, latest version)

## Source Code Setup

### Cloning the Repositories

1. **Create a project directory**

   - Create a folder where both repositories will be stored
   - Open command prompt and navigate to your desired location
   - Run: `mkdir FCMS`
   - Run: `cd FCMS`

2. **Clone Backend Repository**

   ```bash
   git clone https://github.com/Furcare-Management-System/FCMS-Laravel-Backend.git
   ```

3. **Clone Frontend Repository**
   ```bash
   git clone https://github.com/Furcare-Management-System/FCMS-React-TS-Frontend.git
   ```

## Backend Configuration

1. **Install Laravel Dependencies**

- Navigate to the backend directory:
  ```bash
  cd FCMS-Laravel-Backend
  ```
- Install Composer dependencies:
  ```bash
  composer install
  ```

2. **Environment Setup**

- Copy the example environment file:
  ```bash
  copy .env.example .env
  ```
- Generate application key:
  ```bash
  php artisan key:generate
  ```

3. **Configure Environment Variables**

- Open `.env` file in a text editor
- Configure database connection:
  ```
  DB_CONNECTION=mysql
  DB_HOST=127.0.0.1
  DB_PORT=3306
  DB_DATABASE=furcaresystem
  DB_USERNAME=root
  DB_PASSWORD=
  ```
- Configure Pusher for real-time features (if used):
  ```
  PUSHER_APP_ID=your_pusher_app_id
  PUSHER_APP_KEY=your_pusher_key
  PUSHER_APP_SECRET=your_pusher_secret
  PUSHER_APP_CLUSTER=your_cluster
  ```

## Database Setup

1. **Create Database**

- Start XAMPP Control Panel and ensure MySQL is running
- Open browser and navigate to: `http://localhost/phpmyadmin/`
- Create a new database named `furcaresystem`

2. **Run Migrations**

- In the backend directory, run:
  ```bash
  php artisan migrate
  ```

4. **Generate Key & Other Configurations**

- Run these commands one by one:
  ```bash
  php artisan key:generate
  php artisan storage:link
  php artisan cache:clear
  php artisan config:clear
  php artisan route:clear
  ```

3. **Seed Database (optional)**

- If seed data is available, run:
  ```bash
  php artisan db:seed
  ```

## Frontend Configuration

1. **Install Node Dependencies**

- Navigate to the frontend directory:
  ```bash
  cd ../FCMS-React-TS-Frontend
  ```
- Install npm packages:
  ```bash
  npm install
  ```

2. **Environment Setup**

- Create a `.env` file in the frontend root directory:
  ```bash
  copy .env.example .env
  ```
- If `.env.example` doesn't exist, create `.env` with:
  ```
  VITE_API_URL=http://localhost:8000
  VITE_PUSHER_APP_KEY=your_pusher_key
  VITE_PUSHER_APP_CLUSTER=your_cluster
  ```

## Running the Application

### Development Mode

1. **Start Backend Server**

- Navigate to backend directory
- Start Laravel development server:
  ```bash
  php artisan serve
  ```
- Backend will be available at `http://localhost:8000`

2. **Start Frontend Development Server**

- Open a new command prompt window
- Navigate to frontend directory
- Start Vite server:
  ```bash
  npm run dev
  ```
- Frontend will be available at `http://localhost:5173`

3. **Access the Application**

- Open browser and navigate to `http://localhost:5173`
- You should see the FCMS application login page

### Production Build (Local)

1. **Deploy Backend Files**

- Create folder: C:\xampp\htdocs\fcms-backend
- Copy your entire Laravel project to this folder
- Edit the .env file to use these local settings:
  ```
  APP_URL=http://localhost/fcms-backend/public
  DB_CONNECTION=mysql
  DB_HOST=127.0.0.1
  DB_PORT=3306
  DB_DATABASE=furcaresystem
  DB_USERNAME=root
  DB_PASSWORD=
  ```

2. **Deploy Frontend Files**

- Navigate to frontend directory
- Set your .env variable into this:
  ```
  VITE_API_BASE_URL=http://localhost/fcms-backend/public
  ```
- Create production build:
  ```bash
  npm run build
  ```
- This creates optimized files in the `dist` directory

- Create folder: C:\xampp\htdocs\fcms

3. **Serve Production Build**

- Copy `dist` contents to backend's `public` directory

4. **Setup Database**

- Start XAMPP Control Panel and start Apache and MySQL
- Open browser: http://localhost/phpmyadmin
- Create a new database named furcaresystem

5. Create Easy Access Shortcuts

- Create a startup script on the desktop named "FCMS.txt":

```txt
@echo off
echo Starting FCMS Services...

:: Start Apache
cd C:\xampp
start /min apache_start.bat

:: Start MySQL
start /min mysql_start.bat

timeout /t 5

:: Open the browser
start http://localhost/fcms
echo FCMS is now running!
```

- Change the file extension from .txt to .bat

6. **Adding Icon to the .bat File**

- Right-click on your Start FCMS.bat file (on Desktop).
- Select Create shortcut.
- Right-click the new shortcut (FCMS.bat - Shortcut).
- Click Properties.
- Under the Shortcut tab, click Change Icon....
- You might see a warning — click OK to continue.
- Browse or select from:
  - Default Windows icons
  - Or click Browse... and choose a custom .ico file (you can use PNG to ICO converters online if needed).
- Apply and Rename
- After selecting your icon, click OK, then Apply, then OK again.

## Admin Credentials

- Upon accessing the FCMS-Web page, you can log in as admin using this credential.
  - email: admin@test.com
  - password: abcd1234
