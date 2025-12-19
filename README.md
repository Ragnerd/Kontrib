# Kontrib

**Kontrib** is a mobile-first web platform for managing group financial contributions with transparency and accountability. It is designed primarily for WhatsApp-based groups, enabling seamless contribution tracking, real-time visibility, and passwordless authentication using WhatsApp OTP.

Kontrib simplifies informal group finance by providing a structured, transparent, and easy-to-use system suitable for communities, families, savings groups, and small organizations.

---

## ✨ Key Features

* 📱 **Mobile-first & responsive UI**
* 🔐 **WhatsApp OTP authentication** (no passwords)
* 👥 **Create & manage multiple contribution groups**
* 🔗 **Shareable group invite links**
* 📊 **Real-time contribution & payment tracking**
* 🧾 **Transparent contribution history & reporting**
* ⚡ **Fast, lightweight, and user-friendly**

---

## 🎯 Use Cases

* WhatsApp savings or lending groups
* Community or mosque funds
* Family or friends group contributions
* Small organization expense pooling
* Informal rotating savings (ROSCA-style groups)

---

## 🛠️ Tech Stack

### Frontend

* React / Next.js
* TypeScript
* Tailwind CSS

### Backend

* Node.js
* Express / API routes
* Drizzle ORM

### Database

* PostgreSQL (or compatible SQL database)

### Authentication

* WhatsApp OTP-based verification

### Tooling

* Vite / Next.js build system
* ESLint & Prettier
* Git & GitHub

---

## 📁 Project Structure

```bash
kontrib/
├── client/        # Frontend application
├── server/        # Backend / API logic
├── shared/        # Shared utilities & types
├── dist/          # Production build output
├── .env           # Environment variables
├── package.json
└── README.md
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory and configure the following:

```env
DATABASE_URL=your_database_connection_string
WHATSAPP_API_KEY=your_whatsapp_api_key
WHATSAPP_SENDER_NUMBER=your_whatsapp_sender_number
APP_BASE_URL=http://localhost:3000
```

> ⚠️ Never commit `.env` files to version control.

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/kontrib.git
cd kontrib
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup environment variables

Create a `.env` file and add the required values (see above).

### 4. Run the development server

```bash
npm run dev
```

The app should now be running locally.

---

## 📸 Screenshots

> Add screenshots or a demo GIF here to showcase the UI and flows.

---

## 🔒 Security Notes

* OTPs are sent via WhatsApp for identity verification
* No passwords are stored
* Sensitive credentials are managed via environment variables

---

## 🧩 Future Improvements

* Role-based access (admin / member)
* Contribution reminders via WhatsApp
* Export reports (PDF / CSV)
* Multi-currency support
* Payment gateway integration

---

## 🤝 Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Open a pull request

---

## 📄 License

This project is currently not licensed. Add a license if you plan to make it open-source.

---

## 👤 Author

**Faisal (FaisalEngish)**
Frontend Developer | React & Next.js

---

> Kontrib — Making group finance transparent, simple, and accountable.
