# KIKK '24 Brand Asset Generator

Uses [Fragment](https://github.com/raphaelameaume/fragment) - [Guide](https://github.com/raphaelameaume/fragment/blob/dev/docs/README.md)

---

Run `npm i` to install.

### To create a new sketch:
1. `cd sketches`
2. `npx fragment --new` then follow the prompts

### To run a sketch:
`npx fragment sketch-name/sketch.js`

## Saved images and videos
You can export images and videos via fragment. By default these will save to wherever the server process is running from. This needs to be explicitly set so that exports are saved in an accessible location when hosted on a server.

Add the following to the bottom of your sketch files:

`export let exportDir = './exports'`

## Building
You need to add a small config to the bottom of your sketch files:

```
export let buildConfig = {
	gui: {
		output: true
	}
}
```

You can explore more options [here](https://github.com/raphaelameaume/fragment/blob/dev/docs/guide/exports.md#export-a-live-version).

Then run the build command from the root of this repo so it can find the necessary packages like three and p5.

It will look like this:
`npx fragment build sketches/ash-test-01/ash-test-01.js`

Then when it asks for the output directory it will autofill with the name of your sketch appended, just change this to `/build` so it looks like this:

```
Output directory:
sketches\ash-test-01\build
```

Leave the public path as `/`.