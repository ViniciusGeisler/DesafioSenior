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

interface ISolicitation {
  id: number;
  solicitationNumber: number;
  requesterName: string;
  issueDate: Date;
}

const Solicitation: React.FC = () => {
  const [solicitations, setSolicitation] = useState<ISolicitation[]>([]);
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");

  const getSolicitation = async () => {
    const response = await axios.get("http://localhost:3030/solicitation");

    if (response) {
      setSolicitation(response.data.solicitation);
    }
  };

  useEffect(() => {
    
    getSolicitation();
  }, []);

  async function removeMaterial(solicitationNumber: number) {
    const confirmed = window.confirm("Você realmente deseja excluir?");

    if (confirmed) {
      try {
        const response = await axios.delete(
          `http://localhost:3030/solicitation/${solicitationNumber}`
        );

        if (response.status === 204) {
          await getSolicitation()
        }
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
        <Typography variant="h4">Solicitações</Typography>
      <div style={{ margin: "auto 0" }}>
        <Link to="/" style={{ marginRight: "8px"}}>
          <Button variant="contained" color="primary" size="small">
            Home
          </Button>
        </Link>
        <Link to="/solicitation/criar">
          <Button variant="contained" color="primary" size="small">
            Adicionar
          </Button>
        </Link>
      </div>
      </Box>

      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="left">ID</TableCell>
              <TableCell align="left">Número da solicitação</TableCell>
              <TableCell align="left">Nome do requisitor</TableCell>
              <TableCell align="left">Data da solicitação</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {solicitations.map((solicitation: ISolicitation) => (
              <TableRow key={solicitation.id}>
                <TableCell component="th" scope="row">
                  {solicitation.id}
                </TableCell>
                <TableCell align="left">{solicitation.solicitationNumber}</TableCell>
                <TableCell align="left">{solicitation.requesterName}</TableCell>
                <TableCell align="left">{solicitation.issueDate}</TableCell>
                <TableCell align="right" className="mx-05-children">
                <Link to={`/solicitation-details/${solicitation.solicitationNumber}`}>
                    <Button variant="contained" color="primary" size="small">
                      Detalhe
                    </Button>
                  </Link>
                  <Link to={`/solicitation/editar/${solicitation.solicitationNumber}`}>
                    <Button variant="contained" color="primary" size="small">
                      Editar
                    </Button>
                  </Link>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => removeMaterial(solicitation.solicitationNumber)}
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

export default Solicitation;
