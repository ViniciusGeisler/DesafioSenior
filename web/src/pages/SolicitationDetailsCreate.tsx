import { useEffect, useState } from "react";
import {
  DataGrid,
  GridSelectionModelChangeParams,
  GridRowId,
} from "@material-ui/data-grid";
import axios from "axios";
import { useParams, useHistory } from "react-router-dom";
import { Container, Typography, Box, TextField } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Snackbar from "@material-ui/core/Snackbar";

interface IMaterial {
  id: number;
  code: number;
  name: string;
}

const columns = [
  { field: "id", headerName: "ID", width: 100 },
  { field: "code", headerName: "Código", width: 130 },
  { field: "name", headerName: "Material", width: 130 },
];

const SolicitationDetailsCreate: React.FC = () => {
  const [materials, setMaterials] = useState<IMaterial[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState(0);
  const [amount, setAmount] = useState("");
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const history = useHistory();
  const { id } = useParams<{ id: string }>();

  const getMaterials = async () => {
    const response = await axios.get("http://localhost:3030/material");

    if (response) {
      setMaterials(response.data.material);
    }
  };

  async function insertSolicitationItems() {
    const payload = {
      materialCode: selectedMaterials,
      amount,
    };
    try {
      const response = await axios.post(
        `http://localhost:3030/solicitation/${id}`,
        payload
      );
      setSnackMessage("Salvo com sucesso!")
      setSnackOpen(true);
      resetForm();
    } catch (error) {

    }
  }

  function resetForm() {
    setAmount("");
    setSelectedMaterials(0);
  }

  function handleChange(event: React.ChangeEvent<{ value: unknown }>) {
    setSelectedMaterials(event.target.value as number);
  }

  useEffect(() => {
    getMaterials();
  }, []);

  return (
    <Container maxWidth="lg">
      <Snackbar
        open={snackOpen}
        autoHideDuration={6000}
        onClose={() => setSnackOpen(false)}
        message={snackMessage}
      />

      <Box display="flex" justifyContent="space-between" className="my-05">
        <Typography variant="h4">Escolher itens</Typography>
        <div style={{ margin: "auto 0" }}>
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={() => history.goBack()}
          style={{ marginRight: "8px" }}
        >
          Voltar
        </Button>
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={insertSolicitationItems}
        >
          Confirmar
        </Button>
        </div>
      </Box>
      <form onSubmit={insertSolicitationItems}>
        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
          className="mx-05-children"
        >
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={selectedMaterials}
            onChange={handleChange}
            variant="outlined"
            fullWidth
          >
            {materials.map((material) => (
              <MenuItem value={material.code}>{material.name}</MenuItem>
            ))}
          </Select>
          <TextField
            id="amount"
            label="Quantidade"
            variant="outlined"
            type="number"
            name="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </Box>
      </form>
    </Container>
  );
};

export default SolicitationDetailsCreate;
