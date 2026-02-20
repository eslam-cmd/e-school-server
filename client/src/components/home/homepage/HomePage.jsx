"use client";
import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  Grid,
  useTheme,
  useMediaQuery,
  Fade,
} from "@mui/material";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { useEffect, useState } from "react";

// ثوابت التصميم
const DESIGN_CONSTANTS = {
  colors: {
    primaryGradient: "linear-gradient(135deg, #0D8CAB 0%, #004E64 100%)",
    buttonGradient: "linear-gradient(90deg, #E3F2FD, #BBDEFB)",
    white: "#fff",
    black: "#000",
    transparentWhite: "rgba(255,255,255,0.9)",
  },
  sizes: {
    logo: {
      width: 300,
      height: 300,
      border: 5,
    },
    button: {
      borderRadius: 3,
      paddingY: 1.5,
      paddingX: 4,
      minWidth: 200,
    },
  },
  effects: {
    shadow: "0 4px 15px rgba(0,0,0,0.2)",
    hoverShadow: "0 6px 20px rgba(0,0,0,0.3)",
    glow: "0 0 40px rgba(255,255,255,0.4)",
  },
};

export default function HomePage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [isStudentLoggedIn, setIsStudentLoggedIn] = useState(false);
  const [isTeacherLoggedIn, setIsTeacherLoggedIn] = useState(false);

  useEffect(() => {
    // التحقق من حالة تسجيل الدخول
    const studentId = localStorage.getItem("studentId");
    const studentName = localStorage.getItem("studentName");
    const studentSpecialization = localStorage.getItem("studentSpecialization");
    const teacherId = localStorage.getItem("teacherId");

    if (studentId && studentName && studentSpecialization) {
      setIsStudentLoggedIn(true);
    }
    if (teacherId) {
      setIsTeacherLoggedIn(true);
    }
  }, []);

  // عرض الأزرار بناءً على حالة المستخدم
  const renderButtons = () => {
    if (isStudentLoggedIn) {
      return (
        <Button
          variant="contained"
          size="large"
          endIcon={<MeetingRoomIcon />}
          href="/student/my-account"
          sx={{
            borderRadius: DESIGN_CONSTANTS.sizes.button.borderRadius,
            py: DESIGN_CONSTANTS.sizes.button.paddingY,
            px: DESIGN_CONSTANTS.sizes.button.paddingX,
            fontSize: "1rem",
            transition: "0.5s",
            fontWeight: 700,
            background: DESIGN_CONSTANTS.colors.buttonGradient,
            color: DESIGN_CONSTANTS.colors.black,
            boxShadow: DESIGN_CONSTANTS.effects.shadow,
            "&:hover": {
              transform: "translateY(-3px)",
              boxShadow: DESIGN_CONSTANTS.effects.hoverShadow,
            },
          }}
        >
          Log in to my account
        </Button>
      );
    }

    if (isTeacherLoggedIn) {
      return (
        <Button
          variant="contained"
          size="large"
          endIcon={<MeetingRoomIcon />}
          href="/teacher/dashboard-admin"
          sx={{
            borderRadius: DESIGN_CONSTANTS.sizes.button.borderRadius,
            py: DESIGN_CONSTANTS.sizes.button.paddingY,
            px: DESIGN_CONSTANTS.sizes.button.paddingX,
            fontSize: "1rem",
            fontWeight: 700,
            transition: "0.5s",
            background: DESIGN_CONSTANTS.colors.buttonGradient,
            color: DESIGN_CONSTANTS.colors.black,
            boxShadow: DESIGN_CONSTANTS.effects.shadow,
            "&:hover": {
              transform: "translateY(-3px)",
              boxShadow: DESIGN_CONSTANTS.effects.hoverShadow,
            },
          }}
        >
          Access to the control panel
        </Button>
      );
    }

    return (
      <>
        <Button
          variant="contained"
          size="large"
          endIcon={<MeetingRoomIcon />}
          href="/student/login"
          sx={{
            borderRadius: DESIGN_CONSTANTS.sizes.button.borderRadius,
            py: DESIGN_CONSTANTS.sizes.button.paddingY,
            px: DESIGN_CONSTANTS.sizes.button.paddingX,
            fontSize: "1rem",
            transition: "0.5s",
            fontWeight: 700,
            minWidth: DESIGN_CONSTANTS.sizes.button.minWidth,
            background: DESIGN_CONSTANTS.colors.buttonGradient,
            color: DESIGN_CONSTANTS.colors.black,
            boxShadow: DESIGN_CONSTANTS.effects.shadow,
            "&:hover": {
              transform: "translateY(-3px)",
              boxShadow: DESIGN_CONSTANTS.effects.hoverShadow,
            },
          }}
        >
          Student entry
        </Button>

        <Button
          variant="outlined"
          color="inherit"
          size="large"
          endIcon={<EditNoteIcon />}
          href="/teacher/login"
          sx={{
            borderRadius: DESIGN_CONSTANTS.sizes.button.borderRadius,
            py: DESIGN_CONSTANTS.sizes.button.paddingY,
            px: DESIGN_CONSTANTS.sizes.button.paddingX,
            fontSize: "1rem",
            fontWeight: 700,
            minWidth: DESIGN_CONSTANTS.sizes.button.minWidth,
            transition: "0.5s",
            borderWidth: 2,
            borderColor: "rgba(255,255,255,0.8)",
            color: DESIGN_CONSTANTS.colors.white,
            "&:hover": {
              backgroundColor: "rgba(255,255,255,0.1)",
              transform: "translateY(-3px)",
            },
          }}
        >
          The teacher's entry
        </Button>
      </>
    );
  };

  return (
    <Box
      sx={{
        background: DESIGN_CONSTANTS.colors.primaryGradient,
        color: DESIGN_CONSTANTS.colors.white,
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
        pt: 8,
      }}
    >
      {/* تأثير إضاءة خلفية */}
      <Box
        sx={{
          position: "absolute",
          top: -150,
          right: -150,
          width: 600,
          height: 600,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)",
          filter: "blur(50px)",
        }}
      />

      <Container maxWidth="lg">
        <Grid
          container
          spacing={isMobile ? 4 : 8}
          alignItems="center"
          justifyContent="center"
          direction={isMobile ? "column" : "row-reverse"}
        >
          {/* صورة الشعار */}
          <Grid item xs={12} md="auto">
            <Box
              sx={{
                width: DESIGN_CONSTANTS.sizes.logo.width,
                height: DESIGN_CONSTANTS.sizes.logo.height,
                borderRadius: "50%",
                overflow: "hidden",
                boxShadow: "0 15px 40px rgba(0,0,0,0.3)",
                border: `${DESIGN_CONSTANTS.sizes.logo.border}px solid rgba(255,255,255,0.8)`,
                position: "relative",
                mx: "auto", // تمركز أفقي
                "&::after": {
                  content: '""',
                  position: "absolute",
                  inset: 0,
                  borderRadius: "50%",
                  boxShadow: DESIGN_CONSTANTS.effects.glow,
                  zIndex: -1,
                },
              }}
            >
              <Box
                component="img"
                src="/logo5.jpeg"
                alt="Future Institute Logo"
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </Box>
          </Grid>

          {/* النص والأزرار */}
          <Grid item xs={12} md>
            <Box
              sx={{
                textAlign: { xs: "center", md: "right" },
                maxWidth: 600,
                mx: { xs: "auto", md: 0 },
                textDecoration: "ltr",
                textAlign: "left",
              }}
            >
              <Typography
                variant={isMobile ? "h3" : "h2"}
                gutterBottom
                sx={{
                  fontWeight: 900,
                  lineHeight: 1.2,
                  mb: 3,
                  fontSize: {
                    lg: "3.125rem",
                    md: "2.8125rem",
                    xs: "2.1875rem",
                  },
                  color: DESIGN_CONSTANTS.colors.white,
                  textShadow: "2px 2px 8px rgba(0,0,0,0.4)",
                }}
              >
                Welcome to the Future Institute
              </Typography>

              <Typography
                variant={isMobile ? "body1" : "h6"}
                sx={{
                  mb: 4,
                  opacity: 0.95,
                  lineHeight: 1.8,
                  fontSize: "1.25rem",
                  color: DESIGN_CONSTANTS.colors.transparentWhite,
                }}
              >
                A comprehensive educational system that connects students and
                teachers in an advanced interactive environment for an
                exceptional learning experience.
              </Typography>

              <Stack
                direction={isMobile ? "column" : "row"}
                spacing={2}
                justifyContent={{ xs: "center", md: "flex-start" }}
              >
                {renderButtons()}
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
