
# 🛍️ Forever - E-commerce Web Application

Forever is a full-stack e-commerce platform named **Kharido.in**, offering premium shopping experiences with multiple product categories, order tracking, secure payment methods, and a dedicated admin dashboard for complete store management.

---

## 🌐 Live Preview

- 🧑‍💻 **User Site**: [https://khaidoin.netlify.app](https://khaidoin.netlify.app)  
- 🛠️ **Admin Dashboard**: [https://courageous-heliotrope-f1246e.netlify.app](https://courageous-heliotrope-f1246e.netlify.app)

---

### 👨‍💻 User Interface
- Browse products by category
- View featured/bestseller products
- Add to cart 
- Ratings & reviews
- Place orders using:
  - 💳 Stripe (Credit/Debit)
  - 🏦 Razorpay (UPI, Netbanking, Cards)
  - 💵 Cash on Delivery

### 🛠️ Admin Panel
- View dashboard summary (total products, orders, users)
- Add/Edit/Delete products
- View & manage all orders
- Change order status:
  - `Pending`
  - `Processing`
  - `Shipped`
  - `Delivered`
  - `Cancelled`
  - `Returned`
- Manage registered users

---

## 🧩 Features

### 🔷 User Panel
- Home page with **bestsellers products**
- View products with images, descriptions, and prices
- Filter products by categories
- Add/remove items from cart and wishlist
- User can **rate** the products
- Checkout using multiple **payment options**
- Cancel placed orders (if not yet shipped)
- View **order history** and current order status

### 🔷 Admin Panel
- Add new products with image upload
- Manage products list
- View all orders with full details
- Update order status with one click
- Track:
  - Total products
  - Pending orders
  - Delivered orders
  - Total users

---

## 🛒 Tech Stack

### Frontend:
- React.js
- Tailwind CSS
- React Router
- Context API / Redux

### Backend:
- Node.js
- Express.js
- MongoDB (Mongoose)

### Other Tools:
- Stripe API
- Razorpay API
- JWT Authentication
- Cloudinary / Multer (for image uploads)

---

## 🔐 Authentication & Authorization
- User and Admin login
- Admin can access and control dashboard routes
- Protected routes for sensitive pages

---

## 📁 Environment Variables Setup

To run this project, you need to set up environment variables in all three folders: `/backend`, `/frontend`, and `/admin`.

### 🗂️ 1. Backend `.env` (inside `/backend` folder)
```
PORT=5000
MONGO_URI=your-mongodb-uri
UPSTASH_REDIS_URL=your-upstash-redis-url
ACCESS_TOKEN_SECRET=your-access-token-secret
REFRESH_TOKEN_SECRET=your-refresh-token-secret
NODE_ENV=development
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
STRIPE_SECRET_KEY=your-stripe-secret-key
RAZORPAY_KEY_SECRET=your-razorpay-secret-key
CLIENT_URL=http://localhost:5173
SERVER_URL=http://localhost:5000
ADMIN_EMAIL=your-admin-email
ADMIN_PASSWORD=your-admin-password
VITE_CLIENT_ID=your-google-client-id
CLIENT_SECRET=your-google-client-secret
```

### 🌐 2. Frontend `.env` (inside `/frontend` folder)
```
VITE_BACKEND_URL=http://localhost:5000
VITE_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
VITE_RAZORPAY_KEY_ID=your-razorpay-key-id
```

### 🛠️ 3. Admin `.env` (inside `/admin` folder)
```
VITE_BACKEND_URL=http://localhost:5000
```

---

## ⚙️ Installation Instructions

### 1. Clone the repository
```bash
git clone https://github.com/your-username/forever-ecommerce.git
cd forever-ecommerce
```

### 2. Set up Environment Files
Create `.env` files inside each of the following folders: `backend`, `frontend`, and `admin`, as shown above.

### 3. Install Dependencies and Run Project

#### 🔧 Backend
```bash
cd backend
npm install
npm run dev
```

#### 💻 Frontend (User Interface)
```bash
cd frontend
npm install
npm run dev
```

#### 🛡️ Admin Panel
```bash
cd admin
npm install
npm run dev
```

### ✅ Project is now running locally!
- User Panel: http://localhost:5173
- Admin Panel: http://localhost:5174
- Backend: http://localhost:5000

---

