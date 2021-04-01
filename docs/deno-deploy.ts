async function handleRequest(request) {
  const { pathname } = new URL(request.url)
  if (pathname === "/") {
    return index()
  } else if (pathname[0] === "/") {
    const data = await fetch(
      `https://raw.githubusercontent.com/yisar/fre/master/docs/${pathname}`
    )
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

async function index() {
  const data = await fetch(
    `https://raw.githubusercontent.com/yisar/fre/master/docs/index.html`
  )
    .then((res) => res.text())
    .then((data) => data)
  return new Response(data, {
    headers: {
      "content-type": "text/html; charset=UTF-8",
    },
  })
}

addEventListener("fetch", (event: any) => {
  event.respondWith(handleRequest(event.request))
})
