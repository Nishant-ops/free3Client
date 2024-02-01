import { Button, Typography, Box } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateContract() {
  const navigate = useNavigate();
  const [isGoToContract, setIsGoToContract] = useState(false);

  const createContract = async () => {
    try {
      const res = await axios.post("http://localhost:8080/createContract");
      if (res.status == 200) {
        setIsGoToContract(true);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const goToContract = () => {
    navigate("/contract");
  };
  return (
    <Box>
      {isGoToContract ? (
        <Button variant="contained" onClick={goToContract}>
          <Typography>Go to contract</Typography>
        </Button>
      ) : (
        <Button variant="contained" onClick={createContract}>
          <Typography>Create Contract by clicking</Typography>
        </Button>
      )}
    </Box>
  );
}

export default CreateContract;
