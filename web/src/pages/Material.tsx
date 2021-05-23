import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Snackbar from "@material-ui/core/Snackbar";
import { Container, Typography, Box } from "@material-ui/core";

interface IMaterial {
  id: number;
  code: number;
  name: string;
}

const Material: React.FC = () => {
  const [materials, setMaterials] = useState([]);
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");

  useEffect(() => {
    const getMaterials = async () => {
      const response = await axios.get("http://localhost:3030/material");

      if (response) {
        setMaterials(response.data.material);
      }
    };
    getMaterials();
  }, []);

  async function removeMaterial(materialCode: number) {
    const confirmed = window.confirm("Você realmente deseja excluir?");

    if (confirmed) {
      try {
        const response = await axios.delete(
          `http://localhost:3030/material/${7}`
        );
        setMaterials(response.data.material);
      } catch (error) {
        setSnackMessage("Falha ao excluir");
        setSnackOpen(true);
      }
    }
  }

  return (
    <Container maxWidth="lg">
      <Snackbar
        open={snackOpen}
        autoHideDuration={6000}
        onClose={() => setSnackOpen(false)}
        message={snackMessage}
      />

      <Box display="flex" justifyContent="space-between" className="my-05">
        <Typography variant="h4">Materiais</Typography>

        <Link to="/material/criar" style={{ margin: "auto 0" }}>
          <Button variant="contained" color="primary" size="small">
            Adicionar
          </Button>
        </Link>
      </Box>

      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="left">ID</TableCell>
              <TableCell align="left">Código</TableCell>
              <TableCell align="left">Nome</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {materials.map((material: IMaterial) => (
              <TableRow key={material.id}>
                <TableCell component="th" scope="row">
                  {material.id}
                </TableCell>
                <TableCell align="left">{material.code}</TableCell>
                <TableCell align="left">{material.name}</TableCell>
                <TableCell align="right" className="mx-05-children">
                  <Link to={`/material/editar/${material.code}`}>
                    <Button variant="contained" color="primary" size="small">
                      Editar
                    </Button>
                  </Link>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => removeMaterial(material.code)}
                  >
                    Excluir
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default Material;
