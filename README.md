# Template React Market

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=openchannel_react-market-template&metric=alert_status&token=87fa8424fca9d20e3dffb9bc27bf69d6832e7413)](https://sonarcloud.io/dashboard?id=openchannel_react-market-template)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=openchannel_react-market-template&metric=coverage&token=87fa8424fca9d20e3dffb9bc27bf69d6832e7413)](https://sonarcloud.io/dashboard?id=openchannel_react-market-template)

## Table of Contents

- [About the Project](#about-the-project)
- [Built With](#built-with)
- [Getting Started](#getting-started)
- [Installation](#installation)
- [Configure dashboard](#configure-dashboard)
- [Usage](#usage)
- [Contact](#contact)

## About The Project

The goal of a marketplace template site is to allow users to browse and install actual applications. This app represents the market site.

Functional for User:

- Native, SSO login and SAML login.
- Search approved applications.
- Work with applications (install/uninstall, preview).
- Updating profile and organization data.
- Managing users from your organization. Invite new users.

Note: Unauthorized users can browse Applications.

### Built With

- [Bootstrap](https://getbootstrap.com) v. 4.6.0
- [React Boostrab](https://react-bootstrap.github.io) v.1.5.2
- [React](https://reactjs.org) v. 17.0.14
- [Redux](https://react-redux.js.org/) v.3.6.0
- [Typescript](https://www.typescriptlang.org/) v.4.2.4

## Getting Started

### Installation

- Install [node.js and npm](https://linuxize.com/post/how-to-install-node-js-on-ubuntu-20-04/):

```
sudo apt install nodejs npm
```

- Install the [React](https://www.npmjs.com/package/react) using the npm package manager:

```
npm i react
```

- Install NPM packages

```
npm install
```

2. Optional. Dependency with @openchannel/react-common-services.

```
npm install file:<absolute path to common service project dist/react-common-services>
```

3. Optional. Dependency with @openchannel/react-common-components.

```
npm install file:<absolute path to common component project dist/react-common-components>
```

### Configure dashboard

- Openchannel dashboard [https://my.openchannel.io/](https://my.openchannel.io/)

Step 1. Setup OAuth

- Google [guide](https://developers.google.com/identity/protocols/oauth2/openid-connect)
- Okta guide : [guide](https://developer.okta.com/docs/guides/implement-oauth-for-okta/overview)

Step 2. (Optional) (#type) Note: Dashboard already have default type.

- Follow the link to the dashboard and sign in.
- On the left sidebar menu, find 'Settings' and open.
- Then open 'Field Settings'.
- You must create a new types for tabs:  
  _'USER'  
  _'USER ACCOUNT'  
  _'DEVELOPER'  
  _'DEVELOPER ACCOUNT'

Step 3. (Optional) (#roles) Note: Dashboard already have default roles.

- Follow the link to the dashboard and sign in.
- On the left sidebar menu, find 'Users' and open.
- Then open 'Roles' and click by 'ADD ROLE.
- Fill name.
- Then click by 'ADD PERMISSIONS'
- Select all available permissions.
- Save.

Step 4. Creating site template, it is portal or market.

- Follow the link to the dashboard and sign in.
- On the left sidebar menu, find 'Sites' and open.
- Click by 'CREATE SITE'.
- In the opened modal fill fields :
  1. Name\* - just site name.
  2. Type\* - now has two parameters ('Self Hosted' and 'Fully Hosted')  
     Fully Hosted - the site will be created from scratch.  
     Self Hosted - you already have your site and want to link it by site domain.
  3) Template\* ('Fully Hosted') - select your template type: portal(for developers) or market(for users)

Step 5. Configure site authorization type SSO or Native login.

- Follow the link to the dashboard and sign in.
- On the left sidebar menu find 'Sites' and open.
- Find your site and open. (This page configures your site)
- Find and click by 'SSO'.
- Find and click by 'ADD IDENTITY CONFIGURATION'.

  > Google config  
  > *Name : Google  
  > *Validation Mode : Authorization Code  
  > *Client ID : 45823498-349823hfjnlfna98r722903470.apps.googleusercontent.com  
  > *Client Secret : AGSdaskjqASJFnsdfal  
  > *Issuer : https://accounts.google.com  
  > *Grant Type : authorization_code  
  > *Scope : openid profile email  
  > *Classification : USER | DEVELOPER  
  > *Developer Organization Type (#type): admin  
  > *Developer Account Type (#type): admin  
  > \*Developer Account Roles (#roles):dev-admin
  >
  > > Google claims mappings :  
  > > *accountId : {{sub}}  
  > > *organizationName : {{use your custom JWT claim or for test '{{aud}}'  
  > > *email : {{email}}  
  > > *name : {{given_name}} {{family_name}}  
  > > *username : {{name}}  
  > > *organizationId :{{aud}}

  > Okta config  
  > *Name : Okta  
  > *Validation Mode : Authorization Code
  > Note: ('Authorization Code' - signup used special endpoints, but 'Introspect'
  > and 'Public key' use all CAP endpoints)  
  > *Client ID : OAuth clientId  
  > *Client Secret : OAuth client secret  
  > *Issuer : https://dev-2468217.okta.com (use your ID into domain)  
  > *Grant Type : authorization_code  
  > *Scope : openid profile email  
  > *Classification : USER | DEVELOPER  
  > *Developer Organization Type (#type): default  
  > *Developer Account Type (#type): default  
  > \*Developer Account Roles (#roles): dev-admin
  >
  > > Okta claims mappings :  
  > > *accountId : {{sub}}  
  > > *organizationId : {{idp}}  
  > > *organizationName : {{name}}-company  
  > > *email : {{email}}  
  > > \*name : {{name}}

### Usage

#### Run project with the remote site configs:

- In order to use different endpoints, need to create .env files, for example .env.dev1 or .env.stage1, each file should contain environments variables:

```
REACT_APP_API_URL
REACT_APP_API_URL_DEVELOPMENT
REACT_APP_MARKETPLACE_NAME
PORT
REACT_APP_ENABLE_CMS
```

- Open file:

```
/etc/hosts
```

- Add to file your custom domain. (Note: this domain can be invalid, because used only in 'Origin' headers.)

```
127.0.0.1 my-custom-domain.com
```

- Run project with the production environment:

```
sudo npm run start-with-host my-custom-domain.com
```

#### Run project with the Moesif plugin for Chrome:

- Install [Moesif](https://chrome.google.com/webstore/detail/moesif-origin-cors-change/digfbfaphojjndkpccljibejjbppifbc/related) CORS plugin for Chrome
- Submit your work email address there
- Open advanced settings
- Fill in the 'Access-Control-Allow-Credentials' `true`
- Fill in the 'Response headers' field: `http://localhost:4200`
- Fill in the 'Request Headers' field:
  (Note: this domain can be invalid, because used only in 'Origin' headers.) `https://my-custom-domain.com`
- Then start project with command: `npm run start`

## Search engine discoverability

Project contains the `robots.txt` file. This file tells search engine crawlers which URLs the crawler can
access on your site. This is used mainly to avoid overloading your site with requests. Access is disallowed to the whole
site by default. If you want to allow access, change property:

```
Disallow: /
```

to

```
Allow: /
```

Documentation: [https://developers.google.com/search/docs/advanced/robots/create-robots-txt?hl=en](https://developers.google.com/search/docs/advanced/robots/create-robots-txt?hl=en)

## Documentation Compodoc

Compodoc shows project structure. (modules, components, routes etc.)

- Install NPM packages:

```
npm install
```

- Fix Formating:

```
npm run format
```

- Run Linter:

```
npm run lint
```

- Documentation [https://support.openchannel.io/guides](https://support.openchannel.io/guides)

## Troubleshooting

Here is the [solution](https://typicode.github.io/husky/#/?id=command-not-found) if you have problem with '.husky/pre-commit'

## Contact

Website: [https://openchannel.io](https://openchannel.io)

## Designs

App Store Designs: [https://support.openchannel.io/guides/app-store-designs/](https://support.openchannel.io/guides/app-store-designs/)
