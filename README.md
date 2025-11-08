# 📨 FeedFormly

FeedFormly is a modern feedback-collection and message management web application built with **Next.js (App Router)**, **NextAuth.js**, and **MongoDB**.  
It allows users to authenticate securely, send messages, view received messages, and delete them — all within a clean and responsive UI.

Live Demo 👉 [https://feed-formly-ehrg.vercel.app](https://feed-formly-ehrg.vercel.app)

---

## 🚀 Table of Contents
- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [API Routes](#api-routes)
- [Folder Structure](#folder-structure)
- [Deployment](#deployment)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

---

## 📝 About

FeedFormly is a full-stack web app that enables users to:
- Register or log in with secure authentication using **NextAuth**.
- Send and receive messages or feedback.
- Manage messages with the ability to delete specific entries.
- Interact with a clean, simple, and responsive interface.

Built using the **Next.js App Router**, it efficiently integrates both the frontend and backend under one framework.

---

## ✨ Features

- 🔐 User Authentication via NextAuth.js  
- 💬 Send and manage feedback messages  
- 🗑️ Delete messages by ID securely  
- 🧠 Session-based user state handling  
- 🧱 MongoDB + Mongoose database integration  
- ⚡ Deployed on Vercel for instant scalability  
- 🎨 Built with a clean, modern UI architecture  

---

## 🧰 Tech Stack

| Layer | Technology |
|-------|-------------|
| Framework | [Next.js 14 (App Router)](https://nextjs.org/) |
| Language | TypeScript / JavaScript |
| Auth | [NextAuth.js](https://next-auth.js.org/) |
| Database | MongoDB (via Mongoose) |
| Deployment | [Vercel](https://vercel.com/) |
| Styling | Tailwind CSS (if used) |

---

## 🧬 Getting Started

### Prerequisites
- Node.js (v16 or later)
- Git
- MongoDB URI (Atlas or local)
- NextAuth secret and URL configuration

### Installation

```bash
# Clone this repository
git clone https://github.com/Amlan029/FeedFormly.git
cd FeedFormly

# Install dependencies
npm install

# Create your environment file
cp .env.example .env.local
