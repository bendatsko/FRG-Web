
# DAQROC Test Manager


## Tech Stack

**Client:** TypeScript, React, React Redux, RTK Query, ShadcnUI, Formik, Yup 

**API:** IDK WHAT TO CALL THIS API. Golang CRUD API, 
IDK WHAT TO CALL THIS API EITHER. PlatformIO (Python/C++) transceiver API for accepting, running, and storing test sequences.



## Deployment

Package Installation

```bash
  npm run install
```

Running with development server

```bash
  npm run dev
```

Building production

```bash
  npm run build
```

This is how to upload new firmware to the testbench

```bash
  pio run --target upload
```

This is how to check the status of the processes
```bash
  pm2 list
```

This is how to span a new process using pm2. Navigate ot the folder using cd and then once youre in the project/subproject directory run
here is an example for running the frontend.
```bash
  pm2 start npm --name frontend -- run dev
```

Here is how you can monitor in one window using pm2
```bash
  pm2 logs
```
Then if you want to close out of it just do ctrl+c (aka control + cancel)



To make changes to the site, push your changes to this repo. You can schedule a site reload from the administrator panel at which point the frontend and backend will be stopped and new dependencies will be installed. Output will be piped HERE (daqrocstatus.bendatsko.com) while the site is in maintence mode.

Provided below is additional documentation.

