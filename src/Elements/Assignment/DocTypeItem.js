import { Button, Grid } from "@mui/material";
import { ArrowRightAltOutlined } from "@mui/icons-material";

const DocTypeItem = ({ id, name, setDocType, setOpen }) => {
  return (
    <div>
      <div
        style={{
          height: "47px",
          width: "100%",
          display: "inline-flex",
          alignItems: "center",
          fontSize: "14px",
          color: "gray",
          fontFamily: "Source Serif Pro, serif",
          justifyContent: "center",
        }}
      >
        <Grid container>
          <Grid
            item
            xs={4}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {id}
          </Grid>
          <Grid
            item
            xs={4}
            sx={{
              display: "flex",
              justifyContent: "start",
              alignItems: "center",
            }}
          >
            {name}
          </Grid>
          <Grid
            item
            xs={4}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button
              size="small"
              onClick={() => {
                setDocType(id);
                setOpen(false);
              }}
              variant="outlined"
              sx={{
                color: "white",
                bgcolor: "#1260cc",
                borderRadius: "17px",
                fontSize: "10px",
                fontWeight: "bold",
                padding: "0.5em 1.3em 0.5em 0.8em",
                border: "1.3px solid #1260cc",
                "&:disabled": {
                  bgcolor: "#eaeaea",
                  border: "1.3px solid #eaeaea",
                  color: "#aeaeae",
                },
                "&:hover": {
                  border: "1.3px solid #1260cc",
                  color: "white",
                  bgcolor: "#5D89C7",
                },
              }}
            >
              <ArrowRightAltOutlined
                fontSize="small"
                sx={{
                  transform: "scale(0.8)",
                  marginRight: "0.2em",
                }}
              />
              Choose
            </Button>
          </Grid>
        </Grid>
      </div>
      <hr
        style={{
          width: "95%",
          margin: "0 auto",
          border: "0.6px solid #dedede",
        }}
      />
    </div>
  );
};

export default DocTypeItem;
