import * as React from "react";
import { useOnType } from "../src";
import TextField from "@material-ui/core/TextField";
import { Typography } from "@material-ui/core";

let controlledRenderers = 0;
function ControlledOnType() {
  const [isTyping, setIsTyping] = React.useState(false);

  const onType = useOnType(
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

export default {
  title: "ControlledOnType",
  component: ControlledOnType,
};

export const Demo = (): React.ReactNode => <ControlledOnType />;
