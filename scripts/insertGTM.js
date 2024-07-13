const fs = require('fs');
const path = require('path');
require('dotenv').config();

const indexPath = path.join(__dirname, '..', 'public', 'index.html');
let fileContent = fs.readFileSync(indexPath, 'utf8');
const gtmContainerId = process.env.REACT_APP_GTM_CONTAINER_ID;

// GTM Script for head
const gtmHeadCode = `
  <script>
    (function(w, d, s, l, i) {
      w[l] = w[l] || [];
      w[l].push({
        'gtm.start': new Date().getTime(),
        event: 'gtm.js'
      });
      var f = d.getElementsByTagName(s)[0],
        j = d.createElement(s),
        dl = l != 'dataLayer' ? '&l=' + l : '';
      j.async = true;
      j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
      f.parentNode.insertBefore(j, f);
    })(window, document, 'script', 'dataLayer', '${gtmContainerId}');
  </script>
`;

// GTM noscript for body
const gtmBodyCode = `
  <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${gtmContainerId}" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
`;

// Replace placeholders
fileContent = fileContent.replace('<!-- %GTM_HEAD_CODE% -->', gtmHeadCode);
fileContent = fileContent.replace('<!-- %GTM_BODY_CODE% -->', gtmBodyCode);

// Write the changes back to index.html
fs.writeFileSync(indexPath, fileContent, 'utf8');

//FIXME: later