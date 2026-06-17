Store Rating Platform

A full-stack Store Rating Platform built using React.js, Express.js, and MySQL/PostgreSQL. The application enables users to submit ratings for stores and provides role-based access for Administrators, Store Owners, and Normal Users.

Features
System Administrator
Add Stores
Add Users (Admin, Normal User, Store Owner)
View dashboard statistics
Total Users
Total Stores
Total Ratings
View and manage users
View and manage stores
Search and filter users/stores
View detailed user information
Normal User
User Registration and Login
Browse all stores
Search stores by Name and Address
Submit ratings (1–5)
Modify previously submitted ratings
Update password
Store Owner
Login and manage account
View users who rated their store
View average store rating
Update password
Tech Stack
Frontend
React.js
React Router
Axios
Bootstrap / Tailwind CSS
Backend
Node.js
Express.js
Database
MySQL / PostgreSQL
Authentication
JWT (JSON Web Token)
Password Hashing using bcrypt
Form Validations
Field	Validation
Name	20–60 characters
Address	Maximum 400 characters
Email	Valid email format
Password	8–16 characters, one uppercase letter and one special character
Database Design

Main Tables:

Users
Stores
Ratings

Relationships:

One User can rate many Stores
One Store can receive many Ratings
Each User can submit only one rating per Store
Project Structure

backend/
├── controllers/
├── routes/
├── middleware/
├── models/
├── config/
└── server.js

frontend/
├── src/
│ ├── pages/
│ ├── components/
│ ├── services/
│ └── App.js
