# Severless Framework Azure Functions, Sites Heartbeat

A project created from the azure-nodejs template of the Serverless Framework. It creates an Azure function that is triggered on a timer event. When executed it uses the node-fetch package to issue get requests to a list of sites. Essentially preventing their Application Pools from going to sleep.

This project requires that Serverless be installed as a global package.

```
npm install -g serverless
```

To create a new Azure function, run the following

```
serverless create --template azure-nodejs
```

## How to Use

Edit the serverless.yml definitions to match the Azure settings for region, function prefix, subscription id, and resource group.

Then issue a deployment

```
serverless deploy
```

## Known Issues

Serverless Framework might have issues determining the correct authenticated account subscription with the following error

```
The access token is from the wrong issuer 'https://sts.windows.net/TENANT_ID/'. It must match the tenant 'https://sts.windows.net/DIFFERENT_TENANT_ID/' associated with this subscription. Please use the authority (URL) 'https://login.windows.net/DIFFERENT_TENANT_ID' to get the token. Note, if the subscription is transferred to another tenant there is no impact to the services, but information about new tenant could take time to propagate (up to an hour). If you just transferred your subscription and see this error message, please try back later.
```

### Known Issues Solution (Service Principal Fix)

The recommended method of authentication the deployment process is to use an Azure Service Principal that has permissions to write to resource groups in the given subscription. These instructions can be found at https://github.com/serverless/serverless-azure-functions#advanced-authentication

### Known Issues Solution (Azure CLI Workaround)

With a tenant that has multiple directory subscriptions, the serverless deploy method might have problems authenticating the current user. By default the configuration file found in the directory below, will contain the authentication token of the current user.

```
~/.Azure/slsTokenCache.json
```

Run the following Azure PowerShell cmdlets to retrieve the correct authentication token per subscriptions.

```
Connect-AzAccount
```

If the above command connects to the incorrect tenant then use the following which will generate a token locally.

```
Connect-AzAccount -TenantId YOUR_TENANT_ID -UseDeviceAuthentication
```

Switch the current context to the actual subscription on the tenant

```
Set-AzContext -Subscription "YOUR SUBSCRIPTION NAME"
```

Confirm that the access token has been created with the correct tenant id

```
Get-AzAccessToken
```

Copy the token to the clipboard to paste into the Serverless Framework Azure configuration file.

```
(Get-AzAccessToken).Token
```

Replace the authentication token in **~/.Azure/slsTokenCache.json** with the token from the above command.

Use https://jwt.io/ to decrypt the tokens to confirm that the tid (tenant) id matches what Serverless expects to pass its authentication through.

## Copyright and Ownership

All terms used are copyright to their original authors.
