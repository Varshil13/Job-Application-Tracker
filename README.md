# Job Application Tracker 

A full-stack **Job Application Tracker** built using the MERN stack, designed to help users efficiently manage, track, and optimize their job applications with status tracking— enhanced with **AI-powered resume insights and automation**.

---

## Features

- **Authentication System**
  - Secure login/signup with JWT
  - Google OAuth integration
- **Email Notifications**
  - OTP-based authentication
  - Email communication support
- **Track Job Applications - Dashboard & Insights**
  - Visual overview of applications
  - Upload job/intern details/pdf and get concise description(like deadlines , company , stipend etc.) through AI analysis
  - Add, update, and delete job applications
  - Track status (Applied, Interview, Rejected, Offer) with dates

- **AI-Powered Resume Analysis**
  - Upload resume (PDF)
  - Extract and analyze content using AI , get match score , strengths and missing skills analysis , based on opportunity you uploaded
  - Get insights for improvement

- **All documents at one place - Cloud Integration**
  - Secure Document upload via Cloudinary with proper encryption
  - All the documents are easily accesible at one place

- **Smart Reminders**
  - **_Pre-Application Reminders_**
    - Reminder 5 days before the application deadline
    - Reminder 1 day before the application deadline
  - Result Notifications
    - If the user has applied and a result date is available:
    - Reminder 1 day before the result announcement
      Fully automated reminder system to ensure users never miss important deadlines

---

## Tech Stack

### Frontend

- **React.js (Vite)**
- **Tailwind CSS**
- **React Router**
- **Google OAuth**

### Backend

- **Node.js**
- **Express.js**
- **MongoDB (Mongoose)**

### AI & Integrations

- **Grok API**
- **PDF Parsing (pdf-parse)**

### Other Tools

- **Cloudinary** (File Uploads)
- **Nodemailer** (Emails)
- **JWT Authentication**

---

## Installation & Setup

### Clone the repository

```
git clone [https://github.com/your-username/job-application-tracker.git](https://github.com/your-username/job-application-tracker.git)
cd job-application-tracker
```

### Setup Backend

```
cd backend
npm install
```

### Create a .env file in the backend folder:

```
GROK_API_KEY = your_grok_api_key

MONGOOSE_URI = your_mongodb_uri

JWT_SECRET = your_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name

CLOUDINARY_API_SECRET=your_api_secret

CLOUDINARY_API_KEY=your_api_key

ENCRYPTION_KEY=your_encryption_key

ENCRYPTION_IV= encryption_iv

GOOGLE_CLIENT_ID=your_google_id

EMAIL=trakio.team@gmail.com

EMAIL_PASS= email_pass
```

### Run backend

```
npm run dev
```

### Setup Frontend

```
cd ../frontend
npm install
npm run dev
```
