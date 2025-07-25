# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app) by running `npx create-react-app copilot-ui`.

## Copilot UI
- To access the deployed UI, go to [http://34.217.130.235](http://34.217.130.235)
- The configuration that was modified to direct our server to load our application via the server IP on port 80 was done in `/etc/nginx/nginx.conf`.  Everytime that file is changed, you will need to reload it by running `sudo systemctl reload nginx`.  You can also run `sudo nginx -t` to check for syntax errors.
- To see error logs from the application, run `sudo tail -f /var/log/nginx/error.log`.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode locally.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)


## Developer - Local Installation Steps

1. Ensure that you have "npm" installed on your system. Check the version by running the following command:
```
npm --version
```
2. If "npm" is not installed, you can install it by running the following command:

```
sudo apt install npm
```

3. Clone this repository

4. Navigate to the project directory

5. Run the following command to install the router library:
```
npm install react-router-dom
```

6. Run the following command to install the MUI library:
```
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material @mui/x-charts
```
 7. To start the application, run the following command:
```
npm start
```

The webapp should automatically open in your default browser at "localhost:3000".