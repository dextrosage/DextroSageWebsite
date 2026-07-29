# How to Start the Website

Follow these simple, step-by-step instructions to get the DextroSage website up and running on your local machine.

---

## Prerequisites
Before you begin, ensure you have [Node.js](https://nodejs.org) (v18 or higher) installed on your system.

---

## Setup Instructions

### 1. Open Terminal in the Website Folder
Navigate into the `Website` directory:
```bash
cd D:\Code\AndroidDevelopment\Projects\DextroSage\Frontend\Website
```

### 2. Configure the Environment
Create your local environment file by copying the example file:
*   **On Windows (PowerShell):**
    ```powershell
    Copy-Item .env.example .env
    ```
*   **On macOS / Linux:**
    ```bash
    cp .env.example .env
    ```

Open the newly created `.env` file in a text editor and ensure it points to your running FastAPI backend URL:
```env
VITE_API_BASE_URL=http://localhost:8000
```

### 3. Install Dependencies
Install all required Node modules:
```bash
npm install
```

### 4. Launch the Development Server
Start the local Vite development server:
```bash
npm run dev
```

Once running, Vite will print a local URL in your terminal (usually **`http://localhost:5173`**). Open this URL in your web browser to access the website!

---

## Production Build (Optional)
If you want to compile and build the website for production:
```bash
npm run build
```
This generates a highly optimized static bundle inside the `dist/` folder, ready for deployment.
