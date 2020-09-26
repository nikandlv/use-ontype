import * as React from "react";
import clsx from "clsx";
import { useonType } from "./hooks";
import TextField from "@material-ui/core/TextField";
import {
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  makeStyles,
  CircularProgress,
  InputAdornment,
  Collapse,
  Card,
  CardContent,
  Button,
  Typography,
  Divider,
  Box,
} from "@material-ui/core";
import Axios from "axios";
import ArrowIcon from "@material-ui/icons/ChevronLeftRounded";

export interface IInputPreviewProps {}

const useStyles = makeStyles({
  card: {
    marginTop: 24,
    maxWidth: 360,
    borderRadius: 24,
    backgroundColor: "#fff",
    boxShadow: "0 20px 50px rgb(255 33 33 / 16%)",
    border: "1px solid rgb(255 33 33 / 12%)",
  },
});

export function InputPreview(props: IInputPreviewProps) {
  const classes = useStyles();
  return (
    <Box m={6}>
      <Card className={classes.card}>
        <CardContent>
          <ControlledOnType />
        </CardContent>
      </Card>

      <Card className={classes.card}>
        <CardContent>
          <UnControlledOnType />
        </CardContent>
      </Card>

      <Card className={classes.card}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Github search example
          </Typography>

          <Divider />

          <IGithubUsernameSearch />
        </CardContent>
      </Card>
    </Box>
  );
}

let controlledRenderers = 0;
function ControlledOnType() {
  const [isTyping, setIsTyping] = React.useState(false);

  const onType = useonType(
    {
      onTypeStart: (val) => {
        console.log("started", val);
        setIsTyping(true);
      },
      onTypeFinish: (val) => {
        console.log("finished", val);
        setIsTyping(false);
      },
    },
    800,
  );

  controlledRenderers++;

  return (
    <div>
      <p>controlledRenderers: {controlledRenderers}</p>
      <TextField
        fullWidth
        label="find user by email"
        {...onType}
        variant="outlined"
      />
      {isTyping && <Typography variant="caption">Typing ...</Typography>}
    </div>
  );
}

let unControlledRenderers = 0;
function UnControlledOnType() {
  const onType = useonType(
    {
      onTypeStart: (val) => console.log("started", val),
      onTypeFinish: (val) => console.log("finished", val),
    },
    800,
  );

  unControlledRenderers++;

  return (
    <div>
      <p>unControlledRenderers: {unControlledRenderers}</p>
      <TextField
        fullWidth
        label="find user by email"
        {...onType}
        variant="outlined"
      />
    </div>
  );
}

const GITHUB_USER_SEARCH_API = "https://api.github.com/search/users";

interface IGithubUser {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
  score: number;
}
interface IGithubUserResult {
  total_count: number;
  incomplete_results: boolean;
  items: Array<IGithubUser>;
}

function queryUsers(q: string) {
  return Axios.get<IGithubUserResult>(GITHUB_USER_SEARCH_API, {
    params: { q },
  });
}

const useGithubStyles = makeStyles({
  chevron: {
    transition: "transform 300ms ease",
    transform: "rotate(-90deg)",
  },
  chevronOpen: {
    transform: "rotate(90deg)",
  },
  moreButton: {
    borderRadius: 16,
    backgroundColor: "#f65e5e",
    color: "#fff",
    transition: "opacity 300ms ease",
    opacity: 0,
    "&:hover, &:focus, &:active": {
      backgroundColor: "#f33d3d",
    },
  },
  moreButtonVisible: {
    opacity: 1,
  },
});

function IGithubUsernameSearch() {
  const classes = useGithubStyles();
  const [isTyping, setIsTyping] = React.useState(false);

  const [loading, setLoading] = React.useState(false);
  const [moreOpen, setMoreOpen] = React.useState(false);
  const [hasMore, setHasMore] = React.useState(false);
  const [usersData, setUsersData] = React.useState<IGithubUserResult>({
    incomplete_results: true,
    total_count: 0,
    items: [],
  });

  const reset = () =>
    setUsersData({
      incomplete_results: true,
      total_count: 0,
      items: [],
    });

  const onType = useonType(
    {
      onTypeStart: (val) => {
        console.log("started", val);
        setIsTyping(true);
      },
      onTypeFinish: (val) => {
        console.log("finished", val);
        setIsTyping(false);
        if (val === "") {
          setHasMore(false);
          return reset();
        }
        setLoading(true);
        queryUsers(val).then((res) => {
          setHasMore(res.data.items.length > 4);
          setUsersData(res.data);
          setLoading(false);
        });
      },
    },
    800,
  );

  return (
    <div>
      <br />

      <TextField
        label="find by github username"
        {...onType}
        variant="outlined"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              {loading && <CircularProgress size={24} />}
            </InputAdornment>
          ),
        }}
      />
      {isTyping && <Typography variant="caption">Typing ...</Typography>}

      <Collapse
        in={moreOpen}
        collapsedHeight={
          usersData.items.length > 3 ? 180 : usersData.items.length * 56
        }
      >
        <List>
          {usersData.items.map((user) => (
            <ListItem key={user.id}>
              <ListItemAvatar>
                <Avatar src={user.avatar_url} />
              </ListItemAvatar>
              <ListItemText primary={user.login} />
            </ListItem>
          ))}
        </List>
      </Collapse>

      <Button
        fullWidth
        onClick={() => setMoreOpen(!moreOpen)}
        disableElevation
        className={clsx(classes.moreButton, {
          [classes.moreButtonVisible]: hasMore,
        })}
      >
        <ArrowIcon
          className={clsx(classes.chevron, {
            [classes.chevronOpen]: moreOpen,
          })}
        />
      </Button>
    </div>
  );
}
