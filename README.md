## Client Directory Structure

````markdown
client/
├── public/
│ └── index.html # Entry point of the app
├── src/
│ ├── assets/ # Static assets like images, fonts, etc.
│ ├── components/ # React components
│ ├── data/ # Data files, mock data, or API configurations
│ ├── lib/ # Utility functions or libraries
│ ├── App.tsx # Main application component
│ ├── index.css # Global CSS file (including Tailwind imports)
│ ├── main.tsx # Entry point for React
│ ├── types.ts # TypeScript types
│ ├── vite-env.d.ts # Vite environment types
├── .gitignore # Files to be ignored by Git
├── components.json # Component library configuration
├── eslint.config.js # ESLint configuration
├── index.html # Main HTML file
├── package.json # Dependencies and scripts
├── package-lock.json # Exact dependency versions
├── postcss.config.js # PostCSS configuration
├── tailwind.config.js # Tailwind CSS configuration
├── tsconfig.app.json # TypeScript config for the application
├── tsconfig.json # Root TypeScript configuration
├── tsconfig.node.json # TypeScript config for node-specific settings
├── vite.config.ts # Vite configuration file

```

```
````

## Technologies Used

- **Frontend**: React, TypeScript, Vite
- **Styling**: Tailwind CSS, ShadCN

## Setup Instructions

### Prerequisites

Ensure you have the following installed on your local machine:

- Node.js (v14 or higher)
- npm (v6 or higher) or Yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/farendivaz/widatech-submission.git
   cd client
   ```

2. Install dependencies:

   ```bash
   npm install
   # or if using yarn
   yarn install
   ```

### Running the Application

To run the client in development mode:

```bash
npm run dev
```

## Backend Directory Structure

```bash
server/
├── config/                # Configuration files (database)
├── controllers/           # Controller logic (functions to handle requests)
├── models/                # Database models
├── routes/                # API routes (handles incoming API requests)
├── app.js                 # Main application setup (middleware, route setup)
├── package-lock.json      # Lock file for npm dependencies
├── package.json           # Dependencies and scripts for the server
```

## Backend Technologies

- **Backend Framework**: Express.js
- **Database**: Myqsl2

## Backend Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Mysql

### Installation

1. Navigate to the `server` directory:

   ```bash
   cd server
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a Database and the table :

   ```mysql
       CREATE DATABASE invoice_management;

    USE invoice_management;

    CREATE TABLE invoices (
        id INT AUTO_INCREMENT PRIMARY KEY,
        date DATE NOT NULL,
        customer_name VARCHAR(255) NOT NULL,
        salesperson_name VARCHAR(255) NOT NULL,
        notes TEXT,
        total_amount DECIMAL(10, 2) NOT NULL
    );

    CREATE TABLE products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        stock INT NOT NULL,
        image_url VARCHAR(255) NOT NULL
    );

    CREATE TABLE invoice_products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        invoice_id INT,
        product_id INT,
        quantity INT,
        FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );

   ```

### Running the Backend

To run the backend in development mode with hot-reloading (if using `nodemon`):

```bash
nodemon app.js
```
