import { Link } from "react-router-dom";
import { Container, Box, Typography } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import "../global.css";

const Home: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        className="my-03-children"
      >
        <Typography variant="h4">Home</Typography>

        <Link to="/material">
          <Button
            variant="contained"
            color="primary"
            size="small"
            type="submit"
          >
            Criar Material
          </Button>
        </Link>

        <Link to="/solicitation">
          <Button
            variant="contained"
            color="primary"
            size="small"
            type="submit"
          >
            Criar Solicitação
          </Button>
        </Link>
      </Box>
    </Container>
  );
};

export default Home;
