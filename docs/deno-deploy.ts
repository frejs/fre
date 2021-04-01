async function handleRequest(request) {
  let { pathname } = new URL(request.url)

  pathname = pathname === "/" ? "/index.html" : pathname

  const data = await fetch(
    `https://raw.githubusercontent.com/yisar/fre/master/docs/${pathname}`
  )
    .then((res) => res.text())
    .then((data) => data)
  return new Response(data, {
    status: 200,
    headers: {
      server: "denosr",
      "content-type":
        pathname === "/" || pathname === "/zh"
          ? "text/html; charset=UTF-8"
          : "text/plain",
    },
  })
}

addEventListener("fetch", (event: any) => {
  event.respondWith(handleRequest(event.request))
})
