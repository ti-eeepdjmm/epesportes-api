// src/auth/templates/callback-redirect.template.ts

export const getCallbackRedirectHtml = (appCallbackUrl: string) => `
<!DOCTYPE html>
<html>
  <head>
    <title>Redirecionando...</title>
    <script>
      const hash = window.location.hash;
      if (hash) {
        const appUrl = '${appCallbackUrl}' + hash;
        window.location.href = appUrl;
      } else {
        document.body.innerText = 'Fragmento ausente na URL.';
      }
    </script>
  </head>
  <body>
    Redirecionando para o app...
  </body>
</html>
`;
