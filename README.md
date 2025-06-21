# Bitespeed Contact Identification API

A Node.js/TypeScript REST API for identifying and consolidating contact information based on email and phone number inputs. This API implements a sophisticated contact deduplication system that links related contacts and maintains a hierarchical relationship between primary and secondary contacts.

## 🚀 Features

- **Contact Identification**: Identify existing contacts using email or phone number
- **Automatic Deduplication**: Smart linking of related contacts to prevent duplicates
- **Hierarchical Contact Management**: Primary and secondary contact relationships
- **Consolidated Response**: Returns unified contact information with all related emails and phone numbers
- **PostgreSQL Database**: Robust data persistence with proper indexing
- **TypeScript**: Full type safety and modern JavaScript features
- **Express.js**: Fast and reliable web framework

## 📋 API Endpoints

### POST `/api/identify`

Identifies and consolidates contact information based on provided email and/or phone number.

**Request Body:**
```json
{
  "email": "user@example.com",
  "phoneNumber": "+1234567890"
}
```

**Response:**
```json
{
  "contact": {
    "primaryContatctId": 1,
    "emails": ["user@example.com", "user2@example.com"],
    "phonenumbers": ["+1234567890", "+0987654321"],
    "secondaryContactIds": [2, 3]
  }
}
```

**Status Codes:**
- `200`: Success
- `400`: Bad Request (missing both email and phone number)
- `500`: Internal Server Error

## 🏗️ Architecture

The application follows a clean, modular architecture:

```
src/
├── app.ts                 # Express app configuration
├── server.ts             # Server entry point
├── controllers/          # Request/response handlers
│   └── contact.controller.ts
├── services/             # Business logic
│   └── contact.service.ts
├── db/                   # Database queries
│   └── contact.queries.ts
├── config/               # Configuration files
│   └── db.ts
├── routes/               # API route definitions
│   └── contact.route.ts
└── utils/                # Helper functions
    └── helper.ts
```

## 🗄️ Database Schema

The application uses PostgreSQL with the following table structure:

```sql
CREATE TABLE Contact (
    id SERIAL PRIMARY KEY,
    phonenumber VARCHAR(255),
    email VARCHAR(255),
    linkprecedence VARCHAR(10) NOT NULL, -- 'primary' or 'secondary'
    linkedid INTEGER REFERENCES Contact(id),
    createdat TIMESTAMP DEFAULT NOW(),
    updatedat TIMESTAMP DEFAULT NOW()
);
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd bitespeed
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=your_username
   DB_PASSWORD=your_password
   DB_NAME=your_database_name
   ```

4. **Set up the database**
   - Create a PostgreSQL database
   - Run the table creation SQL (see Database Schema section above)

5. **Run the application**
   ```bash
   # Development mode
   npm run dev
   
   # Production build
   npm run build
   npm start
   ```

The server will start on port 5000.

## 🧪 Testing the API

1. Create a new POST request
2. Set URL to `http://localhost:5000/api/identify`
3. Set Content-Type header to `application/json`
4. Add request body:
   ```json
   {
     "email": "user@example.com",
     "phoneNumber": "+1234567890"
   }
   ```

## 🔧 Available Scripts

- `npm run dev`: Start development server with hot reload
- `npm run build`: Build TypeScript to JavaScript
- `npm start`: Start production server

## 🌐 Live Demo

**Hosted Endpoint**: [https://bitespeed-contact-api.onrender.com/api/identify](https://bitespeed-contact-api.onrender.com/api/identify)

You can test the live API using the same request format as shown in the testing section above.

## 🔍 How It Works

### Contact Identification Logic

1. **Input Validation**: Ensures either email or phone number is provided
2. **Contact Search**: Searches for existing contacts by email and/or phone number
3. **Hierarchy Resolution**: 
   - If no contacts found: Creates a new primary contact
   - If contacts found: Identifies the primary contact (oldest by creation date)
   - Normalizes hierarchy by converting other primary contacts to secondary
4. **New Information Handling**: If new email/phone provided, creates secondary contact
5. **Response Generation**: Returns consolidated contact information

### Key Features

- **Automatic Deduplication**: Prevents duplicate contacts by linking related information
- **Primary-Secondary Relationship**: Maintains clear hierarchy between contacts
- **Comprehensive Response**: Returns all related emails, phone numbers, and secondary contact IDs
- **Error Handling**: Robust error handling with appropriate HTTP status codes

## 🛠️ Technology Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with pg driver
- **Environment**: dotenv for configuration
- **Build Tool**: TypeScript compiler
