import React, { FormEvent, useEffect, useState } from "react";
import axios from "axios";
import { useParams, useHistory, Link } from "react-router-dom";
import { Container, Box, Typography } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import '../global.css'

interface ISolicitationFormProps {
  isUpdating?: boolean;
}

const SolicitationForm: React.FC<ISolicitationFormProps> = ({ isUpdating = false }) => {
  const [solicitationNumber, setSolicitationNumber] = useState("");
  const [requesterName, setRequesterName] = useState("");
  const [error, setError] = useState("");
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const history = useHistory();
  const { id } = useParams<{ id: string }>();

  async function getMaterial() {
    const response = await axios.get(`http://localhost:3030/solicitation/${id}`);

    if (response) {
      const solicitation = response.data.solicitation;

      setSolicitationNumber(solicitation.solicitationNumber);
      setRequesterName(solicitation.requesterName);
    }
  }

  useEffect(() => {
    if (isUpdating) {
      if (!id) {
        history.goBack();
      }

      getMaterial();
    }
  }, []);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (isUpdating) {
      updateMaterial();
    } else {
      createMaterial();
    }

    if (!error) {
      setSnackMessage("Salvo com sucesso!");
      setSnackOpen(true);
      history.push("/solicitation");
    }
  }

  async function createMaterial() {
    if (formIsFilled()) {
      const payload = {
        solicitationNumber,
        requesterName
      };

      try {
        await axios.post("http://localhost:3030/solicitation", payload);

        resetForm();
      } catch (error) {
        setError("Erro ao salvar Solicitação!");
      }
    }
  }

  async function updateMaterial() {
    if (formIsFilled()) {
      const payload = {
        solicitationNumber,
        requesterName,
      };

      try {
        await axios.put(`http://localhost:3030/solicitation/${id}`, payload);

        resetForm();
      } catch (error) {
        setError("Erro ao salvar Solicitação!");
      }
    }
  }

  function formIsFilled() {
    if (!solicitationNumber || !requesterName) {
      setError("Preencha todos os campos");
      return false;
    }
    return true;
  }

  function resetForm() {
    setSolicitationNumber("");
    setRequesterName("");
    setError("");
  }

  return (
    <Container maxWidth="lg">

      <Snackbar
        open={snackOpen}
        autoHideDuration={6000}
        onClose={() => setSnackOpen(false)}
        message={snackMessage}
      />

      <form onSubmit={handleSubmit}>
      <Box display="flex" flexDirection="column" alignItems="center" className="my-03-children">
        <Typography variant="h4">Criar Solicitação</Typography>

        <TextField
          id="solicitationNumber"
          label="Número da solicitação"
          variant="outlined"
          type="number"
          name="solicitationNumber"
          value={solicitationNumber}
          onChange={(e) => setSolicitationNumber(e.target.value)}
        />
        <TextField
          id="requesterName"
          label="Nome do requisitório"
          variant="outlined"
          type="text"
          name="requesterName"
          value={requesterName}
          onChange={(e) => setRequesterName(e.target.value)}
        />

        <span>{error}</span>
        <Button variant="contained" color="primary" size="small" type="submit">
          Salvar
        </Button>
        <Link to="/solicitation" style={{ margin: "auto 0" }}>
        <Button variant="contained" color="primary" size="small">
          Voltar
        </Button>
        </Link>
      </Box>
      </form>
    </Container>
  );
};

export default SolicitationForm;
