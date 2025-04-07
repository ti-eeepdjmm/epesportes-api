export const getAuthResultHtml = (token: string) => `
<!DOCTYPE html>
<html>
  <head>
    <title>Finalizando login...</title>
    <script>
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage('${token}');
      } else {
        document.body.innerText = 'Login finalizado. Token: ${token}';
      }
    </script>
  </head>
  <body>Redirecionando...</body>
</html>
`;
