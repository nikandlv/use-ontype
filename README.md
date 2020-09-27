# use-ontype

Easy to use utility to detect when user finishes typing, starts typing, or becomes idle!

## Features

- React hook or component base
- Allows to customize the detection delay
- Allows to wrap your onChange
- High performance, 0 re-renders by default
- written in Holy typescript

## Demo

[Storybook demo here!](https://nikandlv.github.io/use-onType)

## Install it

### Using npm

```
npm install use-ontype
```

## Import it

```ts
// the hook
import { useonType } from "use-ontype";

// for components
import { createOnTypeHandler } from "use-ontype";
```

## Use it!

```tsx
import { useonType } from "use-ontype";

function Example() {
  const onType = useonType(
    {
      onTypeStart: (val) => console.log("started", val),
      onTypeFinish: (val) => console.log("finished", val),
      onChange: (event) => console.log("event", event),
    },
    800,
  );

  return (
    <div>
      <TextField
        fullWidth
        label="find user by email"
        {...onType}
        variant="outlined"
      />
    </div>
  );
}
```

## Arguments

The hook takes two arguments `callbacks` and `delay`

### Callbacks

#### (optional) onTypeStart

Called when user starts typing

#### (optional) onTypeFinish

Called when user finishes typing

#### (optional) onChange

`use-ontype` uses onChange and you can add your custom onChange here while keeping the event tracking

### Delay

Delay is the interval which we check if user is still typing or not. `default: 1000ms`

## Todo

- need to clean the example file, its quite messy

# The Licence

DO WHAT EVER YOU WANT!
You are free to do what ever you want. enjoy!
