import * as React from "react";
import { useOnType } from "../src";
import TextField from "@material-ui/core/TextField";

let unControlledRenderers = 0;
function UnControlledOnType() {
  const onType = useOnType(
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

export default {
  title: "uncontrolled",
  component: UnControlledOnType,
};

export const Demo = (): React.ReactNode => <UnControlledOnType />;
