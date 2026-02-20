"use client";
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  Divider,
  useTheme,
} from "@mui/material";
import {
  Facebook,
  Phone,
  LocationOn,
  Send,
} from "@mui/icons-material";
import { useState } from "react";
import AboutIslam from "../home/aboutislam/aboutIslam"; 
import AddTaskIcon from '@mui/icons-material/AddTask';
import SchoolIcon from '@mui/icons-material/School';
const Footer = () => {
  const theme = useTheme();
  const [openModal, setOpenModal] = useState(false);
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor:
          theme.palette.mode === "dark"
            ? theme.palette.grey[900]
            : theme.palette.grey[50],
        color: theme.palette.text.primary,
        pt: 8,
        pb: 4,
        borderTop: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={6}>
          {/* معلومات المعهد */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,

                  color: "white",
                  borderRadius: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mr: 2,
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                }}
              ></Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  background:
                    "linear-gradient(45deg, #1976d2 30%, #0D8CAB 90%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Institute of the Future <SchoolIcon style={{color:"#0D8CAB"}}/>
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ mb: 3, color: "text.secondary" }}>We provide the best educational programs to qualify an outstanding digital generation with the latest curricula and the best trainers.
            </Typography>

        
        
          </Grid>

          {/* روابط سريعة */}

          {/* النشرة البريدية */}
          <Grid item xs={12} md={4}>
            {/* معلومات الاتصال */}
            <Box sx={{ mt: 3,  }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1,direction: "ltr" }}>
                <Phone
                  sx={{ color: "primary.main", mr: 1, fontSize: "1rem" }}
                />
                <Typography variant="body2" color="text.secondary">
                   +963958359136
                </Typography>
                
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1,direction: "ltr" }}>
               <Phone
                  sx={{ color: "primary.main", mr: 1, fontSize: "1rem" }}
                />
                <Typography variant="body2" color="text.secondary">
                +963958359136
                </Typography>
                 
              </Box>
              <Box sx={{ display: "flex", alignItems: "center",direction: "ltr" }}>
                <Facebook
                  sx={{ color: "primary.main", mr: 1, fontSize: "1rem" }}
                />
              
              <Link href="https://www.facebook.com/share/19mM3fEsd7/" style={{textDecoration:"none"}}>
                <Typography variant="body2" color="text.secondary"
                
                >
                   {" "}
                   Institute of the Future
                </Typography>
                </Link>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center",direction: "ltr" }}>
                <LocationOn
                  sx={{ color: "primary.main", mr: 1, fontSize: "1rem" }}
                />
                <Typography variant="body2" color="text.secondary">
                  Syria. Aleppo {" "}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center",direction: "ltr" }}>
              <AddTaskIcon sx={{ color: "primary.main", mr: 1, fontSize: "1rem" }}/>
                 <Typography
 variant="body2"
  sx={{ color: "primary.main",cursor:"pointer", textDecoration: "underline" }}
  onClick={() => setOpenModal(true)}
>
  Book your design now with Islam Hadaya 
</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* حقوق النشر */}
        <Divider sx={{ my: 4 }} />
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="body2" color="text.secondary">
            . © All rights reserved.{new Date().getFullYear()}
            
          </Typography>
          
          <Box sx={{ display: "flex", gap: 2, mt: { xs: 2, sm: 0 } }}>
            <Link
              href="/"
              variant="body2"
              color="text.secondary"
              underline="hover"
            >
              Privacy Policy
            </Link>
            <Link
              href="/"
              variant="body2"
              color="text.secondary"
              underline="hover"
            >
              Terms and Conditions
            </Link>
            <Link
              href="/"
              variant="body2"
              color="text.secondary"
              underline="hover"
            >
              Site map
            </Link>
          </Box>
        </Box>
      </Container>
      <AboutIslam open={openModal} handleClose={() => setOpenModal(false)} />
    </Box>
    
  );
};

export default Footer;
