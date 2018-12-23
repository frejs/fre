import{ mount, html, observe } from './src'

function app() {

  return html`
    <section class=top>
      <div class=logo>
        <img src="https://ws1.sinaimg.cn/large/0065Zy9egy1fygjdcy3u5j3096097weo.jpg"/>
        <p><b>Fre</b> - 又一个小而美的前端 MVVM 框架.</p>
        <div class=option>
          <a href="https://github.com/132yse/fre#use">起步</a>
          <a href="https://github.com/132yse/fre">github</a>
        </div>
      </div>
    </section>
  `
}

mount(html`<${app} />`, document.body)
