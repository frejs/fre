async function handleRequest(request) {
  const { pathname } = new URL(request.url)

  if (pathname === "/") {
    return index()
  } else if (pathname[0] === "/") {
    const data = await fetch(`https://fre.js.org${pathname}`)
      .then((res) => res.text())
      .then((data) => data)
    return new Response(data, {
      status: 200,
      headers: {
        server: "denosr",
        "content-type": "text/plain",
      },
    })
  }
}

function index() {
  return new Response(
    `<html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Fre doc</title>
          <link rel="stylesheet" href="/docup.min.css">
          <script src="/docup.fre.min.js"></script>
          <style>
          :root{
            --navbar-bg: #3e2e98;
            --navlink-hover-bg: #28127e;
            --sidebar-bg: #f0f4ff;
            --sidebar-menu-item-active-fg: #bd1e68;
            --code-span-bg: #ffecfc;
            --content-link-fg: #bd1e68;
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
            text: "中文",
            link: "/zh",
          },
          {
            text: "GitHub",
            link: "https://github.com/yisar/fre",
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
