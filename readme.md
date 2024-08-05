# RETM-tool

## Project Structure

### Root Directory

The root directory contains general configuration files and folders, such as:

- `README.md`: Instructions and documentation for the project.

### Client Directory

The `client` directory contains the frontend code. Here's a typical structure:

#### 1. **public**

- Contains static files that are served directly. Key files include:
  - `index.html`: The main HTML file.
  - `favicon.ico`: The favicon for the app.
  - Other static assets like images and fonts.

#### 2. **src**

- **components**: Reusable UI components.
  - **ui/\***: reusable pure component.
  - **data-table.js**: Example of a reusable feature component.
  - **layout.js**: Example of a default layout use through application.
- **app**: Contains components representing different pages or views.
  - **auth.js**: authentication's pages.
  - **employees.js**: employee management feature's pages.
- **services**: Contains files for API service functions, handling HTTP requests.
  - **utils.js**: Provided a useful functions for calling api.
- **styles**: Global styles and style sheets for the app.
  - **main.css**: Main stylesheet for global styles.
- **App.js**: Main application component that sets up routes and general app structure.
- **index.js**: Entry point for the React application, rendering the main `App` component.

#### 3. **.env**

- Environment configuration file for frontend, typically containing:
  ```
  REACT_APP_API_URL=http://localhost:8000
  ```

### Example of Component Structure

```plaintext
client/
├── public/
│   ├── favicon.ico
│   ├── index.html
├── src/
│   ├── assets/
│   │   ├── images/
│   │   ├── fonts/
│   ├── components/
│   │   ├── ui/
|   │   │    ├──button.js
|   │   │    ├──select.js
│   │   ├── data-table.js
│   ├── pages/
│   │   ├── auth.js
│   │   ├── employees.js
│   ├── services/
│   │   ├── utils.js
│   ├── styles/
│   │   ├── main.css
│   ├── App.js
│   ├── index.js
├── .env
```

### Running the Client

#### 1. **Navigate to the client directory:**

```
cd client
```

#### 2. **Install dependencies:**

```
npm install
```

#### 1. **Start the frontend development server:**

```
npm start
```

Access the frontend at http://localhost:3000.

### Server Directory

The `server` directory contains the backend code. Here's a typical structure:

- **firebase.js** : Define firebase configuration
- **src/routes**: Define API endpoints and map them to controllers.
- **src/middlewares**: Custom middleware functions.
- **src/config**: Configuration files, such as database configuration.
- **src/app.js**: Main application file that sets up the server.

### Environment Variables

Create a `.env` file in both the `server` and `client` directories with the following content:

- Environment configuration file for frontend, typically containing:
  ```
  APP_HOST=localhost
  APP_PORT=8000
  MAILER_AUTH_USER=auth mail
  MAILER_AUTH_PASS=mail pass provided by google
  JWT_SECRET=your-secret-key
  JWT_EXPIRES_IN=7d
  ```

### Running the Server

#### 1. **Navigate to the server directory:**

```
cd server
```

#### 2. **Install dependencies:**

```
npm install
```

#### 1. **Start the backend server:**

```
npm run dev
```

### Accessing the Application

Once both servers are running, you can access the application in your web browser. The default address for the frontend is usually http://localhost:3000, and the backend should be running on http://localhost:8000 or another port specified in your backend configuration.
