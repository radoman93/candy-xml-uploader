/** @type {import('tailwindcss').Config} */
module.exports =
    {
        content:
            [
                './views/*.{jade,pug, html}',
                "./node_modules/flowbite/**/*.js"
            ],
        theme:
            {
                extend:
                    {},
            },
        plugins:
            [
                require('flowbite/plugin')
            ],
    }