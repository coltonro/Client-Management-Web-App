import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom'
import App from './src/app.jsx'

ReactDOM.render(
    <BrowserRouter>
      <App />
    </BrowserRouter>,
    document.getElementById('root')
  );

// The following is for React 18 (doesn't work with react-pdf/renderer):

// import * as ReactDOM from 'react-dom/client';
// import { BrowserRouter } from 'react-router-dom';
// import { MantineProvider } from '@mantine/core';
// import App from './app.js'

// const Application = () => {
//     return (
//         <div>
//           <BrowserRouter>
//             <MantineProvider withGlobalStyles withNormalizeCSS>
//               <App />
//            </MantineProvider>
//           </BrowserRouter>
//         </div>
//     )
// }

// const container = document.getElementById('root');
// const root = ReactDOM.createRoot(container);
// root.render(<Application />);