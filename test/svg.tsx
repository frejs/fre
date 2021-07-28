import { h, useState } from '../src/index'
import { testUpdates } from './test-util'

export const svg = async (t) => {
    let lastChildren = []

    await testUpdates([
        {
            content: (
                <svg>
                    <circle
                        cx="100"
                        cy="50"
                        r="40"
                        stroke="black"
                        stroke-width="2"
                    />
                    <path d="M12 2.25195C14.8113 2.97552 17.0245 5.18877 17.748 8.00004H12V2.25195Z" />
                </svg>
            ),
            test: (elements) => {
                t.eq(elements[0].tagName, 'svg')
                t.eq(elements[0].children.length, 2)
                t.eq(elements[0].children[0].getAttribute('cx'), '100')
                t.eq(elements[0].children[0].getAttribute('cy'), '50')
                t.eq(elements[0].children[0].getAttribute('r'), '40')
                t.eq(elements[0].children[0].getAttribute('stroke'), 'black')
                t.eq(elements[0].children[0].getAttribute('stroke-width'), '2')
                t.eq(elements[0].children[0] instanceof SVGElement, true)
                t.eq(
                    elements[0].children[1].getAttribute('d'),
                    'M12 2.25195C14.8113 2.97552 17.0245 5.18877 17.748 8.00004H12V2.25195Z'
                )
                t.eq(elements[0].children[1] instanceof SVGElement, true)

                lastChildren = [...elements[0].children]
            },
        },
    ])
}
