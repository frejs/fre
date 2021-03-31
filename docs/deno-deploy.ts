function handleRequest(request) {
  return new Response(
    `<html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Fre doc</title>
      <link rel="stylesheet" href="https://fre.js.org/fre/docup.min.css">
      <script src="https://fre.js.org/docup.fre.min.js"></script>
      <style>
          :root{
              --navbar-bg: #3e2e98;
              --navlink-hover-bg: #28127e;
              --sidebar-bg: #f0f4ff;
              --sidebar-menu-item-active-fg: #80092f;
              --code-span-bg: #ffecfc;
              --content-link-fg: rgb(189 30 104);
              --code-block-bg: #302b38;
          }
          .content ul{
              list-style-position: outside;
              margin-left: 1.25rem;
          }
      </style>
    </head>
    <body>
      <script>
        docup.init({
          title: "Fre",
          highlightLanguages: ["nginx"],
          indexFile:"https://fre.js.org/README.md",
          props: {
            langs: {},
          },
          navLinks: [
            {
              text: "Guide",
              link: "#guide",
            },
            {
              text: "API",
              link: "#api",
            },
            {
              text: "Resources",
              link: "#resources",
            },
            {
              text: "GitHub",
              link: "https://github.com/yisar/fre",
            },
            {
              text: "Donate",
              link: "https://github.com/sponsors/yisar",
            },
          ],
        })
      </script>
    </body>
  </html>
  `,
    {
      headers: {
        "content-type": "text/html; charset=UTF-8",
      },
    }
  )
}

addEventListener("fetch", (event: any) => {
  event.respondWith(handleRequest(event.request))
})
