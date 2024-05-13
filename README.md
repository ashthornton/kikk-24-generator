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