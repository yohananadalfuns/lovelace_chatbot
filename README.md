# Lovelace AI

A clean, minimal AI chatbot built with Next.js and the Google Gemini API.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![License](https://img.shields.io/badge/license-MIT-green)
![Vercel](https://img.shields.io/badge/deploy-vercel-black?logo=vercel)

<!-- Add a screenshot once deployed -->
<!-- ![Lovelace Preview](./public/preview.png) -->

---

## 🚀 Product Overview

Lovelace AI is a lightweight, modern chatbot designed for speed, simplicity, and usability.  
It provides a clean interface for interacting with AI while supporting multiple conversations, file uploads, and a responsive user experience across devices.

---

## ✨ Features

- 🌙 Dark / Light mode toggle  
- 🗂️ Multiple chat sessions with persistent history (localStorage)  
- 📎 File attachments (images, PDFs, Excel/CSV)  
- 📱 Fully responsive layout with mobile sidebar  
- ⌨️ Keyboard shortcuts (Enter to send, Shift+Enter for new lines)  
- ⚡ Fast and minimal UI/UX  

---

## 🧠 Use Cases

- Personal AI assistant  
- Study and research companion  
- File-based Q&A (documents, spreadsheets)  
- Lightweight ChatGPT alternative  

---

## 🚀 Getting Started

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd <repo-name>
npm install
```

---

### 2. Set Up Environment Variables

```bash
cp .env.example .env.local
```

Get your free API key from:  
👉 https://aistudio.google.com  

Then add it:

```env
GEMINI_API_KEY=your_api_key_here
```

---

### 3. Run Locally

```bash
npm run dev
```

Open:  
👉 http://localhost:3000  

---

## 🌐 Live Demo

*(Add your deployed link here)*  
👉 https://your-app.vercel.app  

---

## 🌐 Deployment (Vercel)

1. Push your project to GitHub  
2. Go to https://vercel.com  
3. Import your repository  
4. Add environment variable:
   - `GEMINI_API_KEY`
5. Deploy 🚀  

---

## 🛠️ Tech Stack

- **Next.js 16** — React framework  
- **Google Gemini API** — AI model  
- **Tailwind CSS** — Styling  
- **shadcn/ui** — UI components  
- **TypeScript** — Type safety  

---

## ⚠️ AI Usage Disclaimer

Some parts of this project were generated or assisted by AI tools.  
All generated code has been reviewed, but you should audit and test thoroughly before using in production environments.

---

## 📈 Future Improvements

- Authentication (user accounts)  
- Cloud chat history sync  
- Streaming responses  
- Plugin/tool system  
- Voice input & output  

---

## 📄 License

This project is licensed under the MIT License.

---

## 🤝 Contributing

Contributions are welcome!  
Feel free to open issues or submit pull requests to improve the project.

---

## ⭐ Support

If you like this project, consider giving it a star ⭐ on GitHub!
