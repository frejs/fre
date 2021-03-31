function handleRequest(request) {
  return new Response(
    `  <head>
    <title>Fre doc</title>
    <link rel="stylesheet" href="./docup.min.css">
    <script src="./docup.fre.min.js"></script>
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
  </body>`,
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
