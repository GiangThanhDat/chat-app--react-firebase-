import LogIn from "app/auth/login"
import SetupCredentials from "app/auth/setup-credentials"
import SignIn from "app/auth/sign-in"
import EmployeesPage from "app/employess"
import MessagePage from "app/messages"
import TasksPage from "app/tasks"
import Layout from "components/layout"
import { ChatProvider } from "context/chat-provider"
import { Link, Route, Routes } from "react-router-dom"

export default function App() {
  return (
    <Routes>
      <Route path="/auth">
        <Route path="/auth/login" element={<LogIn />} />
        <Route path="/auth/sign-in" element={<SignIn />} />
        <Route
          path="/auth/setup-credentials/:userId"
          element={<SetupCredentials />}
        />
      </Route>
      <Route path="/" element={<Layout />}>
        <Route path="/employees" element={<EmployeesPage />} />
        <Route
          path="/messages"
          element={
            <ChatProvider>
              <MessagePage />
            </ChatProvider>
          }
        />
        <Route path="/tasks" element={<TasksPage />} />
        {/* <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="dashboard" element={<Dashboard />} /> */}
        {/* Using path="*"" means "match anything", so this route
                acts like a catch-all for URLs that we don't have explicit
                routes for. */}
        <Route path="*" element={<NoMatch />} />
      </Route>
    </Routes>
  )
}

function NoMatch() {
  return (
    <div>
      <h2>Nothing to see here!</h2>
      <p>
        <Link to="/">Go to the home page</Link>
      </p>
    </div>
  )
}
