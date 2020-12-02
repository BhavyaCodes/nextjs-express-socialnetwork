import React, { useContext, useState } from "react";
import { UserContext } from "./context/user.context";
import Link from "next/link";
import MUILink from "@material-ui/core/Link";

import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";

interface LoggedInUser {
  loading: boolean;
  user: {
    _id: string;
    googleId: string;
    imageUrl: string;
    name: string;
    posts: string[];
  } | null;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: { display: "flex", width: "100%", alignItems: "center" },
    title: {
      flexGrow: 1,
      cursor: "pointer",
    },
    navbarRight: {
      margin: "auto",
      marginRight: "0",
    },
    link: {
      color: "inherit",
      textDecoration: "none",
      "&:hover": {
        textDecoration: "none",
      },
    },
  })
);

const Navbar = () => {
  const user: LoggedInUser = useContext(UserContext);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const classes = useStyles();
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  return (
    <div className={classes.root}>
      <Typography variant="h6" noWrap className={classes.title}>
        <Link href="/">
          <a className={classes.link}>Navbar</a>
        </Link>
      </Typography>

      {!user.loading && (
        <div className={classes.navbarRight}>
          {user.user ? (
            <>
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenuOpen}
                color="inherit"
              >
                <Avatar alt={user.user.name} src={user.user.imageUrl} />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={open}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={handleMenuClose}>
                  <Link
                    href="/profile/[id].js"
                    as={`/profile/${user.user._id}`}
                  >
                    <MUILink color="inherit" className={classes.link}>
                      Profile
                    </MUILink>
                  </Link>
                </MenuItem>
                <MenuItem onClick={handleMenuClose}>
                  <MUILink
                    color="inherit"
                    className={classes.link}
                    href="/api/logout"
                  >
                    Logout
                  </MUILink>
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Button
              variant="contained"
              color="secondary"
              disableElevation
              href="/auth/google"
            >
              Login
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default Navbar;
