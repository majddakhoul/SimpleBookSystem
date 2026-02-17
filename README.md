# SimpleBookSystem

A simple Node.js book management system to practice CRUD operations, user authentication, and basic API handling. Includes authors, books, users, and password reset functionality.

## Features

- Manage books and authors (CRUD)
- User registration and login with JWT
- Password reset via email
- Admin and user roles
- File upload for book covers
- Simple frontend pages for password reset

## Installation

```bash
git clone https://github.com/majddakhoul/SimpleBookSystem.git
cd SimpleBookSystem
npm install
```

## Setup

1. Copy `.envExample` to `.env`
2. Fill in your MongoDB URI, JWT secret, and email credentials

## Run

```bash
npm start
```

Server runs on `http://localhost:8080`  

## API Routes

- `/api/books` – CRUD for books
- `/api/authors` – CRUD for authors
- `/api/users` – Manage users
- `/api/auth` – Register/Login
- `/password` – Forget/Reset password
- `/api/upload` – Upload images
