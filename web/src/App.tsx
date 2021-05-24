import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import MaterialForm from "./components/MaterialForm";
import SolicitationForm from "./components/SolicitationForm";
import Home from "./pages/Home";
import Material from "./pages/Material";
import Solicitation from "./pages/Solicitation";
import SolicitationDetails from "./pages/SolicitationDetails";
import SolicitationDetailsCreate from "./pages/SolicitationDetailsCreate";

function App() {
  return (
    <Router>
      <Switch>
      <Route path="/solicitation-details/:id/adicionar-itens">
          <SolicitationDetailsCreate  />
        </Route>
      <Route path="/solicitation-details/:id">
          <SolicitationDetails  />
        </Route>
        <Route path="/solicitation/editar/:id">
          <SolicitationForm isUpdating />
        </Route>
        <Route path="/solicitation/criar">
          <SolicitationForm />
        </Route>
        <Route path="/solicitation">
          <Solicitation />
        </Route>
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
          <Home />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
