import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import MaterialForm from "./components/MaterialForm";
import Material from "./pages/Material";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/material/editar/:id">
          <MaterialForm isUpdating />
        </Route>
        <Route path="/material/criar">
          <MaterialForm />
        </Route>
        <Route path="/material">
          <Material />
        </Route>
        <Route path="/" exact>
          <h1>teste</h1>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
