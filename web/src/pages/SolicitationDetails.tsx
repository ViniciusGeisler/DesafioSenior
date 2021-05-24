import { Box, Button, Container, Typography } from "@material-ui/core";
import axios from "axios";
import { useState, useEffect } from "react";
import { useParams, Link, useHistory } from "react-router-dom";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

interface ISolicitation {
  id: number;
  solicitationNumber: number;
  requesterName: string;
  issueDate: Date;
}

interface ISolicitationItems {
  id: number;
  material_id: number;
  solicitation_id: number;
  amount: number;
  material_name: string;
}

const SolicitationDetails: React.FC = () => {
  const [solicitation, setSolicitation] = useState<ISolicitation>(
    {} as ISolicitation
  );
  const [solicitationItems, setSolicitationItems] = useState<ISolicitationItems[]>([]);
  const { id } = useParams<{ id: string }>();
  const history = useHistory();

  const getSolicitation = async () => {
    const response = await axios.get(
      `http://localhost:3030/solicitation/${id}`
    );

    if (response) {
      setSolicitation(response.data.solicitation);
    }
  };

  const getSolicitationItems = async () => {
    const response = await axios.get(
      `http://localhost:3030/solicitation/${id}/items`
    );

    if (response) {
      setSolicitationItems(response.data.solicitationItems);
    }
  };

  async function removeMaterial(solicitationNumber: number) {
    const confirmed = window.confirm("Você realmente deseja excluir?");

    if (confirmed) {
      try {
        const response = await axios.delete(
          `http://localhost:3030/solicitation/${id}/item/${solicitationNumber}`
        );

        if (response.status === 204) {
          await getSolicitationItems()
        }
      } catch (error) {
        // setSnackMessage("Falha ao excluir");
        // setSnackOpen(true);
      }
    }
  }

  useEffect(() => {
    getSolicitation();
    getSolicitationItems();
  }, []);

  return (
    <Container maxWidth="lg">
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        className="my-05"
      >
        <Typography variant="h4">Solicitação {id}</Typography>
        <Link to={`/solicitation-details/${id}/adicionar-itens`} style={{ marginRight: "8px"}}>
          
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={() => history.goBack()}
          style={{ marginRight: "8px" }}
        >
          Voltar
        </Button>
        <Button variant="contained" color="primary" size="small">
            Adicionar itens
        </Button>
        </Link>
        <Typography variant="h5">{solicitation.requesterName}</Typography>
      </Box>

      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="left">ID</TableCell>
              <TableCell align="left">Material</TableCell>
              <TableCell align="left">Quantidade</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {solicitationItems.map((item: ISolicitationItems) => (
              <TableRow key={item.id}>
                <TableCell component="th" scope="row">
                  {item.id}
                </TableCell>
                <TableCell align="left">{item.material_name}</TableCell>
                <TableCell align="left">{item.amount}</TableCell>
                <TableCell align="right" className="mx-05-children">
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => removeMaterial(item.material_id)}
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

export default SolicitationDetails;
