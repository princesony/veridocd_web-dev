import React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Avatar, ListSubheader } from "@mui/material";
import {
  AddCircleOutline,
  AddCircleRounded,
  Assignment,
  AssignmentOutlined,
  AssignmentTurnedInOutlined,
  AssignmentTurnedInRounded,
  DashboardOutlined,
  DashboardRounded,
  DescriptionOutlined,
  DescriptionRounded,
  GroupsOutlined,
  GroupsRounded,
  Logout,
  NoteAddOutlined,
  NoteAddRounded,
  PersonAddOutlined,
  PersonAddRounded,
  PersonRounded,
  PrintOutlined,
  PrintRounded,
  Settings,
} from "@mui/icons-material";
import ListItemText from "@mui/material/ListItemText";
import { useAuthContext } from "../../Providers/AuthProvider";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useFormBuilderContext } from "../../Providers/FormBuilderProvider";
import { useProfileContext } from "../../Providers/ProfileProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import {
  CustomMenu,
  CustomMenuItem,
  CustomMenuIcon,
} from "../../Elements/CustomMenu";
import { CustomListItem } from "../../Elements/CustomList";

const drawerWidth = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  backgroundColor: "white",
  height: "60px",
  justifyContent: "center",
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  height: "59px",
  justifyContent: "flex-end",
}));

const Dashboard = () => {
  const { setMode, setFormId } = useFormBuilderContext();
  const { profile } = useProfileContext();
  const theme = useTheme();
  const { logOut } = useAuthContext();
  const [profileAnchor, setProfileAnchor] = React.useState();
  const [open, setOpen] = React.useState(false);
  const [profileMenu, setProfileMenu] = React.useState(false);
  const toggleDrawer = () => {
    setOpen((prev) => !prev);
  };
  const navigate = useNavigate();
  const handleProfileMenuClose = () => {
    setProfileMenu(false);
  };
  const location = useLocation();
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar elevation={1} variant="outlined" position="fixed" open={open}>
        <Toolbar
          style={{
            justifyContent: "space-between",
          }}
        >
          <IconButton
            sx={{
              borderRadius: "3px",
              padding: "0.5em",
            }}
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer}
            edge="start"
          >
            <FontAwesomeIcon color="black" icon={faBars} />
          </IconButton>
          <img
            src={"/assets/logo/veridocs-v2.jpeg"}
            style={{
              height: "40px",
            }}
            alt="logo"
          />
          <div>
            <IconButton
              onClick={(event) => {
                setProfileAnchor(event.target);
                setProfileMenu((prev) => !prev);
              }}
              sx={{
                height: "2em",
                width: "2em",
              }}
            >
              <Avatar
                sx={{
                  bgcolor: "#1260cc",
                  cursor: "pointer",
                  height: "2em",
                  width: "2em",
                }}
              >
                {String(profile.agency_name).at(0).toUpperCase()}
              </Avatar>
            </IconButton>
            <CustomMenu
              elevation={3}
              anchorEl={profileAnchor}
              open={profileMenu}
              onClose={handleProfileMenuClose}
              onClick={handleProfileMenuClose}
            >
              <Box
                p={2.2}
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Avatar
                  sx={{
                    height: "53px",
                    width: "53px",
                    backgroundColor: "#1260cc",
                  }}
                >
                  {String(profile.agency_name).at(0).toUpperCase()}
                </Avatar>
                <Typography
                  pl={2}
                  fontFamily="Playfair"
                  fontWeight="bold"
                  fontSize="19px"
                >
                  {profile?.agency_name}
                </Typography>
              </Box>
              <Divider />
              <CustomMenuItem>
                <CustomMenuIcon>
                  <PersonRounded
                    sx={{
                      color: "black",
                    }}
                  />
                </CustomMenuIcon>
                View Profile
              </CustomMenuItem>
              <CustomMenuItem>
                <CustomMenuIcon>
                  <Settings />
                </CustomMenuIcon>
                Settings
              </CustomMenuItem>
              <CustomMenuItem
                onClick={async () => {
                  await logOut();
                  navigate("/");
                }}
              >
                <CustomMenuIcon>
                  <Logout />
                </CustomMenuIcon>
                Log Out
              </CustomMenuItem>
            </CustomMenu>
          </div>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader
          sx={{
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ width: "20px" }}></div>
          <h3 style={{ display: "inline", fontWeight: "500" }}>Main Menu</h3>
          <IconButton onClick={toggleDrawer}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List sx={{ margin: "0 0.4em" }}>
          <CustomListItem
            primary="Summary"
            highlightIcon={
              <DashboardRounded fontSize="small" sx={{ color: "#1260cc" }} />
            }
            normalIcon={
              <DashboardOutlined fontSize="small" sx={{ color: "#1260cc" }} />
            }
            highlight={location.pathname.includes("summary")}
            button
            onClick={() => {
              navigate("/dashboard/summary");
            }}
          />
          <CustomListItem
            button
            highlight={location.pathname.includes("forms")}
            highlightIcon={
              <DescriptionRounded sx={{ color: "green" }} fontSize="small" />
            }
            normalIcon={
              <DescriptionOutlined sx={{ color: "green" }} fontSize="small" />
            }
            primary="Forms"
            onClick={() => {
              navigate("/dashboard/forms", { state: { mode: "create" } });
            }}
          />
          <CustomListItem
            button
            highlight={location.pathname.includes("assignments")}
            onClick={() => {
              navigate("/dashboard/assignments");
            }}
            primary="Assignments"
            highlightIcon={
              <Assignment fontSize="small" sx={{ color: "#c9283d" }} />
            }
            normalIcon={
              <AssignmentOutlined sx={{ color: "#c9283d" }} fontSize="small" />
            }
          />
          <CustomListItem
            highlight={location.pathname.includes("formBuilder")}
            button
            onClick={() => {
              setFormId(null);
              setMode("create");
              navigate("/dashboard/formBuilderPage", {
                state: { mode: "create" },
              });
            }}
            primary="Form Builder"
            normalIcon={
              <NoteAddOutlined fontSize="small" sx={{ color: "orange" }} />
            }
            highlightIcon={
              <NoteAddRounded fontSize="small" sx={{ color: "orange" }} />
            }
          />
          <ListSubheader color="black">Documents</ListSubheader>
          <CustomListItem
            button
            primary="Assign"
            normalIcon={
              <AddCircleOutline fontSize="small" sx={{ color: "#00a9a2" }} />
            }
            highlightIcon={
              <AddCircleRounded fontSize="small" sx={{ color: "#00a9a2" }} />
            }
            highlight={location.pathname.includes("assignment/create")}
            onClick={() => {
              navigate("/dashboard/assignment/create");
            }}
          >
            <ListItemText primary="Assign" />
          </CustomListItem>
          <CustomListItem
            button
            highlight={location.pathname.includes("assignment/verify")}
            normalIcon={
              <AssignmentTurnedInOutlined
                fontSize="small"
                sx={{ color: "#01ab02" }}
                primary="Verify"
              />
            }
            highlightIcon={
              <AssignmentTurnedInRounded
                sx={{ color: "#01ab02" }}
                fontSize="small"
                primary="Verify"
              />
            }
            primary="Verify"
            onClick={() => {
              navigate("/dashboard/assignment/verify");
            }}
          />
          <CustomListItem
            primary="Report"
            button
            highlight={location.pathname.includes("assignment/approve")}
            normalIcon={
              <PrintOutlined fontSize="small" sx={{ color: "#1e2e50" }} />
            }
            highlightIcon={
              <PrintRounded fontSize="small" sx={{ color: "#1e2e50" }} />
            }
            onClick={() => {
              navigate("/dashboard/assignment/result");
            }}
          />
          <ListSubheader>Field Verifiers</ListSubheader>
          <CustomListItem
            highlight={location.pathname.includes("fieldVerifierPage")}
            normalIcon={
              <GroupsOutlined fontSize="small" sx={{ color: "#ff5e64" }} />
            }
            highlightIcon={
              <GroupsRounded sx={{ color: "#ff5e64" }} fontSize="small" />
            }
            button
            primary="List"
            onClick={() => {
              navigate("/dashboard/fieldVerifierPage", {
                state: { mode: "view" },
              });
            }}
          />
          <CustomListItem
            button
            primary="Add"
            highlight={location.pathname.includes("addFieldVerifierPage")}
            normalIcon={
              <PersonAddOutlined fontSize="small" sx={{ color: "#32cf06" }} />
            }
            highlightIcon={
              <PersonAddRounded sx={{ color: "#32cf06" }} fontSize="small" />
            }
            onClick={() => {
              navigate("/dashboard/addFieldVerifierPage");
            }}
          />
        </List>
      </Drawer>
      <Main open={open}>
        <div
          style={{
            marginTop: "4em",
          }}
        ></div>
        <Outlet />
      </Main>
    </Box>
  );
};

export default Dashboard;
