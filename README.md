# Mithai & Mousse - A Sweet Symphony("Indian Seets with Modern Treats")

A delightful full-stack web application that brings the joy of traditional sweets into the digital age! Imagine walking into a sweet shop where everything just works. That's what I've built here - a beautiful, intuitive platform where customers can browse mouthwatering sweets while admins effortlessly manage their inventory. Every interaction feels smooth, every design choice has purpose, and the whole experience is just... sweet!


<img width="1917" height="862" alt="Screenshot 2025-12-14 140435" src="https://github.com/user-attachments/assets/96a2e201-bac0-4dd9-84c2-dcf8cde30c82" />



## Experience
For Sweet Lovers:

<img width="1896" height="844" alt="Screenshot 2025-12-14 140455" src="https://github.com/user-attachments/assets/fec5e6f1-3bdf-4f03-a85f-810507758b4c" />


- Discover a stunning collection of sweets with gorgeous real images
- Search and filter by your favorite categories and price ranges
- See live stock updates and ratings

For Shop Owners:

<img width="1849" height="831" alt="Screenshot 2025-12-14 140550" src="https://github.com/user-attachments/assets/562a782d-e0de-45ee-b9f6-d38b8c7e9dbb" />


- Manage your entire inventory from one dashboard
- Add new sweets with all the details
- Update prices and quantities 

## Features
User Features

1. Browse Sweets - View all available sweets with images and details
2. Search & Filter - Find sweets by name, category, or price range
3. Purchase - Buy sweets with one click, quantity updates automatically
4. User Accounts - Register and login securely
5. View Details - See price, description, stock availability, and ratings

Admin Features

1. Manage Inventory - Add new sweets to the shop
2. Update Products - Edit sweet details, prices, and descriptions
3. Delete Items - Remove sweets from the catalog
4. Stock Management - Track inventory levels and restock items
5. Admin Dashboard - Special interface for managing the shop

Design Features

1. Modern Look - Clean, colorful interface with smooth animations
2. Mobile Friendly - Works perfectly on phones, tablets, and computers
3. Real-time Updates - See changes instantly 
4. Easy Navigation - Simple menus and clear buttons

## Technologies Used

 **Frontend:**
- **React** - JavaScript library for building UI
- **React Router** - Page navigation
- **CSS** - Styling and animations
  
 **Backend:** 
- **Node.js** - JavaScript runtime for the server
- **Express.js** - Web framework for handling API calls
- **MongoDB Atlas** - Cloud-hosted MongoDB database
- **JWT** - User authentication

## Setup and Installation(Quick Start Guide)

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account (Free tier) - [Sign up here](https://www.mongodb.com/cloud/atlas)
- A code editor like VS Code
- Render(for deploying optional)

### Configure Environment Variables

These variables should be configured to manage application behavior across different environments.Before running the application, you need to set up environment variables for both the backend and frontend.

#### Backend:
Create `backend/.env`

```
MONGODB_URI=your_mongodb_connection_string_here
JWT_SECRET=create_a_super_secret_random_string_here
PORT=5000
CORS_ORIGIN=http://localhost:3000
```

*   `MONGODB_URI`: This stores the address needed to connect your application to the MongoDB database.Replace `your_mongodb_connection_string_here` with the the connection string from MongoDB Atlas(it's free)
*   `JWT_SECRET`: This is a private secret key used to securely create and verify login tokens. Use a random string(but keep it secret).
*   `PORT` → This tells the server which network port it should run on.
*   `CORS_ORIGIN`: This specifies which website is allowed to send requests to your backend server. CORS_ORIGIN tells the backend which frontend website is allowed to talk to it.For example, it allows requests only from `http://localhost:3000` and blocks others.

#### Frontend:
Create `frontend/.env`

```
REACT_APP_API_URL=http://localhost:5000
```

* `REACT_APP_API_URL`: stores the backend server address `http://localhost:5000` that the React app will send requests to. It helps React know where to fetch data or send information.

### Seed the Database:
This adds 12 beautiful sweets with real images to get you started!
    ```
    cd backend
    node seedDatabase.js
    ```
    
### Running Locally

#### Terminal 1- Start the Backend

-  Naviagte to the `backend` directory
  ```
  cd backend
  ```
-  Make sure to install the dependencies at first:
    ```
    npm install
    ```
-  Start the backend server:
    ```
    npm run dev
    ```
  You should see: `Server is running on port 5000
                   Connected to MongoDB`

 #### Terminal 2- Start the Frontend:

-  Navigate to the `frontend` directory:
    ```
    cd frontend
    ```
-  Make sure to install the dependencies:
    ```
    npm install
    ```
-  Start the frontend development server:
    ```
    npm start
    ```
 Your browser will automatically open to `http://localhost:3000`


## Testing

Believe in code that works, which includes testing both the frontend and backend

### Test the Backend

```
cd backend
npm test
```
### Test the Frontend

```
cd frontend
npm test
```
<img width="1913" height="865" alt="Screenshot 2025-12-14 115526" src="https://github.com/user-attachments/assets/79226992-047f-4853-89f0-6501d26db662" />

<img width="1429" height="822" alt="Screenshot 2025-12-14 143122" src="https://github.com/user-attachments/assets/bf5b232b-2e13-44e2-99ee-1d1124af3e15" />


### Deployment:

### Frontend Deployment - The frontend of the project has been deployed to Render, making it accessible through a live URL.

You can access the live version of the frontend here:  
**[Frontend URL](https://sweet-shop-frontend-7uj8.onrender.com)**

### Backend Deployment- The backend API is also deployed on Render, providing a fully functional backend that interacts with the frontend.

You can access the live API here:  
**[Backend API URL](https://sweet-shop-backend-bd6g.onrender.com)**


### Screenshots

### Register Page

 <img width="1904" height="744" alt="Screenshot 2025-12-14 140529" src="https://github.com/user-attachments/assets/d8638040-0dcf-487a-9dc2-910528ba1765" />

### Login Page

 <img width="1906" height="855" alt="Screenshot 2025-12-14 140512" src="https://github.com/user-attachments/assets/8005f97d-91ff-4d19-844e-83ab7b950aee" />

### User(filters)

<img width="1889" height="859" alt="Screenshot 2025-12-14 142838" src="https://github.com/user-attachments/assets/9417b47c-f478-440b-a626-1e9a48bcb07f" />

### Admin(add new sweet)

<img width="768" height="862" alt="Screenshot 2025-12-14 140616" src="https://github.com/user-attachments/assets/b1047320-1c70-43bb-95bf-082d9592d83f" />

### Admin(edit sweet)

<img width="1123" height="840" alt="Screenshot 2025-12-14 140601" src="https://github.com/user-attachments/assets/a190cc11-464c-42be-ad33-47be5404dc51" />

### Admin(restock sweet)

<img width="1019" height="630" alt="Screenshot 2025-12-14 140608" src="https://github.com/user-attachments/assets/78422324-ee60-4a95-84ef-b26a7607fc7b" />

## My AI Usage

I used Claude AI as my AI assisstant throughout this project that help me with:

-  **Learning and Understanding**: Explained complex concepts like JWT authentication in simple terms. Helped me understand React hooks and state management and clarified MongoDB queries.
-  **Code generation and Boilerplate**: Generated initial project structure and created boilerplate for routes and controllers.
-  **Debugging and Problem Solving**: Helped fix CORS configuration issues. Debugged the `No sweets available` display problem. `Syntax error` problem is common problem in which assisstant helped me.
-  **Design & Styling**: Suggested modern UI patterns and beautiful CSS animations,hover effects. Also helped in designing responsive layouts for mobile devices

Overall, the AI assistant was a very helpful tool throughout this project, AI explained "why" things work, not just "how", major help by saving hours on debugging and setup,got instant answers to questions, generated boilerplate quickly and ensured learning a ton at each and every step.
