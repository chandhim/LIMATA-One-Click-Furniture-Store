# LIMATA — One-Click Furniture Store
### AI Development Specification

**Project Type:** Full-stack e-commerce web platform with AI-assisted AR visualization
**Academic Context:** IIT 372-2 (Project II), Industrial Information Technology, Uva Wellassa University of Sri Lanka — Group IIT 06

---

## 1. Project Overview

### 1.1 Description
LIMATA One-Click Furniture Store is a web-based e-commerce platform that digitally transforms an existing physical furniture business into an online marketplace through a single integrated system.

- Customers can browse, search, and purchase furniture online.
- The seller (client) can create product listings, upload product images, manage prices, and update stock availability.
- Customers can create accounts, log in securely, explore categories, filter products, and view detailed descriptions.
- A core differentiator is **AI-assisted AR-based product visualization**, letting customers preview furniture in 3D/AR before buying, backed by object detection, depth estimation, spatial suitability analysis, and contextual recommendations.

### 1.2 Background & Motivation
Furniture e-commerce faces high return rates driven by mismatched customer expectations, since buyers can't easily judge how a piece will look or fit in their own space. Standard e-commerce features (accounts, catalogs, order tracking) form the base of the system, while 3D/AR visualization and AI-driven spatial analysis close the "will it fit / will it look right" gap that plain product photos can't solve.

### 1.3 Problem Statement
- Physical showrooms limit reach to customers in specific locations, and browsing/comparing without visiting in person is hard.
- Customers can't easily visualize how large furniture items will look or fit in their own space before buying, which lowers purchase confidence.

### 1.4 Proposed Solution
A centralized e-commerce platform where the seller manages users, products, and orders through a secure admin system, and customers get:
- AI-assisted AR product visualization to preview furniture in their real environment.
- Object detection + depth estimation to analyze existing furniture, room congestion, and available space.
- Intelligent placement guidance, contextual recommendations, and spatial suitability analysis based on that environmental understanding.

### 1.5 Aim
Develop an AI-assisted spatial suitability analysis system using object detection and depth estimation for intelligent furniture placement support, wrapped in a full e-commerce platform.

### 1.6 Objectives
- [ ] Build an e-commerce platform for browsing and purchasing furniture online.
- [ ] Integrate AI-assisted 3D/AR visualization with spatial suitability analysis for intelligent furniture placement.
- [ ] Build order and product management features for business operations.

---

## 2. Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | Next.js, React, Tailwind CSS, Google `<model-viewer>` (WebAR) |
| Backend | Node.js, Express.js, REST API, MVC pattern, JWT auth |
| Database | PostgreSQL (hosted on Supabase) |
| 3D / AR | Three.js, WebXR (ARCore on Android, ARKit on iOS) |
| AI / Computer Vision | YOLOv8 (object detection), MiDaS (monocular depth estimation), Python, OpenCV, FastAPI |
| AI Model Training | Roboflow / LabelImg (annotation), Google Colab (training) |
| 3D Model Generation | Tencent Hunyuan 3D (produces `.glb` furniture models) |
| Deployment | Vercel (frontend), Render (backend), Supabase (Postgres), Cloudflare R2 (object storage) |
| Dev Tools | VS Code, GitHub, Postman |

**Development methodology:** Scrum/Agile, 4 sprint cycles (see Section 8).

---

## 3. Non-Functional Requirements

- **Security:** JWT-based authentication and authorization; role-based access control (customer vs. seller); HTTPS everywhere; input validation.
- **Maintainability:** MVC architecture; modular, reusable component-based frontend; GitHub version control; iterative Scrum-based development.
- **Availability:** Cloud deployment (Vercel + Render + Supabase); stable hosting to minimize downtime; fully internet-accessible.
- **Reliability:** Continuous testing/bug-fixing per sprint; robust error handling and input validation; stable transaction handling; optimized inference using pretrained AI models.

---

## 4. Functional Requirements

### 4.1 User Authentication & Role Management
- [ ] Registration and login with valid credentials.
- [ ] Role-based access separating customer vs. seller (client) functionality.
- [ ] Profile editing (name, contact number, address).

### 4.2 Order & Payment Management
- [ ] Customers place orders and view order history.
- [ ] Seller updates order status.
- [ ] Online payment integration with stored transaction details.

### 4.3 Product Listings & Management
- [ ] Seller can create, update, delete product listings.
- [ ] Product entries support image uploads and `.glb` 3D model uploads.
- [ ] Customers can view detailed product info (price, category, description).

### 4.4 Real-Time Communication & Notifications
- [ ] Real-time chat between customers and seller.
- [ ] Persisted conversation history; seller notified of new messages.
- [ ] Real-time notifications for chat messages and order updates.

### 4.5 Search & Filtering
- [ ] Keyword-based product search.
- [ ] Filtering by category, price range, and style/material.

### 4.6 Reviews
- [ ] Customers can submit product reviews.
- [ ] Reviews displayed on product pages.

---

## 5. Novel AI-Assisted Features (Core Differentiator)

### 5.1 AI-Assisted Environmental Understanding
- [ ] YOLOv8 object detection to identify existing furniture (sofas, chairs, tables, beds, TV stands) from the customer's room via device camera.
- [ ] MiDaS monocular depth estimation to gauge object distances, available space, and room congestion.
- [ ] Lightweight fine-tuning of pretrained YOLOv8 on a furniture-specific dataset to improve indoor detection accuracy.

### 5.2 Intelligent AR Furniture Placement & Spatial Suitability
- [ ] Combine AR visualization with the environmental analysis above for placement support.
- [ ] Evaluate suitability using free space, object clearance, room congestion, and furniture compatibility.
- [ ] Surface placement guidance: compact furniture suggestions, overcrowding warnings, movement-space alerts.
- [ ] AR interaction via WebXR with ARCore/ARKit compatibility.

### 5.3 Context-Aware Recommendation System
- [ ] Recommendations based on room environment, detected objects, congestion level, category, style, and user preference — not just category matching.
- [ ] Powered by custom spatial suitability + contextual recommendation logic.

### 5.4 LIMATA AI Chatbot
- [ ] Functions as an intelligent furniture assistant, not a generic support bot.
- [ ] Combines AI-generated responses with object detection, depth estimation, AR placement data, and recommendation outputs.
- [ ] Helps with product suitability explanations, placement suggestions, AR usage guidance, and recommendations.

---

## 6. User Roles & Permissions

### Client (Seller) — full admin
- Log in to admin panel; full administrative privileges.
- Manage user accounts.
- Browse home page.
- Add/update/delete product listings; upload images and `.glb` models.
- View and update order status.

### Visitor (not logged in)
- Browse home page; view products and product details (incl. 3D/AR).
- Search and filter products; register.
- Use AI-assisted AR visualization and recommendations.
- Receive placement suggestions; use the LIMATA chatbot.

### Customer (logged in)
- Everything a Visitor can do, plus:
- Add to cart and place orders; view order history.
- Submit product reviews.

---

## 7. System / Environment Requirements

**Seller side:** Windows 10+/macOS Monterey+, i3 8th-gen or higher, ≥4GB RAM (8GB recommended), ≥20GB storage, ≥5Mbps internet.

**Customer side:** Android 10+/iOS 15+ or Windows 10+/macOS Monterey+, camera required for AR, ≥3Mbps internet, ≥4GB RAM recommended for AI-assisted AR, device must support ARCore (Android) or ARKit (iOS).

---

## 8. Development Plan (Scrum, 4 Sprints)

**Sprint 1 — User Authentication & Foundation**
- User registration/login (customer + seller), JWT auth.
- Profile management (name, contact, address).
- Frontend structure and navigation.
- Product listing and detail pages.
- PostgreSQL schema + REST API setup.

**Sprint 2 — Product Management, Search, Orders, Payments, Communication**
- Seller product CRUD, image upload, `.glb` model upload.
- Customer-facing product listing/detail pages.
- Keyword search; filtering by category, price, style/material.
- Shopping cart, order placement/history, payment integration.
- Seller order-status management.
- Real-time chat and notifications.

**Sprint 3 — 3D/AR, Recommendations, Reviews**
- 3D model viewer (rotate/zoom).
- AR product visualization via WebXR.
- 3D model compatibility/performance optimization.
- Contextual recommendations (category, style, price).
- Review submission/display.
- AR compatibility and usability testing.

**Sprint 4 — AI-Assisted Intelligence & Final Polish**
- YOLOv8 object detection for room furniture.
- MiDaS depth estimation for congestion/spatial analysis.
- Fine-tune YOLOv8 on furniture-specific dataset.
- Custom spatial suitability + placement recommendation logic.
- LIMATA AI chatbot integration.
- Placement suggestions and overcrowding warnings.
- Final testing, bug fixing, UI/UX polish, deployment.

**Timeline (15 weeks):** Requirement planning (W1–3) → Sprint 1 (W4–6) → Sprint 2 / Sprint 3 planning (W7–9) → Sprint 3 / Sprint 4 planning (W10–12) → Sprint 4 + full-system integration (W13–15). Documentation runs the full 15 weeks in parallel.

---

## 9. Notes for the Coding Agent

- Build backend data model and auth first (Sprint 1 scope) before touching AI/AR features — later sprints depend on users, products, and orders existing.
- Keep the AI/CV pipeline (YOLOv8 + MiDaS, Python/FastAPI/OpenCV) as a separate service from the main Node.js/Express API; the Node backend should call it over REST rather than embedding Python.
- `.glb` model upload/storage and the Three.js/`<model-viewer>`/WebXR viewer are independent of the AI pipeline and can be built in parallel with it.
- Enforce role-based access (client/seller vs. customer vs. visitor) at the API layer, not just in the UI.
