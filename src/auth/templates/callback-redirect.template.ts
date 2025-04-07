// src/auth/templates/callback-redirect.template.ts

export const getCallbackRedirectHtml = () => `
<!DOCTYPE html>
<html>
  <head>
    <title>Redirecionando...</title>
    <script>
      const hash = window.location.hash.substring(1); // remove o "#"
      const params = new URLSearchParams(hash);
      const accessToken = params.get('access_token');

      if (accessToken) {
        const backendRedirect = '/auth/finish-google-login?token=' + accessToken;
        window.location.replace(backendRedirect);
      } else {
        document.body.innerText = 'Token não encontrado na URL.';
      }
    </script>
  </head>
  <body>
    Redirecionando para o backend...
  </body>
</html>
`;
