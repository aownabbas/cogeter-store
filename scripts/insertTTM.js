const fs = require('fs');
const path = require('path');
require('dotenv').config();

const indexPath = path.join(__dirname, '..', 'public', 'index.html');
let fileContent = fs.readFileSync(indexPath, 'utf8');
const ttqContainerId = process.env.REACT_APP_TTQ_CONTAINER_ID;
// GTM Script for head
const ttmHeadCode = `
// BASE CODE TEMPLATE:

<script>
//Part1
!function (w, d, t) {
  w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};

//Part 2
  ttq.load(${ttqContainerId});
  ttq.page();
}(window, document, 'ttq');
</script>

`;

// GTM noscript for body
const ttmBodyCode = `
  <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${ttqContainerId}" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
`;

// Replace placeholders
fileContent = fileContent.replace('<!-- %TTM_HEAD_CODE% -->', ttmHeadCode);
fileContent = fileContent.replace('<!-- %TTM_BODY_CODE% -->', ttmBodyCode);

// Write the changes back to index.html
fs.writeFileSync(indexPath, fileContent, 'utf8');
