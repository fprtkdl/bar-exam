import { HashRouter, Route, Routes } from 'react-router-dom'
import { Layout } from './Layout'
import { routes } from './routes'

export function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          {routes.map((r) => (
            <Route key={r.path} path={r.path} Component={r.Component} />
          ))}
        </Route>
      </Routes>
    </HashRouter>
  )
}
