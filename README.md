This is a full-stack Blogger Web App that empowers users to create, edit, and publish rich-text blog posts with cover images. It offers a seamless writing and reading experience, complete with user authentication, image uploads, and a responsive UI.

Built using the MERN (MongoDB, Express, React, Node.js) stack, the platform showcases modern React development practices with real-world features like:

🔐 Authentication & Authorization
Secure login and registration with JWT and cookie-based authentication.

📝 Blog CRUD Operations
Full support for creating, editing, viewing, and deleting blog posts with rich text and media.

🎨 Responsive UI with Tailwind CSS
Modern design that works seamlessly on all devices.

📡 API Integration with Axios
Clean separation of concerns between front-end and back-end services using RESTful APIs.

🖼️ Image Uploads with Cloudinary
Upload and manage media assets easily and efficiently.

🧠 React Hook Form
Robust form state management with real-time validation.

🧾 Rich Text Editing (TinyMCE)
WYSIWYG editing experience for writing detailed and formatted blog posts.

🔁 Client-Side Routing
Smooth navigation powered by React Router DOM.

🔔 User Feedback with React Hot Toast
Lightweight toast notifications for a polished UX.

💬 Custom Confirm Modal
Extra layer of confirmation before critical actions like delete.

🕸️ Skeleton Loaders
Better perceived performance with content placeholders during async operations.


Here are a few screenshots from my application:

Login Page:

![Screenshot 2025-06-07 141331](https://github.com/user-attachments/assets/bb7a8ca5-4776-4e17-a3a4-682e511bd682)

Home Page:

![Screenshot 2025-06-07 141350](https://github.com/user-attachments/assets/8d88fa52-a6fa-4eb7-9519-987333ef0038)

Blog Post:

![Screenshot 2025-06-07 141611](https://github.com/user-attachments/assets/ecb92f21-e2c5-4c16-b9c2-15783169f6d5)
![Screenshot 2025-06-07 141554](https://github.com/user-attachments/assets/15c1fcb8-5f79-4f61-b46c-f6667b4bd08c)

Adding a Blog Post: TinyMCE's Real Time Editor

![Screenshot 2025-06-07 141401](https://github.com/user-attachments/assets/b6ea66c8-77b3-4f74-b549-dfe4f2bdb0a0)

Profile: (All the blogs posted by an user)

![Screenshot 2025-06-07 141409](https://github.com/user-attachments/assets/da24bdba-1d96-4087-8445-9b6c736cb31f)

Updating account details, avatar and updating password:

![Screenshot 2025-06-07 141440](https://github.com/user-attachments/assets/11c18bf6-a8c8-49a2-8834-ce9c84639d87)

![Screenshot 2025-06-07 141429](https://github.com/user-attachments/assets/a17f3c7a-6723-4c5d-a26d-da7158754d1a)

![Screenshot 2025-06-07 141419](https://github.com/user-attachments/assets/7486c6fe-1424-4401-90de-5d1133d3e49e)




🧰 Tech Stack:

📦 Frontend
React.js

Redux Toolkit

Tailwind CSS

React Router DOM

Axios

React Hook Form

TinyMCE Editor

React Hot Toast

🔧 Backend
Node.js

Express.js

MongoDB (Mongoose ODM)

JWT Authentication

Cloudinary (for image hosting)



📁 FOLDER STRUCTURE:

<pre> blogger-app/ ├── frontend/ (React) 
  │ ├── components/ # Reusable UI components (Input, Button, RTE, etc.) 
  │ ├── pages/ # Main page views (Home, Profile, etc.) │ ├── store/ # Auth slices and configuration │ ├── App.jsx # App root with route structure │ └── main.jsx # Entry point for the React app │ ├── backend/ # Backend (Node.js + Express) │ ├── controllers/ # Controller functions for route logic │ ├── models/ # Mongoose schemas for MongoDB collections │ ├── routes/ # API route definitions │ ├── middlewares/ # Custom middleware (auth, error handlers, and upload function for cloudinary etc.) │ ├── utils/ # Utility functions (like Cloudinary uploader) │ └── index.js # App entry point and server setup │ ├── .env # Environment variables for server ├── package.json # Root config (or separate for client/server) └── README.md # Project documentation </pre>



⚙️ Setup Instructions

1.) Clone the Repository
```
git clone https://github.com/apoorvaww/blogger.git
cd blogger
```

2.) Install Dependencies
```
cd frontend && npm install
cd backend && npm install
```

3.) Environment Variables
Create a .env file in both /frontend and /backend directories with the following:
Frontend:
```
VITE_BACKEND_URL: http://localhost:5173
```
Backend:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CORS_ORIGIN=http://localhost:5173
```

4.) Run the App
frontend: 
```
npm run dev
```
backend: 
```
nodemon src/index.js
```


⭐️ If you like this project...
Give it a ⭐ on GitHub and consider following me for more full-stack builds!


