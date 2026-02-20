"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  AppBar,
  Toolbar,
  Container,
  Box,
  Button,
  IconButton,
  Stack,
  Dialog,
  Typography,
  ListItemIcon,
  Divider,
  Avatar,
  Drawer,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { Menu as MenuIcon, PersonOutline } from "@mui/icons-material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

const navItems = [{ label: "About the institute", href: "/" }];

const whatsappNumbers = [
  { label: "Professor Ahmad Al-Ahmad", number: "+963932642429" },
  { label: "Professor Islam hadaya", number: "+963932642429" },
];

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isStudentLoggedIn, setIsStudentLoggedIn] = useState(false);
  const [isTeacherLoggedIn, setIsTeacherLoggedIn] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  useEffect(() => {
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

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const openWhatsApp = (number) => {
    const url = `https://wa.me/${number.replace(/\D/g, "")}`;
    window.open(url, "_blank");
  };

  return (
    <>
      <AppBar
        position="fixed"
        elevation={scrolled ? 4 : 0}
        sx={{
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 1000,
          backgroundColor: "rgba(0, 0, 0, 0.81)",
          backdropFilter: "blur(10px)",
          color: "white",
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
            {/* شعار المعهد */}
            <Box
              component={Link}
              href="/"
              sx={{
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
              }}
            >
              <Typography
                variant="subtitle1"
                fontWeight={500}
                sx={{
                  fontFamily: "'Orbitron', sans-serif",
                  letterSpacing: 1.5,
                  color: "#1976d2", // لون أنيق
                  textShadow: "0 1px 3px rgba(0,0,0,0.3)", // ظل خفيف
                }}
              >
                Institute of the Future
              </Typography>
            </Box>
            <IconButton
              onClick={() => setOpenDrawer(true)}
              sx={{
                display: { xs: "inline-flex", md: "none" },
                color: "white",
              }}
            >
              <MenuIcon />
            </IconButton>
            {/* قائمة التنقل */}
            <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
              {navItems.map((item) => (
                <Button
                  key={item.label}
                  component={Link}
                  href={item.href}
                  sx={{
                    color: "inherit",
                    fontSize: { lg: "17px", md: "15px", xs: "13px" },
                  }}
                >
                  {item.label}
                </Button>
              ))}

              {/* زر اتصل بنا */}
              <Button
                onClick={() => setOpenModal(true)}
                sx={{
                  color: "inherit",
                  fontSize: { lg: "17px", md: "15px", xs: "13px" },
                }}
              >
                Contact Us
              </Button>
            </Box>

            {/* أيقونة الحساب أو زر دخول الطالب */}
            <Stack direction="row" spacing={1} alignItems="center">
              {isStudentLoggedIn || isTeacherLoggedIn ? (
                <IconButton
                  color="inherit"
                  component={Link}
                  href={
                    isStudentLoggedIn
                      ? "/student/my-account"
                      : "/teacher/dashboard-admin"
                  }
                >
                  <PersonOutline />
                </IconButton>
              ) : (
                <Button
                  variant="outlined"
                  component={Link}
                  href="/student/login"
                  sx={{
                    borderRadius: 4,
                    color: "white",
                    borderColor: "white",
                    fontSize: { lg: "17px", md: "15px", xs: "13px" },
                  }}
                >
                  Student entry
                </Button>
              )}
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>

      {/* مودال واتساب */}
      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ textAlign: "center", fontWeight: "bold", pt: 3 }}>
          <WhatsAppIcon sx={{ fontSize: 40, color: "#25D366", mb: 1 }} />
          <Typography fontWeight={700}>Contact us via WhatsApp</Typography>
        </DialogTitle>

        <Divider sx={{ mx: 4, my: 1 }} />

        <DialogContent sx={{ pb: 3 }}>
          <List>
            {whatsappNumbers.map((item, index) => (
              <ListItem key={index} disablePadding>
                <ListItemButton
                  onClick={() => openWhatsApp(item.number)}
                  sx={{
                    borderRadius: 2,
                    mb: 1,
                    backgroundColor: "#f5f5f5",
                    "&:hover": {
                      backgroundColor: "#e0f7e9",
                    },
                  }}
                >
                  <ListItemIcon>
                    <Avatar sx={{ bgcolor: "#25D366" }}>
                      <WhatsAppIcon />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" fontWeight={600}>
                        {item.label}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="body2" color="text.secondary">
                        {item.number}
                      </Typography>
                    }
                    sx={{ textAlign: "right" }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog>
      <Drawer
        anchor="right"
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
      >
        <Box sx={{ width: 250, p: 2 }}>
          <Typography variant="h6" fontWeight={700} textAlign="center" mb={2}>
            Menu
          </Typography>
          <Divider />
          <List>
            {navItems.map((item, index) => (
              <ListItem key={index} disablePadding>
                <ListItemButton
                  component={Link}
                  href={item.href}
                  onClick={() => setOpenDrawer(false)}
                >
                  <ListItemText
                    primary={item.label}
                    sx={{ textAlign: "right" }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  setOpenDrawer(false);
                  setOpenModal(true);
                }}
              >
                <ListItemText
                  primary="Contact Us"
                  sx={{ textAlign: "right" }}
                />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Header;
