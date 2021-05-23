import React, { FormEvent, useEffect, useState } from "react";
import axios from "axios";
import { useParams, useHistory } from "react-router-dom";
import { Container, Box, Typography } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import '../global.css'

interface IMaterialFormProps {
  isUpdating?: boolean;
}

const MaterialForm: React.FC<IMaterialFormProps> = ({ isUpdating = false }) => {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const history = useHistory();
  const { id } = useParams<{ id: string }>();

  async function getMaterial() {
    const response = await axios.get(`http://localhost:3030/material/${id}`);

    if (response) {
      const material = response.data.material;

      setCode(material.code);
      setName(material.name);
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
      history.push("/material");
    }
  }

  async function createMaterial() {
    if (formIsFilled()) {
      const payload = {
        code,
        name,
      };

      try {
        await axios.post("http://localhost:3030/material", payload);

        resetForm();
      } catch (error) {
        setError("Erro ao salvar Material!");
      }
    }
  }

  async function updateMaterial() {
    if (formIsFilled()) {
      const payload = {
        code,
        name,
      };

      try {
        await axios.put(`http://localhost:3030/material/${id}`, payload);

        resetForm();
      } catch (error) {
        setError("Erro ao salvar Material!");
      }
    }
  }

  function formIsFilled() {
    if (!code || !name) {
      setError("Preencha todos os campos");
      return false;
    }
    return true;
  }

  function resetForm() {
    setCode("");
    setName("");
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
        <Typography variant="h4">Criar Material</Typography>

        <TextField
          id="name"
          label="Nome"
          variant="outlined"
          type="text"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          id="code"
          label="Código"
          variant="outlined"
          type="number"
          name="code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />

        <span>{error}</span>

        <Button variant="contained" color="primary" size="small" type="submit">
          Salvar
        </Button>
      </Box>
      </form>
    </Container>
  );
};

export default MaterialForm;
