// authProvider.js
import { PublicClientApplication } from '@azure/msal-browser';
import { AuthCodeMSALBrowserAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/authCodeMsalBrowser';
import { InteractionType } from '@azure/msal-browser';

const pca = new PublicClientApplication({
    auth: {
        clientId: 'b1b65f58-fe30-4c6c-9362-7cd76a152e33',
        authority: 'https://login.microsoftonline.com/d0d43762-49e6-4326-90ec-01635c1bd3d8',
        redirectUri: 'http://localhost:3000/',
    },
});

const authenticate = async () => {
    const authResult = await pca.acquireTokenPopup({
        scopes: ['User.Read'],
    });

    if (!authResult.account) {
        throw new Error('Could not authenticate');
    }

    const authProvider = new AuthCodeMSALBrowserAuthenticationProvider(pca, {
        account: authResult.account,
        interactionType: InteractionType.Popup,
        scopes: ['User.Read'],
    });

    return authProvider;
};

export default authenticate;
